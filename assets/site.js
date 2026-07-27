'use strict';

/* ── Layout compartido: header + footer ──────────────────────── */
const NAV = [
  ['Inicio', '/'],
  ['Quiénes somos', '/quienes-somos'],
  ['Método Eureqa', '/metodo-eureqa'],
  ['Traumatología', '/traumatologia'],
  ['Otras especialidades', '/otras-especialidades'],
  // ['Visor 3D', '/visor-3d'],   // oculto temporalmente: página preparada, sin mostrar
  ['Modelos 3D', '/modelos-3d'],
  ['Noticias', '/noticias'],
  ['Contacto', '/contacto'],
];

/* Traducción de etiquetas (delega en i18n.js; si no está, devuelve el español) */
const tr = (s) => (window.I18N ? window.I18N.t(s) : s);

/* ── Iconos SVG (Lucide) — sustituyen a los emojis en toda la web ─
   Se definen una vez aquí y se inyectan en cualquier elemento con
   data-ic="nombre" (ver injectIcons). También se usan inline en el
   header/footer/topbar vía svgIcon().                              */
const ICONS = {
  phone:      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  mail:       '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  twitter:    '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
  lock:       '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  mapPin:     '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  users:      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  award:      '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  shield:     '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  refresh:    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  layers:     '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  eye:        '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  cpu:        '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  scissors:   '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  link:       '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  droplet:    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  heart:      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  smile:      '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  brain:      '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
  activity:   '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  wind:       '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  ear:        '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/>',
  stethoscope:'<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  flower:     '<circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/>',
};
function svgIcon(paths, size = 24) {
  return `<svg class="ic-svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}
/* Inyecta el SVG en cada elemento con data-ic="nombre" */
function injectIcons(root = document) {
  root.querySelectorAll('[data-ic]').forEach((el) => {
    const p = ICONS[el.dataset.ic];
    if (p && !el.querySelector('svg')) el.innerHTML = svgIcon(p);
  });
}

function renderLangSwitch() {
  const langs = window.I18N ? window.I18N.LANGS : [];
  const cur = window.I18N ? window.I18N.getLang() : 'es';
  if (!langs.length) return '';
  return `<div class="lang-switch" role="group" aria-label="Idioma">${langs.map(l =>
    `<button type="button" class="lang-btn${l.code === cur ? ' active' : ''}" data-lang="${l.code}" lang="${l.code}" title="${l.label}" aria-label="${l.label}">${l.flag}</button>`
  ).join('')}</div>`;
}

function renderHeader() {
  const here = location.pathname.replace(/\/$/, '') || '/';
  const links = NAV.map(([t, h]) => {
    const active = (h === '/' ? here === '/' : here.startsWith(h)) ? ' class="active"' : '';
    return `<li><a href="${h}"${active}>${tr(t)}</a></li>`;
  }).join('');
  return `
  <div class="topbar-utility" data-no-i18n>
    <div class="container">
      <a href="tel:+34927180032">${svgIcon(ICONS.phone, 15)} 927 180 032</a>
      <span class="sep">·</span>
      <a href="mailto:info@eureqa3d.com">${svgIcon(ICONS.mail, 15)} info@eureqa3d.com</a>
      <span class="sep">·</span>
      <a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">${svgIcon(ICONS.twitter, 15)} @eureqa3D</a>
      <span class="sep">·</span>
      <a href="/login" class="topbar-access">${svgIcon(ICONS.lock, 15)} ${tr('Acceso')}</a>
      ${renderLangSwitch()}
    </div>
  </div>
  <header class="site-header" data-no-i18n>
    <div class="container nav">
      <a class="nav-logo" href="/" aria-label="Eureqa3D"><img src="/assets/img/logo.svg" alt="Eureqa3D"></a>
      <nav class="nav-main">
        <ul class="nav-links" id="navLinks">${links}
          <li class="nav-cta-mobile"><a href="/contacto">${tr('Solicita un caso de prueba')}</a></li>
        </ul>
        <a class="btn btn-primary nav-cta" href="/contacto">${tr('Caso de prueba')}</a>
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="${tr('Menú')}"><span></span><span></span><span></span></button>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer" data-no-i18n>
    <div class="container">
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="/assets/img/logo.svg" alt="Eureqa3D">
          <p>${tr('Servicio integral de impresión 3D y modelos digitales especializado en el sector salud. Tecnología y cirugía al servicio del profesional.')}</p>
          <p class="muted">${tr('Extremadura · España')}</p>
        </div>
        <div>
          <h4>${tr('Navegación')}</h4>
          <ul>
            <li><a href="/quienes-somos">${tr('Quiénes somos')}</a></li>
            <li><a href="/metodo-eureqa">${tr('Método Eureqa')}</a></li>
            <li><a href="/traumatologia">${tr('Traumatología')}</a></li>
            <li><a href="/otras-especialidades">${tr('Otras especialidades')}</a></li>
            <li><a href="/modelos-3d">${tr('Modelos 3D')}</a></li>
            <li><a href="/noticias">${tr('Noticias')}</a></li>
          </ul>
        </div>
        <div>
          <h4>${tr('Contacto')}</h4>
          <ul>
            <li><a href="mailto:info@eureqa3d.com">info@eureqa3d.com</a></li>
            <li><a href="tel:+34927180032">927 180 032</a></li>
            <li><a href="tel:+34654552044">654 552 044</a></li>
            <li><a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">@eureqa3D</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Eureqa3D. ${tr('Todos los derechos reservados.')}</span>
        <span>${tr('Impresión 3D · Sector Salud · ISO 9001')}</span>
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
  // Selector de idioma
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.addEventListener('click', () => window.I18N && window.I18N.setLang(btn.dataset.lang)));
  // Traducir el contenido de la página
  if (window.I18N) window.I18N.apply();
}

