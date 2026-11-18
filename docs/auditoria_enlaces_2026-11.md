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

---

# PIIT Segovia V6 - 2026: verificación de 18 parámetros (17-nov-2026)

| # | Parámetro | Estado | Detalle |
|---|---|---|---|
| 1 | Política de privacidad | Cumple | `public/politica-privacidad.html` v1.1: ahora describe cookies necesarias y analítica opcional con consentimiento. Borrador pendiente de revisión jurídica |
| 2 | Términos y condiciones | Cumple | `public/terminos-condiciones.html`, enlazado en pie y login |
| 3 | API y secretos | Cumple | Sin claves ni tokens en archivos versionados; `.env*` solo con valores públicos; `.gitignore` bloquea `.env.*.local`, `.pem`, `.key`; el build de producción no contiene credenciales demo. La sesión es solo del navegador (limitación documentada) |
| 4 | Forzar HTTPS | Parcial | Redirección a https en las 4 páginas HTML (salvo localhost) y cabecera HSTS en `public/_headers`. **La redirección del servidor y HSTS dependen del hosting**: confirmar que lo aplica |
| 5 | Aviso de cookies | Cumple | Aviso con «Solo necesarias» y «Aceptar analítica» (mismo peso), se puede reabrir desde «Configurar cookies» en el pie; la decisión se guarda en el navegador |
| 6 | Metadescripciones | Cumple | Descripción única en plataforma, acceso, legales y 404 |
| 7 | Vista previa al compartir | Cumple | Open Graph + Twitter Card con `assets/og-piit.jpg` (800×419). Para que las redes la lean, la URL de la imagen debe ser absoluta en producción: definir el dominio |
| 8 | Favicon | Cumple | `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon` 180 px, íconos 192/512 en el manifest |
| 9 | sitemap y robots.txt | Cumple | Generados por `scripts/gen-sitemap.mjs` antes de cada build. **Dominio por defecto supuesto (`jpangel8.github.io/segovia-piit`)**: ejecutar con `SITE_URL=https://su-dominio` |
| 10 | ALT en imágenes | Cumple | 0 imágenes sin `alt`; 0 botones sin nombre; 0 campos sin etiqueta (etiquetas automáticas añadidas) |
| 11 | Velocidad de carga | Aceptable | HTML de 1,05 MB (270 KB gzip, 205 KB brotli). En local: primer contenido 92 ms, carga total 166 ms. Se eliminó una carga duplicada de la fuente Inter. Pendiente (no se hizo, riesgo visual): dividir el archivo único y reducir familias tipográficas |
| 12 | Contraste de color | Mejorado | Texto bajo 4,5:1: de 22,6 % a ~8 % de los textos medidos (los restantes están sobre fondos con imagen o mapa, que la medición automática no resuelve). Ajustados grises, ámbar, verde y amarillo de texto |
| 13 | Web en móvil | Cumple | 375 px sin desbordes en las 17 secciones; CTA a ancho completo |
| 14 | Página 404 | Cumple | `public/404.html` con salida a la plataforma y al portal. En desarrollo, Vite devuelve la app para rutas desconocidas; la 404 real la sirve el hosting |
| 15 | Enlaces rotos | Cumple con 2 excepciones | 30 de 33 URLs externas responden; `terridata.dnp.gov.co` y `portal.gestiondelriesgo.gov.co` no conectan desde esta red; 0 anclas rotas y 0 secciones inexistentes |
| 16 | Validación de formularios | Cumple | Reporte: celular de 10 dígitos que empieza por 3, nombre ≥ 3 letras, correo con formato, descripción ≥ 10 caracteres; mensajes en línea (sin `alert`) con `role="alert"`; aviso de que el reporte no se transmite a la Alcaldía |
| 17 | Analytics GA4 | Listo, sin ID | Se carga solo con consentimiento y con un ID válido (`<meta name="piit-ga4" content="G-XXXXXXXXXX">`). **Falta el ID de medición de la Alcaldía**; sin él no se carga nada |
| 18 | (no indicado) | n/a | La lista recibida salta del 17 al 19 |
| 19 | CTA claro | Cumple | Dos botones en el encabezado: «Explorar el mapa territorial» y «Reportar un problema» |

Cambio de nombre: la plataforma pasa a **PIIT Segovia V6 - 2026** (título, insignia, pie, exportaciones, manifest). El archivo ahora es `public/piit-v6.html`; `piit-v5.html` queda como redirección.

