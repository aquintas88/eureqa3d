'use strict';
/* ── Google Analytics 4 — cableado a la espera del ID real ───────
   Para activarlo: pon aquí abajo tu Measurement ID (G-XXXXXXXXXX).
   Mientras esté vacío, este script no hace nada: no carga ningún
   script externo, no pide consentimiento, no deja cookies.

   El idioma seleccionado por el visitante (ver i18n.js) viaja como
   user property y como parámetro de página en cada carga, para poder
   segmentar el tráfico por idioma en GA4 aunque todas las versiones
   compartan la misma URL. */
const GA_MEASUREMENT_ID = '';

(function () {
  if (!GA_MEASUREMENT_ID) return;

  const CONSENT_KEY = 'eureqa3d_cookie_consent'; // 'accepted' | 'rejected'
  const tr = (s) => (window.I18N ? window.I18N.t(s) : s);

  function loadGA() {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());

    const lang = window.I18N ? window.I18N.getLang() : 'es';
    gtag('config', GA_MEASUREMENT_ID, {
      user_properties: { site_language: lang },
      page_language: lang
    });
  }

  function showBanner() {
    const el = document.createElement('div');
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', tr('Cookies'));
    el.innerHTML = `
      <div class="cookie-banner-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
      </div>
      <div class="cookie-banner-body">
        <h4>${tr('Tu privacidad')}</h4>
        <p>${tr('Usamos cookies analíticas para entender cómo se usa la web. No se activan hasta que las aceptas.')}</p>
        <div class="cookie-banner-actions">
          <button type="button" class="btn btn-ghost" data-cookie="reject">${tr('Rechazar')}</button>
          <button type="button" class="btn btn-primary" data-cookie="accept">${tr('Aceptar')}</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));

    el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      const choice = btn.dataset.cookie === 'accept' ? 'accepted' : 'rejected';
      localStorage.setItem(CONSENT_KEY, choice);
      el.classList.remove('in');
      setTimeout(() => el.remove(), 250);
      if (choice === 'accepted') loadGA();
    });
  }

  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') loadGA();
  else if (consent !== 'rejected') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  }
})();
