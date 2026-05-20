# 🪪 Generador de Carnets SENA — Articulación Media Técnica

**Regional Huila · Centro de la Industria, la Empresa y los Servicios**

Sistema web estático para la generación, visualización, edición e impresión de carnets institucionales de aprendices del programa de Articulación con la Educación Media Técnica del SENA.

---

## 📋 Funcionalidades

- Carga de aprendices desde archivos **Excel (.xlsx / .xls)** o **CSV**
- Carga masiva de **fotos** asociadas por número de documento
- **Agregar, editar y eliminar** aprendices manualmente
- **Filtrado** por programa de formación y número de ficha
- **Vista previa** en tiempo real del carnet al editar
- **Configuración visual**: activar/desactivar barra superior, cambiar color (verde, azul, blanco o personalizado)
- **Generación de carnets** en formato CR80 / ISO 7810 ID-1 (85.60 × 53.98 mm, vertical)
- **Código de barras decorativo** generado a partir del número de documento
- **Vigencia calculada** automáticamente: año de ingreso + 2 años
- **Impresión individual** en ventana emergente con formato CR80
- **Exportación PDF individual** del carnet seleccionado
- **Exportación masiva PDF** de todos los carnets filtrados (con barra de progreso)
- **Descarga de plantilla Excel** con 3 hojas, estilos, validaciones de datos y lista de programas oficiales
- **Subida manual del logo** institucional como alternativa a colocar el archivo en `/assets/img/`
- **Footer institucional** con créditos del autor

---

## 🗂 Estructura del proyecto

```
sena-carnets/
├── index.html                  ← HTML principal (estructura sin lógica inline)
├── README.md
│
├── assets/
│   └── img/
│       └── logosena.png        ← Logo SENA (colocar aquí)
│
├── css/
│   ├── base.css                ← Reset, variables CSS, tipografía, tabla
│   ├── layout.css              ← Header, tabs, app, footer, grid principal
│   ├── components.css          ← Botones, paneles, badges, toast, upload zones
│   ├── carnet.css              ← Documentación de estilos de impresión CR80
│   ├── modal.css               ← Modal de edición y modal de progreso PDF
│   └── responsive.css          ← Media queries para pantallas pequeñas
│
├── js/
│   ├── app.js                  ← Punto de entrada: inicialización y arranque
│   ├── state.js                ← Estado global: learners, fil, sel, cfg, filtros
│   │
│   ├── config/
│   │   ├── constants.js        ← SG, SB, RH, AÑO_ACTUAL, CR80
│   │   └── programs.js         ← Lista oficial de 16 programas SENA
│   │
│   ├── utils/
│   │   ├── dom.js              ← q(), qi(), toast()
│   │   ├── format.js           ← calcVigencia(), esVigente()
│   │   ├── normalize.js        ← norm(), normMatch()
│   │   ├── validators.js       ← validateLearnerForm()
│   │   └── barcode.js          ← barcode() — generador SVG decorativo
│   │
│   ├── render/
│   │   ├── carnet.render.js    ← mkCarnet() — HTML del carnet CR80
│   │   ├── table.render.js     ← rTable(), updSelects(), setSel()
│   │   ├── list.render.js      ← rList() — lista lateral pestaña Carnets
│   │   ├── preview.render.js   ← rBig(), rThumbs(), pick()
│   │   ├── info.render.js      ← rInfo() — panel lateral de datos del carnet
│   │   └── design.render.js    ← rDesign() — vista previa pestaña Diseño
│   │
│   ├── services/
│   │   ├── import.service.js   ← onCSV(), imp(), gf() — importación Excel/CSV
│   │   ├── image.service.js    ← onImgs(), onLogoUp() — fotos y logo
│   │   ├── export.service.js   ← dlTemplate() — plantilla Excel con 3 hojas
│   │   ├── pdf.service.js      ← doPDF(), doAllPDF(), carnetToCanvas()
│   │   └── print.service.js    ← doPrint() — ventana emergente CR80
│   │
│   ├── features/
│   │   ├── filters.js          ← applyFilter(), syncFilter()
│   │   ├── modal.js            ← openEdit(), saveEdit(), buildForm(), upMP()
│   │   ├── learners.js         ← delRow(), clearAll(), addNewRow()
│   │   ├── design.js           ← setBar(), setColor()
│   │   ├── template.js         ← Documentación (proxy a export.service)
│   │   └── navigation.js       ← goTab(), nav()
│   │
│   └── vendors/
│       └── README-vendors.md   ← Documentación de librerías externas
│
├── data/
│   └── sample-data.json        ← Datos de muestra para referencia/pruebas
│
└── docs/
    ├── arquitectura.md
    ├── flujo-funcional.md
    └── estructura-del-proyecto.md
```

---

## ▶️ Cómo ejecutar el proyecto

### Opción 1 — Servidor local con Python (recomendado para PDF)

```bash
# Python 3
cd sena-carnets
python -m http.server 8080
```
Luego abre: `http://localhost:8080`

### Opción 2 — Servidor local con Node.js

```bash
cd sena-carnets
npx serve .
```

### Opción 3 — Extensión VS Code

