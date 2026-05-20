/* =========================================================
   js/services/pdf.service.js — Exportación de carnets a PDF
   individual y masivo usando jsPDF + html2canvas (lazy load)
   ========================================================= */
'use strict'

/* ── Carga diferida de librerías PDF ─────────────────────
   jsPDF y html2canvas se cargan solo cuando se necesitan,
   para no penalizar el tiempo de carga inicial.
   ───────────────────────────────────────────────────────── */

/**
 * Carga un script externo de forma diferida (Promise).
 * No recarga si ya está en el DOM y la librería está disponible.
 * @param  {string} src
 * @returns {Promise<void>}
 */
function loadLib(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`) && window.jspdf && window.html2canvas) {
      res()
      return
    }
    const s   = document.createElement('script')
    s.src     = src
    s.onload  = res
    s.onerror = () => rej(new Error('No se pudo cargar: ' + src))
    document.head.appendChild(s)
  })
}

/**
 * Garantiza que jsPDF y html2canvas están disponibles.
 * @returns {Promise<void>}
 */
async function ensureLibs() {
  const base = 'https://cdnjs.cloudflare.com/ajax/libs/'
  if (!window.jspdf)
    await loadLib(base + 'jspdf/2.5.1/jspdf.umd.min.js')
  if (!window.html2canvas)
    await loadLib(base + 'html2canvas/1.4.1/html2canvas.min.js')
}

/**
 * Espera a que todas las imágenes de un elemento estén cargadas.
 * Tiene un timeout de seguridad de 3 segundos.
 * @param  {HTMLElement} el
 * @returns {Promise<void>}
 */
function waitForImages(el) {
  return new Promise(res => {
    const imgs  = el.querySelectorAll('img')
    let done    = 0
    const total = imgs.length

    if (!total) { setTimeout(res, 80); return }

    const d = () => { done++; if (done >= total) res() }
    imgs.forEach(img => {
      if (img.complete && img.naturalHeight > 0) d()
      else { img.onload = d; img.onerror = d }
    })

    setTimeout(res, 3000) // timeout de seguridad
  })
}

/**
 * Renderiza un carnet fuera de pantalla y lo convierte a canvas.
 * Usa escala 3.937 ≈ 300 DPI (mm → px).
 *
 * @param  {Object} l - Datos del aprendiz
 * @returns {Promise<HTMLCanvasElement>}
 */
async function carnetToCanvas(l) {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:fixed;top:-9999px;left:-9999px;z-index:-1;background:#fff;padding:0;margin:0'
  wrap.innerHTML     = mkCarnet(l, cfg, CR80.scalePDF, true)

  document.body.appendChild(wrap)
  await waitForImages(wrap)

  const canvas = await html2canvas(wrap.firstElementChild, {
    scale:           1,
    useCORS:         true,
    allowTaint:      true,
    backgroundColor: '#fff',
    logging:         false,
    width:           wrap.firstElementChild.offsetWidth,
    height:          wrap.firstElementChild.offsetHeight
  })

  document.body.removeChild(wrap)
  return canvas
}

/* ── Exportar PDF del carnet actual ──────────────────────
   ───────────────────────────────────────────────────────── */

/**
 * Exporta el carnet del aprendiz seleccionado como PDF individual (CR80).
 */
async function doPDF() {
  const l = fil[sel]
  if (!l) { toast('Sin aprendiz seleccionado', 'err'); return }

  const btn = qi('btnPDF')
  btn.disabled = true
  toast('⏳ Generando PDF...')

  try {
    await ensureLibs()
    const canvas   = await carnetToCanvas(l)
    const { jsPDF } = window.jspdf
    const pdf      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [CR80.widthMM, CR80.heightMM] })
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, CR80.widthMM, CR80.heightMM)
    pdf.save(`carnet_${l.documento}_${l.nombre.split(' ')[0]}.pdf`)
    toast('✅ PDF exportado correctamente')
  } catch (e) {
    console.error(e)
    toast('❌ Error al generar PDF. Usa un servidor local (ver README).', 'err')
  }

  btn.disabled = false
}

/* ── Exportar todos los carnets filtrados en un PDF ──────
   ───────────────────────────────────────────────────────── */

/**
 * Exporta todos los carnets del filtro activo en un único PDF multi-página.
 * Muestra modal de progreso durante la generación.
 */
async function doAllPDF() {
  if (!fil.length) { toast('Sin carnets para exportar', 'err'); return }

  const btn = qi('btnAllPDF')
  btn.disabled = true

  try {
    await ensureLibs()
  } catch {
    toast('❌ No se pudo cargar jsPDF/html2canvas. Usa servidor local.', 'err')
    btn.disabled = false
    return
  }

  // Mostrar modal de progreso
  const pm = qi('prgmdl')
  const pf = qi('prgfill')
  const pt = qi('prgtxt')
  const pn = qi('prgnum')
  pm.style.display = 'flex'

  const { jsPDF } = window.jspdf
  const pdf       = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [CR80.widthMM, CR80.heightMM] })
  const total     = fil.length

  try {
    for (let i = 0; i < total; i++) {
      const l         = fil[i]
      pt.textContent  = `Procesando: ${l.nombre}`
      pn.textContent  = `${i + 1} / ${total}`
      pf.style.width  = `${Math.round(((i + 1) / total) * 100)}%`

      const canvas = await carnetToCanvas(l)
      if (i > 0) pdf.addPage([CR80.widthMM, CR80.heightMM], 'portrait')
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, CR80.widthMM, CR80.heightMM)

      // Ceder el control al navegador entre iteraciones
      await new Promise(r => setTimeout(r, 50))
    }

    const fname = `carnets_sena_${total}aprendices_ficha${fFich || 'todos'}.pdf`
    pdf.save(fname)
    toast(`✅ PDF con ${total} carnets guardado`)
  } catch (e) {
    console.error(e)
    toast('❌ Error en exportación masiva. Ver consola.', 'err')
  }

  pm.style.display = 'none'
  btn.disabled     = false
}