Nota: `scripts/inject-auth.mjs` es un generador antiguo que escribe `public/piit-v5.html`; no debe ejecutarse (sobrescribiría la redirección con una versión obsoleta).

---

# Alineación con owid-grapher (17-nov-2026)

Referencia: `github.com/owid/owid-grapher`, paquete `@ourworldindata/grapher/src` (valores leídos del código fuente).

| Elemento | owid-grapher | PIIT V6 | Estado |
|---|---|---|---|
| Tipografía del gráfico | Lato (`SVG_FONT_FAMILY`) | Lato en ejes, leyendas, tooltips y tablas | Alineado |
| Títulos | Playfair Display 600 | Playfair Display 600 en títulos de gráficas | Alineado |
| Texto de ejes | `#5b5b5b` (`GRAPHER_DARK_TEXT`) | `#5b5b5b` | Alineado |
| Rejilla horizontal | `#ddd`, guiones `4,4` | `#ddd`, guiones `4,4` en 15 de 15 gráficas con ejes | Alineado |
| Eje X | línea `#ccc`, marcas `#999` de 5 px | igual | Alineado |
| Grosor de línea / puntos | 1,5 / radio 1,8 | 1,5 / radio 1,8, sin suavizado | Alineado |
| Tooltip | blanco, borde `#e7e7e7`, radio 4, título 14 px negrita | igual | Alineado, excepto la sombra (Chart.js no la admite sin tooltip externo) |
| Paleta de series | OWID Distinct (`#4c6a9c`, `#b13507`, `#996d39`, `#2c8465`, `#6d3e91`…) | aplicada en ICV, SIVIGILA y K-Means | Parcial: las demás gráficas conservan colores institucionales/semánticos (semáforos, fuentes) para no cambiar su significado |
| Tabla | cabecera `#f7f7f7` negrita, celdas `8px 16px`, números a la derecha, filas pares `#f7f7f7`, hover `#f0f0f0` | igual | Alineado |
| Pie de gráfico | Fuente, nota, licencia CC BY, acciones | Fuente, nota y acciones | Parcial: no se declara CC BY porque las fuentes tienen licencias distintas |
| Pestañas Gráfico/Tabla/Mapa | Chart / Table / Map | Gráfico / Tabla (sin pestaña Mapa en las gráficas) | Parcial |

No verificado en el repositorio (no se pudo leer): tamaño exacto de los ticks, opacidad de barras no resaltadas, etiquetas de botones de acción y SCSS global de variables.

## Revisión gráfica por gráfica (17-nov-2026)

Se inventariaron 32 gráficas Chart.js (más las diferidas de Salud/SISPRO) y se comprobó en cada una: rejilla del eje de valores `#ddd` con guiones `4,4`, eje de categorías sin rejilla con línea `#ccc`, ticks `#5b5b5b`, líneas de 1,5 px sin suavizado, barras sin radio y paleta.

Desviaciones encontradas y corregidas: rejilla vertical residual en ejes de categoría (varias gráficas), barras horizontales sin rejilla guionada en el eje de valores, colores de ticks propios (`#8A9E96`, `#43594E`, `#5A7268`), líneas de 2 a 3,4 px, marcadores de 3 a 4 px, radar con rejilla distinta y resalte de la gráfica ICV (3,4 px; ahora 2 px, con series atenuadas a 1 px y opacidad 0,5 como `LINE_STYLE` de owid-grapher).

Paleta OWID Distinct aplicada a 25 gráficas categóricas. Conservan colores semánticos: Sisbén (grupos), ejecución presupuestal, cobertura (semáforo), estado vial, vulnerabilidad, comparativo de barrios, histórico SIG y la serie de permutaciones de Moran.

## Ejecución fiscal por año (17-nov-2026)

Una sola fuente de datos por año (`presupuesto.datos(año)` en `public/piit-v6.html`) alimenta el selector de años del panel y el de la sección Ejecución fiscal (comparten estado), el título, las 4 tarjetas, las barras por secretaría, las fuentes de financiación y los proyectos SGR. Solo 2026 tiene datos; 2024, 2025 y 2027 muestran un aviso hasta que se carguen. No se encontró un informe público de ejecución presupuestal de Segovia para 2024 o 2025 (búsqueda del 17-nov-2026); la fuente natural es el reporte de la Secretaría de Hacienda / FUT.

