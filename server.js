'use strict';

const express   = require('express');
const session   = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const path      = require('path');
const db        = require('./db/init');
const BACKLOG_SEED = require('./db/backlog-seed');

const app  = express();
const PORT = process.env.PORT || 8080;

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
app.get('/admin/licitaciones-info', requireLicitacionesAccess, (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'licitaciones-info.html')));
app.get('/admin/ejecuciones', requireLicitacionesAccess, (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'ejecuciones.html')));
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
//
// El agente de ingesta solo escribe en tenders/analisis, no en pipeline_comercial
// (el funnel del kanban) -- por eso una oportunidad detectada (encaje alto/medio)
// no aparecía sola en el kanban. La sincronización se hace desde dos sitios: a
// demanda (cada vez que se pide el listado del kanban) y en segundo plano cada
// pocos minutos (ver setInterval junto a app.listen) para que el aviso por email
// no dependa de que alguien tenga el panel abierto. Da de alta (etapa inicial
// 'detectada') cualquier tender con encaje alto/medio sin fila en pipeline_comercial
// y avisa por correo a los admins de las que sean nuevas.
//
// SOLO la versión MÁS RECIENTE de analisis cuenta (hallazgo real 2026-07-30): `analisis`
// es una tabla versionada (una fila nueva por reanálisis, nunca se borra la anterior). Sin
// el filtro por MAX(version), un tender que en su primer análisis salió 'medio' por error
// (bug ya corregido en el agente de ingesta) volvía a colarse aquí para siempre aunque una
// reanálisis posterior lo corrigiera a 'bajo'/'nulo' -- la fila vieja seguía cumpliendo el
// WHERE igualmente. Mismo patrón que ya usan las queries de /api/licitaciones/ejecuciones.
async function sincronizarOportunidadesFunnel() {
  const { rows: nuevas } = await db.query(`
    INSERT INTO licitaciones.pipeline_comercial (tender_id, etapa)
    SELECT a.tender_id, 'detectada'
    FROM licitaciones.analisis a
    WHERE a.encaje IN ('alto','medio')
      AND a.version = (SELECT MAX(version) FROM licitaciones.analisis WHERE tender_id = a.tender_id)
      AND NOT EXISTS (
        SELECT 1 FROM licitaciones.pipeline_comercial p WHERE p.tender_id = a.tender_id
      )
    RETURNING tender_id
  `);
  if (!nuevas.length) return;

  const { rows: detalle } = await db.query(`
    SELECT t.id AS tender_id, COALESCE(a.titulo_traducido, t.objeto_contrato) AS titulo,
           t.organo_contratacion, t.pais_iso2, t.fecha_limite_presentacion, t.url_perfil,
           a.encaje, a.resumen_ia, a.score_final, f.nombre AS fuente_nombre
    FROM licitaciones.tenders t
    JOIN licitaciones.analisis a ON a.tender_id = t.id
      AND a.version = (SELECT MAX(version) FROM licitaciones.analisis WHERE tender_id = t.id)
    JOIN licitaciones.fuentes f ON f.id = t.fuente_id
    WHERE t.id = ANY($1::bigint[])
    ORDER BY a.score_final DESC
  `, [nuevas.map(n => n.tender_id)]);

  try {
    await enviarCorreoOportunidades(detalle);
  } catch (e) {
    console.error('No se pudo enviar el correo de nuevas oportunidades:', e.message);
  }
}

