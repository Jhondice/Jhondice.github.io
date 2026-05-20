# Librerías de terceros (vendors)

Este proyecto usa las siguientes librerías externas cargadas desde CDN.
No se incluyen archivos locales en esta carpeta — se usan directamente desde `cdnjs.cloudflare.com`.

## Librerías cargadas en `index.html` (siempre presentes)

| Librería   | Versión | CDN URL                                                           | Uso                                   |
|------------|---------|-------------------------------------------------------------------|---------------------------------------|
| PapaParse  | 5.4.1   | `cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js` | Parsing de archivos CSV               |
| SheetJS    | 0.18.5  | `cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`     | Lectura/escritura de archivos Excel   |

## Librerías cargadas de forma diferida (solo al exportar PDF)

| Librería     | Versión | CDN URL                                                                  | Uso                           |
|--------------|---------|--------------------------------------------------------------------------|-------------------------------|
| jsPDF        | 2.5.1   | `cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`           | Generación del archivo PDF    |
| html2canvas  | 1.4.1   | `cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`   | Captura del DOM como imagen   |

> **Nota:** jsPDF y html2canvas se inyectan dinámicamente la primera vez que el usuario hace clic
> en "PDF actual" o "Exportar todos PDF". Esto evita cargarlas en el arranque inicial.

## Uso offline / intranet

Si el proyecto debe funcionar sin acceso a Internet, descarga manualmente estas librerías
y reemplaza las URLs en `index.html` y en `js/services/pdf.service.js` por rutas locales,
por ejemplo `js/vendors/papaparse.min.js`.
