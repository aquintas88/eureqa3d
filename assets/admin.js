'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => (s ?? '').toString().replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('es-ES', {day:'2-digit',month:'short',year:'numeric'}) : '—';
const fmtShort = (iso) => iso ? new Date(iso).toLocaleDateString('es-ES', {day:'2-digit',month:'2-digit',year:'2-digit'}) : '—';
const fmtEUR = (v) => v == null ? '—' : Number(v).toLocaleString('es-ES') + ' €';

async function api(url, opts) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (res.status === 401) { location.href = '/login'; throw new Error('Sesión'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

function showErr(msg) {
  const el = $('#modal-error');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
}
function clearErr() { const el = $('#modal-error'); if (el) el.hidden = true; }

/* ── Role config ──────────────────────────────────────────────── */
let ME = null; // populated on init

const NAV_ITEMS = [
  { key: 'news',     label: '📰 Noticias',         roles: ['admin'] },
  { key: 'events',   label: '📅 Jornadas',          roles: ['admin'] },
  { key: 'messages', label: '✉️ Mensajes',          roles: ['admin'] },
  { key: '__sep__',  label: '',                      roles: ['admin'] },
  { key: 'kanban',       label: '📋 Backlog Kanban', roles: ['admin', 'investigador'] },
  { key: 'licitaciones', label: '📈 Licitaciones',   roles: ['admin', 'investigador'] },
  { key: 'users',        label: '👥 Usuarios',       roles: ['admin'] },
];

const ROLE_LABELS = {
  admin: 'Admin', investigador: 'Investigador',
  medico: 'Médico', radiologo: 'Radiólogo', invitado: 'Invitado'
};

function buildNav() {
  const nav = $('#sidebar-nav');
  nav.innerHTML = '';
  const role = ME?.role;
  let defaultView = null;
  for (const item of NAV_ITEMS) {
    if (!item.roles.includes(role)) continue;
    if (item.key === '__sep__') { nav.insertAdjacentHTML('beforeend', '<hr class="nav-sep">'); continue; }
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.view = item.key;
    btn.textContent = item.label;
    btn.addEventListener('click', () => loadView(item.key));
    nav.appendChild(btn);
    if (!defaultView) defaultView = item.key;
  }
  $('#who').textContent = ME?.name || '';
  const rb = $('#role-badge');
  if (rb) { rb.textContent = ROLE_LABELS[role] || role; rb.className = `role-badge role-pill--${role}`; }
  return defaultView;
}

/* ── Vista activa ─────────────────────────────────────────────── */
function setActiveNav(key) {
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === key));
}

function showView(name) {
  ['list-view', 'kanban-view', 'licitaciones-view', 'users-view'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = (id !== name + '-view' && name !== 'list');
  });
  if (name === 'list') {
    $('#list-view').hidden = false;
    $('#kanban-view').hidden = true;
    $('#licitaciones-view').hidden = true;
    $('#users-view').hidden = true;
  }
}

/* ── Definición de vistas genéricas ───────────────────────────── */
const VIEWS = {
  news: {
    title: 'Noticias', api: '/api/news',
    fields: [
      { name: 'title',      label: 'Título',                        type: 'text',     required: true },
      { name: 'slug',       label: 'Slug (URL, opcional)',          type: 'text' },
      { name: 'excerpt',    label: 'Resumen',                       type: 'textarea' },
      { name: 'body',       label: 'Cuerpo',                        type: 'textarea' },
      { name: 'image_url',  label: 'URL de imagen',                 type: 'text' },
      { name: 'source_url', label: 'URL de la fuente',              type: 'text' },
      { name: 'published',  label: 'Publicada (visible en la web)', type: 'check' },
    ],
    row: (n) => ({ title: n.title, sub: `${fmt(n.published_at||n.created_at)} · /noticias/${n.slug}`, pill: n.published }),
  },
  events: {
    title: 'Jornadas y eventos', api: '/api/events',
    fields: [
      { name: 'title',       label: 'Título',                      type: 'text', required: true },
      { name: 'event_date',  label: 'Fecha',                       type: 'date' },
      { name: 'location',    label: 'Lugar',                       type: 'text' },
      { name: 'description', label: 'Descripción',                 type: 'textarea' },
      { name: 'url',         label: 'Enlace (opcional)',           type: 'text' },
      { name: 'published',   label: 'Publicado (visible en web)',  type: 'check' },
    ],
    row: (e) => ({ title: e.title, sub: `${fmt(e.event_date)}${e.location ? ' · '+e.location : ''}`, pill: e.published }),
  },
  messages: {
    title: 'Mensajes', api: '/api/messages', readonly: true,
    row: (m) => ({
      title: `${m.name} — ${m.subject || 'Sin asunto'}`,
      sub: `${fmt(m.created_at)} · ${m.email}`,
      pill: m.handled, pillOn: 'Atendido', pillOff: 'Pendiente',
      detail: m.body,
    }),
  },
};

let currentView = 'news';
let cache = [];

