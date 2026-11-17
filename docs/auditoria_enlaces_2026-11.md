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

## Riesgos de la auditoría: resueltos

- **Imágenes ajenas hotlinkeadas** (2 miniaturas de Google y 1 de una tienda, `app.redecom.co`): eliminadas. Estaban bajo un velo de color al 88 %, así que casi no se veían.
- **Logo oficial**: copia local en `public/assets/logo-alcaldia-segovia.png` (PNG 300×100, 9,5 KB, descargado de `segovia-antioquia.gov.co`).
- **Integridad de recursos externos (SRI)**: Leaflet, Chart.js, Font Awesome y la hoja de Leaflet ahora llevan `integrity` (sha384 calculado sobre el archivo real) y `crossorigin`.
- Pendiente de la fuente: el WMS de Agrología de IGAC tarda ~47 s en responder `GetCapabilities`.

---

# Auditoría de seguridad: secretos y credenciales

## Secretos y claves API

- **Sin hallazgos.** Búsqueda en todos los archivos versionados de patrones de claves (AWS, Google, GitHub, Slack, OpenAI, JWT, llaves privadas) y de asignaciones tipo `api_key/secret/password/token`: ninguna coincidencia.
- Los cuatro `.env*` versionados contienen solo configuración pública (`VITE_APP_NAME`, `VITE_API_URL`, banderas de depuración). Las variables `VITE_*` terminan en el navegador, por lo que **nunca** deben contener secretos. Se reforzó `.gitignore` (`.env.*.local`, `.env.secret`, `*.pem`, `*.key`, `*.p12`).
- La plataforma no usa claves de API propias: consume servicios públicos sin autenticación.

## Hallazgos de autenticación (`src/services/auth-service.js`) y corrección

| # | Hallazgo | Severidad | Corrección |
|---|---|---|---|
| 1 | Administrador por defecto `admin@piit.dev` / `admin123` en el código **y mostrado en la pantalla de login** | Crítica | Solo se crea y se muestra en desarrollo (`import.meta.env.DEV`). Verificado: el build de producción no contiene ni el correo ni la clave |
| 2 | Contraseñas con un hash propio de 32 bits (reversible por fuerza bruta en milisegundos) | Alta | PBKDF2-SHA256, 210 000 iteraciones, sal aleatoria de 16 bytes. Las cuentas antiguas se migran solas en el siguiente ingreso correcto (verificado) |
| 3 | `register()` aceptaba el parámetro `role` → cualquiera podía crearse como administrador | Alta | El rol solo lo asigna un administrador autenticado; por defecto `user` |
| 4 | `getAllUsers`, `deleteUser` y `updateRole` sin verificación de rol | Alta | Exigen rol de administrador; roles válidos limitados a `admin`/`user` |
| 5 | Sin freno a intentos repetidos; contraseña mínima de 6 | Media | Bloqueo de 60 s tras 5 fallos; mínimo 8 caracteres; mensaje uniforme que no revela si el correo existe |
| 6 | Sesión = JSON en base64 **sin firma**, y los usuarios viven en `localStorage` | Estructural | **No se puede resolver sin servidor.** Quien tenga acceso al navegador puede fabricar una sesión. Documentado en el código y en la política de privacidad |

## Limitación que debes conocer

Mientras PIIT sea una aplicación estática, el inicio de sesión **no es una barrera de seguridad real**. No publiques información reservada en ella. Protegerla exige autenticación en servidor (contraseñas con bcrypt/argon2, JWT firmado o cookie HttpOnly) y que los datos viajen solo tras validar la sesión en el servidor.

## Documentos legales

- `public/politica-privacidad.html`: política de privacidad y tratamiento de datos (Ley 1581 de 2012, Decreto 1377 de 2013, Ley 1712 de 2014), descrita según los datos que la plataforma realmente trata.
- `public/terminos-condiciones.html`: términos y condiciones de uso.
- Ambos están enlazados desde el pie de la plataforma y desde la pantalla de acceso. Son **borradores** que deben ser revisados y aprobados por la Oficina Jurídica de la Alcaldía.

---

# Actualización de datos oficiales (17-nov-2026)

**Fuente:** DANE, Proyecciones de población y estudios demográficos, serie municipal por área 2018-2042 (base CNPV 2018), publicada 8-ago-2025. Archivo `PPED-AreaMun-2018-2042_VP.xlsx`, hoja `PobMunicipalxÁrea`, DIVIPOLA 05736 (Segovia).

| Año | Cabecera | Centros poblados y rural disperso | Total |
|---|---|---|---|
| 2018 | 30.128 | 7.772 | 37.900 |
| 2024 | 31.846 | 7.270 | 39.116 |
| 2025 | 32.112 | 7.231 | 39.343 |
| 2026 | 32.366 | 7.183 | **39.549** |

**Corregido en la plataforma:** población 2026 de 41.222 a 39.549 (en 4 lugares), variación +1,5 % a +1,1 % frente a 2024, base de los escenarios (2024 = 39.116) y densidad 33,1 a 31,8 hab/km² (misma superficie implícita).

**No se pudo actualizar (sin fuente oficial accesible):**
- Sisbén: `sisben.gov.co` no resolvió (DNS) y datos.gov.co no tiene un conjunto de Segovia. Las cifras por barrio siguen siendo estimaciones internas; hay un conflicto interno sin resolver (Sisbén A+B de GALÁN: 71 % en Análisis frente a 51 % en la tarjeta Sisbén). Se requiere el reporte de la Oficina del Sisbén de la Alcaldía.
- Valores por barrio de población, índices, coberturas y reportes: el DANE no los publica a ese nivel. Los 21 barrios suman 32.090, coherente con la cabecera oficial (32.366).
