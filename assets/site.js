'use strict';

/* ── Layout compartido: header + footer ──────────────────────── */
const NAV = [
  ['Inicio', '/'],
  ['Quiénes somos', '/quienes-somos'],
  ['Método Eureqa', '/metodo-eureqa'],
  ['Traumatología', '/traumatologia'],
  ['Otras especialidades', '/otras-especialidades'],
  ['Noticias', '/noticias'],
  ['Contacto', '/contacto'],
];

function renderHeader() {
  const here = location.pathname.replace(/\/$/, '') || '/';
  const links = NAV.map(([t, h]) => {
    const active = (h === '/' ? here === '/' : here.startsWith(h)) ? ' class="active"' : '';
    return `<li><a href="${h}"${active}>${t}</a></li>`;
  }).join('');
  return `
  <div class="topbar-utility">
    <div class="container">
      <a href="tel:+34927180032">📞 927 180 032</a>
      <span class="sep">·</span>
      <a href="mailto:info@eureqa3d.com">✉️ info@eureqa3d.com</a>
      <span class="sep">·</span>
      <a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">🐦 @eureqa3D</a>
    </div>
  </div>
  <header class="site-header">
    <div class="container nav">
      <a class="nav-logo" href="/" aria-label="Eureqa3D"><img src="/assets/img/logo.svg" alt="Eureqa3D"></a>
      <nav class="nav-main">
        <ul class="nav-links" id="navLinks">${links}
          <li class="nav-cta-mobile"><a href="/contacto">Solicita un caso de prueba</a></li>
        </ul>
        <a class="btn btn-primary nav-cta" href="/contacto">Caso de prueba</a>
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Menú"><span></span><span></span><span></span></button>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="/assets/img/logo.svg" alt="Eureqa3D">
          <p>Servicio integral de impresión 3D especializado en el sector salud. Tecnología y cirugía al servicio del profesional.</p>
          <p class="muted">Extremadura · España</p>
        </div>
        <div>
          <h4>Navegación</h4>
          <ul>
            <li><a href="/quienes-somos">Quiénes somos</a></li>
            <li><a href="/metodo-eureqa">Método Eureqa</a></li>
            <li><a href="/traumatologia">Traumatología</a></li>
            <li><a href="/otras-especialidades">Otras especialidades</a></li>
            <li><a href="/noticias">Noticias</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul>
            <li><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a></li>
            <li><a href="tel:+34927180032">927 180 032</a></li>
            <li><a href="tel:+34654552044">654 552 044</a></li>
            <li><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Eureqa3D. Todos los derechos reservados.</span>
        <span>Impresión 3D · Sector Salud · ISO 9001</span>
      </div>
    </div>
  </footer>`;
}

function mountLayout() {
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.outerHTML = renderHeader();
  if (f) f.outerHTML = renderFooter();
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
}

/* ── Utilidades ──────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}
function esc(s) {
  return (s ?? '').toString().replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/* ── Noticias: listado público ───────────────────────────────── */
async function loadNewsList(el) {
  try {
    const res = await fetch('/api/public/news');
    const items = await res.json();
    if (!items.length) {
      el.innerHTML = '<p class="muted center">Próximamente publicaremos novedades aquí.</p>';
      return;
    }
    el.innerHTML = items.map(n => `
      <a class="card news-card" href="/noticias/${esc(n.slug)}">
        <div class="thumb" ${n.image_url ? `style="background-image:url('${esc(n.image_url)}')"` : ''}></div>
        <div class="body">
          <span class="date">${fmtDate(n.published_at)}</span>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.excerpt || '')}</p>
          <span class="more">Leer más →</span>
        </div>
      </a>`).join('');
  } catch {
    el.innerHTML = '<p class="muted center">No se pudieron cargar las noticias.</p>';
  }
}

/* ── Noticia: detalle ────────────────────────────────────────── */
async function loadArticle(el) {
  const slug = location.pathname.split('/').filter(Boolean).pop();
  try {
    const res = await fetch(`/api/public/news/${slug}`);
    if (!res.ok) throw new Error();
    const n = await res.json();
    document.title = `${n.title} · Eureqa3D`;
    el.innerHTML = `
      <p class="meta">${fmtDate(n.published_at)}</p>
      <h1>${esc(n.title)}</h1>
      ${n.image_url ? `<img class="cover" src="${esc(n.image_url)}" alt="${esc(n.title)}">` : ''}
      ${n.excerpt ? `<p><strong>${esc(n.excerpt)}</strong></p>` : ''}
      <div>${(n.body || '').split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      ${n.source_url ? `<p class="muted">Fuente: <a href="${esc(n.source_url)}" target="_blank" rel="noopener">${esc(n.source_url)}</a></p>` : ''}
      <p style="margin-top:2rem"><a class="btn btn-ghost" href="/noticias">← Volver a noticias</a></p>`;
  } catch {
    el.innerHTML = '<h1>Noticia no encontrada</h1><p><a class="btn btn-ghost" href="/noticias">← Volver a noticias</a></p>';
  }
}

/* ── Eventos / Jornadas (home) ───────────────────────────────── */
async function loadEvents(el) {
  try {
    const items = await (await fetch('/api/public/events')).json();
    if (!items.length) { el.closest('[data-events-section]')?.remove(); return; }
    el.innerHTML = items.slice(0, 5).map(e => {
      const d = e.event_date ? new Date(e.event_date) : null;
      return `<div class="event">
        <div class="when"><div class="d">${d ? d.getDate() : '·'}</div><div class="m">${d ? d.toLocaleDateString('es-ES',{month:'short'}) : ''}</div></div>
        <div>
          <h3>${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener" style="color:#fff">${esc(e.title)}</a>` : esc(e.title)}</h3>
          <p>${[esc(e.location), esc(e.description)].filter(Boolean).join(' · ')}</p>
        </div>
      </div>`;
    }).join('');
  } catch { el.closest('[data-events-section]')?.remove(); }
}

/* ── Formulario de contacto ──────────────────────────────────── */
function initContactForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg') || (() => {
      const d = document.createElement('div'); form.prepend(d); return d;
    })();
    msg.className = 'form-msg'; msg.textContent = '';
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar');
      msg.className = 'form-msg ok'; msg.textContent = '¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.';
      form.reset();
    } catch (err) {
      msg.className = 'form-msg err'; msg.textContent = err.message;
    }
  });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  mountLayout();
  const newsList = document.getElementById('news-list');   if (newsList) loadNewsList(newsList);
  const article  = document.getElementById('article');     if (article)  loadArticle(article);
  const events   = document.getElementById('events-list'); if (events)   loadEvents(events);
  const contact  = document.getElementById('contact-form');if (contact)  initContactForm(contact);
});
