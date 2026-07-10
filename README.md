# PIIT Segovia — Plataforma Integral de Inteligencia Territorial

SPA de un solo archivo (`public/piit-v5.html`) que integra SIG municipal, dashboard de indicadores y módulos sectoriales (salud, contratación, SISBEN, gestión del riesgo, planeación estratégica) para el municipio de Segovia, Antioquia. Sin backend propio: consume directamente desde el navegador los servicios OGC/API oficiales (WMS IGAC/DANE/INVIAS/SGC/PNN, SECOP II).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/piit-v5.html` en el navegador.

```bash
npm run build      # build de producción a dist/
npm run preview    # sirve el build de producción localmente
```

## Notas conocidas del entorno de desarrollo

### "Preview only supports localhost URLs"

Si al probar la plataforma dentro de un panel de vista previa embebido (por ejemplo, el panel de preview de un asistente de desarrollo o de un IDE) aparece el aviso:

> Link to `xxx.gov.co` was blocked. Preview only supports localhost URLs. Right-click the link to open it in your browser.

**Esto no es un defecto de PIIT.** Es una restricción de seguridad propia de ese panel de vista previa embebido (un WebView en sandbox que solo permite navegar dentro de `localhost`), que intercepta cualquier enlace externo antes de que se resuelva. Diagnóstico completo:

- No proviene de VS Code, Dev Containers, Codespaces, CORS ni de ninguna política CSP del proyecto — el archivo no define CSP, y `vite.config.js` no añade cabeceras de seguridad.
- Todos los enlaces externos de la plataforma (SIVIGILA, SISPRO, MinSalud, IDEAM, SGC, UNGRD, SIATA, SIMMA, SECOP II, DANE, DNP Terridata, IGAC) usan correctamente `target="_blank" rel="noopener noreferrer"`.
- **Para verificar el comportamiento real**, abre la plataforma en un navegador normal (`npm run dev` y visita `http://localhost:5173/piit-v5.html` desde Chrome/Edge/Firefox directamente, no desde el panel embebido) o haz clic derecho sobre el enlace → "Abrir en el navegador", como indica el propio aviso.

No se debe intentar "corregir" este aviso modificando CSP, agregando `window.open()`, o migrando a componentes `Link` de un framework — ninguno de esos cambios tiene efecto sobre una restricción del panel de vista previa, y podrían romper la integración real con los servicios WMS/SECOP.

## Arquitectura

- **Sin backend propio.** Todo el código vive en `public/piit-v5.html`; los datos estáticos (indicadores por barrio, proyectos PDM) están embebidos como objetos JavaScript.
- **Capas geoespaciales**: Leaflet 1.9 + gestor de capas propio (`LayerManager`) con reordenamiento por arrastre, opacidad y bloqueo por capa.
- **Resiliencia de servicios WMS**: motor propio (`GeoHealth`) con failover entre fuentes alternas y revalidación periódica.
- **Contratación pública**: sincronización en vivo con la API de SECOP II (Socrata) cada 2 minutos.

Para un análisis técnico completo de tipología, arquitectura y hoja de ruta (qué está implementado vs. qué es evolución futura — PostGIS, GeoServer, IA/ML, Gemelo Digital, IoT), ver `informe_tecnico_piit.html`.

## Estructura del repositorio

```
public/piit-v5.html   → la plataforma completa (único archivo real en producción)
src/                   → scaffold Vue/JS sin usar, no referenciado por la plataforma real
docs/                   → informes técnicos generados
```