/* ── Utilidades ──────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '';
  const loc = window.I18N ? window.I18N.locale() : 'es-ES';
  return new Date(iso).toLocaleDateString(loc, { day: '2-digit', month: 'long', year: 'numeric' });
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
      el.innerHTML = `<p class="muted center">${tr('Próximamente publicaremos novedades aquí.')}</p>`;
      return;
    }
    el.innerHTML = items.map(n => `
      <a class="card news-card" href="/noticias/${esc(n.slug)}">
        <div class="thumb" ${n.image_url ? `style="background-image:url('${esc(n.image_url)}')"` : ''}></div>
        <div class="body">
          <span class="date">${fmtDate(n.published_at)}</span>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.excerpt || '')}</p>
          <span class="more">${tr('Leer más →')}</span>
        </div>
      </a>`).join('');
  } catch {
    el.innerHTML = `<p class="muted center">${tr('No se pudieron cargar las noticias.')}</p>`;
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
      ${n.source_url ? `<p class="muted">${tr('Fuente:')} <a href="${esc(n.source_url)}" target="_blank" rel="noopener">${esc(n.source_url)}</a></p>` : ''}
      <p style="margin-top:2rem"><a class="btn btn-ghost" href="/noticias">${tr('← Volver a noticias')}</a></p>`;
  } catch {
    el.innerHTML = `<h1>${tr('Noticia no encontrada')}</h1><p><a class="btn btn-ghost" href="/noticias">${tr('← Volver a noticias')}</a></p>`;
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
        <div class="when"><div class="d">${d ? d.getDate() : '·'}</div><div class="m">${d ? d.toLocaleDateString(window.I18N ? window.I18N.locale() : 'es-ES',{month:'short'}) : ''}</div></div>
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
      if (!res.ok) throw new Error(data.error || tr('No se pudo enviar'));
      msg.className = 'form-msg ok'; msg.textContent = tr('¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.');
      form.reset();
    } catch (err) {
      msg.className = 'form-msg err'; msg.textContent = err.message;
    }
  });
}

/* ── Carrusel ────────────────────────────────────────────────── */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.carousel-track');
    const step = () => Math.max(240, track.querySelector('.carousel-slide')?.offsetWidth + 20 || 280);
    c.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    c.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });
}

/* ── Visores 3D con carga diferida (Sketchfab o iframe propio) ── */
function initSketchfab() {
  document.querySelectorAll('[data-sketchfab],[data-embed]').forEach(v => {
    const open = () => {
      if (v.dataset.loaded) return;
      v.dataset.loaded = '1';
      const title = v.closest('.model-card, .model-feature, .visor-block')?.querySelector('h2, h3')?.textContent?.trim() || 'Eureqa3D';
      const frame = document.createElement('iframe');
      frame.className = 'sk-frame';
      frame.title = title;
      frame.allow = 'autoplay; fullscreen; xr-spatial-tracking';
      frame.allowFullscreen = true;
      frame.setAttribute('mozallowfullscreen', 'true');
      frame.setAttribute('webkitallowfullscreen', 'true');
      frame.src = v.dataset.embed
        ? v.dataset.embed
        : `https://sketchfab.com/models/${v.dataset.sketchfab}/embed?autostart=1&ui_theme=dark&dnt=1&ui_hint=0`;
      v.innerHTML = '';
      v.appendChild(frame);
      v.classList.add('loaded');
    };
    v.querySelector('.model-play')?.addEventListener('click', open);
  });
}

