'use strict';
/* ─────────────────────────────────────────────────────────────
   hero-model.js — Carga el modelo anatómico 3D REAL de Eureqa3D
   (Sketchfab) en el hero, auto-iniciado y girando. Es su
   producto de verdad como protagonista, no un adorno.
   Si el iframe no carga (red), quedan el campo de partículas y
   el vídeo de fondo como respaldo.
   ───────────────────────────────────────────────────────────── */
(function () {
  const el = document.querySelector('.hero-model[data-sk]');
  if (!el || el.dataset.loaded) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const id = el.dataset.sk;

  // Parámetros de embed: auto-inicio, giro suave, UI oculta, fondo transparente
  const params = [
    'autostart=1',
    reduce ? 'autospin=0' : 'autospin=0.2',
    'ui_theme=dark',
    'transparent=1',
    'ui_infos=0', 'ui_controls=0', 'ui_stop=0', 'ui_hint=0',
    'ui_watermark=0', 'ui_watermark_link=0', 'ui_ar=0', 'ui_help=0',
    'ui_settings=0', 'ui_vr=0', 'ui_fullscreen=0', 'ui_annotations=0',
    'scrollwheel=0', 'dnt=1',
  ].join('&');

  const frame = document.createElement('iframe');
  frame.title = 'Modelo anatómico 3D real — Eureqa3D';
  frame.allow = 'autoplay; fullscreen; xr-spatial-tracking';
  frame.setAttribute('allowfullscreen', 'true');
  frame.setAttribute('mozallowfullscreen', 'true');
  frame.setAttribute('webkitallowfullscreen', 'true');
  frame.loading = 'eager';
  frame.src = `https://sketchfab.com/models/${id}/embed?${params}`;

  frame.addEventListener('load', () => el.classList.add('ready'));
  el.appendChild(frame);
  el.dataset.loaded = '1';
})();
