'use strict';
/* ─────────────────────────────────────────────────────────────
   preview.js — servidor de VISTA PREVIA del sitio público.
   NO necesita base de datos: replica solo las rutas públicas de
   server.js y sirve /assets, para poder navegar la web entera en
   local (el menú funciona). Las APIs de noticias/eventos se
   devuelven vacías para que las páginas no den error.
   Uso:  node preview.js   →  http://localhost:8100/
   ───────────────────────────────────────────────────────────── */
const express = require('express');
const path = require('path');

const app = express();
const PUBLIC = path.join(__dirname, 'views', 'public');
const page = (name) => (_req, res) => res.sendFile(path.join(PUBLIC, name));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Páginas públicas (mismo mapeo que server.js)
app.get('/',                     page('index.html'));
app.get('/quienes-somos',        page('quienes-somos.html'));
app.get('/metodo-eureqa',        page('metodo-eureqa.html'));
app.get('/traumatologia',        page('traumatologia.html'));
app.get('/otras-especialidades', page('otras-especialidades.html'));
app.get('/visor-3d',             page('visor-3d.html'));
app.get('/modelos-3d',           page('modelos-3d.html'));
app.get('/noticias',             page('noticias.html'));
app.get('/noticias/:slug',       page('noticia.html'));
app.get('/contacto',             page('contacto.html'));

// APIs públicas → vacías (sin BD) para que las páginas no fallen
app.get('/api/public/news',   (_req, res) => res.json([]));
app.get('/api/public/events', (_req, res) => res.json([]));

const PORT = process.env.PREVIEW_PORT || 8100;
app.listen(PORT, () => console.log(`\n  Preview lista →  http://localhost:${PORT}/\n`));
