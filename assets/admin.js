'use strict';

/* ── Helpers ─────────────────────────────────────────────────── */
const $ = (s) => document.querySelector(s);
const esc = (s) => (s ?? '').toString().replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

async function api(url, opts) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (res.status === 401 || res.status === 403) { location.href = '/login'; throw new Error('Sesión'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

/* ── Definición de vistas ────────────────────────────────────── */
const VIEWS = {
  news: {
    title: 'Noticias', api: '/api/news',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'slug', label: 'Slug (URL, opcional)', type: 'text' },
      { name: 'excerpt', label: 'Resumen', type: 'textarea' },
      { name: 'body', label: 'Cuerpo (separa párrafos con línea en blanco)', type: 'textarea' },
      { name: 'image_url', label: 'URL de imagen', type: 'text' },
      { name: 'source_url', label: 'URL de la fuente', type: 'text' },
      { name: 'published', label: 'Publicada (visible en la web)', type: 'check' },
    ],
    row: (n) => ({
      title: n.title,
      sub: `${fmt(n.published_at || n.created_at)} · /noticias/${n.slug}`,
      pill: n.published,
    }),
  },
  events: {
    title: 'Jornadas y eventos', api: '/api/events',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'event_date', label: 'Fecha', type: 'date' },
      { name: 'location', label: 'Lugar', type: 'text' },
      { name: 'description', label: 'Descripción', type: 'textarea' },
      { name: 'url', label: 'Enlace (opcional)', type: 'text' },
      { name: 'published', label: 'Publicado (visible en la web)', type: 'check' },
    ],
    row: (e) => ({
      title: e.title,
      sub: `${fmt(e.event_date)}${e.location ? ' · ' + e.location : ''}`,
      pill: e.published,
    }),
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

let current = 'news';
let cache = [];

/* ── Render listado ──────────────────────────────────────────── */
async function loadView(key) {
  current = key;
  const v = VIEWS[key];
  $('#view-title').textContent = v.title;
  $('#new-btn').style.display = v.readonly ? 'none' : '';
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === key));
  $('#list').innerHTML = '<p class="empty">Cargando…</p>';
  try {
    cache = await api(v.api);
    if (!cache.length) { $('#list').innerHTML = '<p class="empty">No hay registros todavía.</p>'; return; }
    $('#list').innerHTML = cache.map(item => {
      const r = v.row(item);
      const pill = `<span class="pill ${r.pill ? 'on' : 'off'}">${r.pill ? (r.pillOn || 'Publicado') : (r.pillOff || 'Borrador')}</span>`;
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

/* ── Editor (modal) ──────────────────────────────────────────── */
let editingId = null;
function openEditor(item) {
  const v = VIEWS[current];
  editingId = item?.id ?? null;
  $('#modal-title').textContent = (editingId ? 'Editar' : 'Nuevo') + ' · ' + v.title.replace(/s$/, '');
  $('#modal-error').hidden = true;
  $('#editor').innerHTML = v.fields.map(f => {
    const val = item?.[f.name] ?? '';
    if (f.type === 'check')
      return `<label class="check"><input type="checkbox" name="${f.name}" ${val ? 'checked' : ''}/> ${f.label}</label>`;
    if (f.type === 'textarea')
      return `<label>${f.label}<textarea name="${f.name}">${esc(val)}</textarea></label>`;
    const v2 = f.type === 'date' && val ? new Date(val).toISOString().slice(0, 10) : esc(val);
    return `<label>${f.label}<input type="${f.type}" name="${f.name}" value="${v2}" ${f.required ? 'required' : ''}/></label>`;
  }).join('');
  $('#modal').hidden = false;
}
function closeEditor() { $('#modal').hidden = true; editingId = null; }

async function save() {
  const v = VIEWS[current];
  const form = $('#editor');
  const body = {};
  v.fields.forEach(f => {
    const el = form.elements[f.name];
    body[f.name] = f.type === 'check' ? el.checked : el.value;
  });
  try {
    if (editingId) await api(`${v.api}/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
    else await api(v.api, { method: 'POST', body: JSON.stringify(body) });
    closeEditor();
    loadView(current);
  } catch (e) {
    $('#modal-error').textContent = e.message;
    $('#modal-error').hidden = false;
  }
}

/* ── Eventos de UI ───────────────────────────────────────────── */
document.querySelectorAll('.nav-item').forEach(b => b.addEventListener('click', () => loadView(b.dataset.view)));
$('#new-btn').addEventListener('click', () => openEditor(null));
$('#modal-close').addEventListener('click', closeEditor);
$('#cancel').addEventListener('click', closeEditor);
$('#save').addEventListener('click', save);
$('#logout').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); location.href = '/login'; });

$('#list').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const id = btn.dataset.id;
  const item = cache.find(x => String(x.id) === id);
  const v = VIEWS[current];
  if (btn.dataset.act === 'edit') openEditor(item);
  else if (btn.dataset.act === 'del') {
    if (confirm('¿Eliminar este registro?')) { await api(`${v.api}/${id}`, { method: 'DELETE' }); loadView(current); }
  } else if (btn.dataset.act === 'toggle') {
    await api(`${v.api}/${id}`, { method: 'PUT', body: JSON.stringify({ handled: !item.handled }) });
    loadView(current);
  }
});

/* ── Init ────────────────────────────────────────────────────── */
api('/api/auth/me').then(u => { $('#who').textContent = u.name; }).catch(() => location.href = '/login');
loadView('news');