Para cargar un año: `presupuesto.OTROS_ANIOS[2025] = { secs, kpi, ingresos, sgr }` con la misma forma que 2026.

---

# Verificación del ICV y buque de auto verificación (17-nov-2026)

**Hallazgos del ICV.** (1) No existe una serie oficial del ICV de Segovia: es un índice interno. (2) Hay cuatro valores distintos para 2024: panel 72, módulo Calidad de Vida 72, serie histórica 59 (2025 = 62) y promedio ponderado de los barrios 61,1 (diferencia máxima 13 puntos). (3) Dos fórmulas con el mismo nombre: Salud 30 % + Educación 30 % + Vivienda 20 % + Seguridad 20 % (módulo) frente a Infraestructura 30 % + Social 25 % + Servicios 25 % + Población 20 % (barrios). (4) «Antioquia 78 · Nacional 74 · Meta PDM 79» no cita fuente. No se modificaron cifras del ICV porque no hay referencia oficial para elegir cuál es la correcta.

**Buque «Verificación automática de datos»** (sección Fuentes de datos, `PIITVerif` en `public/piit-v6.html`): ~20 comprobaciones (población vs DANE PPED, coherencia del ICV y de las fórmulas, Sisbén A+B entre tablas, enlace mapa-indicadores-Sisbén, vigencia de cada fuente, ejecución por año, servicios en vivo). Corre al abrir la sección y cada 30 minutos; botón «Verificar ahora», «Aplicar correcciones oficiales» (solo cifras con referencia oficial, hoy la población) e «Informe CSV». Para actualizar la referencia cuando el DANE publique una nueva serie, editar `DANE_PPED.anios`.

## Resolución de las 3 incoherencias (17-nov-2026)

1. **ICV con cuatro valores (72 / 72 / 59 / 61,1) y 2. dos fórmulas.** Se adoptó una sola definición, calculada con los datos de los 21 barrios: ICV barrio = 0,30 Infraestructura + 0,25 Social + 0,25 Servicios + 0,20 Población; ICV municipal = promedio ponderado por población = **61** (2024). Panel, módulo Calidad de Vida, barra, cuatro componentes (64 / 64 / 62 / 53), radar (promedio municipal y barrios de mayor y menor ICV) y el punto 2024 de la serie histórica leen del mismo cálculo (`PIIT.icv`). Se retiraron las series sin fuente (radar 2022 y Antioquia 2024, «Antioquia 78 · Nacional 74 · Meta PDM 79»). Pendiente: los años 2019-2023 y 2025 de la serie y los escenarios ICV 2030 (79 / 85 / 72) siguen sin fuente verificable y fueron construidos sobre la base anterior (72).
3. **Sisbén A+B en dos tablas.** El arreglo heredado `DATA.SISBEN` (8 de 21 barrios, sin uso y con cifras distintas) se eliminó; todo lee de `DATA.INDICADORES`. Las cifras siguen sin validar por la Oficina del Sisbén.

## Verificación de la fuente oficial del Sisbén (17-nov-2026)

**Fuente oficial pública:** DNP, muestra anonimizada del Sisbén IV, corte marzo 2022, en datos.gov.co (`hq2v-5umk` personas, `ab8a-uwf7` hogares, `np8m-kdhq` vivienda; licencia CC BY-SA 4.0; muestreo probabilístico estratificado, error relativo ≈ 5 %). Trae código de municipio, grupo A-D y zona; **no trae barrio ni vereda**. `sisben.gov.co` y `anda.dnp.gov.co` no respondieron desde esta red.

**Segovia (05736), hogares:** A 2.275 · B 4.770 · C 3.935 · D 1.110 (total 12.091; A+B = **58,3 %**; cabecera 56,2 %). **Personas:** A 9.420 · B 15.082 · C 9.772 · D 1.670 (A+B = **68,2 %**; cabecera 65,7 %).

**Contraste con la plataforma:** los 21 barrios promedian 36,6 % en A+B (ponderado por hogares), unos 22 puntos por debajo de la cifra oficial; los hogares de los barrios suman 8.434 frente a 9.851 de la cabecera oficial. Los perfiles por barrio (distribución A/B/C/D, puntaje) son derivados de forma determinista, no datos del Sisbén. El Sisbén IV clasifica por grupos, no por puntaje.

