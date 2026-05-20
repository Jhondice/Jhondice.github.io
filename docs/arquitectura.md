# Arquitectura del Proyecto

## Filosofía de diseño

El proyecto es una aplicación web **completamente estática** (HTML + CSS + JavaScript vanilla).
No usa frameworks, bundlers ni transpiladores. La elección deliberada de no migrar a React, Vue
o TypeScript preserva la fidelidad funcional y elimina cualquier riesgo de regresión.

Los módulos se cargan como scripts individuales en `index.html` en orden de dependencia.
No se usa `import/export` de ES Modules para maximizar la compatibilidad con entornos locales
sin servidor HTTPS.

---

## Capas de la arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│         (estructura HTML + carga de scripts)         │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │          CSS (6 archivos)    │
        │  base · layout · components  │
        │  carnet · modal · responsive │
        └──────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  config/ (estático)                  │
│           constants.js · programs.js                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   state.js                           │
│   learners · fil · sel · cfg · uid · fProg · fFich  │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │          utils/              │
        │  dom · format · normalize    │
        │  validators · barcode        │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │          render/             │
        │  carnet · table · list       │
        │  preview · info · design     │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │          services/           │
        │  import · image · export     │
        │  pdf · print                 │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │          features/           │
        │  filters · modal · learners  │
        │  design · template · nav     │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │            app.js            │
        │   (inicialización y arranque)│
        └──────────────────────────────┘
```

---

## Estado global (`state.js`)

Todo el estado mutable compartido vive en `state.js`. Los módulos leen y escriben directamente
sobre estas variables porque JavaScript en el browser comparte el scope global al cargar scripts
sin módulos ES.

| Variable   | Tipo       | Descripción                                      |
|------------|------------|--------------------------------------------------|
| `learners` | `Object[]` | Lista maestra de aprendices                      |
| `fil`      | `Object[]` | Subconjunto filtrado de `learners`               |
| `sel`      | `number`   | Índice del aprendiz seleccionado en `fil`        |
| `eid`      | `number\|null` | ID en edición dentro del modal              |
| `cfg`      | `Object`   | Config visual: `{ on: bool, color: string }`     |
| `uid`      | `number`   | Contador incremental de IDs únicos               |
| `fProg`    | `string`   | Filtro activo de programa (`''` = todos)         |
| `fFich`    | `string`   | Filtro activo de ficha (`''` = todas)            |
| `logoSrc`  | `string`   | URL/dataURL del logo institucional               |
| `logoLoaded` | `boolean` | Si el logo se cargó correctamente               |

---

## Ciclo de actualización de vistas

El sistema sigue un patrón simple de **re-render directo**:

1. Una acción del usuario modifica `learners`, `cfg`, `fProg` o `fFich`
2. Se llama a `applyFilter()` que recalcula `fil` y llama a `rTable()`
3. Si el tab Carnets está visible, se llama también a `rList()`, `rBig()`, `rThumbs()`
4. El tab Diseño llama a `rDesign()` al activarse o cuando cambia `cfg`

No existe reactividad automática ni Virtual DOM. Cada función de render regenera el innerHTML
completo de su contenedor.

---

## Generación del carnet (`mkCarnet`)

El carnet es HTML puro con **estilos inline** escalables mediante el factor `sc` (escala).

La misma función `mkCarnet` sirve para:
- Vista previa en tab Diseño (escala 1.88)
- Vista grande en tab Carnets (escala 1.88)
- Miniatura en cuadrícula (escala 0.52)
- Vista previa en modal de edición (escala 0.55)
- Impresión en ventana emergente (escala 1, `isPrint=true`)
- Captura para PDF (escala 3.937 ≈ 300 DPI)

El parámetro `isPrint=true` elimina sombras y bordes redondeados para obtener un carnet limpio.

---

## Carga diferida de jsPDF y html2canvas

Estas librerías (~800 KB combinadas) **no se cargan al iniciar** la aplicación.
Se inyectan dinámicamente la primera vez que el usuario solicita exportar a PDF,
desde `js/services/pdf.service.js → ensureLibs()`.

Esto mejora significativamente el tiempo de carga inicial.