async function loadView(key) {
  currentView = key;
  setActiveNav(key);

  if (key === 'kanban')       { showView('kanban');       return loadKanban(); }
  if (key === 'licitaciones') { showView('licitaciones'); return loadLicitaciones(); }
  if (key === 'users')        { showView('users');        return loadUsers(); }

  showView('list');
  const v = VIEWS[key];
  $('#view-title').textContent = v.title;
  $('#new-btn').style.display = v.readonly ? 'none' : '';
  $('#list').innerHTML = '<p class="empty">Cargando…</p>';
  try {
    cache = await api(v.api);
    if (!cache.length) { $('#list').innerHTML = '<p class="empty">No hay registros todavía.</p>'; return; }
    $('#list').innerHTML = cache.map(item => {
      const r = v.row(item);
      const pill = `<span class="pill ${r.pill ? 'on' : 'off'}">${r.pill ? (r.pillOn||'Publicado') : (r.pillOff||'Borrador')}</span>`;
      const actions = v.readonly
        ? `<button class="icon-btn" data-act="toggle" data-id="${item.id}">${item.handled ? 'Marcar pendiente' : 'Marcar atendido'}</button>
           <button class="icon-btn danger" data-act="del" data-id="${item.id}">🗑</button>`
        : `<button class="icon-btn" data-act="edit" data-id="${item.id}">✏️</button>
           <button class="icon-btn danger" data-act="del" data-id="${item.id}">🗑</button>`;
      return `<div class="row">
        <div class="grow">
          <h3>${esc(r.title)} ${pill}</h3>
          <div class="sub">${esc(r.sub)}</div>
          ${r.detail ? `<p class="sub" style="margin:.5rem 0 0;color:var(--ink-soft)">${esc(r.detail)}</p>` : ''}
        </div>
        <div class="actions">${actions}</div>
      </div>`;
    }).join('');
  } catch { $('#list').innerHTML = '<p class="empty">No se pudo cargar.</p>'; }
}

/* ── Editor modal genérico (noticias / eventos) ───────────────── */
let editingId = null;
function openEditor(item) {
  const v = VIEWS[currentView];
  editingId = item?.id ?? null;
  $('#modal-title').textContent = (editingId ? 'Editar' : 'Nuevo') + ' · ' + v.title.replace(/s$/, '');
  clearErr();
  $('#editor').innerHTML = v.fields.map(f => {
    const val = item?.[f.name] ?? '';
    if (f.type === 'check')
      return `<label class="check"><input type="checkbox" name="${f.name}" ${val ? 'checked' : ''}/> ${f.label}</label>`;
    if (f.type === 'textarea')
      return `<label>${f.label}<textarea name="${f.name}">${esc(val)}</textarea></label>`;
    const v2 = f.type === 'date' && val ? new Date(val).toISOString().slice(0,10) : esc(val);
    return `<label>${f.label}<input type="${f.type}" name="${f.name}" value="${v2}" ${f.required ? 'required' : ''}/></label>`;
  }).join('');
  $('#save').onclick = saveGeneric;
  $('#modal').hidden = false;
}
function closeModal() { $('#modal').hidden = true; editingId = null; clearErr(); }

