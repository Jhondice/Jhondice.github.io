/* =========================================================
   js/render/carnet.render.js — Generador HTML del carnet
   Función principal: mkCarnet(l, cfg, sc, isPrint)
   ========================================================= */
'use strict'

/**
 * Genera el HTML completo de un carnet SENA en formato CR80 vertical.
 *
 * @param  {Object}  l        - Datos del aprendiz
 * @param  {Object}  cfg      - Configuración visual { on, color }
 * @param  {number}  sc       - Factor de escala (1 = tamaño base ≈ 204×323px)
 * @param  {boolean} isPrint  - true cuando se renderiza para impresión/PDF
 * @returns {string}          - HTML del carnet listo para insertar en el DOM
 */
function mkCarnet(l, cfg, sc, isPrint = false) {
  sc = sc || 1
  const W = Math.round(204 * sc)
  const H = Math.round(323 * sc)
  const s = sc

  // Color de la barra: si está desactivada se usa verde SENA de todas formas
  const bc = cfg.on ? cfg.color : SG

  // Contraste de texto sobre la barra según luminosidad del color
  const isDark = bc.toLowerCase() !== '#ffffff' && bc.toLowerCase() !== '#fff'
  const tc = isDark ? '#fff' : '#222'

  // HTML de la foto del aprendiz o placeholder
  const fotoHTML = l.foto
    ? `<img src="${l.foto}" style="width:100%;height:100%;object-fit:cover;display:block" alt="">`
    : `<div style="color:#bbb;font-size:${(6.5 * s).toFixed(1)}px;text-align:center;line-height:1.6">SIN<br>FOTO</div>`

  // Barra superior opcional
  const topBarHTML = cfg.on
    ? `<div style="background:${bc};height:${Math.round(20 * s)}px;display:flex;align-items:center;
        justify-content:center;flex-shrink:0;overflow:hidden">
        <span style="color:${tc};font-size:${(5.8 * s).toFixed(1)}px;font-weight:bold;
          letter-spacing:${(0.6 * s).toFixed(1)}px;font-family:Arial,sans-serif;white-space:nowrap">
          SERVICIO NACIONAL DE APRENDIZAJE</span>
      </div>`
    : ''

  // Sombra solo en pantalla, no en impresión
  const shadow = isPrint ? '' : 'box-shadow:0 8px 28px rgba(0,0,0,.35);'

  // ── Sección de vigencia ───────────────────────────────
  const a      = parseInt(l.ano) || AÑO_ACTUAL
  const vd     = a + 2
  const hoy    = AÑO_ACTUAL
  const vigente = hoy <= vd
  const bc2    = cfg.on ? cfg.color : SG
  const isDark2 = bc2.toLowerCase() !== '#ffffff' && bc2.toLowerCase() !== '#fff'
  const bgV    = vigente ? bc2 : '#c0392b'
  const tcV    = vigente ? (isDark2 ? '#fff' : '#1a4d00') : '#fff'

  const vigenciaHTML = `
    <div style="display:flex;align-items:center;gap:${Math.round(4 * s)}px;margin-top:${Math.round(2 * s)}px">
      <div style="text-align:center;line-height:1.3">
        <span style="font-size:${(5.2 * s).toFixed(1)}px;color:#aaa;display:block;letter-spacing:.5px">AÑO INGRESO</span>
        <span style="font-size:${(8 * s).toFixed(1)}px;font-weight:bold;color:#333;font-family:monospace">${a}</span>
      </div>
      <div style="height:${Math.round(20 * s)}px;width:1px;background:#ddd"></div>
      <div style="background:${bgV};border-radius:${Math.round(3 * s)}px;
        padding:${Math.round(2 * s)}px ${Math.round(5 * s)}px;text-align:center">
        <span style="font-size:${(4.8 * s).toFixed(1)}px;color:${tcV};display:block;font-weight:bold;letter-spacing:.5px">VIGENTE HASTA</span>
        <span style="font-size:${(9 * s).toFixed(1)}px;font-weight:900;color:${tcV};font-family:monospace;letter-spacing:1px">${vd}</span>
      </div>
    </div>`

  // ── HTML completo del carnet ──────────────────────────
  return `<div style="width:${W}px;height:${H}px;background:#fff;border-radius:${isPrint ? 0 : Math.round(7 * s)}px;
      overflow:hidden;${shadow}display:flex;flex-direction:column;
      font-family:Arial,Helvetica,sans-serif;flex-shrink:0">

    ${topBarHTML}

    <!-- LOGO INSTITUCIONAL -->
    <div style="padding:${Math.round(4 * s)}px ${Math.round(10 * s)}px;display:flex;justify-content:center;
      align-items:center;border-bottom:1.5px solid #e0e0e0;flex-shrink:0;min-height:${Math.round(36 * s)}px;background:#fff">
      <img src="${logoSrc}" style="height:${Math.round(26 * s)}px;max-width:85%;object-fit:contain" alt=""
        onerror="this.style.display='none'">
    </div>

    <!-- FOTO DEL APRENDIZ -->
    <div style="display:flex;justify-content:center;padding:${Math.round(5 * s)}px 0 ${Math.round(3 * s)}px;flex-shrink:0">
      <div style="width:${Math.round(66 * s)}px;height:${Math.round(74 * s)}px;background:#e8eee8;
        border:2px solid ${bc};border-radius:${Math.round(3 * s)}px;overflow:hidden;
        display:flex;align-items:center;justify-content:center">
        ${fotoHTML}
      </div>
    </div>

    <!-- NOMBRE Y ROL -->
    <div style="text-align:center;padding:0 ${Math.round(8 * s)}px ${Math.round(2 * s)}px;flex-shrink:0">
      <div style="font-size:${(8.8 * s).toFixed(1)}px;font-weight:bold;color:#111;line-height:1.22;
        text-transform:uppercase">${l.nombre || 'NOMBRE COMPLETO'}</div>
      <div style="font-size:${(7.5 * s).toFixed(1)}px;color:${bc};font-weight:bold;
        margin-top:${Math.round(2 * s)}px;letter-spacing:${(1.5 * s).toFixed(1)}px">APRENDIZ</div>
    </div>

    <!-- PROGRAMA DE FORMACIÓN -->
    <div style="margin:0 ${Math.round(8 * s)}px ${Math.round(3 * s)}px;background:#f5f5f5;
      border-radius:${Math.round(3 * s)}px;padding:${Math.round(3 * s)}px ${Math.round(5 * s)}px;flex-shrink:0;
      border-left:3px solid ${bc}">
      <div style="font-size:${(5.2 * s).toFixed(1)}px;color:#999;text-transform:uppercase;letter-spacing:.5px">Programa de Formación</div>
      <div style="font-size:${(7.2 * s).toFixed(1)}px;color:#1a1a1a;font-weight:bold;line-height:1.25;
        margin-top:${Math.round(s)}px">${l.programa || '—'}</div>
    </div>

    <!-- FICHA · DOCUMENTO · RH -->
    <div style="display:flex;gap:${Math.round(3 * s)}px;margin:0 ${Math.round(8 * s)}px ${Math.round(3 * s)}px;flex-shrink:0">
      <div style="background:#f5f5f5;border-radius:${Math.round(3 * s)}px;padding:${Math.round(3 * s)}px ${Math.round(4 * s)}px;min-width:0">
        <div style="font-size:${(5.2 * s).toFixed(1)}px;color:#999;white-space:nowrap">Ficha</div>
        <div style="font-size:${(8.5 * s).toFixed(1)}px;font-weight:bold;color:#222">${l.ficha || 'XXXX'}</div>
      </div>
      <div style="flex:1;background:#f5f5f5;border-radius:${Math.round(3 * s)}px;padding:${Math.round(3 * s)}px ${Math.round(4 * s)}px;min-width:0;overflow:hidden">
        <div style="font-size:${(5.2 * s).toFixed(1)}px;color:#999;white-space:nowrap">N° Documento</div>
        <div style="font-size:${(7.5 * s).toFixed(1)}px;font-weight:bold;color:#222;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.documento || '0000000000'}</div>
      </div>
      <div style="background:#fff0f0;border:1px solid #fcc;border-radius:${Math.round(3 * s)}px;
        padding:${Math.round(3 * s)}px ${Math.round(5 * s)}px;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="font-size:${(5.2 * s).toFixed(1)}px;color:#999">RH</div>
        <div style="font-size:${(9 * s).toFixed(1)}px;font-weight:bold;color:#c0392b">${l.rh || 'O+'}</div>
      </div>
    </div>

    <!-- TEXTO INSTITUCIONAL -->
    <div style="text-align:center;padding:${Math.round(3 * s)}px ${Math.round(8 * s)}px;flex-shrink:0;
      border-top:1px dashed #e0e0e0;margin:0 ${Math.round(8 * s)}px;margin-bottom:${Math.round(3 * s)}px">
      <div style="font-size:${(6.8 * s).toFixed(1)}px;color:#222;font-weight:bold;letter-spacing:.4px">Regional Huila</div>
      <div style="font-size:${(5.5 * s).toFixed(1)}px;color:#555;line-height:1.5;margin-top:${Math.round(1 * s)}px">
        Centro de la Industria,<br>la Empresa y los Servicios
      </div>
    </div>

    <!-- CÓDIGO DE BARRAS + VIGENCIA -->
    <div style="display:flex;flex-direction:column;align-items:center;
      padding:${Math.round(2 * s)}px ${Math.round(8 * s)}px ${Math.round(3 * s)}px;
      margin-top:auto;flex-shrink:0">
      ${barcode(l.documento || '1234567890', Math.round(148 * s), Math.round(24 * s))}
      ${vigenciaHTML}
    </div>

    <!-- FRANJA INFERIOR DE COLOR -->
    <div style="height:${Math.round(5 * s)}px;background:${bc};flex-shrink:0"></div>
  </div>`
}
