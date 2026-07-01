'use strict';

const express   = require('express');
const session   = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const path      = require('path');
const nodemailer = require('nodemailer');
const db        = require('./db/init');
const BACKLOG_SEED = require('./db/backlog-seed');

const app  = express();
const PORT = process.env.PORT || 8080;

/* ── Correo (opcional) ───────────────────────────────────────── */
let _mailer;
function getMailer() {
  if (_mailer !== undefined) return _mailer;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) { _mailer = false; return false; }
  const port = Number(SMTP_PORT) || 587;
  _mailer = nodemailer.createTransport({
    host: SMTP_HOST, port, secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return _mailer;
}
async function sendLeadEmail({ name, email, subject, body }) {
  const m = getMailer();
  if (!m) return;
  const to = process.env.LEAD_TO || process.env.SMTP_USER;
  await m.sendMail({
    from: `"Eureqa3D Web" <${process.env.SMTP_USER}>`,
    to, replyTo: email,
    subject: subject || `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject || '-'}\n\n${body}`
  });
}

app.set('trust proxy', 1);

/* ── Middleware ──────────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: 'sessions',
    schemaName: 'eureqa3d',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'eureqa3d-dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

/* ── Auth helpers ────────────────────────────────────────────── */
const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role === 'invitado') return res.redirect('/visor-3d');
  next();
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'No autenticado' });
  if (!roles.includes(req.session.user.role)) return res.status(403).json({ error: 'Acceso restringido' });
  next();
};

const requireAdminAPI = requireRole('admin');

// Backlog: sesión admin/investigador O API key de agente
const requireBacklogAccess = (req, res, next) => {
  const key = process.env.BACKLOG_AGENT_KEY;
  if (key && req.headers.authorization === `Bearer ${key}`) return next();
  return requireRole('admin', 'investigador')(req, res, next);
};

// Licitaciones: solo sesión admin/investigador — el agente de ingesta escribe
// directo a Postgres (schema licitaciones), nunca llama a esta API.
const requireLicitacionesAccess = requireRole('admin', 'investigador');

const slugify = (s) => s.toString().toLowerCase().trim()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

/* ── Schema bootstrap ────────────────────────────────────────── */
async function ensureSchema() {
  await db.query('CREATE SCHEMA IF NOT EXISTS eureqa3d');

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'admin',
      invite_token  TEXT UNIQUE,
      invite_expires_at TIMESTAMPTZ,
      invite_model_id   TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  // Añade columnas de invitados si la tabla ya existía sin ellas
  await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE`);
  await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_expires_at TIMESTAMPTZ`);
  await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_model_id TEXT`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS news (
      id           SERIAL PRIMARY KEY,
      title        TEXT NOT NULL,
      slug         TEXT UNIQUE NOT NULL,
      excerpt      TEXT,
      body         TEXT,
      image_url    TEXT,
      source_url   TEXT,
      published    BOOLEAN NOT NULL DEFAULT false,
      published_at TIMESTAMPTZ,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS events (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      location    TEXT,
      event_date  DATE,
      url         TEXT,
      published   BOOLEAN NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      subject    TEXT,
      body       TEXT NOT NULL,
      handled    BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS backlog_items (
      id           TEXT PRIMARY KEY,
      titulo       TEXT NOT NULL,
      area         TEXT,
      historia     TEXT,
      tipo         TEXT,
      modulo       TEXT,
      prioridad    TEXT,
      estimacion   TEXT,
      estado       TEXT NOT NULL DEFAULT 'Backlog',
      origen       TEXT,
      creador      TEXT,
      responsable  TEXT,
      fecha_alta   DATE,
      fecha_cierre DATE,
      notas        TEXT,
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS model_assignments (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      model_id   TEXT NOT NULL,
      model_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, model_id)
    )
  `);

  // Admin por defecto
  const { rows: usersCount } = await db.query('SELECT COUNT(*)::int AS n FROM users');
  if (usersCount[0].n === 0) {
    const email = (process.env.ADMIN_EMAIL || 'admin@eureqa3d.com').toLowerCase().trim();
    const pass  = process.env.ADMIN_PASSWORD || 'changeme';
    await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)',
      ['Administrador', email, bcrypt.hashSync(pass, 12), 'admin']
    );
    console.log(`👤  Usuario admin creado → ${email}`);
  }

  // Seed backlog — idempotente: inserta solo los que no existan todavía
  if (BACKLOG_SEED.length > 0) {
    let inserted = 0;
    for (const item of BACKLOG_SEED) {
      const r = await db.query(
        `INSERT INTO backlog_items
           (id, titulo, area, historia, tipo, modulo, prioridad, estimacion,
            estado, origen, creador, responsable, fecha_alta, fecha_cierre, notas)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         ON CONFLICT (id) DO NOTHING`,
        [item.id, item.titulo, item.area, item.historia, item.tipo, item.modulo,
         item.prioridad, item.estimacion, item.estado, item.origen, item.creador,
         item.responsable, item.fecha_alta || null, item.fecha_cierre || null, item.notas]
      );
      if (r.rowCount > 0) inserted++;
    }
    if (inserted > 0) console.log(`📋  Backlog seed → ${inserted} ítem(s) nuevos importados`);
  }
}