async function saveGeneric() {
  const v = VIEWS[currentView];
  const form = $('#editor');
  const body = {};
  v.fields.forEach(f => {
    const el = form.elements[f.name];
    body[f.name] = f.type === 'check' ? el.checked : el.value;
  });
  try {
    if (editingId) await api(`${v.api}/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
    else await api(v.api, { method: 'POST', body: JSON.stringify(body) });
    closeModal(); loadView(currentView);
  } catch (e) { showErr(e.message); }
}

/* ── Eventos UI genéricos ─────────────────────────────────────── */
$('#new-btn').addEventListener('click', () => openEditor(null));
$('#modal-close').addEventListener('click', closeModal);
$('#cancel').addEventListener('click', closeModal);
$('#logout').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.href = '/login';
});

$('#list').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const id = btn.dataset.id;
  const item = cache.find(x => String(x.id) === id);
  const v = VIEWS[currentView];
  if (btn.dataset.act === 'edit') openEditor(item);
  else if (btn.dataset.act === 'del') {
    if (confirm('¿Eliminar este registro?')) { await api(`${v.api}/${id}`, { method: 'DELETE' }); loadView(currentView); }
  } else if (btn.dataset.act === 'toggle') {
    await api(`${v.api}/${id}`, { method: 'PUT', body: JSON.stringify({ handled: !item.handled }) });
    loadView(currentView);
  }
});

/* ══════════════════════════════════════════════════════════════
   KANBAN
   ══════════════════════════════════════════════════════════════ */
const COLUMNS = ['Backlog', 'Pendiente', 'En curso', 'Hecho', 'Duda'];
let kItems = [];
let kFilters = { q: '', area: '', prioridad: '', creador: '' };
let dragId = null;

function idPrefix(id) {
  return (id || '').split('-')[0] || 'default';
}

function prioBadge(p) {
  if (!p) return '';
  return `<span class="prio prio--${esc(p)}">${esc(p)}</span>`;
}

function estimBadge(e) {
  if (!e) return '';
  return `<span class="estim">${esc(e)}</span>`;
}

function idBadge(id) {
  const pre = idPrefix(id);
  return `<span class="id-badge id-badge--${esc(pre)}">${esc(id)}</span>`;
}

function filterItems(items) {
  return items.filter(item => {
    if (kFilters.area && item.area !== kFilters.area) return false;
    if (kFilters.prioridad && item.prioridad !== kFilters.prioridad) return false;
    if (kFilters.creador && item.creador !== kFilters.creador) return false;
    if (kFilters.q) {
      const q = kFilters.q.toLowerCase();
      if (!(item.titulo||'').toLowerCase().includes(q) &&
          !(item.id||'').toLowerCase().includes(q) &&
          !(item.historia||'').toLowerCase().includes(q) &&
          !(item.area||'').toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function renderKanban() {
  const board = $('#kanban-board');
  if (!board) return;
  const visible = filterItems(kItems);

  board.innerHTML = COLUMNS.map(col => {
    const cards = visible.filter(i => i.estado === col);
    return `<div class="kanban-col" data-col="${esc(col)}" id="col-${esc(col)}">
      <div class="kanban-col-head">
        <h3>${esc(col)}</h3>
        <span class="kanban-col-count">${cards.length}</span>
      </div>
      <div class="kanban-cards" data-col="${esc(col)}">
        ${cards.map(renderCard).join('')}
        <div class="drop-zone" data-col="${esc(col)}"></div>
      </div>
    </div>`;
  }).join('');

  setupDragDrop();
}

function renderCard(item) {
  const pre = idPrefix(item.id);
  return `<div class="kcard" draggable="true" data-id="${esc(item.id)}" data-col="${esc(item.estado)}">
    <div class="kcard-top">
      ${idBadge(item.id)}
      ${prioBadge(item.prioridad)}
      ${estimBadge(item.estimacion)}
    </div>
    <div class="kcard-title">${esc(item.titulo)}</div>
    <div class="kcard-meta">
      ${item.area ? `<span>${esc(item.area)}</span>` : ''}
      ${item.responsable ? `<span>→ ${esc(item.responsable)}</span>` : ''}
    </div>
  </div>`;
}

function setupDragDrop() {
  const board = $('#kanban-board');

  board.querySelectorAll('.kcard').forEach(card => {
    card.addEventListener('click', (e) => {
      if (dragId) return; // ignore click after drag
      const id = card.dataset.id;
      openCardDetail(kItems.find(i => i.id === id));
    });
    card.addEventListener('dragstart', (e) => {
      dragId = card.dataset.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      board.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
      setTimeout(() => { dragId = null; }, 0);
    });
  });

  board.querySelectorAll('.kanban-col').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
    });
    col.addEventListener('drop', async (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const newEstado = col.dataset.col;
      if (!dragId || !newEstado) return;
      const item = kItems.find(i => i.id === dragId);
      if (!item || item.estado === newEstado) return;
      try {
        const updated = await api(`/api/backlog/items/${encodeURIComponent(dragId)}`, {
          method: 'PATCH', body: JSON.stringify({ estado: newEstado })
        });
        const idx = kItems.findIndex(i => i.id === dragId);
        if (idx !== -1) kItems[idx] = updated;
        renderKanban();
      } catch (e) { alert('Error: ' + e.message); }
    });
  });
}

async function loadKanban() {
  const board = $('#kanban-board');
  if (!board) return;
  board.innerHTML = '<p class="empty" style="padding:2rem">Cargando…</p>';
  try {
    const [items, meta] = await Promise.all([
      api('/api/backlog/items'),
      api('/api/backlog/meta'),
    ]);
    kItems = items;
    populateKanbanFilters(meta);
    renderKanban();
  } catch { board.innerHTML = '<p class="empty">No se pudo cargar el backlog.</p>'; }
}

function populateKanbanFilters(meta) {
  const areaEl = $('#kf-area');
  const creadorEl = $('#kf-creador');
  if (!areaEl || !creadorEl) return;

  const savedArea = areaEl.value;
  const savedCreador = creadorEl.value;

  areaEl.innerHTML = '<option value="">Todas las áreas</option>' +
    meta.areas.map(a => `<option value="${esc(a)}" ${savedArea===a?'selected':''}>${esc(a)}</option>`).join('');
  creadorEl.innerHTML = '<option value="">Creador</option>' +
    meta.creadores.map(c => `<option value="${esc(c)}" ${savedCreador===c?'selected':''}>${esc(c)}</option>`).join('');
}

function applyKanbanFilters() {
  kFilters.q         = ($('#kf-search')?.value   || '').trim();
  kFilters.area      =  $('#kf-area')?.value     || '';
  kFilters.prioridad =  $('#kf-prioridad')?.value || '';
  kFilters.creador   =  $('#kf-creador')?.value  || '';
  renderKanban();
}

$('#kf-search')?.addEventListener('input',  applyKanbanFilters);
$('#kf-area')?.addEventListener('change',   applyKanbanFilters);
$('#kf-prioridad')?.addEventListener('change', applyKanbanFilters);
$('#kf-creador')?.addEventListener('change', applyKanbanFilters);
$('#kf-clear')?.addEventListener('click', () => {
  ['#kf-search','#kf-area','#kf-prioridad','#kf-creador'].forEach(s => { const el = $(s); if (el) el.value = ''; });
  kFilters = { q:'', area:'', prioridad:'', creador:'' };
  renderKanban();
});

/* ── Nueva tarjeta kanban ─────────────────────────────────────── */
$('#kanban-new-btn')?.addEventListener('click', () => openKanbanEditor(null));

const KANBAN_FIELDS = [
  { name:'id',          label:'ID (PLT-XX / JES-XX / CEL-XX / PRD-XX)', type:'text', required:true },
  { name:'titulo',      label:'Título',        type:'text',     required:true },
  { name:'area',        label:'Área / Épica',  type:'text' },
  { name:'historia',    label:'Historia de usuario', type:'textarea' },
  { name:'tipo',        label:'Tipo',          type:'select', options:['Feature','Mejora','Bug','Seguridad','Deuda técnica','Otro'] },
  { name:'modulo',      label:'Módulo impactado', type:'text' },
  { name:'prioridad',   label:'Prioridad',     type:'select', options:['', 'Alta', 'Media', 'Baja'] },
  { name:'estimacion',  label:'Estimación',    type:'select', options:['', 'S', 'M', 'L', 'XL'] },
  { name:'estado',      label:'Estado',        type:'select', options:['Backlog','Pendiente','En curso','Hecho','Duda'] },
  { name:'origen',      label:'Origen',        type:'text' },
  { name:'creador',     label:'Creador',       type:'text' },
  { name:'responsable', label:'Responsable',   type:'text' },
  { name:'fecha_alta',  label:'Fecha alta',    type:'date' },
  { name:'fecha_cierre',label:'Fecha cierre',  type:'date' },
  { name:'notas',       label:'Notas / análisis', type:'textarea' },
];

let editingKanbanId = null;

function openKanbanEditor(item) {
  editingKanbanId = item?.id ?? null;
  $('#modal-title').textContent = item ? `Editar · ${item.id}` : 'Nueva tarjeta';
  clearErr();
  const today = new Date().toISOString().slice(0,10);
  $('#editor').innerHTML = KANBAN_FIELDS.map(f => {
    let val = item?.[f.name] ?? '';
    if (f.name === 'creador' && !item) val = ME?.name || '';
    if (f.name === 'fecha_alta' && !item) val = today;
    if (f.name === 'estado' && !item) val = 'Backlog';

    if (f.type === 'textarea')
      return `<label>${esc(f.label)}<textarea name="${esc(f.name)}">${esc(val)}</textarea></label>`;
    if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${esc(o)}" ${val===o?'selected':''}>${esc(o)||'—'}</option>`).join('');
      return `<label>${esc(f.label)}<select name="${esc(f.name)}">${opts}</select></label>`;
    }
    const dateVal = f.type === 'date' && val ? new Date(val).toISOString().slice(0,10) : esc(val);
    return `<label>${esc(f.label)}<input type="${esc(f.type)}" name="${esc(f.name)}" value="${dateVal}" ${f.required?'required':''}></label>`;
  }).join('');
  $('#save').onclick = saveKanbanItem;
  $('#modal').hidden = false;
}

