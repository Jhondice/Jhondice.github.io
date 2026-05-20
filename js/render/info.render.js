/* =========================================================
   js/render/info.render.js — Panel lateral de información
   del carnet seleccionado en la pestaña Carnets
   ========================================================= */
'use strict'

/**
 * Renderiza el panel de información del aprendiz seleccionado.
 * Muestra vigencia calculada, todos los campos y botón de edición.
 */
function rInfo() {
  const l = fil[sel]
  if (!l) return

  const a      = parseInt(l.ano) || AÑO_ACTUAL
  const v      = a + 2
  const ok     = AÑO_ACTUAL <= v

  const vigenciaBlock = `
    <div style="background:${ok ? 'rgba(57,169,0,.12)' : 'rgba(192,57,43,.12)'};
      border:1px solid ${ok ? 'var(--G)' : 'var(--R)'};
      border-radius:7px;padding:9px 12px;margin-bottom:10px;
      display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:10px;color:#888">Año ingreso</div>
        <div style="font-size:15px;font-weight:bold;color:#ddd">${a}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;color:#888">Vence</div>
        <div style="font-size:15px;font-weight:bold;color:${ok ? 'var(--G)' : 'var(--R)'}">${v}</div>
      </div>
      <div style="font-size:11px;font-weight:bold;
        color:${ok ? 'var(--G)' : 'var(--R)'};
        background:${ok ? 'rgba(57,169,0,.15)' : 'rgba(192,57,43,.15)'};
        padding:4px 8px;border-radius:5px">
        ${ok ? '✅ VIGENTE' : '❌ VENCIDO'}
      </div>
    </div>`

  const campos = [
    ['Nombre',    l.nombre],
    ['Documento', l.documento],
    ['RH',        l.rh],
    ['Programa',  l.programa],
    ['Ficha',     l.ficha],
    ['Foto',      l.foto ? '✅ Cargada' : '❌ Sin foto']
  ]

  const camposHTML = campos.map(([k, v]) => `
    <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--E)">
      <div style="color:#666;margin-bottom:2px;font-size:11px">${k}</div>
      <div style="color:#ddd;word-break:break-all;font-size:12px;line-height:1.35">${v}</div>
    </div>`
  ).join('')

  qi('cinfo').innerHTML = `
    <div class="cinfo-title">Info del Carnet</div>
    ${vigenciaBlock}
    ${camposHTML}
    <div style="background:#1e2235;border-radius:6px;padding:8px 10px;font-size:10px;color:#666;margin-top:4px;line-height:1.5">
      🔗 Cód: oferta.senasofiaplus.edu.co<br>
      📐 CR80 · 85.60×53.98mm
    </div>
    <button class="btn bd sm" style="width:100%;margin-top:10px" onclick="openEdit(${l.id})">✏️ Editar datos</button>`
}