const escHtml = (s) => (s ?? '').toString().replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Aviso de un nuevo mensaje del formulario de contacto, vía API HTTP de Brevo
// (mismo patrón que enviarCorreoOportunidades). LEAD_NOTIFY_EMAILS admite
// varias direcciones separadas por comas, para no depender de un único buzón
// (info@eureqa3d.com recibe mucho spam y algún cliente se ha escapado por eso).
async function enviarCorreoLead({ name, email, subject, body }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const destinatarios = (process.env.LEAD_NOTIFY_EMAILS || 'info@eureqa3d.com')
    .split(',').map(e => e.trim()).filter(Boolean).map(addr => ({ email: addr }));
  if (!destinatarios.length) return;

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'aquintas@gmail.com';

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: senderEmail, name: 'Eureqa3D · Web' },
      to: destinatarios,
      replyTo: { email, name },
      subject: subject || `Nuevo mensaje de ${name} (formulario web)`,
      htmlContent: `<p><strong>Nombre:</strong> ${escHtml(name)}</p>
        <p><strong>Email:</strong> ${escHtml(email)}</p>
        <p><strong>Asunto:</strong> ${escHtml(subject || '-')}</p>
        <p>${escHtml(body).replace(/\n/g, '<br>')}</p>`
    })
  });
  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }
}

// Auto-respuesta de cortesía a quien rellena el formulario público, para que
// sepa que su mensaje ha llegado (antes no se enviaba nada al propio lead).
async function enviarCorreoConfirmacionLead({ name, email }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'aquintas@gmail.com';

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: senderEmail, name: 'Eureqa3D' },
      to: [{ email, name }],
      subject: 'Gracias por contactar con Eureqa3D',
      htmlContent: `<p>Hola ${escHtml(name)},</p>
        <p>Gracias por ponerte en contacto con Eureqa3D. Hemos recibido tu mensaje y te responderemos en breve.</p>
        <p>Un saludo,<br>El equipo de Eureqa3D</p>`
    })
  });
  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }
}

// Envío vía API HTTP de Brevo (no SMTP): con solo BREVO_API_KEY basta, sin
// necesitar el "login" SMTP que Brevo no expone junto a la SMTP key. Mismo
// patrón que src/lib/brevo.ts en KiraConnect. Ojo: BREVO_API_KEY es una key
// compartida con KiraConnect y el workflow de Dapart (mismo BREVO_DAILY_LIMIT).
async function enviarCorreoOportunidades(oportunidades) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !oportunidades.length) return;

  const { rows: admins } = await db.query(`SELECT email, name FROM users WHERE role='admin'`);
  const destinatarios = admins.filter(a => a.email).map(a => ({ email: a.email, name: a.name || undefined }));
  if (!destinatarios.length) return;

  const asunto = oportunidades.length === 1
    ? `Nueva oportunidad detectada: ${oportunidades[0].titulo}`
    : `${oportunidades.length} nuevas oportunidades detectadas en licitaciones`;

  const items = oportunidades.map(o => {
    const limite = o.fecha_limite_presentacion
      ? new Date(o.fecha_limite_presentacion).toLocaleDateString('es-ES')
      : 'sin fecha límite';
    return `<li style="margin-bottom:14px">
      <strong>[${escHtml((o.encaje || '').toUpperCase())}]</strong> ${escHtml(o.titulo)}<br>
      <span style="color:#666">${escHtml(o.fuente_nombre)}${o.organo_contratacion ? ' · ' + escHtml(o.organo_contratacion) : ''} · límite ${limite}</span><br>
      ${o.url_perfil ? `<a href="${escHtml(o.url_perfil)}">${escHtml(o.url_perfil)}</a>` : '(sin enlace)'}
    </li>`;
  }).join('');

  const urlPanel = `${process.env.APP_URL || 'https://eureqa3d-production.up.railway.app'}/admin`;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'aquintas@gmail.com';

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: senderEmail, name: 'Eureqa3D · Licitaciones' },
      to: destinatarios,
      subject: asunto,
      htmlContent: `<p>La IA ha marcado ${oportunidades.length === 1 ? 'una nueva licitación' : `${oportunidades.length} nuevas licitaciones`} como oportunidad (encaje alto/medio):</p><ul>${items}</ul><p><a href="${urlPanel}">Ver en el kanban</a></p>`
    })
  });
  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }
}