async function saveKanbanItem() {
  const form = $('#editor');
  const body = {};
  KANBAN_FIELDS.forEach(f => {
    const el = form.elements[f.name];
    if (el) body[f.name] = el.value || null;
  });
  if (!body.id?.trim() || !body.titulo?.trim()) { showErr('ID y título son obligatorios'); return; }
  try {
    if (editingKanbanId) {
      const updated = await api(`/api/backlog/items/${encodeURIComponent(editingKanbanId)}`, {
        method: 'PATCH', body: JSON.stringify(body)
      });
      const idx = kItems.findIndex(i => i.id === editingKanbanId);
      if (idx !== -1) kItems[idx] = updated; else kItems.push(updated);
    } else {
      const created = await api('/api/backlog/items', { method: 'POST', body: JSON.stringify(body) });
      kItems.push(created);
    }
    closeModal();
    renderKanban();
  } catch (e) { showErr(e.message); }
}

/* ── Detalle de tarjeta ───────────────────────────────────────── */
function openCardDetail(item) {
  if (!item) return;
  const cm = $('#card-modal');
  const pre = idPrefix(item.id);
  $('#cm-id-badge').className = `id-badge id-badge--${esc(pre)}`;
  $('#cm-id-badge').textContent = item.id;
  $('#cm-title').textContent = item.titulo || '';

  const field = (label, val) => `
    <div class="field">
      <label>${esc(label)}</label>
      <span>${val ? esc(String(val)) : '<span style="color:var(--muted)">—</span>'}</span>
    </div>`;

  $('#card-detail').innerHTML = `
    <div class="card-detail-grid">
      ${field('Estado',      item.estado)}
      ${field('Prioridad',   item.prioridad)}
      ${field('Área / Épica',item.area)}
      ${field('Tipo',        item.tipo)}
      ${field('Estimación',  item.estimacion)}
      ${field('Módulo',      item.modulo)}
      ${field('Creador',     item.creador)}
      ${field('Responsable', item.responsable)}
      ${field('Fecha alta',  fmtShort(item.fecha_alta))}
      ${field('Fecha cierre',fmtShort(item.fecha_cierre))}
      ${field('Origen',      item.origen)}
    </div>
    ${item.historia ? `<div class="card-detail-full"><label>Historia de usuario</label><p>${esc(item.historia)}</p></div>` : ''}
    ${item.notas    ? `<div class="card-detail-full"><label>Notas / análisis</label><p>${esc(item.notas)}</p></div>` : ''}
  `;

  $('#card-edit-btn').onclick = () => { closeCardModal(); openKanbanEditor(item); };
  cm.hidden = false;
}
function closeCardModal() { $('#card-modal').hidden = true; }
$('#card-modal-close')?.addEventListener('click', closeCardModal);
$('#card-modal-cancel')?.addEventListener('click', closeCardModal);
$('#card-modal')?.addEventListener('click', (e) => { if (e.target === $('#card-modal')) closeCardModal(); });

