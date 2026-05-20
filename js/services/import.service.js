/* =========================================================
   js/services/import.service.js — Importación de archivos
   Excel (.xlsx / .xls) y CSV con normalización de columnas
   ========================================================= */
'use strict'

/**
 * Extrae el valor de un campo de una fila importada probando
 * múltiples nombres de columna posibles (tolerante a variaciones).
 *
 * @param  {Object}    r    - Fila del archivo importado
 * @param  {...string} ks   - Nombres alternativos del campo
 * @returns {string}
 */
function gf(r, ...ks) {
  for (const k of ks)
    for (const rk of Object.keys(r))
      if (rk.trim().toLowerCase() === k.toLowerCase()) {
        const v = r[rk]
        if (v != null && v !== '') return v.toString().trim()
      }
  return ''
}

/**
 * Procesa un array de filas (ya parseadas) y agrega los aprendices
 * válidos a la lista `learners`. Muestra un toast con el resultado.
 *
 * @param {Object[]} rows - Filas del archivo importado
 */
function imp(rows) {
  let ok = 0, warn = 0, skip = 0

  const mapped = rows.map(r => {
    const nombre    = gf(r, 'nombre', 'Nombre', 'NOMBRE', 'Nombre Completo').toUpperCase()
    const documento = gf(r, 'documento', 'Documento', 'DOCUMENTO', 'CC', 'cc', 'cedula', 'cédula',
                          'N° Documento', 'No Documento', 'NroDocumento')

    // Omitir filas sin nombre o documento, y filas de encabezado repetido
    if (!nombre || !documento || nombre === 'NOMBRE' || nombre === 'NOMBRE COMPLETO') {
      skip++
      return null
    }

    const rh      = gf(r, 'rh', 'RH', 'sangre', 'tipo_sangre', 'Sangre', 'Tipo Sangre', 'TipoSangre') || 'O+'
    const rawProg = gf(r, 'programa', 'Programa', 'PROGRAMA', 'Programa de Formación', 'ProgramaFormacion')
    const match   = PROGS.find(p => normMatch(p, rawProg))
    if (!match) warn++

    const rawAno  = gf(r, 'ano', 'año', 'ingreso', 'año_ingreso', 'anio', 'anio_ingreso', 'Año Ingreso', 'AnoIngreso')
    const ano     = parseInt(rawAno) || AÑO_ACTUAL

    ok++
    return {
      id:        uid++,
      nombre:    nombre.replace(/\s+/g, ' ').trim(),
      documento: documento.replace(/\D/g, ''),
      rh:        rh.trim().toUpperCase(),
      programa:  match || rawProg.toUpperCase(),
      ficha:     (gf(r, 'ficha', 'Ficha', 'FICHA', 'N° Ficha', 'NroFicha') || '').trim(),
      ano,
      foto:      null
    }
  }).filter(Boolean)

  learners = [...learners, ...mapped]
  applyFilter()

  let msg = `✅ ${ok} aprendices importados`
  if (warn)   msg += ` · ⚠️ ${warn} con programa no reconocido`
  if (skip > 3) msg += ` · ${skip} filas vacías omitidas`
  toast(msg, warn ? 'wrn' : 'ok')
}

/**
 * Manejador del input de archivo (CSV o Excel).
 * Detecta la extensión y usa PapaParse (CSV) o SheetJS (Excel).
 *
 * @param {HTMLInputElement} inp
 */
function onCSV(inp) {
  const f = inp.files[0]
  if (!f) return

  const ext = f.name.split('.').pop().toLowerCase()

  if (ext === 'csv') {
    // ── CSV: PapaParse ────────────────────────────────────
    Papa.parse(f, {
      header:           true,
      skipEmptyLines:   true,
      encoding:         'UTF-8',
      transformHeader:  h => h.trim().toLowerCase()
        .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
        .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
        .replace(/[úùü]/g, 'u').replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]/g, ''),
      complete: ({ data }) => imp(data)
    })
  } else {
    // ── Excel: SheetJS ────────────────────────────────────
    const rd = new FileReader()
    rd.onload = e => {
      const wb     = XLSX.read(e.target.result, { type: 'binary', codepage: 65001 })
      const wsName = wb.SheetNames[0]
      const ws     = wb.Sheets[wsName]

      // Detectar fila de encabezado buscando "nombre" en las primeras 8 filas
      let headerRow = 0
      const range   = XLSX.utils.decode_range(ws['!ref'] || 'A1:E1')
      outer: for (let r = range.s.r; r <= Math.min(range.s.r + 7, range.e.r); r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
          const cell = ws[XLSX.utils.encode_cell({ r, c })]
          if (cell && norm(cell.v || '').includes('NOMBRE')) {
            headerRow = r
            break outer
          }
        }
      }

      const rows  = XLSX.utils.sheet_to_json(ws, { defval: '', range: headerRow })

      // Normalizar claves de columna (sin tildes, sin espacios, mayúsculas)
      const normed = rows.map(r => {
        const out = {}
        Object.keys(r).forEach(k => {
          const nk = norm(k).replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '')
          out[nk]       = r[k]
          out[k.trim()] = r[k] // también guardar clave original
        })
        return out
      })

      imp(normed)
    }
    rd.readAsBinaryString(f)
  }

  inp.value = '' // limpiar input para permitir reimportación del mismo archivo
}