**Cambios:** el KPI «Hogares grupo A+B» usa la cifra oficial (58 %), con nota visible sobre la fuente y los límites; el «puntaje» se rotuló como estimación interna; el buque de verificación compara en vivo con el DNP. Para cifras por barrio hay que solicitar la base certificada a la Oficina del Sisbén.

## Tarjeta «Inversión pública 2026» del encabezado (17-nov-2026)

Verificada contra SECOP II (datos.gov.co `jbjy-vk9h`, proveedor EDURSEG NIT 901989964, entidades «SEGOVIA»): 32 contratos en total ($98.090M); con inicio en 2025: 18 ($66.089M); con inicio en 2026: **12 ($30.422M)**. La tarjeta decía «$61.932M · 18 proyectos», que no coincide con ninguna combinación (18 es el conteo de 2025). Ahora se llama «Contratos EDURSEG 2026», se actualiza en vivo desde SECOP II y el buque de verificación la compara. Es contratación de EDURSEG, no la inversión pública total del municipio. Las 6 tarjetas del encabezado pasaron a una cuadrícula de 6 columnas (3 y 2 en pantallas menores).

## Capa de datos en vivo con ciclo automático (18-nov-2026)

`PIITLive` (en `public/piit-v6.html`) consulta fuentes oficiales al abrir la plataforma y las repite cada 30 minutos mientras la página está visible; si una consulta falla conserva la última cifra y registra el error (visible en el buque «Verificación automática de datos»). Fuentes conectadas: **SECOP II** (tarjeta «Contratos EDURSEG»: 12 contratos, $30.422M en 2026), **DNP** (Sisbén IV A+B: 58,3 % de hogares, 68,2 % de personas) y **ADRES BDUA** (afiliados activos de Segovia: 44.085, contributivo 13.660 y subsidiado 30.425; la tabla y las gráficas de EPS se rehacen con los datos oficiales). Para agregar otra fuente: `PIITLive.registrar(id, nombre, funciónQueDevuelveUnaPromesa)`.

Correcciones derivadas: el módulo de aseguramiento mostraba 37.185 afiliados (8.215 contributivo / 28.970 subsidiado) y una tabla de EPS con cifras propias (Savia Salud 18.420, Mutualser 4.290…); la BDUA oficial da Coosalud 19.291, Nueva EPS 15.713 y Savia Salud 9.075, y no incluye Mutualser. «Población total proyectada 40.247 (DANE 2024)» era incorrecta: el DANE da 39.116 (2024) y 39.549 (2026). El total de afiliados BDUA supera la proyección DANE en un 11 %: no son cifras comparables como «cobertura».

Fuentes sin ciclo automático (sin API consultable desde el navegador): DANE PPED (archivo Excel), geoportales DANE e IGAC (CORS).

## Mapa de amenazas y mapas base (18-nov-2026)

**Mapas base de CARTO:** los teselas `basemaps.cartocdn.com` (voyager y dark_all) ahora responden una imagen con la marca «API KEY REQUIRED» (el servidor entrega un PNG de ~2 KB). Se sustituyeron por Esri (Canvas World Dark Gray en el mapa SIG; el mapa de amenazas ya no usa mapa base por defecto y ofrece Esri Light Gray opcional).

**Mapa de amenazas rediseñado** (sección Gestión del Riesgo, `PIITRiesgoMapa`), con la interacción del visor 2D de referencia (gentrificacionmadrid.netlify.app: mapa SVG de coropletas sin mapa base, selector de capa, leyenda flotante, zoom, buscador, ranking y ficha): coropleta de los 21 barrios (IGAC) con 11 capas seleccionables (vulnerabilidad = 100 − ICV, ICV, infraestructura, social, servicios, población, Sisbén A+B estimado, acueducto, energía, reportes y habitantes), leyenda flotante, zoom +/−, «Casco» y «Todo», panel «Elige un barrio» con ranking ordenado y buscador, ficha por barrio, zonas de amenaza activables, mapa base opcional, descarga CSV y enlace con el estado (`g_riesgo`). No se replicó la vista 3D.

**Aviso:** las zonas de amenaza (inundación, movimiento en masa, incendio, avenida torrencial) son polígonos esquemáticos colocados a mano, no cartografía del SGC ni del IDEAM; y las probabilidades del «Inventario de amenazas» tampoco tienen fuente verificable.