/* ══════════════════════════════════════════════════════════════
   LICITACIONES — funnel comercial (mirroring el bloque KANBAN)
   ══════════════════════════════════════════════════════════════ */
const LIC_COLUMNS = ['detectada', 'analizada', 'interesante', 'oferta_presentada', 'ganada', 'perdida', 'descartada'];
const LIC_COLUMN_LABELS = {
  detectada: 'Detectada', analizada: 'Analizada', interesante: 'Interesante',
  oferta_presentada: 'Oferta presentada', ganada: 'Ganada', perdida: 'Perdida', descartada: 'Descartada',
};
let lItems = [];
let lFilters = { q: '', encaje: '', responsable: '' };
let lDragId = null;

function encajeBadge(encaje) {
  if (!encaje) return '';
  const clase = encaje === 'alto' ? 'Alta' : 'Media';
  return `<span class="prio prio--${clase}">${esc(encaje)}</span>`;
}

function scoreBadge(score) {
  if (score == null) return '';
  return `<span class="estim">${Math.round(score)} pts</span>`;
}

function filterLicitaciones(items) {
  return items.filter(item => {
    if (lFilters.encaje && item.encaje !== lFilters.encaje) return false;
    if (lFilters.responsable && item.responsable !== lFilters.responsable) return false;
    if (lFilters.q) {
      const q = lFilters.q.toLowerCase();
      if (!(item.organo_contratacion||'').toLowerCase().includes(q) &&
          !(item.objeto_contrato||'').toLowerCase().includes(q) &&
          !(item.titulo_mostrar||'').toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function renderLicitacionesBoard() {
  const board = $('#licitaciones-board');
  if (!board) return;
  const visible = filterLicitaciones(lItems);

  board.innerHTML = LIC_COLUMNS.map(col => {
    const cards = visible.filter(i => i.etapa === col);
    return `<div class="kanban-col" data-col="${esc(col)}">
      <div class="kanban-col-head">
        <h3>${esc(LIC_COLUMN_LABELS[col] || col)}</h3>
        <span class="kanban-col-count">${cards.length}</span>
      </div>
      <div class="kanban-cards" data-col="${esc(col)}">
        ${cards.map(renderLicitacionCard).join('')}
        <div class="drop-zone" data-col="${esc(col)}"></div>
      </div>
    </div>`;
  }).join('');

  setupLicitacionesColumnDrops();
}

function renderLicitacionCard(item) {
  return `<div class="kcard" draggable="true" data-id="${esc(item.tender_id)}" data-col="${esc(item.etapa)}">
    <div class="kcard-top">
      ${encajeBadge(item.encaje)}
      ${scoreBadge(item.score_final)}
    </div>
    <div class="kcard-title">${esc(item.titulo_mostrar || item.objeto_contrato)}</div>
    <div class="kcard-meta">
      <span>${esc(item.organo_contratacion)}</span>
      ${item.fecha_limite_presentacion ? `<span>⏱ ${fmtShort(item.fecha_limite_presentacion)}</span>` : ''}
      ${item.presupuesto_total ? `<span>${fmtEUR(item.presupuesto_total)}</span>` : ''}
    </div>
  </div>`;
}

function initLicitacionesDragDrop() {
  const board = $('#licitaciones-board');
  if (!board) return;

  board.addEventListener('click', (e) => {
    if (lDragId) return;
    const card = e.target.closest('.kcard');
    if (!card) return;
    openLicitacionDetail(lItems.find(i => String(i.tender_id) === card.dataset.id));
  });

  board.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.kcard');
    if (!card) return;
    lDragId = card.dataset.id;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', lDragId);
  });

  board.addEventListener('dragend', () => {
    const dragging = board.querySelector('.dragging');
    if (dragging) dragging.classList.remove('dragging');
    board.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
    setTimeout(() => { lDragId = null; }, 0);
  });
}

function setupLicitacionesColumnDrops() {
  const board = $('#licitaciones-board');
  if (!board) return;

  board.querySelectorAll('.kanban-col').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      board.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
    });
    col.addEventListener('drop', async (e) => {
      e.preventDefault();
      board.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
      const newEtapa = col.dataset.col;
      if (!lDragId || !newEtapa) return;
      const item = lItems.find(i => String(i.tender_id) === lDragId);
      if (!item || item.etapa === newEtapa) return;
      const capturedId = lDragId;
      try {
        const updated = await api(`/api/licitaciones/items/${encodeURIComponent(capturedId)}`, {
          method: 'PATCH', body: JSON.stringify({ etapa: newEtapa })
        });
        const idx = lItems.findIndex(i => String(i.tender_id) === capturedId);
        if (idx !== -1) lItems[idx] = updated;
        renderLicitacionesBoard();
      } catch (err) { alert('Error: ' + err.message); }
    });
  });
}

