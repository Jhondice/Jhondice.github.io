/* =========================================================
   js/services/export.service.js — Descarga de la plantilla
   Excel institucional con 3 hojas y validaciones de datos
   ========================================================= */
'use strict'

/**
 * Genera y descarga la plantilla Excel para ingreso de aprendices.
 * Incluye 3 hojas: Plantilla, Programas y Tipos RH.
 * Tiene validaciones de datos, estilos y filas de ejemplo.
 */
function dlTemplate() {
  const wb = XLSX.utils.book_new()

  /* ── Hoja 1: PLANTILLA ─────────────────────────────── */
  const SAMPLES = [
    ['ANDREA VALENTINA TORRES PEÑA', '1075000001', 'O+', 'PROGRAMACION DE SOFTWARE',                                  '2987654'],
    ['CARLOS ANDRES MUÑOZ SILVA',    '1075000002', 'A+', 'ASISTENCIA ADMINISTRATIVA',                                 '2987654'],
    ['MARIA JOSE VARGAS OSPINA',     '1075000003', 'B+', 'SISTEMAS TELEINFORMATICOS',                                 '2987655']
  ]
  const EMPTY = Array(50).fill(null).map(() => ['', '', '', '', ''])

  const aoa = [
    // Fila 1 — título institucional
    ['SENA — Articulación con la Educación Media Técnica', '', '', '', ''],
    // Fila 2 — subtítulo
    ['Centro de la Industria, la Empresa y los Servicios — Regional Huila', '', '', '', ''],
    // Fila 3 — instrucción
    ['⚠ Complete los datos desde la fila 5. No modifique las columnas ni los encabezados.', '', '', '', ''],
    // Fila 4 — encabezados (los usa el importador)
    ['nombre', 'documento', 'rh', 'programa', 'ficha'],
    ...SAMPLES,
    ...EMPTY
  ]

  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // Anchos de columna
  ws['!cols'] = [{ wch: 48 }, { wch: 16 }, { wch: 7 }, { wch: 62 }, { wch: 11 }, { wch: 14 }]

  // Combinar celdas de encabezado (A1:E3)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } }
  ]

  // Congelar encabezados (filas 1-4)
  ws['!freeze'] = { xSplit: 0, ySplit: 4 }

  // ── Estilos por tipo de fila ──────────────────────────
  const S = {
    titulo: {
      font:      { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill:      { fgColor: { rgb: '39A900' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    },
    subtitulo: {
      font:      { sz: 11, color: { rgb: 'DDDDDD' } },
      fill:      { fgColor: { rgb: '2d8600' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center' }
    },
    instruccion: {
      font:      { italic: true, sz: 10, color: { rgb: 'AA6600' } },
      fill:      { fgColor: { rgb: 'FFF8E1' }, patternType: 'solid' },
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
    },
    header: {
      font:      { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
      fill:      { fgColor: { rgb: '1a6e00' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top:    { style: 'thin',   color: { rgb: '0d4500' } },
        bottom: { style: 'medium', color: { rgb: '0d4500' } },
        left:   { style: 'thin',   color: { rgb: '0d4500' } },
        right:  { style: 'thin',   color: { rgb: '0d4500' } }
      }
    },
    muestra: {
      font:      { sz: 10, color: { rgb: '1a1a1a' } },
      fill:      { fgColor: { rgb: 'F0FAF0' }, patternType: 'solid' },
      alignment: { vertical: 'center' },
      border:    { bottom: { style: 'thin', color: { rgb: 'DDDDDD' } } }
    },
    datos: {
      font:      { sz: 10 },
      alignment: { vertical: 'center' },
      border: {
        bottom: { style: 'hair', color: { rgb: 'E0E0E0' } },
        left:   { style: 'hair', color: { rgb: 'E0E0E0' } },
        right:  { style: 'hair', color: { rgb: 'E0E0E0' } }
      }
    }
  }

  // Altura de filas
  ws['!rows'] = [
    { hpt: 30 }, { hpt: 20 }, { hpt: 22 }, { hpt: 22 },
    ...Array(SAMPLES.length).fill({ hpt: 18 }),
    ...Array(EMPTY.length).fill({ hpt: 16 })
  ]

  // Aplicar estilos celda por celda
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  cols.forEach(c => {
    if (ws[`${c}1`]) ws[`${c}1`].s = S.titulo
    if (ws[`${c}2`]) ws[`${c}2`].s = S.subtitulo
    if (ws[`${c}3`]) ws[`${c}3`].s = S.instruccion
    if (ws[`${c}4`]) ws[`${c}4`].s = S.header

    for (let r = 5; r <= 4 + SAMPLES.length; r++) {
      const addr = `${c}${r}`
      if (ws[addr]) ws[addr].s = S.muestra
    }
    for (let r = 5 + SAMPLES.length; r <= 4 + SAMPLES.length + EMPTY.length; r++) {
      const addr = `${c}${r}`
      if (ws[addr]) ws[addr].s = S.datos
    }
  })

  // Etiquetas de encabezado legibles en fila 4
  ws['A4'].v = 'nombre';    ws['A4'].w = 'Nombre Completo'
  ws['B4'].v = 'documento'; ws['B4'].w = 'N° Documento'
  ws['C4'].v = 'rh';        ws['C4'].w = 'Tipo Sangre'
  ws['D4'].v = 'programa';  ws['D4'].w = 'Programa de Formación'
  ws['E4'].v = 'ficha';     ws['E4'].w = 'N° Ficha'
  ws['F4'].v = 'ano';       ws['F4'].w = 'Año de Ingreso'

  // Validaciones de datos
  ws['!dataValidations'] = [
    {
      sqref: 'C5:C10000',
      type: 'list',
      formula1: '"O+,O-,A+,A-,B+,B-,AB+,AB-"',
      showDropDown: false,
      showErrorMessage: true,
      errorStyle: 'stop',
      errorTitle: 'Tipo de sangre inválido',
      error: 'Seleccione un tipo de sangre de la lista (O+, O-, A+, A-, B+, B-, AB+, AB-)'
    },
    {
      sqref: 'D5:D10000',
      type: 'list',
      formula1: 'Programas!$A$2:$A$17',
      showDropDown: false,
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Programa no reconocido',
      error: 'Use la lista desplegable para seleccionar el programa oficial.'
    },
    {
      sqref: 'F5:F10000',
      type: 'whole',
      operator: 'between',
      formula1: `${AÑO_ACTUAL - 4}`,
      formula2: `${AÑO_ACTUAL + 1}`,
      showDropDown: false,
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Año de ingreso inválido',
      error: `Ingrese un año entre ${AÑO_ACTUAL - 4} y ${AÑO_ACTUAL + 1}`
    }
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla')

  /* ── Hoja 2: PROGRAMAS ─────────────────────────────── */
  const wsProg = XLSX.utils.aoa_to_sheet([
    ['PROGRAMAS TÉCNICOS DE ARTICULACIÓN'],
    ...PROGS.map(p => [p])
  ])
  wsProg['!cols'] = [{ wch: 65 }]
  wsProg['!merges'] = []

  if (wsProg['A1']) wsProg['A1'].s = {
    font:      { bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
    fill:      { fgColor: { rgb: '003DA5' }, patternType: 'solid' },
    alignment: { horizontal: 'center' }
  }

  for (let i = 0; i < PROGS.length; i++) {
    const addr = `A${i + 2}`
    if (wsProg[addr]) wsProg[addr].s = {
      font:      { sz: 10, color: { rgb: '1a1a1a' } },
      fill:      { fgColor: { rgb: i % 2 === 0 ? 'EEF5FF' : 'FFFFFF' }, patternType: 'solid' },
      alignment: { vertical: 'center' }
    }
  }

  wsProg['!rows'] = [{ hpt: 24 }, ...Array(PROGS.length).fill({ hpt: 16 })]
  XLSX.utils.book_append_sheet(wb, wsProg, 'Programas')

  /* ── Hoja 3: TIPOS RH ──────────────────────────────── */
  const wsRH = XLSX.utils.aoa_to_sheet([
    ['TIPOS DE SANGRE'],
    ...RH.map(r => [r])
  ])
  wsRH['!cols'] = [{ wch: 16 }]

  if (wsRH['A1']) wsRH['A1'].s = {
    font:      { bold: true, color: { rgb: 'FFFFFF' } },
    fill:      { fgColor: { rgb: 'C0392B' }, patternType: 'solid' },
    alignment: { horizontal: 'center' }
  }

  XLSX.utils.book_append_sheet(wb, wsRH, 'Tipos RH')

  /* ── Escritura y descarga ───────────────────────────── */
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary', cellStyles: true })
  const buf   = new ArrayBuffer(wbout.length)
  const view  = new Uint8Array(buf)
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF

  const a = document.createElement('a')
  a.href = URL.createObjectURL(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  )
  a.download = 'plantilla_carnets_sena.xlsx'
  a.click()
  URL.revokeObjectURL(a.href)

  toast('✅ Plantilla Excel descargada — 3 hojas incluidas')
}
