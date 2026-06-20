'use strict';

/* ── Layout compartido: header + footer ──────────────────────── */
const NAV = [
  ['Inicio', '/'],
  ['Quiénes somos', '/quienes-somos'],
  ['Método Eureqa', '/metodo-eureqa'],
  ['Especialidades', '/otras-especialidades'],
  ['Visor 3D', '/visor-3d'],
  ['Modelos 3D', '/modelos-3d'],
  ['Noticias', '/noticias'],
  ['Contacto', '/contacto'],
];

/* Traducción de etiquetas (delega en i18n.js; si no está, devuelve el español) */
const tr = (s) => (window.I18N ? window.I18N.t(s) : s);

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
      <a href="tel:+34927180032">📞 927 180 032</a>
      <span class="sep">·</span>
      <a href="mailto:info@eureqa3d.com">✉️ info@eureqa3d.com</a>
      <span class="sep">·</span>
      <a href="https://twitter.com/eureqa3D" target="_blank" rel="noopener">🐦 @eureqa3D</a>
      <span class="sep">·</span>
      <a href="/login" class="topbar-access">🔒 ${tr('Acceso')}</a>
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
    const [first, ...rest] = items.slice(0, 3);
    const makeCard = (n, cls = '') => `
      <a class="news-card ${cls}" href="/noticias/${esc(n.slug)}">
        <div class="thumb" ${n.image_url ? `style="background-image:url('${esc(n.image_url)}')"` : ''}></div>
        <div class="body">
          <span class="date">${fmtDate(n.published_at)}</span>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.excerpt || '')}</p>
          <span class="more">${tr('Leer más →')}</span>
        </div>
      </a>`;
    el.innerHTML = makeCard(first)
      + (rest.length ? `<div class="news-secondary-col">${rest.map(n => makeCard(n, 'news-secondary')).join('')}</div>` : '');
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