async function loadLicitaciones() {
  const board = $('#licitaciones-board');
  if (!board) return;
  board.innerHTML = '<p class="empty" style="padding:2rem">Cargando…</p>';
  try {
    const [items, meta] = await Promise.all([
      api('/api/licitaciones/items'),
      api('/api/licitaciones/meta'),
    ]);
    lItems = items;
    populateLicitacionesFilters(meta);
    renderLicitacionesBoard();
  } catch { board.innerHTML = '<p class="empty">No se pudo cargar el funnel de licitaciones.</p>'; }
}

function populateLicitacionesFilters(meta) {
  const responsableEl = $('#lf-responsable');
  if (!responsableEl) return;
  const saved = responsableEl.value;
  responsableEl.innerHTML = '<option value="">Responsable</option>' +
    meta.responsables.map(r => `<option value="${esc(r)}" ${saved===r?'selected':''}>${esc(r)}</option>`).join('');
}

function applyLicitacionesFilters() {
  lFilters.q            = ($('#lf-search')?.value      || '').trim();
  lFilters.encaje       =  $('#lf-encaje')?.value       || '';
  lFilters.responsable  =  $('#lf-responsable')?.value  || '';
  renderLicitacionesBoard();
}

$('#lf-search')?.addEventListener('input',  applyLicitacionesFilters);
$('#lf-encaje')?.addEventListener('change', applyLicitacionesFilters);
$('#lf-responsable')?.addEventListener('change', applyLicitacionesFilters);
$('#lf-clear')?.addEventListener('click', () => {
  ['#lf-search','#lf-encaje','#lf-responsable'].forEach(s => { const el = $(s); if (el) el.value = ''; });
  lFilters = { q:'', encaje:'', responsable:'' };
  renderLicitacionesBoard();
});

const LICITACIONES_FIELDS = [
  { name:'etapa',           label:'Etapa',          type:'select', options: LIC_COLUMNS },
  { name:'responsable',     label:'Responsable',    type:'text' },
  { name:'valor_oferta',    label:'Valor de la oferta (€)', type:'number' },
  { name:'motivo_descarte', label:'Motivo de descarte (si aplica)', type:'text' },
  { name:'notas',           label:'Notas',          type:'textarea' },
];

function openLicitacionEditor(item) {
  $('#modal-title').textContent = `Editar · ${item.organo_contratacion}`;
  clearErr();
  $('#editor').innerHTML = LICITACIONES_FIELDS.map(f => {
    const val = item?.[f.name] ?? '';
    if (f.type === 'textarea')
      return `<label>${esc(f.label)}<textarea name="${esc(f.name)}">${esc(val)}</textarea></label>`;
    if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${esc(o)}" ${val===o?'selected':''}>${esc(LIC_COLUMN_LABELS[o] || o)}</option>`).join('');
      return `<label>${esc(f.label)}<select name="${esc(f.name)}">${opts}</select></label>`;
    }
    return `<label>${esc(f.label)}<input type="${esc(f.type)}" name="${esc(f.name)}" value="${esc(val)}"></label>`;
  }).join('');
  $('#save').onclick = () => saveLicitacionItem(item.tender_id);
  $('#modal').hidden = false;
}

async function saveLicitacionItem(tenderId) {
  const form = $('#editor');
  const body = {};
  LICITACIONES_FIELDS.forEach(f => {
    const el = form.elements[f.name];
    if (el) body[f.name] = el.value || null;
  });
  try {
    const updated = await api(`/api/licitaciones/items/${encodeURIComponent(tenderId)}`, {
      method: 'PATCH', body: JSON.stringify(body)
    });
    const idx = lItems.findIndex(i => String(i.tender_id) === String(tenderId));
    if (idx !== -1) lItems[idx] = updated;
    closeModal();
    renderLicitacionesBoard();
  } catch (e) { showErr(e.message); }
}

