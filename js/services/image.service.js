/* =========================================================
   js/services/image.service.js — Carga masiva de fotos y
   gestión del logo institucional
   ========================================================= */
'use strict'

/**
 * Procesa la carga masiva de fotos de aprendices.
 * Asocia cada imagen por nombre de archivo = N° de documento.
 * Ej: 1075678901.jpg → aprendiz con documento "1075678901"
 *
 * @param {HTMLInputElement} inp
 */
function onImgs(inp) {
  let matched = 0
  const files = Array.from(inp.files)

  files.forEach(f => {
    // Obtener número de documento del nombre del archivo (sin extensión)
    const doc = f.name.replace(/\.[^.]+$/, '')
    const rd  = new FileReader()

    rd.onload = e => {
      const idx = learners.findIndex(l => l.documento === doc)
      if (idx >= 0) {
        learners[idx].foto = e.target.result
        matched++
        rTable()
      }
    }

    rd.readAsDataURL(f)
  })

  setTimeout(() => {
    toast(`📷 ${files.length} imágenes procesadas · ${matched} asociadas`)
  }, 600)

  inp.value = ''
}

/**
 * Carga una imagen como logo institucional desde el equipo del usuario.
 * Actualiza logoSrc y la imagen del header.
 *
 * @param {HTMLInputElement} inp
 */
function onLogoUp(inp) {
  const f = inp.files[0]
  if (!f) return

  const rd = new FileReader()
  rd.onload = e => {
    logoSrc    = e.target.result
    logoLoaded = true

    const img = qi('logoimg')
    img.src   = logoSrc
    img.style.display = 'block'
    q('.nologo').style.display = 'none'

    rDesign()
    toast('✅ Logo institucional actualizado')
  }

  rd.readAsDataURL(f)
  inp.value = ''
}
