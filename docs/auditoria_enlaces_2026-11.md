# Auditoría de enlaces externos · PIIT Segovia v5

Fecha: 16-nov-2026 · Archivo auditado: `public/piit-v5.html` · 62 URLs únicas verificadas con `curl` (User-Agent de navegador, reintentos y, para WMS, `GetCapabilities` real).

## Resultado

De las 62 URLs, las que no aparecen en las tablas siguientes respondieron correctamente (HTTP 200). Los problemas reales se agrupan así: reparados, rotos sin reemplazo verificado, no verificables desde esta red y falsos positivos.

## Reparados

| Enlace | Problema | Reparación |
|---|---|---|
| `ins.gov.co/Paginas/informe-de-evento.aspx` | HTTP 404 | Apunta al buscador de eventos vigente: `ins.gov.co/buscador-eventos/SitePages/BusquedaEventos.aspx` (200) |
| `www.siata.gov.co` | Redirige | Enlace directo: `siata.gov.co/siata_nuevo/` (200) |
| IGAC `…/carto/mapa_referencia_nacional100k/…WMSServer` | El servicio ya no existe ("Service not found") | Reemplazado por `carto25000colombia2017` vía ArcGIS `/export` (el servicio puede responder 503 por momentos; la capa avisa al usuario) |
| IGAC `…/catastro/direccionesterritorialesigac/…WMSServer` | HTTP 400: el servicio no tiene extensión WMS | Cambiado a ArcGIS `/export` (verificado: devuelve imagen 256×256) |

Además se retiró la capa "Límites IGAC" (`territorioscedidosporcolombia`): responde HTTP 500 de forma persistente y trata territorios cedidos por Colombia, sin relación con Segovia.

## Rotos sin reemplazo oficial verificado

| Enlace | Causa | Estado en la plataforma |
|---|---|---|
| `hermes.invias.gov.co/arcgis/…/Mapa_Carreteras/RedVial` | El host ya no resuelve en DNS. `hermes2.invias.gov.co` existe pero es solo un sitio web, sin ArcGIS REST | Tarjeta de fuente marcada "Servicio no disponible (host retirado)" |
| `mapas.parquesnacionales.gov.co/…/Limites_oficiales_Poligono` | HTTP 525 (fallo SSL en el origen) | Sin cambio: la tarjeta ya se había retirado por no aplicar a Segovia |
| `mapas.parquesnacionales.gov.co/…/runap` | HTTP 525 | Ídem |
| `datos.gov.co` (Socrata) | No está roto: responde en ~2 s (los fallos iniciales eran lentitud) | Sin cambio |

## No verificables desde esta red

`terridata.dnp.gov.co` y `portal.gestiondelriesgo.gov.co` no conectan (timeout) desde donde se hizo la auditoría; es habitual en sitios `.gov.co` con restricción geográfica. Verifícalos desde un navegador en Colombia.

## Falsos positivos descartados

- `community.secop.gov.co/…` devuelve la página del reCAPTCHA de SECOP (200): es el comportamiento normal de ese portal.
- `sgc.gov.co` responde 403 con clientes simples y 200 con un navegador.
- `fonts.googleapis.com/` (raíz) devuelve 404; solo se usa como `preconnect`.
- Los WMS de IGAC probados sin `?SERVICE=WMS&REQUEST=GetCapabilities` devuelven 400/200 engañosos; se revalidaron con parámetros.

## Riesgos que no son enlaces rotos (recomendación)

- La página de prestadores usa tres imágenes de fondo "hotlinkeadas": dos miniaturas de Google (`encrypted-tbn0.gstatic.com`) y una imagen de una tienda ajena (`app.redecom.co`). Hoy cargan, pero las miniaturas de Google caducan y los derechos de uso no están claros. Conviene reemplazarlas por imágenes propias.
- El logo oficial se carga desde `segovia-antioquia.gov.co`. Si se prefiere independencia del portal, descargarlo al repositorio.
- El servicio WMS de Agrología de IGAC tarda ~47 s en responder `GetCapabilities`.
