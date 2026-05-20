# Flujo Funcional del Sistema

## Flujo principal de uso

```
Usuario abre index.html
        │
        ▼
app.js → applyFilter() → rTable() (tabla vacía con datos de muestra)
app.js → rDesign()                (vista previa con primer aprendiz)
        │
        ▼
┌───────────────────────────────────────────────────┐
│                  PESTAÑA DATOS                     │
│                                                    │
│  [Cargar Excel/CSV]──► onCSV()                     │
│       │                  │                         │
│       │            PapaParse / SheetJS             │
│       │                  │                         │
│       │              imp(rows)                     │
│       │                  │                         │
│       │         learners = [...learners, ...new]   │
│       │                  │                         │
│       │            applyFilter()                   │
│       │                  │                         │
│       └──────────────► rTable() ──► updSelects()  │
│                                                    │
│  [Cargar Fotos]──► onImgs()                        │
│       │              │                             │
│       │         FileReader × N archivos            │
│       │              │                             │
│       │         learners[idx].foto = dataURL        │
│       │              │                             │
│       └──────────► rTable()                        │
│                                                    │
│  [Agregar / Editar]──► openEdit(id)                │
│       │                    │                       │
│       │               buildForm(l)                 │
│       │               mkCarnet() → mprev           │
│       │                    │                       │
│       │         [upMP()] en tiempo real             │
│       │                    │                       │
│       │              saveEdit()                    │
│       │                    │                       │
│       │         validateLearnerForm()               │
│       │                    │                       │
│       │         learners.push / learners[idx]=rec  │
│       │                    │                       │
│       └──────────────► applyFilter()               │
│                                                    │
│  [Filtros]──► syncFilter() ──► applyFilter()       │
│                                                    │
│  [Plantilla Excel]──► dlTemplate()                 │
│       │                  │                         │
│       │            SheetJS (3 hojas)               │
│       └──────────► descarga .xlsx                  │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│                 PESTAÑA DISEÑO                     │
│                                                    │
│  Al activar pestaña ──► rDesign()                  │
│                              │                    │
│                         mkCarnet(l, cfg, 1.88)     │
│                              │                    │
│                         dprev.innerHTML = ...      │
│                                                    │
│  [Activar/Desactivar barra]──► setBar(on)          │
│       │                           │               │
│       │                      cfg.on = on           │
│       └──────────────────► rDesign()               │
│                                                    │
│  [Color de barra]──► setColor(c)                   │
│       │                  │                        │
│       │             cfg.color = c                  │
│       └──────────► rDesign()                       │
└───────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────┐
│                PESTAÑA CARNETS                     │
│                                                    │
│  Al activar pestaña ──► rList() + rBig() + rThumbs()│
│                                                    │
│  [◀ ▶ Navegar]──► nav(d)                           │
│       │               │                           │
│       │          sel = clamp(sel+d)                │
│       └──► rList() + rBig() + rThumbs()            │
│                                                    │
│  [Clic en lista/miniatura]──► pick(i)              │
│       │                           │               │
│       │                      sel = i               │
│       └──► rList() + rBig() + rThumbs()            │
│                                                    │
│  [🖨 Imprimir]──► doPrint()                        │
│       │               │                           │
│       │         window.open(ventana)               │
│       │         mkCarnet(l, cfg, 1, true)          │
│       └──► window.print() (auto)                   │
│                                                    │
│  [📄 PDF actual]──► doPDF()                        │
│       │                 │                         │
│       │           ensureLibs() (lazy)              │
│       │           carnetToCanvas(l)                │
│       │           jsPDF + canvas.toDataURL         │
│       └──► pdf.save(nombre.pdf)                    │
│                                                    │
│  [📦 Exportar todos]──► doAllPDF()                 │
│       │                      │                    │
│       │               ensureLibs() (lazy)          │
│       │               modal progreso visible       │
│       │               for each l in fil:           │
│       │                  carnetToCanvas(l)         │
│       │                  pdf.addPage() + addImage()│
│       └──► pdf.save(carnets_sena_N.pdf)            │
└───────────────────────────────────────────────────┘
```

---

## Lógica de vigencia

```
ano_ingreso = parseInt(l.ano) || AÑO_ACTUAL
vence       = ano_ingreso + 2
vigente     = AÑO_ACTUAL <= vence
```

El carnet muestra en el bloque inferior:
- Fondo **verde** (o color configurado) con "VIGENTE" si `vigente === true`
- Fondo **rojo** con "VENCIDO" si `vigente === false`

---

## Lógica de importación Excel/CSV

```
Archivo → FileReader / PapaParse
    │
    ▼
Normalizar encabezados (sin tildes, lowercase, sin espacios)
    │
    ▼
Por cada fila:
  - Extraer campos con gf() (tolera múltiples nombres de columna)
  - Si !nombre || !documento → skip
  - Buscar programa en PROGS con normMatch() → warn si no coincide
  - Construir objeto { id, nombre, documento, rh, programa, ficha, ano, foto:null }
    │
    ▼
learners = [...learners, ...mapped]
applyFilter()
toast(resumen)
```

---

## Lógica de asociación de fotos masivas

```
Por cada archivo imagen:
  doc = nombre_archivo.replace(extensión, '')
  idx = learners.findIndex(l => l.documento === doc)
  si idx >= 0:
    learners[idx].foto = FileReader.readAsDataURL(archivo)
    rTable()
```

El nombre del archivo debe ser **exactamente** el número de documento (solo dígitos), sin prefijos ni sufijos.