/* ── Public pages ────────────────────────────────────────────── */
const PUBLIC = path.join(__dirname, 'views', 'public');
const page = (name) => (req, res) => res.sendFile(path.join(PUBLIC, name));

app.get('/',                    page('index.html'));
app.get('/quienes-somos',       page('quienes-somos.html'));
app.get('/metodo-eureqa',       page('metodo-eureqa.html'));
app.get('/traumatologia',       page('traumatologia.html'));
app.get('/otras-especialidades',page('otras-especialidades.html'));
app.get('/visor-3d',            page('visor-3d.html'));
app.get('/modelos-3d',          page('modelos-3d.html'));
app.get('/noticias',            page('noticias.html'));
app.get('/noticias/:slug',      page('noticia.html'));
app.get('/contacto',            page('contacto.html'));

/* ── Private zone ────────────────────────────────────────────── */
app.get('/login', (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'invitado' ? res.redirect('/visor-3d') : res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/admin',         requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/admin/{*path}', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/login')));

/* ── Invitados: acceso por token ─────────────────────────────── */
app.get('/invite/:token', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE invite_token=$1 AND role='invitado'`, [req.params.token]);
    const guest = rows[0];
    if (!guest) return res.status(404).sendFile(path.join(__dirname, 'views', '404.html')).catch(() => res.status(404).send('Invitación no encontrada'));
    if (guest.invite_expires_at && new Date(guest.invite_expires_at) < new Date()) {
      return res.status(410).send('Esta invitación ha caducado.');
    }
    req.session.user = {
      id: guest.id, name: guest.name, email: guest.email,
      role: 'invitado', invite_model_id: guest.invite_model_id
    };
    const dest = guest.invite_model_id
      ? `/visor-3d?model=${encodeURIComponent(guest.invite_model_id)}`
      : '/visor-3d';
    res.redirect(dest);
  } catch (e) { next(e); }
});

/* ── API: Auth ───────────────────────────────────────────────── */
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });
    const { rows } = await db.query(
      `SELECT * FROM users WHERE email=$1 AND role != 'invitado'`, [email.toLowerCase().trim()]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash))
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ name: user.name, role: user.role });
  } catch (e) { next(e); }
});
app.post('/api/auth/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/auth/me', (req, res) =>
  req.session.user ? res.json(req.session.user) : res.status(401).json({ error: 'No autenticado' }));

/* ── API: Usuarios (admin) ───────────────────────────────────── */
app.get('/api/users', requireAdminAPI, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, role, invite_expires_at, invite_model_id, invite_token, created_at
         FROM users ORDER BY created_at ASC`);
    res.json(rows);
  } catch (e) { next(e); }
});