function openLicitacionDetail(item) {
  if (!item) return;
  const cm = $('#card-modal');
  const clase = item.encaje === 'alto' ? 'Alta' : 'Media';
  $('#cm-id-badge').className = `prio prio--${clase}`;
  $('#cm-id-badge').textContent = (item.encaje || '').toUpperCase();
  $('#cm-title').textContent = item.titulo_mostrar || item.objeto_contrato || '';

  const field = (label, val) => `
    <div class="field">
      <label>${esc(label)}</label>
      <span>${val ? esc(String(val)) : '<span style="color:var(--muted)">—</span>'}</span>
    </div>`;

  const enlaces = [
    item.url_perfil ? `<a href="${esc(item.url_perfil)}" target="_blank" rel="noopener">Perfil del contratante ↗</a>` : '',
    item.url_pliego_administrativo ? `<a href="${esc(item.url_pliego_administrativo)}" target="_blank" rel="noopener">Pliego administrativo ↗</a>` : '',
  ].filter(Boolean).join(' · ');

  $('#card-detail').innerHTML = `
    <div class="card-detail-grid">
      ${field('Órgano de contratación', item.organo_contratacion)}
      ${field('Importe', item.presupuesto_total ? fmtEUR(item.presupuesto_total) : null)}
      ${field('Fecha límite', fmtShort(item.fecha_limite_presentacion))}
      ${field('Score IA', item.score_final)}
      ${field('Encaje', item.encaje)}
      ${field('Etapa', LIC_COLUMN_LABELS[item.etapa] || item.etapa)}
      ${field('Responsable', item.responsable)}
      ${field('Valor oferta', item.valor_oferta ? fmtEUR(item.valor_oferta) : null)}
    </div>
    ${item.titulo_traducido && item.titulo_traducido !== item.objeto_contrato ? `<div class="card-detail-full"><label>Título original</label><p>${esc(item.objeto_contrato)}</p></div>` : ''}
    ${item.resumen_ia ? `<div class="card-detail-full"><label>Resumen IA</label><p>${esc(item.resumen_ia)}</p></div>` : ''}
    ${item.aplicaciones_detectadas?.length ? `<div class="card-detail-full"><label>Aplicaciones detectadas</label><p>${item.aplicaciones_detectadas.map(esc).join(', ')}</p></div>` : ''}
    ${item.notas ? `<div class="card-detail-full"><label>Notas</label><p>${esc(item.notas)}</p></div>` : ''}
    ${enlaces ? `<div class="card-detail-full"><label>Enlaces</label><p>${enlaces}</p></div>` : ''}
  `;

  $('#card-edit-btn').onclick = () => { closeCardModal(); openLicitacionEditor(item); };
  cm.hidden = false;
}

/* ══════════════════════════════════════════════════════════════
   USUARIOS
   ══════════════════════════════════════════════════════════════ */
let usersCache = [];
let invitesCache = [];
let showingInvites = false;

async function loadUsers() {
  $('#users-list').innerHTML = '<p class="empty">Cargando…</p>';
  $('#invites-list').innerHTML = '';
  $('#invites-panel').hidden = true;
  showingInvites = false;
  try {
    [usersCache, invitesCache] = await Promise.all([
      api('/api/users'),
      api('/api/users/invites'),
    ]);
    renderUsers();
  } catch { $('#users-list').innerHTML = '<p class="empty">No se pudo cargar.</p>'; }
}

function renderUsers() {
  const ROLE_MAP = { admin:'Admin', investigador:'Investigador', medico:'Médico', radiologo:'Radiólogo' };
  $('#users-list').innerHTML = usersCache.length
    ? usersCache.map(u => `
      <div class="user-row">
        <div class="grow">
          <h3>${esc(u.name)} <span class="role-pill role-pill--${esc(u.role)}">${esc(ROLE_MAP[u.role]||u.role)}</span></h3>
          <div class="sub">${esc(u.email)} · desde ${fmt(u.created_at)}</div>
        </div>
        <div class="actions">
          <button class="icon-btn" data-uact="edit" data-uid="${u.id}">✏️</button>
          <button class="icon-btn danger" data-uact="del" data-uid="${u.id}">🗑</button>
        </div>
      </div>`).join('')
    : '<p class="empty">No hay usuarios.</p>';
}

function renderInvites() {
  const panel = $('#invites-panel');
  panel.hidden = false;
  $('#invites-list').innerHTML = invitesCache.length
    ? invitesCache.map(inv => {
        const expired = inv.expired;
        const badge = expired
          ? '<span class="badge-expired">Caducada</span>'
          : '<span class="badge-active">Activa</span>';
        return `<div class="invite-row">
          <div class="grow">
            <h3>${esc(inv.name)} ${badge}</h3>
            <div class="sub">${esc(inv.email)} · caduca ${fmt(inv.invite_expires_at)}</div>
            ${inv.invite_url ? `<div class="invite-url" title="Clic para copiar" data-copy="${esc(inv.invite_url)}">${esc(inv.invite_url)}</div>` : ''}
          </div>
          <div class="actions">
            <button class="icon-btn danger" data-iact="del" data-iid="${inv.id}">🗑</button>
          </div>
        </div>`;
      }).join('')
    : '<p class="empty">No hay invitaciones.</p>';
}

$('#invite-tab-btn')?.addEventListener('click', () => {
  showingInvites = !showingInvites;
  if (showingInvites) { renderInvites(); $('#invite-tab-btn').textContent = 'Ocultar invitados'; }
  else { $('#invites-panel').hidden = true; $('#invite-tab-btn').textContent = 'Invitados'; }
});

// Nueva invitación
$('#invite-new-btn')?.addEventListener('click', () => openInviteEditor());

