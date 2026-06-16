'use strict';

const express   = require('express');
const session   = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt    = require('bcryptjs');
const path      = require('path');
const nodemailer = require('nodemailer');
const db        = require('./db/init');

const app  = express();
const PORT = process.env.PORT || 8080;

/* ── Correo (opcional, se activa con variables SMTP_*) ───────────── */
let _mailer; // undefined = sin inicializar, false = no configurado
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
  if (!m) return; // sin SMTP configurado → el lead queda guardado en BD
  const to = process.env.LEAD_TO || process.env.SMTP_USER;
  await m.sendMail({
    from: `"Eureqa3D Web" <${process.env.SMTP_USER}>`,
    to, replyTo: email,
    subject: subject || `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject || '-'}\n\n${body}`
  });
}

app.set('trust proxy', 1); // Railway / Nginx proxy

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
const requireAuth = (req, res, next) =>
  req.session.user ? next() : res.redirect('/login');

const requireAdminAPI = (req, res, next) =>
  req.session.user?.role === 'admin' ? next() : res.status(403).json({ error: 'Acceso restringido' });

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
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);
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

  // Usuario admin por defecto (solo si la tabla está vacía)
  const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM users');
  if (rows[0].n === 0) {
    const email = (process.env.ADMIN_EMAIL || 'admin@eureqa3d.com').toLowerCase().trim();
    const pass  = process.env.ADMIN_PASSWORD || 'changeme';
    await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)',
      ['Administrador', email, bcrypt.hashSync(pass, 12), 'admin']
    );
    console.log(`👤  Usuario admin creado → ${email}`);
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
app.get('/modelos-3d',          page('modelos-3d.html'));
app.get('/noticias',            page('noticias.html'));
app.get('/noticias/:slug',      page('noticia.html'));
app.get('/contacto',            page('contacto.html'));

/* ── Private zone ────────────────────────────────────────────── */
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/admin');
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/admin',          requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/admin/{*path}',  requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/login')));

/* ── API: Auth ───────────────────────────────────────────────── */
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
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
      [b.title.trim(), slug, b.excerpt || null, b.body || null, b.image_url || null,
       b.source_url || null, published, published ? new Date() : null]);
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
      [b.title.trim(), slug, b.excerpt || null, b.body || null, b.image_url || null,
       b.source_url || null, published, req.params.id]);
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

/* ── API: Eventos / Jornadas (admin) ─────────────────────────── */
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
      [b.title.trim(), b.description || null, b.location || null,
       b.event_date || null, b.url || null, b.published !== false]);
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
      [b.title.trim(), b.description || null, b.location || null,
       b.event_date || null, b.url || null, b.published !== false, req.params.id]);
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

/* ── API: Mensajes de contacto (admin) ───────────────────────── */
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

/* ── Static files (after all routes) ─────────────────────────── */
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
  console.log(`🔐  Zona privada → http://localhost:${PORT}/admin`);
  ensureSchema().catch(err => console.error('No se pudo preparar el esquema:', err.message));
});
