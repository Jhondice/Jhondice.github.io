/* =========================================================
   js/services/print.service.js — Impresión del carnet
   activo en ventana emergente con formato CR80
   ========================================================= */
'use strict'

/**
 * Abre una ventana emergente con el carnet seleccionado y
 * lanza la impresión automáticamente una vez que las
 * imágenes hayan terminado de cargar.
 *
 * Formato: CR80 / ISO 7810 ID-1 — 53.98 mm × 85.60 mm
 */
function doPrint() {
  const l = fil[sel]
  if (!l) { toast('Sin aprendiz seleccionado', 'err'); return }

  const win = window.open('', '_blank', 'width=440,height=720,menubar=no,toolbar=no,location=no')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Carnet SENA — ${l.nombre}</title>
  <style>
    @page {
      size: ${CR80.widthMM}mm ${CR80.heightMM}mm;
      margin: 0;
      padding: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: ${CR80.widthMM}mm;
      height: ${CR80.heightMM}mm;
      background: #fff;
      overflow: hidden;
    }
    @media screen {
      body {
        background: #777;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: auto;
        height: auto;
        padding: 24px;
        overflow: auto;
      }
    }
    @media screen  { .card { box-shadow: 0 4px 20px rgba(0,0,0,.4); border-radius: 7px; } }
    @media print   { .card { border-radius: 0 !important; box-shadow: none !important; } }

    #instructions {
      font-family: Arial;
      font-size: 11px;
      color: #ccc;
      margin-top: 16px;
      text-align: center;
      max-width: 250px;
    }
    @media print { #instructions { display: none; } }
  </style>
</head>
<body>
  <div class="card">${mkCarnet(l, cfg, 1, true)}</div>
  <div id="instructions">
    Configura tu impresora en formato CR80<br>
    (85.60 mm × 53.98 mm) antes de imprimir
  </div>
  <script>
    const imgs  = document.querySelectorAll('img')
    let done    = 0
    const total = imgs.length

    function tryPrint() { setTimeout(() => window.print(), 600) }

    if (!total) {
      tryPrint()
    } else {
      imgs.forEach(img => {
        const d = () => { done++; if (done >= total) tryPrint() }
        if (img.complete && img.naturalHeight > 0) d()
        else { img.onload = d; img.onerror = d }
      })
    }
  <\/script>
</body>
</html>`

  win.document.write(html)
  win.document.close()
  toast('🖨️ Preparando impresión...')
}