function openInviteEditor() {
  $('#modal-title').textContent = 'Nueva invitación';
  clearErr();
  $('#editor').innerHTML = `
    <label>Nombre del invitado<input type="text" name="name" required></label>
    <label>Email<input type="email" name="email" required></label>
    <label>ID del modelo (URL o identificador Sketchfab)
      <input type="text" name="model_id" placeholder="opcional">
    </label>
    <label>Nombre del modelo (informativo)
      <input type="text" name="model_name" placeholder="opcional">
    </label>
    <label>Días de validez
      <input type="number" name="days" value="30" min="1" max="365">
    </label>
  `;
  $('#save').onclick = saveInvite;
  $('#modal').hidden = false;
}

async function saveInvite() {
  const form = $('#editor');
  const body = {
    name:       form.elements.name?.value?.trim(),
    email:      form.elements.email?.value?.trim(),
    model_id:   form.elements.model_id?.value?.trim() || null,
    model_name: form.elements.model_name?.value?.trim() || null,
    days:       Number(form.elements.days?.value) || 30,
  };
  if (!body.name || !body.email) { showErr('Nombre y email son obligatorios'); return; }
  try {
    const result = await api('/api/users/invite', { method: 'POST', body: JSON.stringify(body) });
    closeModal();
    invitesCache.unshift({ ...result, expired: false, invite_url: result.invite_url });
    renderInvites();
    setTimeout(() => {
      const el = $('#invites-list').querySelector(`[data-copy]`);
      if (el) { navigator.clipboard.writeText(result.invite_url).catch(() => {}); }
    }, 100);
    alert(`Invitación creada.\nURL copiada al portapapeles:\n${result.invite_url}`);
  } catch (e) { showErr(e.message); }
}

// Nuevo usuario
$('#user-new-btn')?.addEventListener('click', () => openUserEditor(null));

function openUserEditor(user) {
  $('#modal-title').textContent = user ? `Editar · ${user.name}` : 'Nuevo usuario';
  clearErr();
  const ROLES = ['admin', 'investigador', 'medico', 'radiologo'];
  const roleOpts = ROLES.map(r => `<option value="${r}" ${user?.role===r?'selected':''}>${ROLE_MAP_USER[r]}</option>`).join('');
  $('#editor').innerHTML = `
    <label>Nombre<input type="text" name="name" value="${esc(user?.name||'')}" required></label>
    <label>Email<input type="email" name="email" value="${esc(user?.email||'')}" required></label>
    <label>Contraseña ${user ? '(dejar vacío para no cambiar)' : ''}
      <input type="password" name="password" ${!user ? 'required' : ''} autocomplete="new-password">
    </label>
    <label>Rol<select name="role">${roleOpts}</select></label>
  `;
  $('#save').onclick = () => saveUser(user?.id);
  $('#modal').hidden = false;
}

const ROLE_MAP_USER = { admin:'Admin', investigador:'Investigador', medico:'Médico', radiologo:'Radiólogo' };

async function saveUser(id) {
  const form = $('#editor');
  const body = {
    name:     form.elements.name?.value?.trim(),
    email:    form.elements.email?.value?.trim(),
    password: form.elements.password?.value || undefined,
    role:     form.elements.role?.value,
  };
  if (!body.name || !body.email) { showErr('Nombre y email son obligatorios'); return; }
  try {
    if (id) {
      const updated = await api(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      const idx = usersCache.findIndex(u => u.id === id);
      if (idx !== -1) usersCache[idx] = { ...usersCache[idx], ...updated };
    } else {
      if (!body.password) { showErr('La contraseña es obligatoria para nuevos usuarios'); return; }
      const created = await api('/api/users', { method: 'POST', body: JSON.stringify(body) });
      usersCache.push(created);
    }
    closeModal();
    renderUsers();
  } catch (e) { showErr(e.message); }
}

// Delegación de eventos en users-list e invites-list
$('#users-list')?.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-uact]');
  if (!btn) return;
  const uid = Number(btn.dataset.uid);
  if (btn.dataset.uact === 'edit') {
    const user = usersCache.find(u => u.id === uid);
    openUserEditor(user);
  } else if (btn.dataset.uact === 'del') {
    if (confirm('¿Eliminar este usuario?')) {
      await api(`/api/users/${uid}`, { method: 'DELETE' });
      usersCache = usersCache.filter(u => u.id !== uid);
      renderUsers();
    }
  }
});

$('#invites-list')?.addEventListener('click', async (e) => {
  // Copiar URL al portapapeles
  const copy = e.target.closest('[data-copy]');
  if (copy) { navigator.clipboard.writeText(copy.dataset.copy).then(() => alert('URL copiada al portapapeles')); return; }
  // Eliminar invitación
  const btn = e.target.closest('[data-iact]');
  if (!btn) return;
  if (btn.dataset.iact === 'del' && confirm('¿Eliminar esta invitación?')) {
    await api(`/api/users/invites/${btn.dataset.iid}`, { method: 'DELETE' });
    invitesCache = invitesCache.filter(i => String(i.id) !== btn.dataset.iid);
    renderInvites();
  }
});

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
(async () => {
  try {
    ME = await api('/api/auth/me');
    const defaultView = buildNav();
    initLicitacionesDragDrop();
    if (defaultView) loadView(defaultView);
  } catch { location.href = '/login'; }
})();