Instala **Live Server** en VS Code, clic derecho sobre `index.html` → *Open with Live Server*.

### ⚠️ Nota importante sobre exportación PDF

La exportación a PDF usa `html2canvas`, que necesita que las imágenes sean servidas con cabeceras CORS correctas. **No funciona abriendo el archivo directamente como `file://`** en el navegador.

Usa siempre un servidor local para garantizar el correcto funcionamiento del PDF.

### Logo institucional

Coloca el archivo `logosena.png` en la carpeta `assets/img/` antes de iniciar el servidor.

Si no tienes acceso al archivo, puedes cargarlo desde la interfaz usando el botón **🖼 Subir logosena.png** en la pestaña Datos.

---

## 📦 Dependencias externas

Todas se cargan automáticamente desde CDN (no requieren instalación):

| Librería     | Versión | Uso                                          | Carga         |
|--------------|---------|----------------------------------------------|---------------|
| PapaParse    | 5.4.1   | Parsing de archivos CSV                      | Al arrancar   |
| SheetJS      | 0.18.5  | Lectura y escritura de archivos Excel        | Al arrancar   |
| jsPDF        | 2.5.1   | Generación del archivo PDF                   | Diferida*     |
| html2canvas  | 1.4.1   | Captura del carnet como imagen para el PDF   | Diferida*     |

*Diferida: se cargan solo la primera vez que el usuario solicita exportar un PDF.

---

## 🔄 Flujo funcional

### 1. Carga de datos
1. Ir a la pestaña **📊 Datos**
2. Clic en **Cargar Excel / CSV** y seleccionar el archivo
3. El sistema detecta automáticamente la fila de encabezados y normaliza los nombres de columna
4. Los aprendices aparecen en la tabla con indicador ⚠️ si el programa no es reconocido

### 2. Carga de fotos masivas
1. Clic en **Cargar Fotos Masivas**
2. Seleccionar todas las imágenes. Cada imagen debe nombrarse con el número de documento exacto (ej: `1075678901.jpg`)
3. El sistema asocia automáticamente cada foto al aprendiz correspondiente

### 3. Edición manual
- Clic en ✏️ en la fila de cualquier aprendiz para editar sus datos
- Clic en **➕ Agregar** para ingresar un nuevo aprendiz manualmente
- La vista previa del carnet se actualiza en tiempo real mientras se edita

### 4. Configuración de diseño
1. Ir a la pestaña **⚙️ Diseño**
2. Activar o desactivar la barra superior del carnet
3. Seleccionar color: Verde SENA, Azul SENA, Blanco o personalizado
4. La vista previa refleja los cambios instantáneamente

### 5. Visualización de carnets
1. Ir a la pestaña **🪪 Carnets**
2. Usar los botones ◀ ▶ o clic en la lista lateral para navegar
3. El panel derecho muestra el estado de vigencia y datos del carnet seleccionado

### 6. Exportación e impresión
- **🖨️ Imprimir actual**: abre ventana emergente y lanza el diálogo de impresión
- **📄 PDF actual**: genera PDF individual del carnet seleccionado
- **📦 Exportar todos PDF**: genera un PDF con todos los carnets del filtro activo

---

## 🏗 Convenciones de desarrollo

### Módulos y responsabilidades

| Carpeta      | Responsabilidad                                            |
|--------------|------------------------------------------------------------|
| `config/`    | Constantes y datos de configuración estática               |
| `state.js`   | Estado mutable compartido (única fuente de verdad)         |
| `utils/`     | Funciones puras sin efectos secundarios                    |
| `render/`    | Funciones que generan HTML o actualizan el DOM             |
| `services/`  | Operaciones con archivos, PDF, importación/exportación     |
| `features/`  | Lógica de negocio de cada funcionalidad de la interfaz     |

### Orden de carga de scripts

Los scripts se cargan en orden de dependencia en `index.html`:
1. Constantes y configuración (`config/`)
2. Estado global (`state.js`)
3. Utilidades (`utils/`)
4. Renderizadores (`render/`)
5. Servicios (`services/`)
6. Features (`features/`)
7. Punto de entrada (`app.js`)

### Naming

- Funciones de render: prefijo `r` → `rTable()`, `rList()`, `rBig()`
- Manejadores de eventos: prefijo `on` → `onCSV()`, `onImgs()`
- Servicios async: sufijo `PDF` / `Print` → `doPDF()`, `doPrint()`

---

## 📝 Notas importantes

- Este proyecto es una **refactorización estructural** del sistema original `sena-carnet-html_V4.html`. No se modificó ningún comportamiento, lógica, texto ni salida visual.
- El carnet se genera completamente con HTML/CSS inline embebido en JavaScript. No usa canvas ni librerías de renderizado específicas para la maquetación del carnet.
- La vigencia se calcula como: `año_ingreso + 2`. El carnet muestra "VIGENTE" o "VENCIDO" en el bloque inferior junto al código de barras.
- El código de barras es **decorativo** (no es un código EAN/Code128 escaneable), generado algorítmicamente a partir del número de documento.
- La plantilla Excel incluye validaciones de lista para tipo de sangre y programa, referenciadas entre hojas del mismo libro.