app.post('/api/users', requireAdminAPI, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const VALID_ROLES = ['admin', 'investigador', 'medico', 'radiologo'];
    if (!name?.trim() || !email?.trim() || !password?.trim())
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    if (!VALID_ROLES.includes(role))
      return res.status(400).json({ error: 'Rol inválido' });
    const hash = bcrypt.hashSync(password, 12);
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, created_at`,
      [name.trim(), email.toLowerCase().trim(), hash, role]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    next(e);
  }
});

app.put('/api/users/:id', requireAdminAPI, async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    const VALID_ROLES = ['admin', 'investigador', 'medico', 'radiologo'];
    if (!name?.trim() || !email?.trim()) return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    if (!VALID_ROLES.includes(role)) return res.status(400).json({ error: 'Rol inválido' });

    let q, params;
    if (password?.trim()) {
      const hash = bcrypt.hashSync(password, 12);
      q = `UPDATE users SET name=$1, email=$2, role=$3, password_hash=$4 WHERE id=$5 AND role!='invitado' RETURNING id, name, email, role`;
      params = [name.trim(), email.toLowerCase().trim(), role, hash, req.params.id];
    } else {
      q = `UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 AND role!='invitado' RETURNING id, name, email, role`;
      params = [name.trim(), email.toLowerCase().trim(), role, req.params.id];
    }
    const { rows } = await db.query(q, params);
    if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    next(e);
  }
});

app.delete('/api/users/:id', requireAdminAPI, async (req, res, next) => {
  try {
    if (String(req.session.user.id) === req.params.id)
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// Generar invitación para invitado
app.post('/api/users/invite', requireAdminAPI, async (req, res, next) => {
  try {
    const { name, email, model_id, model_name, days } = req.body;
    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + (Number(days) || 30));
    const fakeHash = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 12);
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role, invite_token, invite_expires_at, invite_model_id)
       VALUES ($1,$2,$3,'invitado',$4,$5,$6)
       ON CONFLICT (email) DO UPDATE
         SET invite_token=$4, invite_expires_at=$5, invite_model_id=$6, role='invitado'
       RETURNING id, name, email, role, invite_token, invite_expires_at, invite_model_id`,
      [name.trim(), email.toLowerCase().trim(), fakeHash, token, expires.toISOString(), model_id || null]);
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    res.status(201).json({ ...rows[0], invite_url: `${baseUrl}/invite/${token}` });
  } catch (e) { next(e); }
});