app.get('/api/licitaciones/items', requireLicitacionesAccess, async (req, res, next) => {
  try {
    await sincronizarOportunidadesFunnel();
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
    const [responsables, paises] = await Promise.all([
      db.query(
        `SELECT DISTINCT responsable FROM licitaciones.pipeline_comercial
         WHERE responsable IS NOT NULL ORDER BY responsable`
      ),
      db.query(
        `SELECT DISTINCT pais_iso2 FROM licitaciones.v_funnel
         WHERE pais_iso2 IS NOT NULL AND etapa IS NOT NULL ORDER BY pais_iso2`
      ),
    ]);
    res.json({
      responsables: responsables.rows.map(r => r.responsable),
      paises: paises.rows.map(r => r.pais_iso2),
    });
  } catch (e) { next(e); }
});

// Todas las cuentas de "oportunidades" de este endpoint y de /ejecuciones filtran por
// MAX(version) (hallazgo real 2026-07-30, mismo motivo que sincronizarOportunidadesFunnel
// más arriba): sin el filtro, una licitación reanalizada y corregida a 'bajo' seguía
// contando como oportunidad para siempre porque su primera versión (errónea) seguía
// cumpliendo el WHERE. Efecto secundario asumido a propósito: al reanalizar una licitación,
// su recuento "por noche" se desplaza a la noche de la reanálisis, no la de detección
// original -- preferible a arrastrar un número que ya no es cierto.
app.get('/api/licitaciones/dashboard-stats', requireLicitacionesAccess, async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT
        f.codigo, f.pais_iso2, f.nombre, f.activa,
        count(t.id) AS ingeridas,
        count(a.id) FILTER (
          WHERE a.encaje IN ('alto','medio')
            AND a.version = (SELECT MAX(version) FROM licitaciones.analisis WHERE tender_id = a.tender_id)
        ) AS oportunidades
      FROM licitaciones.fuentes f
      LEFT JOIN licitaciones.tenders t ON t.fuente_id = f.id
      LEFT JOIN licitaciones.analisis a ON a.tender_id = t.id
      GROUP BY f.id
      ORDER BY f.pais_iso2
    `);
    res.json(rows);
  } catch (e) { next(e); }
});

// Ejecuciones del pipeline (cron diario), pivotadas: una fila por noche de cron,
// una columna por fuente/país. "Encontrados" viene de ingest_runs (entries_nuevas);
// "oportunidades" se cuenta aparte sobre analisis+tenders porque el análisis IA no
// es por fuente (analysis_runs es una única fila global por noche) -- se reparte por
// país agrupando por la fecha en que se analizó cada licitación.
// ?year=YYYY&month=1-12 filtran la tabla diaria (por defecto, mes en curso); el
// resumen anual siempre es del año en curso real, independiente de esos parámetros.
function sumarPorFuente(rows, campoValor) {
  const porFuente = {};
  for (const r of rows) porFuente[r.codigo] = r[campoValor] || 0;
  return porFuente;
}

app.get('/api/licitaciones/ejecuciones', requireLicitacionesAccess, async (req, res, next) => {
  try {
    const ahora = new Date();
    let year = parseInt(req.query.year, 10);
    let month = parseInt(req.query.month, 10);
    if (!Number.isInteger(year)) year = ahora.getUTCFullYear();
    if (!Number.isInteger(month) || month < 1 || month > 12) month = ahora.getUTCMonth() + 1;

    const mesInicio = new Date(Date.UTC(year, month - 1, 1));
    const mesFin     = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
    const anioActual  = ahora.getUTCFullYear();
    const anioInicio  = new Date(Date.UTC(anioActual, 0, 1));
    const anioFin     = new Date(Date.UTC(anioActual + 1, 0, 1));

    // Nota: sin ::date -- ese cast hace que node-postgres reinterprete la fecha con
    // el huso horario LOCAL del proceso Node (no el de la sesión de Postgres, que es
    // UTC), desplazando el día en 1 si el contenedor no corre exactamente en UTC.
    // Dejar el timestamptz truncado y cortar la fecha en JS con toISOString() evita
    // esa reinterpretación (confirmado en real: con el cast, un cron de las 05:xx UTC
    // aparecía fechado el día anterior al ejecutar este servidor en Europe/Madrid).
    const [fuentesRes, ingestaRes, oportunidadesRes, anualIngestaRes, anualOportunidadesRes] = await Promise.all([
      db.query(`SELECT codigo, nombre, pais_iso2, url_base, activa FROM licitaciones.fuentes ORDER BY pais_iso2, codigo`),
      db.query(`
        SELECT date_trunc('day', r.iniciado_en) AS dia, f.codigo,
               SUM(r.entries_nuevas)::int AS encontrados,
               bool_or(r.estado = 'error') AS con_error,
               string_agg(DISTINCT r.error, ' | ') FILTER (WHERE r.error IS NOT NULL) AS error
        FROM licitaciones.ingest_runs r
        JOIN licitaciones.fuentes f ON f.id = r.fuente_id
        WHERE r.iniciado_en >= $1 AND r.iniciado_en < $2
        GROUP BY 1, 2
      `, [mesInicio, mesFin]),
      db.query(`
        SELECT date_trunc('day', a.analizado_en) AS dia, f.codigo,
               COUNT(*) FILTER (
                 WHERE a.encaje IN ('alto','medio')
                   AND a.version = (SELECT MAX(version) FROM licitaciones.analisis WHERE tender_id = a.tender_id)
               )::int AS oportunidades
        FROM licitaciones.analisis a
        JOIN licitaciones.tenders t ON t.id = a.tender_id
        JOIN licitaciones.fuentes f ON f.id = t.fuente_id
        WHERE a.analizado_en >= $1 AND a.analizado_en < $2
        GROUP BY 1, 2
      `, [mesInicio, mesFin]),
      db.query(`
        SELECT f.codigo, SUM(r.entries_nuevas)::int AS encontrados
        FROM licitaciones.ingest_runs r
        JOIN licitaciones.fuentes f ON f.id = r.fuente_id
        WHERE r.iniciado_en >= $1 AND r.iniciado_en < $2
        GROUP BY 1
      `, [anioInicio, anioFin]),
      db.query(`
        SELECT f.codigo, COUNT(*) FILTER (
          WHERE a.encaje IN ('alto','medio')
            AND a.version = (SELECT MAX(version) FROM licitaciones.analisis WHERE tender_id = a.tender_id)
        )::int AS oportunidades
        FROM licitaciones.analisis a
        JOIN licitaciones.tenders t ON t.id = a.tender_id
        JOIN licitaciones.fuentes f ON f.id = t.fuente_id
        WHERE a.analizado_en >= $1 AND a.analizado_en < $2
        GROUP BY 1
      `, [anioInicio, anioFin]),
    ]);

    const oportunidadesPorClave = new Map();
    for (const o of oportunidadesRes.rows) {
      oportunidadesPorClave.set(`${o.dia.toISOString().slice(0, 10)}|${o.codigo}`, o.oportunidades);
    }

    const diasMap = new Map();
    for (const r of ingestaRes.rows) {
      const fecha = r.dia.toISOString().slice(0, 10);
      if (!diasMap.has(fecha)) diasMap.set(fecha, {});
      diasMap.get(fecha)[r.codigo] = {
        encontrados: r.encontrados || 0,
        oportunidades: oportunidadesPorClave.get(`${fecha}|${r.codigo}`) || 0,
        estado: r.con_error ? 'error' : 'ok',
        error: r.error || null,
      };
    }

    const dias = [...diasMap.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([fecha, porFuente]) => {
        const valores = Object.values(porFuente);
        return {
          dia: fecha,
          resumen: {
            encontrados: valores.reduce((s, v) => s + v.encontrados, 0),
            oportunidades: valores.reduce((s, v) => s + v.oportunidades, 0),
          },
          porFuente,
        };
      });

    const anualEncontrados = sumarPorFuente(anualIngestaRes.rows, 'encontrados');
    const anualOportunidades = sumarPorFuente(anualOportunidadesRes.rows, 'oportunidades');
    const anualPorFuente = {};
    for (const f of fuentesRes.rows) {
      anualPorFuente[f.codigo] = {
        encontrados: anualEncontrados[f.codigo] || 0,
        oportunidades: anualOportunidades[f.codigo] || 0,
      };
    }
    const anualValores = Object.values(anualPorFuente);
    const anual = {
      anio: anioActual,
      resumen: {
        encontrados: anualValores.reduce((s, v) => s + v.encontrados, 0),
        oportunidades: anualValores.reduce((s, v) => s + v.oportunidades, 0),
      },
      porFuente: anualPorFuente,
    };

    res.json({ fuentes: fuentesRes.rows, anio: year, mes: month, dias, anual });
  } catch (e) { next(e); }
});

// Listado de licitaciones marcadas como oportunidad (encaje alto/medio) para un
// rango dado: un día concreto (?dia=YYYY-MM-DD), un año completo (?year=YYYY sin
// month) o un mes (?year=YYYY&month=1-12, por defecto mes en curso). Filtra
// opcionalmente por fuente (?codigo=). Usa el mismo criterio que el conteo de
// "oportunidades" en /api/licitaciones/ejecuciones para que la lista cuadre con
// el número sobre el que se pinchó.
app.get('/api/licitaciones/ejecuciones/oportunidades', requireLicitacionesAccess, async (req, res, next) => {
  try {
    const ahora = new Date();
    let desde, hasta;
    if (req.query.dia) {
      const d = new Date(`${req.query.dia}T00:00:00.000Z`);
      desde = d;
      hasta = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    } else {
      let year = parseInt(req.query.year, 10);
      if (!Number.isInteger(year)) year = ahora.getUTCFullYear();
      let month = parseInt(req.query.month, 10);
      if (Number.isInteger(month) && month >= 1 && month <= 12) {
        desde = new Date(Date.UTC(year, month - 1, 1));
        hasta = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
      } else {
        desde = new Date(Date.UTC(year, 0, 1));
        hasta = new Date(Date.UTC(year + 1, 0, 1));
      }
    }

    const params = [desde, hasta];
    let filtroFuente = '';
    if (req.query.codigo) { params.push(req.query.codigo); filtroFuente = `AND f.codigo = $${params.length}`; }

    const { rows } = await db.query(`
      SELECT t.id AS tender_id,
             COALESCE(a.titulo_traducido, t.objeto_contrato) AS titulo,
             t.organo_contratacion, t.pais_iso2, t.fecha_limite_presentacion,
             t.url_perfil, a.encaje, a.resumen_ia, f.codigo AS fuente_codigo,
             a.analizado_en
      FROM licitaciones.analisis a
      JOIN licitaciones.tenders t ON t.id = a.tender_id
      JOIN licitaciones.fuentes f ON f.id = t.fuente_id
      WHERE a.analizado_en >= $1 AND a.analizado_en < $2
        AND a.encaje IN ('alto','medio')
        AND a.version = (SELECT MAX(version) FROM licitaciones.analisis WHERE tender_id = a.tender_id)
        ${filtroFuente}
      ORDER BY a.analizado_en DESC
    `, params);
    res.json(rows);
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
    enviarCorreoLead({ name: name.trim(), email: email.trim(), subject: subject?.trim(), body: body.trim() })
      .catch(e => console.error('✉️  Error enviando correo del lead:', e.message));
    enviarCorreoConfirmacionLead({ name: name.trim(), email: email.trim() })
      .catch(e => console.error('✉️  Error enviando confirmación al lead:', e.message));
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

  // Revisa cada 5 min si hay nuevas oportunidades (encaje alto/medio) para darlas
  // de alta en el kanban y avisar por email, sin depender de que alguien abra el panel.
  setInterval(() => {
    sincronizarOportunidadesFunnel().catch(err => console.error('Sync oportunidades:', err.message));
  }, 5 * 60 * 1000);
});
