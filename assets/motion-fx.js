'use strict';
/* ── Motion One (vendorizado) — animaciones de marca ──────────────
   Progresivo y a prueba de fallos: si Motion no carga o el usuario
   pide reduced-motion, el contenido se muestra sin animar.
   El estado inicial oculto (.anim) lo pone un script inline en <head>
   solo cuando se va a animar, así no hay parpadeo (FOUC).            */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = window.Motion;
  const EASE = [0.23, 1, 0.32, 1]; // ease-out fuerte (Emil Kowalski)

  const revealHero = () => {
    const glass = document.querySelector('.hero-glass');
    const items = document.querySelectorAll('.hero-content > *');
    const demo = document.querySelector('.hero-demo');
    if (!glass && !items.length && !demo) return;
    // Fallback: sin librería o con reduced-motion → mostrar sin animar
    if (reduce || !M || !M.animate) {
      if (glass) { glass.style.opacity = '1'; glass.style.transform = 'none'; }
      if (demo) { demo.style.opacity = '1'; demo.style.transform = 'none'; }
      items.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
      // El vídeo de la ventana de producto se detiene en su primer fotograma
      const video = demo && demo.querySelector('video');
      if (reduce && video) { video.removeAttribute('autoplay'); video.pause(); }
      return;
    }
    // 1) El panel de vidrio se materializa (escala + fade)
    if (glass) {
      M.animate(
        glass,
        { opacity: [0, 1], transform: ['translateY(26px) scale(.96)', 'translateY(0) scale(1)'] },
        { duration: 0.75, easing: EASE }
      );
    }
    // 2) La ventana de producto entra justo después, desde el otro lado
    if (demo) {
      M.animate(
        demo,
        { opacity: [0, 1], transform: ['translateY(26px) scale(.97)', 'translateY(0) scale(1)'] },
        { duration: 0.75, delay: 0.1, easing: EASE }
      );
    }
    // 3) El contenido cae en cascada, ligeramente después
    if (items.length) {
      M.animate(
        items,
        { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0)'] },
        { duration: 0.6, delay: M.stagger(0.07, { start: 0.22 }), easing: EASE }
      );
    }
  };

  const start = () => { revealHero(); };
  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