// Listar invitados
app.get('/api/users/invites', requireAdminAPI, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, invite_token, invite_expires_at, invite_model_id, created_at
         FROM users WHERE role='invitado' ORDER BY created_at DESC`);
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    res.json(rows.map(r => ({
      ...r,
      invite_url: r.invite_token ? `${baseUrl}/invite/${r.invite_token}` : null,
      expired: r.invite_expires_at ? new Date(r.invite_expires_at) < new Date() : false
    })));
  } catch (e) { next(e); }
});

app.delete('/api/users/invites/:id', requireAdminAPI, async (req, res, next) => {
  try {
    await db.query(`DELETE FROM users WHERE id=$1 AND role='invitado'`, [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── API: Model assignments (admin) ──────────────────────────── */
app.get('/api/model-assignments', requireAdminAPI, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT ma.*, u.name as user_name, u.email as user_email
         FROM model_assignments ma JOIN users u ON u.id=ma.user_id
        ORDER BY u.name, ma.model_name`);
    res.json(rows);
  } catch (e) { next(e); }
});
app.post('/api/model-assignments', requireAdminAPI, async (req, res, next) => {
  try {
    const { user_id, model_id, model_name } = req.body;
    const { rows } = await db.query(
      `INSERT INTO model_assignments (user_id, model_id, model_name) VALUES ($1,$2,$3)
       ON CONFLICT (user_id, model_id) DO UPDATE SET model_name=$3 RETURNING *`,
      [user_id, model_id, model_name || null]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});
app.delete('/api/model-assignments/:id', requireAdminAPI, async (req, res, next) => {
  try {
    await db.query('DELETE FROM model_assignments WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── API: Backlog (admin + investigador + agent key) ─────────── */
app.get('/api/backlog/items', requireBacklogAccess, async (req, res, next) => {
  try {
    const { estado, area, prioridad, creador, q } = req.query;
    let sql = 'SELECT * FROM backlog_items WHERE 1=1';
    const params = [];
    if (estado)    { params.push(estado);    sql += ` AND estado=$${params.length}`; }
    if (area)      { params.push(area);      sql += ` AND area=$${params.length}`; }
    if (prioridad) { params.push(prioridad); sql += ` AND prioridad=$${params.length}`; }
    if (creador)   { params.push(creador);   sql += ` AND creador=$${params.length}`; }
    if (q) {
      params.push(`%${q}%`);
      sql += ` AND (titulo ILIKE $${params.length} OR historia ILIKE $${params.length} OR id ILIKE $${params.length})`;
    }
    sql += ' ORDER BY fecha_alta DESC NULLS LAST, id';
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});

app.post('/api/backlog/items', requireBacklogAccess, async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.id?.trim() || !b.titulo?.trim())
      return res.status(400).json({ error: 'ID y título son obligatorios' });
    const VALID_ESTADOS = ['Backlog', 'Pendiente', 'En curso', 'Hecho', 'Duda'];
    if (b.estado && !VALID_ESTADOS.includes(b.estado))
      return res.status(400).json({ error: 'Estado inválido' });
    const { rows } = await db.query(
      `INSERT INTO backlog_items
         (id, titulo, area, historia, tipo, modulo, prioridad, estimacion,
          estado, origen, creador, responsable, fecha_alta, fecha_cierre, notas)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [b.id.trim(), b.titulo.trim(), b.area||null, b.historia||null, b.tipo||null,
       b.modulo||null, b.prioridad||null, b.estimacion||null,
       b.estado||'Backlog', b.origen||null,
       b.creador || req.session.user?.name || null,
       b.responsable||null,
       b.fecha_alta || new Date().toISOString().slice(0,10),
       b.fecha_cierre||null, b.notas||null]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Ya existe un ítem con ese ID' });
    next(e);
  }
});

app.patch('/api/backlog/items/:id', requireBacklogAccess, async (req, res, next) => {
  try {
    const b = req.body;
    const fields = ['titulo','area','historia','tipo','modulo','prioridad','estimacion',
                    'estado','origen','creador','responsable','fecha_alta','fecha_cierre','notas'];
    const sets = [];
    const params = [];
    for (const f of fields) {
      if (f in b) { params.push(b[f] ?? null); sets.push(`${f}=$${params.length}`); }
    }
    if (!sets.length) return res.status(400).json({ error: 'Sin campos para actualizar' });
    params.push('NOW()'); sets.push(`updated_at=$${params.length}`);
    params.push(req.params.id);
    const { rows } = await db.query(
      `UPDATE backlog_items SET ${sets.join(',')} WHERE id=$${params.length} RETURNING *`, params);
    if (!rows[0]) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

app.delete('/api/backlog/items/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await db.query('DELETE FROM backlog_items WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// Catálogo de valores únicos (para filtros)
app.get('/api/backlog/meta', requireBacklogAccess, async (req, res, next) => {
  try {
    const [areas, creadores, responsables] = await Promise.all([
      db.query('SELECT DISTINCT area FROM backlog_items WHERE area IS NOT NULL ORDER BY area'),
      db.query('SELECT DISTINCT creador FROM backlog_items WHERE creador IS NOT NULL ORDER BY creador'),
      db.query('SELECT DISTINCT responsable FROM backlog_items WHERE responsable IS NOT NULL ORDER BY responsable'),
    ]);
    res.json({
      areas: areas.rows.map(r => r.area),
      creadores: creadores.rows.map(r => r.creador),
      responsables: responsables.rows.map(r => r.responsable),
    });
  } catch (e) { next(e); }
});

/* ── API: Licitaciones (admin + investigador) ─────────────────── */
// Solo lectura + PATCH de etapa/notas: las licitaciones las crea el agente de
// ingesta (schema licitaciones, misma Postgres), no hay creación manual aquí.
app.get('/api/licitaciones/items', requireLicitacionesAccess, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM licitaciones.v_funnel
       WHERE etapa IS NOT NULL
       ORDER BY fecha_limite_presentacion ASC NULLS LAST`
    );
    res.json(rows);
  } catch (e) { next(e); }
});

app.get('/api/licitaciones/meta', requireLicitacionesAccess, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT DISTINCT responsable FROM licitaciones.pipeline_comercial
       WHERE responsable IS NOT NULL ORDER BY responsable`
    );
    res.json({ responsables: rows.map(r => r.responsable) });
  } catch (e) { next(e); }
});

app.patch('/api/licitaciones/items/:tenderId', requireLicitacionesAccess, async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: current } = await client.query(
      'SELECT etapa FROM licitaciones.pipeline_comercial WHERE tender_id=$1 FOR UPDATE',
      [req.params.tenderId]
    );
    if (!current[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Licitación no encontrada en el funnel' });
    }
    const etapaAnterior = current[0].etapa;

    const b = req.body;
    const fields = ['etapa', 'responsable', 'notas', 'valor_oferta', 'motivo_descarte'];
    const sets = [];
    const params = [];
    for (const f of fields) {
      if (f in b) { params.push(b[f] ?? null); sets.push(`${f}=$${params.length}`); }
    }
    if (!sets.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Sin campos para actualizar' });
    }
    sets.push('actualizado_en=NOW()');
    const etapaCambia = 'etapa' in b && b.etapa !== etapaAnterior;
    if (etapaCambia) sets.push('fecha_cambio_etapa=NOW()');
    params.push(req.params.tenderId);

    await client.query(
      `UPDATE licitaciones.pipeline_comercial SET ${sets.join(',')} WHERE tender_id=$${params.length}`,
      params
    );

    if (etapaCambia) {
      await client.query(
        `INSERT INTO licitaciones.pipeline_historial (tender_id, etapa_anterior, etapa_nueva, cambiado_por)
         VALUES ($1,$2,$3,$4)`,
        [req.params.tenderId, etapaAnterior, b.etapa, req.session.user?.name || null]
      );
    }

    await client.query('COMMIT');

    const { rows: updated } = await db.query(
      'SELECT * FROM licitaciones.v_funnel WHERE tender_id=$1', [req.params.tenderId]
    );
    res.json(updated[0]);
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    next(e);
  } finally {
    client.release();
  }
});

/* ── API: público (lectura) ──────────────────────────────────── */
app.get('/api/public/news', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, slug, excerpt, image_url, source_url, published_at
         FROM news WHERE published = true
        ORDER BY published_at DESC NULLS LAST, created_at DESC`);
    res.json(rows);
  } catch (e) { next(e); }
});
app.get('/api/public/news/:slug', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM news WHERE slug = $1 AND published = true', [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'Noticia no encontrada' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});
app.get('/api/public/events', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, description, location, event_date, url
         FROM events WHERE published = true
        ORDER BY event_date DESC NULLS LAST, created_at DESC`);
    res.json(rows);
  } catch (e) { next(e); }
});
app.post('/api/public/contact', async (req, res, next) => {
  try {
    const { name, email, subject, body } = req.body;
    if (!name?.trim() || !email?.trim() || !body?.trim())
      return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios' });
    await db.query(
      'INSERT INTO messages (name, email, subject, body) VALUES ($1,$2,$3,$4)',
      [name.trim(), email.trim(), subject?.trim() || null, body.trim()]);
    sendLeadEmail({ name: name.trim(), email: email.trim(), subject: subject?.trim(), body: body.trim() })
      .catch(e => console.error('✉️  Error enviando correo del lead:', e.message));
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

/* ── API: Noticias (admin) ───────────────────────────────────── */
app.get('/api/news', requireAdminAPI, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { next(e); }
});
app.post('/api/news', requireAdminAPI, async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title?.trim()) return res.status(400).json({ error: 'El título es obligatorio' });
    const slug = (b.slug?.trim() ? slugify(b.slug) : slugify(b.title)) || `noticia-${Date.now()}`;
    const published = !!b.published;
    const { rows } = await db.query(
      `INSERT INTO news (title, slug, excerpt, body, image_url, source_url, published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [b.title.trim(), slug, b.excerpt||null, b.body||null, b.image_url||null,
       b.source_url||null, published, published ? new Date() : null]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Ya existe una noticia con ese slug' });
    next(e);
  }
});
app.put('/api/news/:id', requireAdminAPI, async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title?.trim()) return res.status(400).json({ error: 'El título es obligatorio' });
    const slug = (b.slug?.trim() ? slugify(b.slug) : slugify(b.title));
    const published = !!b.published;
    const { rows } = await db.query(
      `UPDATE news SET title=$1, slug=$2, excerpt=$3, body=$4, image_url=$5, source_url=$6,
          published=$7,
          published_at = CASE WHEN $7 AND published_at IS NULL THEN NOW()
                              WHEN $7 THEN published_at ELSE NULL END,
          updated_at = NOW()
       WHERE id=$8 RETURNING *`,
      [b.title.trim(), slug, b.excerpt||null, b.body||null, b.image_url||null,
       b.source_url||null, published, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Noticia no encontrada' });
    res.json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Ya existe una noticia con ese slug' });
    next(e);
  }
});
app.delete('/api/news/:id', requireAdminAPI, async (req, res, next) => {
  try {
    await db.query('DELETE FROM news WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── API: Eventos (admin) ────────────────────────────────────── */
app.get('/api/events', requireAdminAPI, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM events ORDER BY event_date DESC NULLS LAST, created_at DESC');
    res.json(rows);
  } catch (e) { next(e); }
});
app.post('/api/events', requireAdminAPI, async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title?.trim()) return res.status(400).json({ error: 'El título es obligatorio' });
    const { rows } = await db.query(
      `INSERT INTO events (title, description, location, event_date, url, published)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [b.title.trim(), b.description||null, b.location||null,
       b.event_date||null, b.url||null, b.published !== false]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});
app.put('/api/events/:id', requireAdminAPI, async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title?.trim()) return res.status(400).json({ error: 'El título es obligatorio' });
    const { rows } = await db.query(
      `UPDATE events SET title=$1, description=$2, location=$3, event_date=$4, url=$5, published=$6
       WHERE id=$7 RETURNING *`,
      [b.title.trim(), b.description||null, b.location||null,
       b.event_date||null, b.url||null, b.published !== false, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});
app.delete('/api/events/:id', requireAdminAPI, async (req, res, next) => {
  try {
    await db.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── API: Mensajes (admin) ───────────────────────────────────── */
app.get('/api/messages', requireAdminAPI, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { next(e); }
});
app.put('/api/messages/:id', requireAdminAPI, async (req, res, next) => {
  try {
    await db.query('UPDATE messages SET handled=$1 WHERE id=$2', [req.body.handled !== false, req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
app.delete('/api/messages/:id', requireAdminAPI, async (req, res, next) => {
  try {
    await db.query('DELETE FROM messages WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ── Static files ────────────────────────────────────────────── */
app.use((req, res, next) => {
  if (req.path.startsWith('/views/') || req.path.startsWith('/db/')) return res.status(404).end();
  next();
});
app.use(express.static(path.join(__dirname, '.')));

/* ── Error handler ───────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

/* ── Start ───────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`✅  Eureqa3D → http://localhost:${PORT}`);
  console.log(`🔐  Panel privado → http://localhost:${PORT}/admin`);
  ensureSchema().catch(err => console.error('Schema error:', err.message));
});
