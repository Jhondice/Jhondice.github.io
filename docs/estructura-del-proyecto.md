# Estructura del Proyecto — Guía Detallada

Este documento explica qué hace cada archivo, de dónde viene el código y cómo mantener el proyecto.

---

## `index.html`

Contiene únicamente la **estructura HTML** del sistema: header, tabs, paneles de cada pestaña,
modal de edición y modal de progreso PDF.

No contiene ninguna lógica JavaScript ni estilos inline (excepto los valores de `display:none`
necesarios para el estado inicial de los tabs).

Carga todos los CSS al inicio y todos los JS al final del `<body>` en orden de dependencia.

---

## `css/`

| Archivo          | Contenido                                                                 |
|------------------|---------------------------------------------------------------------------|
| `base.css`       | Reset, variables `:root`, estilos de `body`, `table`, `input`, `select`   |
| `layout.css`     | `#hdr`, `#tabbar`, `#app`, `#footer`, `.upload-row`, `.carnets-viewer`    |
| `components.css` | `.btn`, `.pnl`, `.upz`, `.bdg`, `#toast`, `.thi`, `.cr80-info`, etc.     |
| `carnet.css`     | Documentación de referencia del formato CR80 (sin reglas activas)         |
| `modal.css`      | `#mdl`, `.mbox`, `.modal-*`, `#prgmdl`, `.prgbox`, `.prgfill`            |
| `responsive.css` | `@media (max-width: 700px)` para pantallas móviles                       |

---

## `js/config/constants.js`

Define las constantes globales del sistema:
- `SG` — Verde SENA `#39A900`
- `SB` — Azul SENA `#003DA5`
- `RH` — Array de tipos de sangre válidos
- `AÑO_ACTUAL` — Año en curso para cálculos de vigencia
- `CR80` — Dimensiones del carnet (ancho, alto, factores de escala)

---

## `js/config/programs.js`

Array `PROGS` con los 16 programas técnicos oficiales de articulación.
Se usa en:
- Validación de programas al importar datos
- Select del modal de edición
- Hoja "Programas" de la plantilla Excel

---

## `js/state.js`

**Única fuente de verdad del estado mutable** de la aplicación.
Todos los módulos leen y escriben directamente sobre las variables declaradas aquí.

Cambiar el estado siempre debe ir seguido de la función de re-render correspondiente.

---

## `js/utils/`

Funciones **puras** (sin efectos secundarios sobre el DOM o el estado global):

| Archivo          | Funciones exportadas                        |
|------------------|---------------------------------------------|
| `dom.js`         | `q(selector)`, `qi(id)`, `toast(msg, type)` |
| `format.js`      | `calcVigencia(ano)`, `esVigente(ano)`       |
| `normalize.js`   | `norm(s)`, `normMatch(a, b)`                |
| `validators.js`  | `validateLearnerForm(nombre, doc, ficha)`   |
| `barcode.js`     | `barcode(val, w, h)` → SVG string           |

---

## `js/render/`

Funciones que **generan HTML o actualizan el DOM**. Cada función re-renderiza su sección completa.

| Archivo              | Función principal  | Qué actualiza                              |
|----------------------|--------------------|--------------------------------------------|
| `carnet.render.js`   | `mkCarnet(l,c,sc)` | Retorna string HTML del carnet             |
| `table.render.js`    | `rTable()`         | `#tbl`, `#hcount`, `#fcnt`, selects        |
| `list.render.js`     | `rList()`          | `#clist`, `#navcnt`                        |
| `preview.render.js`  | `rBig()`           | `#cbig`; también llama `rInfo()`           |
|                      | `rThumbs()`        | `#tgrid`, `#tcnt`                          |
|                      | `pick(i)`          | `sel`, luego llama rList+rBig+rThumbs      |
| `info.render.js`     | `rInfo()`          | `#cinfo` — panel lateral con vigencia      |
| `design.render.js`   | `rDesign()`        | `#dprev` — vista previa en tab Diseño      |

---

## `js/services/`

Operaciones que involucran **archivos externos, APIs o librerías de terceros**:

| Archivo               | Función principal        | Descripción                                    |
|-----------------------|--------------------------|------------------------------------------------|
| `import.service.js`   | `onCSV(inp)`             | Lee CSV (PapaParse) o Excel (SheetJS) y llama `imp()` |
|                       | `imp(rows)`              | Mapea filas a objetos aprendiz y agrega a `learners` |
|                       | `gf(row, ...keys)`       | Extrae campo tolerante a múltiples nombres     |
| `image.service.js`    | `onImgs(inp)`            | Asocia fotos a aprendices por nombre de archivo |
|                       | `onLogoUp(inp)`          | Carga logo manual y actualiza `logoSrc`        |
| `export.service.js`   | `dlTemplate()`           | Genera y descarga plantilla Excel con 3 hojas  |
| `pdf.service.js`      | `doPDF()`                | PDF individual del carnet seleccionado         |
|                       | `doAllPDF()`             | PDF masivo de todos los carnets filtrados      |
|                       | `carnetToCanvas(l)`      | Renderiza carnet fuera de pantalla y captura canvas |
|                       | `ensureLibs()`           | Carga jsPDF y html2canvas si no están listos   |
| `print.service.js`    | `doPrint()`              | Abre ventana emergente CR80 y lanza impresión  |

---

## `js/features/`

Lógica de negocio de cada **funcionalidad de la interfaz**:

| Archivo           | Funciones                                             |
|-------------------|-------------------------------------------------------|
| `filters.js`      | `applyFilter()`, `syncFilter(type, val)`              |
| `modal.js`        | `openEdit(id)`, `buildForm(l)`, `saveEdit()`, `upMP()`, `closeMdl()`, `mdlOut(e)`, `onMFoto(inp)` |
| `learners.js`     | `delRow(id)`, `clearAll()`, `addNewRow()`             |
| `design.js`       | `setBar(on)`, `setColor(c)`                           |
| `template.js`     | Documentación (la función real está en export.service)|
| `navigation.js`   | `goTab(name, btn)`, `nav(d)`                          |

---

## `js/app.js`

Punto de entrada. Se ejecuta **después de todos los demás scripts**.

1. Verifica si `assets/img/logosena.png` carga correctamente
2. Llama `applyFilter()` para inicializar la tabla con datos de muestra
3. Llama `rDesign()` para inicializar la vista previa del tab Diseño

---

## `data/sample-data.json`

Datos de muestra en formato JSON. Útil para pruebas o referencia del esquema de un aprendiz.
No es usado directamente por la aplicación (los datos de muestra están en `state.js`).

---

## Cómo agregar un nuevo programa

1. Abrir `js/config/programs.js`
2. Agregar el nombre del programa al array `PROGS` en mayúsculas
3. La validación de importación, el select del modal y la plantilla Excel se actualizan automáticamente

## Cómo cambiar el texto institucional del carnet

El texto "Regional Huila", "Centro de la Industria, la Empresa y los Servicios" y
"SERVICIO NACIONAL DE APRENDIZAJE" están en `js/render/carnet.render.js`, dentro de `mkCarnet()`.

## Cómo cambiar las dimensiones del carnet

Modificar el objeto `CR80` en `js/config/constants.js` y los valores `W`, `H`, `sc`
en `mkCarnet()`. Las dimensiones de impresión y PDF están en `print.service.js` y `pdf.service.js`.
