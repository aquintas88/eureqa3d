const PAIS_LABELS = { ES: 'España 🇪🇸', GB: 'Reino Unido 🇬🇧', DE: 'Alemania 🇩🇪', IE: 'Irlanda 🇮🇪', FR: 'Francia 🇫🇷', NL: 'Países Bajos 🇳🇱', PT: 'Portugal 🇵🇹', BR: 'Brasil 🇧🇷', CA: 'Canadá 🇨🇦' };

function fmtMiles(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

async function cargar() {
  const cont = document.getElementById('tabla-paises');
  try {
    const res = await fetch('/api/licitaciones/dashboard-stats');
    if (!res.ok) throw new Error();
    const filas = await res.json();
    if (!filas.length) { cont.innerHTML = '<p class="loading">Sin datos todavía.</p>'; return; }

    let html = '<table><thead><tr><th>País</th><th>Estado</th><th class="num">Licitaciones ingeridas (2026)</th><th class="num">Oportunidades generadas</th></tr></thead><tbody>';
    for (const f of filas) {
      const oport = Number(f.oportunidades) || 0;
      html += `<tr>
        <td>${PAIS_LABELS[f.pais_iso2] || f.pais_iso2}</td>
        <td><span class="badge ${f.activa ? 'badge--activo' : 'badge--pendiente'}">${f.activa ? 'Activo' : 'Pausado'}</span></td>
        <td class="num">${fmtMiles(f.ingeridas)}</td>
        <td class="num oport ${oport > 0 ? 'oport--pos' : 'oport--zero'}">${oport}</td>
      </tr>`;
    }
    html += '</tbody></table>';
    cont.innerHTML = html;
  } catch {
    cont.innerHTML = '<p class="loading">No se pudo cargar el estado en vivo — revisa que has iniciado sesión.</p>';
  }
}
cargar();

const horaEl = document.getElementById('hora-carga');
if (horaEl) {
  horaEl.textContent = '(consultado ' + new Date().toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) + ')';
}