/* ── Chat de captación de leads (estilo Kira) ────────────────── */
function initChat() {
  if (document.querySelector('.chat-fab')) return;

  const GREETING = '👋 ¡Hola! Soy el asistente de Eureqa3D. Te hago un par de preguntas y te contactamos.';
  const QUESTIONS = [
    { field: 'name',    q: 'Para empezar, ¿cómo te llamas?' },
    { field: 'company', q: 'Encantado, {name}. ¿De qué empresa, hospital o centro nos escribes?' },
    { field: 'email',   q: '¿Y un email donde podamos contactarte?', type: 'email' },
    { field: 'message', q: 'Por último, cuéntanos brevemente qué necesitas.' },
  ];
  const data = {};
  let step = -1, started = false, finished = false;

  // Botón flotante
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', tr('Abrir chat'));
  fab.innerHTML = `<span class="badge">1</span>
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.04 2 11.02c0 2.69 1.3 5.1 3.36 6.74L4.5 22l4.6-2.07c.92.25 1.9.39 2.9.39 5.52 0 10-4.04 10-9.02S17.52 2 12 2z"/></svg>`;

  // Panel
  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.setAttribute('data-no-i18n', '');
  panel.innerHTML = `
    <div class="chat-head">
      <div class="av"><img src="/assets/img/logo.svg" alt="Eureqa3D"></div>
      <div>
        <h4>${esc(tr('Asistente de Eureqa3D'))}</h4>
        <div class="status"><span class="dot"></span>${esc(tr('Normalmente responde en minutos'))}</div>
      </div>
      <button class="close" type="button" aria-label="${esc(tr('Cerrar chat'))}">×</button>
    </div>
    <div class="chat-body"></div>
    <form class="chat-foot">
      <input type="text" autocomplete="off" placeholder="${esc(tr('Escribe tu respuesta…'))}" aria-label="${esc(tr('Escribe tu respuesta…'))}" />
      <button type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg></button>
    </form>`;

  document.body.append(fab, panel);
  const body = panel.querySelector('.chat-body');
  const form = panel.querySelector('.chat-foot');
  const input = panel.querySelector('input');
  const badge = fab.querySelector('.badge');

  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const addMsg = (text, who) => {
    const d = document.createElement('div');
    d.className = `chat-msg ${who}`;
    d.textContent = text;
    body.appendChild(d); scroll();
  };
  const botSay = (text) => new Promise(res => {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t); scroll();
    setTimeout(() => { t.remove(); addMsg(text, 'bot'); res(); }, 750);
  });
  const ask = async () => {
    const Q = QUESTIONS[step];
    await botSay(tr(Q.q).replace('{name}', data.name || ''));
  };

  async function open() {
    panel.classList.add('open');
    badge.style.display = 'none';
    input.focus();
    if (started) return;
    started = true;
    await botSay(tr(GREETING));
    step = 0;
    await ask();
  }
  const close = () => panel.classList.remove('open');

  fab.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
  panel.querySelector('.close').addEventListener('click', close);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (finished || step < 0) return;
    const val = input.value.trim();
    if (!val) return;
    const Q = QUESTIONS[step];
    if (Q.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      addMsg(val, 'me'); input.value = '';
      await botSay(tr('Mmm, ese email no parece válido. ¿Puedes revisarlo?'));
      return;
    }
    addMsg(val, 'me');
    data[Q.field] = val;
    input.value = '';
    step++;
    if (step < QUESTIONS.length) { await ask(); return; }

    // Fin: enviar
    finished = true;
    input.disabled = true;
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: `Solicitud desde el chat web${data.company ? ' — ' + data.company : ''}`,
          body: `${data.message}\n\nEmpresa/centro: ${data.company || '-'}`
        })
      });
      if (!res.ok) throw new Error();
      await botSay(tr('¡Gracias, {name}! 🙌 Hemos recibido tu solicitud y te contactaremos muy pronto.').replace('{name}', data.name || ''));
    } catch {
      finished = false; input.disabled = false; step = QUESTIONS.length - 1;
      await botSay(tr('Ups, no hemos podido enviar tu solicitud. Inténtalo de nuevo en un momento.'));
    }
  });
}

/* ── Reveal al hacer scroll (fade-up escalonado) ─────────────── */
function initReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sel = '.section-head, .card, .step, .spec, .client-logo, .event, .stat, .carousel, .media-split, .news-card, .article';
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}

/* ── Contadores animados (.num con data-count) ───────────────── */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
      const dur = 1100, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  mountLayout();
  injectIcons();
  initCarousels();
  initSketchfab();
  initChat();
  initReveal();
  initCounters();
  const newsList = document.getElementById('news-list');   if (newsList) loadNewsList(newsList);
  const article  = document.getElementById('article');     if (article)  loadArticle(article);
  const events   = document.getElementById('events-list'); if (events)   loadEvents(events);
  const contact  = document.getElementById('contact-form');if (contact)  initContactForm(contact);
});
