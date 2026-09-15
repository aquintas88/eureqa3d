const FLAGS = { ES:'🇪🇸', GB:'🇬🇧', DE:'🇩🇪', IE:'🇮🇪', FR:'🇫🇷', NL:'🇳🇱', PT:'🇵🇹', BR:'🇧🇷', CA:'🇨🇦', NZ:'🇳🇿' };
const PAIS_LABELS = { ES:'España', GB:'Reino Unido', DE:'Alemania', IE:'Irlanda', FR:'Francia', NL:'Países Bajos', PT:'Portugal', BR:'Brasil', CA:'Canadá', NZ:'Nueva Zelanda' };
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const esc = (s) => (s ?? '').toString().replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtMiles = (n) => String(n ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtFecha = (iso) => { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`; };

function celda(encontrados, oportunidades, estado, tooltip, extraClass, scope) {
  const esError = estado === 'error';
  const errClass = esError ? ' cell--error' : '';
  const oppClass = (oportunidades > 0 && !esError) ? ' cell--tiene-opp' : '';
  const scopeAttr = scope ? ` data-scope='${esc(JSON.stringify(scope))}'` : '';
  return `<td class="cell${errClass}${oppClass}${extraClass ? ' ' + extraClass : ''}" title="${esc(tooltip || '')}"${scopeAttr}>
    <span class="split">
      <span class="found">${fmtMiles(encontrados)}</span>
      <span class="sep">/</span>
      <span class="opp ${oportunidades > 0 ? 'opp--pos' : ''}">${oportunidades}</span>
    </span>
  </td>`;
}

function paisLabelCorto(f, fuentes) {
  const label = PAIS_LABELS[f.pais_iso2] || f.pais_iso2;
  const duplicado = fuentes.filter(x => x.pais_iso2 === f.pais_iso2).length > 1;
  if (!duplicado) return label;
  const m = f.nombre.match(/\(([^)]+)\)/);
  const paren = m && m[1];
  return (paren && paren.toLowerCase() !== label.toLowerCase()) ? `${label} · ${paren}` : label;
}

function headerRow(fuentes, primeraCol, soloPais) {
  return '<tr><th>' + primeraCol + '</th><th>Resumen</th>' + fuentes.map(f => {
    const flag = FLAGS[f.pais_iso2] || '';
    const contenido = soloPais
      ? `<span class="th-flag">${flag}</span><span class="th-pais">${esc(paisLabelCorto(f, fuentes))}</span>`
      : `${flag} ${esc(f.codigo)}`;
    return `<th><a href="${esc(f.url_base || '#')}" target="_blank" rel="noopener" title="${esc(f.nombre)}">${contenido}</a></th>`;
  }).join('') + '</tr>';
}

function renderAnual(fuentes, anual) {
  document.getElementById('anual-titulo').textContent = `Resumen anual — ${anual.anio} (año en curso)`;
  const thead = headerRow(fuentes, 'Año', true);
  let row = `<tr><td>${anual.anio}</td>`;
  row += celda(anual.resumen.encontrados, anual.resumen.oportunidades, null,
    'Total de todas las fuentes en lo que va de año — pincha para ver el listado', 'resumen-cell',
    { anio: anual.anio });
  for (const f of fuentes) {
    const c = anual.porFuente[f.codigo];
    row += celda(c ? c.encontrados : 0, c ? c.oportunidades : 0, null, f.nombre + ' — pincha para ver el listado',
      null, { anio: anual.anio, codigo: f.codigo });
  }
  row += '</tr>';
  document.getElementById('tabla-anual').innerHTML = `<table id="tabla-anual-tbl">${thead}<tbody>${row}</tbody></table>`;
}

function renderMes(fuentes, dias) {
  const thead = headerRow(fuentes, 'Fecha');
  if (!dias.length) {
    document.getElementById('tabla-ejecuciones').innerHTML = '<p class="loading">Sin ejecuciones registradas este mes.</p>';
    return;
  }
  let rows = '';
  for (const d of dias) {
    rows += `<tr><td>${fmtFecha(d.dia)}</td>`;
    rows += celda(d.resumen.encontrados, d.resumen.oportunidades, null,
      'Total de todas las fuentes esa noche — pincha para ver el listado', 'resumen-cell', { dia: d.dia });
    for (const f of fuentes) {
      const c = d.porFuente[f.codigo];
      if (!c) { rows += '<td class="muted">—</td>'; continue; }
      const tooltip = (c.estado === 'error'
        ? `${f.nombre} — ERROR: ${c.error}`
        : `${f.nombre} — completado sin errores`) + ' — pincha para ver el listado';
      rows += celda(c.encontrados, c.oportunidades, c.estado, tooltip, null, { dia: d.dia, codigo: f.codigo });
    }
    rows += '</tr>';
  }
  document.getElementById('tabla-ejecuciones').innerHTML = `<table>${thead}<tbody>${rows}</tbody></table>`;
}

function marcarCeldaActiva(scope) {
  document.querySelectorAll('td.cell--activa').forEach(td => td.classList.remove('cell--activa'));
  if (!scope) return;
  const claveBuscada = JSON.stringify(scope);
  document.querySelectorAll('#tabla-anual td[data-scope], #tabla-ejecuciones td[data-scope]').forEach(td => {
    if (td.dataset.scope === claveBuscada) td.classList.add('cell--activa');
  });
}

function encajeLabel(e) { return e === 'alto' ? 'Alto' : 'Medio'; }

function renderOportunidades(rows, etiqueta) {
  document.getElementById('oportunidades-titulo').textContent = `Oportunidades detectadas — ${etiqueta} (${rows.length})`;
  const cont = document.getElementById('oportunidades-lista');
  if (!rows.length) {
    cont.innerHTML = '<p class="loading">Sin oportunidades en este rango.</p>';
    return;
  }
  cont.innerHTML = '<ul class="opp-list">' + rows.map(r => `
    <li class="opp-item">
      <div class="opp-item-head">
        <span class="opp-badge opp-badge--${r.encaje}">${encajeLabel(r.encaje)}</span>
        <span class="opp-item-title">${esc(r.titulo || '(sin título)')}</span>
      </div>
      <div class="opp-item-meta">
        ${FLAGS[r.pais_iso2] || ''} ${esc(r.fuente_codigo)}${r.organo_contratacion ? ' · ' + esc(r.organo_contratacion) : ''}${r.fecha_limite_presentacion ? ' · límite ' + fmtFecha(r.fecha_limite_presentacion.slice(0, 10)) : ''}
      </div>
      ${r.resumen_ia ? `<p class="opp-item-resumen">${esc(r.resumen_ia)}</p>` : ''}
      ${r.url_perfil ? `<p class="opp-item-meta"><a href="${esc(r.url_perfil)}" target="_blank" rel="noopener">Ver ficha ↗</a></p>` : ''}
    </li>`).join('') + '</ul>';
}

async function mostrarOportunidades(scope) {
  const params = new URLSearchParams();
  let etiqueta;
  if (scope.dia) {
    params.set('dia', scope.dia);
    etiqueta = fmtFecha(scope.dia);
  } else if (scope.anio && !scope.mes) {
    params.set('year', scope.anio);
    etiqueta = `año ${scope.anio}`;
  } else {
    params.set('year', scope.anio);
    params.set('month', scope.mes);
    etiqueta = `${MESES[scope.mes - 1]} ${scope.anio}`;
  }
  if (scope.codigo) { params.set('codigo', scope.codigo); etiqueta += ` · ${scope.codigo}`; }
  marcarCeldaActiva(scope.mes ? null : scope);
  const cont = document.getElementById('oportunidades-lista');
  cont.innerHTML = '<p class="loading">Cargando…</p>';
  try {
    const res = await fetch(`/api/licitaciones/ejecuciones/oportunidades?${params}`);
    if (!res.ok) throw new Error();
    const rows = await res.json();
    renderOportunidades(rows, etiqueta);
  } catch {
    cont.innerHTML = '<p class="loading">No se pudo cargar.</p>';
  }
}

function onCeldaClick(e) {
  const td = e.target.closest('td[data-scope]');
  if (!td) return;
  mostrarOportunidades(JSON.parse(td.dataset.scope));
}
document.getElementById('tabla-anual').addEventListener('click', onCeldaClick);
document.getElementById('tabla-ejecuciones').addEventListener('click', onCeldaClick);

const hoy = new Date();
let vista = { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1 };
const esMesActual = () => vista.anio === hoy.getUTCFullYear() && vista.mes === (hoy.getUTCMonth() + 1);

async function cargar() {
  const contMes = document.getElementById('tabla-ejecuciones');
  const contAnual = document.getElementById('tabla-anual');
  const contOpp = document.getElementById('oportunidades-lista');
  document.getElementById('mes-label').textContent = `${MESES[vista.mes - 1]} ${vista.anio}`;
  document.getElementById('mes-next').disabled = esMesActual();
  contMes.innerHTML = '<p class="loading">Cargando…</p>';
  try {
    const res = await fetch(`/api/licitaciones/ejecuciones?year=${vista.anio}&month=${vista.mes}`);
    if (!res.ok) throw new Error();
    const { fuentes, dias, anual } = await res.json();
    renderAnual(fuentes, anual);
    renderMes(fuentes, dias);
    mostrarOportunidades({ anio: vista.anio, mes: vista.mes });
  } catch {
    contMes.innerHTML = '<p class="loading">No se pudo cargar — revisa que has iniciado sesión.</p>';
    contAnual.innerHTML = '<p class="loading">No se pudo cargar.</p>';
    contOpp.innerHTML = '<p class="loading">No se pudo cargar.</p>';
  }
}

document.getElementById('mes-prev').addEventListener('click', () => {
  vista.mes--;
  if (vista.mes < 1) { vista.mes = 12; vista.anio--; }
  cargar();
});
document.getElementById('mes-next').addEventListener('click', () => {
  if (esMesActual()) return;
  vista.mes++;
  if (vista.mes > 12) { vista.mes = 1; vista.anio++; }
  cargar();
});

cargar();

const horaEl = document.getElementById('hora-carga');
if (horaEl) {
  horaEl.textContent = '(consultado ' + new Date().toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) + ')';
}
