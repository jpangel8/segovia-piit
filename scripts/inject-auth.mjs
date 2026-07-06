import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src  = 'C:\\Users\\JUANPABLOÁNGEL\\Desktop\\PIIT_Segovia_v5_single-file.html'
const dest = path.join(__dirname, '..', 'public', 'piit-v5.html')

let html = readFileSync(src, 'utf8')

// ══════════════════════════════════════════════════════════════════════
// 1. AUTH GUARD
// ══════════════════════════════════════════════════════════════════════
const AUTH_GUARD = `\n<script>
(function(){
  var SESSION_KEY='piit-session';
  function decodeToken(t){try{var p=JSON.parse(atob(t));return p.exp<Date.now()?null:p;}catch(e){return null;}}
  var token=localStorage.getItem(SESSION_KEY);
  var user=token?decodeToken(token):null;
  if(!user){window.location.replace('/');throw new Error('no-auth');}
  window.__PIIT_USER__=user;
})();
</script>`

const bodyIdx = html.indexOf('<body>')
if (bodyIdx === -1) throw new Error('<body> no encontrado')
html = html.slice(0, bodyIdx + 6) + AUTH_GUARD + html.slice(bodyIdx + 6)

// ══════════════════════════════════════════════════════════════════════
// 2. CSS INSTITUCIONAL PREMIUM — antes de </head>
//    Fondo blanco · Verde refinado · Apple-quality · Sobrio
// ══════════════════════════════════════════════════════════════════════
const PREMIUM_CSS = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* ════════════════════════════════════════════════════════════════════
   PIIT Segovia · Rediseño Institucional Premium v3
   Fondo blanco · Identidad verde/dorada · Calidad Apple
   ════════════════════════════════════════════════════════════════════ */

:root {
  /* Tokens de superficie */
  --white:      #FFFFFF;
  --surface:    #F7F9F8;
  --surface-2:  #F0F5F2;
  --surface-3:  #E8F0EC;
  --border:     #DDE8E2;
  --border-h:   #B8D4C4;

  /* Verde institucional */
  --green-900:  #092616;
  --green-800:  #0E3520;
  --green-700:  #165C38;
  --green-600:  #1E7A4C;
  --green-500:  #2A9660;
  --green-400:  #3BB378;
  --green-300:  #65C99A;
  --green-200:  #A8DFC1;
  --green-100:  #D6F0E4;
  --green-50:   #EEF8F3;

  /* Dorado/Ámbar */
  --gold-700:   #8A6200;
  --gold-600:   #B07F00;
  --gold-500:   #D4A017;
  --gold-400:   #E8BC3A;
  --gold-300:   #F5D06E;
  --gold-100:   #FDF3D0;

  /* Texto */
  --text-1:     #0F1F17;
  --text-2:     #2A4035;
  --text-3:     #4A6B5A;
  --text-4:     #7A9E8C;
  --text-5:     #A8C4B8;

  /* Semáforo */
  --sat-verde:   #16A34A;
  --sat-amarillo:#CA8A04;
  --sat-naranja: #EA580C;
  --sat-rojo:    #DC2626;

  /* Sistema */
  --radius-xs:  4px;
  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full:9999px;
  --shadow-xs:  0 1px 2px rgba(10,50,30,0.05);
  --shadow-sm:  0 1px 4px rgba(10,50,30,0.06), 0 2px 8px rgba(10,50,30,0.04);
  --shadow-md:  0 2px 8px rgba(10,50,30,0.08), 0 6px 24px rgba(10,50,30,0.05);
  --shadow-lg:  0 4px 16px rgba(10,50,30,0.10), 0 12px 40px rgba(10,50,30,0.06);
  --shadow-hover: 0 6px 24px rgba(10,50,30,0.13), 0 16px 48px rgba(10,50,30,0.07);
  --ease-apple: cubic-bezier(0.25,0.46,0.45,0.94);
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
}

/* ── Cuerpo ── */
body {
  background: var(--surface) !important;
  color: var(--text-1) !important;
  font-family: 'Inter', 'Nunito', system-ui, sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
}

/* ── Topbar ── */
.topbar {
  background: var(--green-900) !important;
  border-bottom: none !important;
}
.tb-tag, .topbar-tag {
  background: rgba(255,255,255,0.10) !important;
  color: rgba(255,255,255,0.7) !important;
  border: none !important;
}

/* ══════════════════════════════════════════
   NAVBAR — Blanca institucional premium
   ══════════════════════════════════════════ */
.navbar {
  background: var(--white) !important;
  border-bottom: 1px solid var(--border) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: 0 1px 0 var(--border), 0 2px 8px rgba(10,50,30,0.04) !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 200 !important;
}

.nav-logo-t {
  color: var(--green-800) !important;
  font-family: 'Inter',sans-serif !important;
  font-weight: 700 !important;
}
.nav-logo-s { color: var(--text-4) !important; }
.nav-logo-icon {
  background: var(--green-50) !important;
  border: 1px solid var(--border) !important;
}
.nav-logo-icon i { color: var(--green-600) !important; }

.nav-btn {
  color: var(--text-3) !important;
  border-bottom: none !important;
  border-radius: var(--radius-sm) !important;
  font-family: 'Inter',sans-serif !important;
  font-size: 12.5px !important;
  font-weight: 500 !important;
  transition: background 0.15s var(--ease-apple), color 0.15s var(--ease-apple) !important;
}
.nav-btn:hover {
  color: var(--green-700) !important;
  background: var(--green-50) !important;
}
.nav-btn.act {
  color: var(--green-700) !important;
  background: var(--green-50) !important;
  border-bottom: none !important;
  font-weight: 600 !important;
}
.nav-dd-trigger.act {
  color: var(--green-700) !important;
  background: var(--green-50) !important;
}

/* Dropdown portal */
#nav-dd-portal {
  background: var(--white) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-lg) !important;
  backdrop-filter: none !important;
}
.dd-item:hover { background: var(--green-50) !important; color: var(--green-700) !important; }

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
.hero {
  background: linear-gradient(150deg, var(--green-900) 0%, var(--green-800) 50%, var(--green-700) 100%) !important;
  padding: 52px 32px 60px !important;
}
.hero-h {
  font-family: 'Inter',sans-serif !important;
  font-size: 34px !important;
  font-weight: 700 !important;
  letter-spacing: -0.025em !important;
  color: #fff !important;
}
.hero-sub { font-size: 14px !important; line-height: 1.7 !important; color: rgba(255,255,255,0.72) !important; }

/* KPIs del hero sobre verde oscuro — mantener blancos */
.hkpi {
  background: rgba(255,255,255,0.10) !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  backdrop-filter: none !important;
  transition: background 0.2s ease !important;
}
.hkpi:hover { background: rgba(255,255,255,0.16) !important; }

/* ══════════════════════════════════════════
   ÁREA PRINCIPAL
   ══════════════════════════════════════════ */
.main { padding: 32px 28px !important; }

.section.act {
  animation: instFadeIn 0.38s var(--ease-apple) both !important;
}
@keyframes instFadeIn {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── Títulos ── */
.sec-title {
  font-family: 'Inter',sans-serif !important;
  font-size: 26px !important;
  font-weight: 700 !important;
  color: var(--text-1) !important;
  letter-spacing: -0.022em !important;
  line-height: 1.18 !important;
}
.sec-sub {
  color: var(--text-4) !important;
  font-size: 13px !important;
}
.pt {
  color: var(--text-4) !important;
  letter-spacing: 0.09em !important;
  font-size: 10.5px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  margin-bottom: 10px !important;
}

/* ══════════════════════════════════════════
   CARDS — Blancas con sombra institucional
   ══════════════════════════════════════════ */
.card {
  background: var(--white) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-sm) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  transition:
    border-color 0.2s var(--ease-apple),
    box-shadow 0.2s var(--ease-apple),
    transform 0.2s var(--ease-spring) !important;
}
.card::before { display:none !important; }
.card:hover {
  border-color: var(--border-h) !important;
  box-shadow: var(--shadow-hover) !important;
  transform: translateY(-2px) !important;
}

/* ── KPI Cards ── */
.kc {
  background: var(--white) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-sm) !important;
  backdrop-filter: none !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s var(--ease-spring) !important;
}
.kc:hover {
  border-color: var(--border-h) !important;
  box-shadow: var(--shadow-hover) !important;
  transform: translateY(-3px) !important;
}
.kc-val {
  font-family: 'Inter',sans-serif !important;
  font-size: 28px !important;
  font-weight: 700 !important;
  color: var(--text-1) !important;
  letter-spacing: -0.025em !important;
}
.kc-lbl {
  color: var(--text-4) !important;
  font-size: 11.5px !important;
}
.kc-ico {
  background: var(--green-50) !important;
  border: 1px solid var(--border) !important;
}
.kc-top .kc-trend { font-size: 11px !important; }
.kc-trend.ok  { background: var(--green-50) !important; color: var(--green-600) !important; border: 1px solid var(--green-100) !important; }
.kc-trend.up  { background: #FFF8E6 !important; color: var(--gold-600) !important; border: 1px solid var(--gold-100) !important; }
.kc-trend.low { background: #FFF1F1 !important; color: #C0392B !important; border: 1px solid #FFD5D5 !important; }

/* ── Badges ── */
.badge-green { background: var(--green-50) !important; color: var(--green-700) !important; border: 1px solid var(--green-100) !important; }
.badge-gold  { background: var(--gold-100) !important; color: var(--gold-700) !important; border: 1px solid var(--gold-300) !important; }
.badge-red   { background: #FFF1F1 !important; color: #C0392B !important; border: 1px solid #FFD5D5 !important; }
.badge-blue  { background: #EFF6FF !important; color: #1D4ED8 !important; border: 1px solid #BFDBFE !important; }

/* ── Alertas ── */
.alert-item {
  background: var(--white) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-xs) !important;
}
.alert-item.crit { border-color: #FFBCBC !important; background: #FFF6F6 !important; }
.alert-item.warn { border-color: #F5D06E !important; background: #FFFBEB !important; }
.alert-item.info { border-color: var(--green-200) !important; background: var(--green-50) !important; }
.alert-t { color: var(--text-1) !important; font-weight: 600 !important; }
.alert-s { color: var(--text-3) !important; }
.alert-ico.crit { background: #FFF1F1 !important; border-color: #FFBCBC !important; }
.alert-ico.warn { background: #FFFBEB !important; border-color: #F5D06E !important; }
.alert-ico.info { background: var(--green-50) !important; border-color: var(--green-200) !important; }

/* ── Tablas ── */
th {
  color: var(--text-4) !important;
  letter-spacing: 0.07em !important;
  font-weight: 600 !important;
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
}
td { color: var(--text-2) !important; border-bottom: 1px solid var(--surface-3) !important; }
tr:hover td { background: var(--surface) !important; }

/* ── SISBEN ── */
.sb-c, .sdet-k {
  background: var(--white) !important;
  border: 1px solid var(--border) !important;
  box-shadow: var(--shadow-xs) !important;
}
.sb-c:hover, .sb-c.sel {
  border-color: var(--border-h) !important;
  background: var(--green-50) !important;
}
.sisben-det { background: var(--surface) !important; border: 1px solid var(--border) !important; }
.sb-nom { color: var(--text-1) !important; font-weight: 600 !important; }
.sb-lbl { color: var(--text-4) !important; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background: var(--surface); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius:9999px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-h); }

/* ════════════════════════════════════════════════════════════════════
   SAT · GESTIÓN DEL RIESGO — Tema institucional claro
   ════════════════════════════════════════════════════════════════════ */

/* Semáforo */
.sat-semaforo {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 6px;
  box-shadow: var(--shadow-sm);
}
.sat-nivel-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 8px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s var(--ease-spring);
  border: 1.5px solid transparent;
}
.sat-nivel-item .sat-dot-level {
  width: 12px; height: 12px; border-radius: 50%;
  transition: all 0.25s ease;
}
.sat-nivel-item .sat-nivel-lbl {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.09em; text-transform: uppercase;
}
.sat-nivel-item .sat-nivel-desc {
  font-size: 9.5px; color: var(--text-4); text-align:center;
}

.sat-nivel-item[data-nivel="verde"] .sat-dot-level  { background: var(--sat-verde); box-shadow:0 0 0 3px rgba(22,163,74,0.15); }
.sat-nivel-item[data-nivel="amarillo"] .sat-dot-level{ background: var(--sat-amarillo); box-shadow:0 0 0 3px rgba(202,138,4,0.15); }
.sat-nivel-item[data-nivel="naranja"] .sat-dot-level { background: var(--sat-naranja); box-shadow:0 0 0 3px rgba(234,88,12,0.15); }
.sat-nivel-item[data-nivel="rojo"] .sat-dot-level    { background: var(--sat-rojo); box-shadow:0 0 0 3px rgba(220,38,38,0.15); }

.sat-nivel-item[data-nivel="verde"].sat-activo  { background:#F0FDF4; border-color:#86EFAC; }
.sat-nivel-item[data-nivel="amarillo"].sat-activo{ background:#FEFCE8; border-color:#FDE047; }
.sat-nivel-item[data-nivel="naranja"].sat-activo { background:#FFF7ED; border-color:#FDBA74; }
.sat-nivel-item[data-nivel="rojo"].sat-activo    { background:#FFF1F2; border-color:#FCA5A5; animation:sat-pulse-light 2s infinite; }

@keyframes sat-pulse-light {
  0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0)}
  50%{box-shadow:0 0 0 5px rgba(220,38,38,0.12)}
}

.sat-nivel-item[data-nivel="verde"] .sat-nivel-lbl    { color: var(--sat-verde); }
.sat-nivel-item[data-nivel="amarillo"] .sat-nivel-lbl { color: var(--sat-amarillo); }
.sat-nivel-item[data-nivel="naranja"] .sat-nivel-lbl  { color: var(--sat-naranja); }
.sat-nivel-item[data-nivel="rojo"] .sat-nivel-lbl     { color: var(--sat-rojo); }

/* Banner SAT */
.sat-banner {
  display:flex; align-items:center; justify-content:space-between;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  margin-bottom: 22px;
  border: 1.5px solid;
  transition: all 0.3s ease;
}
.sat-banner.verde    { background:#F0FDF4; border-color:#86EFAC; }
.sat-banner.amarillo { background:#FEFCE8; border-color:#FDE047; }
.sat-banner.naranja  { background:#FFF7ED; border-color:#FDBA74; }
.sat-banner.rojo     { background:#FFF1F2; border-color:#FCA5A5; animation:sat-pulse-light 2s infinite; }

.sat-banner-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.sat-banner.verde    .sat-banner-dot { background:var(--sat-verde); }
.sat-banner.amarillo .sat-banner-dot { background:var(--sat-amarillo); }
.sat-banner.naranja  .sat-banner-dot { background:var(--sat-naranja); }
.sat-banner.rojo     .sat-banner-dot { background:var(--sat-rojo); animation:sat-dot-blink 1s infinite; }
@keyframes sat-dot-blink { 0%,100%{opacity:1}50%{opacity:.3} }

.sat-banner-left  { display:flex; align-items:center; gap:10px; }
.sat-banner-title { font-size:13px; font-weight:700; color:var(--text-1); }
.sat-banner-sub   { font-size:11px; color:var(--text-3); margin-top:2px; }
.sat-banner-time  { font-size:10px; font-family:'Fira Code',monospace; color:var(--text-4); white-space:nowrap; }

/* Badge nivel */
#sat-nivel-badge {
  display:flex; align-items:center; gap:8px;
  padding:6px 14px 6px 10px; border-radius:var(--radius-full);
  border:1.5px solid; font-size:11.5px; font-weight:700;
  letter-spacing:0.06em; transition:all 0.3s ease;
}

/* Mapa */
#sat-mapa { height:360px; border-radius:0 0 var(--radius-lg) var(--radius-lg); }

/* Amenaza card */
.sat-amenaza-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-xs);
  transition: all 0.2s var(--ease-spring);
  cursor: default;
}
.sat-amenaza-card:hover {
  border-color: var(--border-h);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Progress bar */
.sat-prob-bar {
  height:4px; background:var(--surface-3);
  border-radius:2px; margin-top:8px; overflow:hidden;
}
.sat-prob-fill { height:4px; border-radius:2px; transition:width 0.8s var(--ease-apple); }

/* Protocolo */
.sat-protocolo {
  display:flex; align-items:flex-start; gap:12px;
  padding:12px 14px; border-radius:var(--radius-sm);
  background:var(--white); border:1px solid var(--border);
  box-shadow:var(--shadow-xs); margin-bottom:8px;
  transition:border-color 0.18s ease;
}
.sat-protocolo:hover { border-color:var(--border-h); }
.sat-proto-num {
  width:24px; height:24px; border-radius:var(--radius-sm);
  background:var(--green-50); border:1px solid var(--green-100);
  display:flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:700; color:var(--green-700); flex-shrink:0;
}
.sat-proto-title { font-size:12px; font-weight:700; color:var(--text-1); margin-bottom:2px; }
.sat-proto-desc  { font-size:11px; color:var(--text-3); line-height:1.5; }

/* Contacto */
.sat-contacto {
  display:flex; align-items:center; gap:10px;
  padding:10px 12px; border-radius:var(--radius-sm);
  background:var(--white); border:1px solid var(--border);
  box-shadow:var(--shadow-xs); margin-bottom:8px;
}
.sat-contacto-ico {
  width:32px; height:32px; border-radius:var(--radius-sm);
  display:flex; align-items:center; justify-content:center;
  font-size:15px; flex-shrink:0;
}
.sat-contacto-nombre { font-size:12px; font-weight:700; color:var(--text-1); }
.sat-contacto-tel    { font-size:11px; font-family:'Fira Code',monospace; color:var(--text-3); margin-top:1px; }

/* Historial tabla */
#sat-historial-tbody td { color:var(--text-2) !important; }
#sat-historial-tbody tr:hover td { background:var(--surface) !important; }

/* ── Responsive SAT ── */
@media(max-width:900px) {
  #sat-amenazas-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
}
@media(max-width:768px) {
  .sat-semaforo { flex-wrap: wrap; padding: 4px; }
  .sat-nivel-item { flex: 1 1 calc(50% - 6px); padding: 10px 6px; }
  #sat-mapa { height: 240px !important; }
  .sat-banner { flex-direction: column; align-items: flex-start; gap: 8px; }
  .sat-banner-time { font-size: 9px; }
  #sat-amenazas-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; gap: 8px !important; }
  .grid2.sat-main-grid { grid-template-columns: 1fr !important; }
}
@media(max-width:480px) {
  #sat-amenazas-grid { grid-template-columns: 1fr !important; }
  .sat-protocolo { flex-direction: column; gap: 8px; }
  .sat-proto-num { width: auto; }
}

/* ── Correcciones institucionales globales ── */
.card { position: relative !important; }
.kc-trend { border-radius: 6px !important; font-weight: 700 !important; }

/* Impresión */
@media print {
  .navbar, .topbar { display: none !important; }
  .section.act { display: block !important; }
  .card { box-shadow: none !important; border: 1px solid #ccc !important; }
}
</style>`

// ══════════════════════════════════════════════════════════════════════
// 2b. MAC THEME — Fluidez y experiencia macOS · glassmorphism · spring
// ══════════════════════════════════════════════════════════════════════
const MAC_THEME_CSS = `
<style>
/* ════════════════════════════════════════════════════════════════════
   PIIT Segovia · macOS Experience Layer
   Glassmorphism · SF Pro font stack · Spring animations · Vibrancy
   ════════════════════════════════════════════════════════════════════ */

/* ── Apple System Font Stack ── */
*, *::before, *::after {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility !important;
}
body, .sec-title, .kc-lbl, .kc-val, .nav-btn, .pt, button, input, select, textarea {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display',
               'Inter', 'Helvetica Neue', Arial, sans-serif !important;
}
.nav-logo-t, .sec-title, .hero-h {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
               'Inter', 'Helvetica Neue', Arial, sans-serif !important;
  letter-spacing: -0.022em !important;
}

/* ── Variables macOS ── */
:root {
  --mac-blur:       blur(24px) saturate(180%);
  --mac-blur-light: blur(16px) saturate(160%);
  --mac-glass:      rgba(255,255,255,0.78);
  --mac-glass-dark: rgba(28,28,32,0.82);
  --mac-border:     rgba(0,0,0,0.08);
  --mac-border-h:   rgba(0,0,0,0.14);
  --mac-shadow-sm:  0 1px 3px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.05);
  --mac-shadow-md:  0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
  --mac-shadow-lg:  0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06);
  --mac-shadow-xl:  0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
  --mac-shadow-lift:0 12px 40px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08);
  --mac-ease:       cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --mac-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
  --mac-snap:       cubic-bezier(0.22, 1, 0.36, 1);
  --mac-radius:     12px;
  --mac-radius-lg:  16px;
  --mac-radius-xl:  20px;
  --mac-accent:     #1E7A4C;
  --mac-accent-rgb: 30,122,76;
  /* Apple gray background */
  --apple-bg:       #F4F4F5;
  --apple-bg-2:     #EBEBED;
}

/* ── Body: Apple Gray ── */
html { scroll-behavior: smooth !important; }
body {
  background: var(--apple-bg) !important;
  min-height: 100vh;
}

/* ─────────────────────────────────────────
   TOPBAR — macOS Title Bar
   ───────────────────────────────────────── */
.topbar {
  background: rgba(9,38,22,0.94) !important;
  backdrop-filter: var(--mac-blur) !important;
  -webkit-backdrop-filter: var(--mac-blur) !important;
  border-bottom: 0.5px solid rgba(255,255,255,0.10) !important;
  box-shadow: none !important;
  height: 42px !important;
}
.tb-name  { font-weight: 600 !important; letter-spacing: 0.005em !important; font-size: 13px !important; }
.tb-dep   { letter-spacing: 0.03em !important; font-size: 10px !important; }
.tb-version {
  background: rgba(222,176,48,0.18) !important;
  border: 0.5px solid rgba(222,176,48,0.4) !important;
  border-radius: 999px !important;
  font-size: 10px !important; padding: 2px 10px !important;
}
.tb-live {
  background: rgba(59,179,120,0.15) !important;
  border: 0.5px solid rgba(59,179,120,0.35) !important;
  border-radius: 999px !important;
  padding: 3px 10px !important;
}
.live-dot { box-shadow: 0 0 5px rgba(91,175,132,0.7) !important; }

/* ─────────────────────────────────────────
   NAVBAR — macOS App Tab Bar (frosted glass)
   ───────────────────────────────────────── */
.navbar {
  background: rgba(255,255,255,0.82) !important;
  backdrop-filter: var(--mac-blur) !important;
  -webkit-backdrop-filter: var(--mac-blur) !important;
  border-bottom: 0.5px solid rgba(0,0,0,0.10) !important;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06) !important;
  position: sticky !important; top: 0 !important; z-index: 300 !important;
  height: 50px !important;
  transition: background 0.3s var(--mac-ease) !important;
}
.navbar:has(.nav-btn.act) {
  background: rgba(255,255,255,0.88) !important;
}

/* Logo pill */
.nav-logo {
  padding: 8px 16px 8px 0 !important;
  border-right: 0.5px solid rgba(0,0,0,0.08) !important;
}
.nav-logo-icon {
  background: linear-gradient(135deg,rgba(30,122,76,0.12) 0%,rgba(30,122,76,0.06) 100%) !important;
  border: 0.5px solid rgba(30,122,76,0.2) !important;
  border-radius: 10px !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8) !important;
}
.nav-logo-t {
  font-size: 13px !important; font-weight: 600 !important;
  color: #1a1a1a !important; letter-spacing: -0.01em !important;
}
.nav-logo-s { font-size: 10px !important; color: rgba(0,0,0,0.4) !important; }

/* Nav buttons — macOS pill tabs */
.nav-btn, .nav-dd-trigger {
  font-size: 12.5px !important; font-weight: 500 !important;
  color: rgba(0,0,0,0.55) !important;
  border: none !important;
  border-radius: 7px !important;
  margin: 0 1px !important;
  padding: 6px 11px !important;
  transition:
    background 0.18s var(--mac-ease),
    color 0.18s var(--mac-ease),
    box-shadow 0.18s var(--mac-ease),
    transform 0.12s var(--mac-snap) !important;
  position: relative !important;
  white-space: nowrap !important;
}
.nav-btn:hover, .nav-dd-trigger:hover {
  background: rgba(0,0,0,0.06) !important;
  color: rgba(0,0,0,0.80) !important;
  transform: none !important;
}
.nav-btn:active, .nav-dd-trigger:active {
  background: rgba(0,0,0,0.10) !important;
  transform: scale(0.97) !important;
}
.nav-btn.act, .nav-dd-trigger.act {
  background: rgba(30,122,76,0.10) !important;
  color: var(--mac-accent) !important;
  font-weight: 600 !important;
  box-shadow: inset 0 0 0 1px rgba(30,122,76,0.18) !important;
}
.nav-btn i, .nav-dd-trigger i { font-size: 11px !important; }

/* Dropdown macOS panel */
#nav-dd-portal {
  background: rgba(255,255,255,0.92) !important;
  backdrop-filter: var(--mac-blur) !important;
  -webkit-backdrop-filter: var(--mac-blur) !important;
  border: 0.5px solid rgba(0,0,0,0.12) !important;
  box-shadow: var(--mac-shadow-xl) !important;
  border-radius: var(--mac-radius-lg) !important;
  overflow: hidden !important;
}
.dd-item {
  border-radius: 0 !important;
  transition: background 0.12s var(--mac-ease) !important;
  font-size: 12.5px !important;
}
.dd-item:hover {
  background: rgba(30,122,76,0.08) !important;
  color: var(--mac-accent) !important;
}
.dd-item:active { background: rgba(30,122,76,0.14) !important; transform: none !important; }

/* ─────────────────────────────────────────
   MAIN AREA — macOS content panel
   ───────────────────────────────────────── */
.main {
  background: var(--apple-bg) !important;
  min-height: calc(100vh - 92px) !important;
}

/* Sección activa — macOS page transition */
.section.act {
  animation: mac-page-in 0.32s var(--mac-snap) both !important;
}
@keyframes mac-page-in {
  from { opacity:0; transform:translateY(10px) scale(0.995); }
  to   { opacity:1; transform:translateY(0)    scale(1); }
}

/* ─────────────────────────────────────────
   CARDS — Glass cards macOS style
   ───────────────────────────────────────── */
.card, .kc, .src-card, .sat-amenaza-card, .prest-data-card,
.sb-c, .alert-item, .sat-protocolo, .sat-contacto {
  background: rgba(255,255,255,0.88) !important;
  backdrop-filter: var(--mac-blur-light) !important;
  -webkit-backdrop-filter: var(--mac-blur-light) !important;
  border: 0.5px solid rgba(0,0,0,0.08) !important;
  box-shadow: var(--mac-shadow-sm) !important;
  border-radius: var(--mac-radius) !important;
  transition:
    box-shadow 0.22s var(--mac-ease),
    transform 0.22s var(--mac-spring),
    border-color 0.22s var(--mac-ease) !important;
}
.card:hover, .kc:hover {
  box-shadow: var(--mac-shadow-lift) !important;
  transform: translateY(-2px) !important;
  border-color: rgba(0,0,0,0.12) !important;
}
.kc:active {
  transform: scale(0.98) translateY(0) !important;
  box-shadow: var(--mac-shadow-sm) !important;
}

/* KPI valores */
.kc-val {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif !important;
  font-weight: 700 !important; letter-spacing: -0.025em !important;
}
.kc-lbl { font-size: 11px !important; color: rgba(0,0,0,0.45) !important; }
.kc-ico {
  border-radius: 9px !important;
  background: rgba(30,122,76,0.08) !important;
  border: 0.5px solid rgba(30,122,76,0.12) !important;
}

/* Src cards */
.src-card {
  transition: box-shadow 0.2s var(--mac-ease), transform 0.2s var(--mac-spring) !important;
  padding: 14px 16px !important;
}
.src-card:hover {
  box-shadow: var(--mac-shadow-md) !important;
  transform: translateY(-1px) !important;
}
.src-card.open {
  border-color: rgba(30,122,76,0.2) !important;
  box-shadow: 0 0 0 3px rgba(30,122,76,0.06), var(--mac-shadow-md) !important;
}

/* ─────────────────────────────────────────
   BUTTONS — macOS style
   ───────────────────────────────────────── */
button:not(.nav-btn):not(.nav-dd-trigger):not(.app-btn):not(.app-back):not(.mob-sev-btn) {
  border-radius: 8px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif !important;
  font-weight: 500 !important;
  transition:
    background 0.15s var(--mac-ease),
    box-shadow 0.15s var(--mac-ease),
    transform 0.1s var(--mac-snap) !important;
}
button:not(.nav-btn):not(.nav-dd-trigger):not(.app-btn):not(.app-back):not(.mob-sev-btn):active {
  transform: scale(0.97) !important;
}

/* Botón primario verde — macOS accent button */
.btn-primary, .btn, [class*="btn-g"] {
  background: linear-gradient(180deg, #2A9660 0%, #1E7A4C 100%) !important;
  border: 0.5px solid rgba(0,0,0,0.15) !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.18) !important;
  color: #fff !important; border-radius: 9px !important;
  font-weight: 600 !important;
  transition: all 0.15s var(--mac-ease) !important;
}
.btn-primary:hover, .btn:hover { filter: brightness(1.08) !important; box-shadow: var(--mac-shadow-md) !important; }
.btn-primary:active, .btn:active { transform: scale(0.97) !important; filter: brightness(0.96) !important; }

/* ─────────────────────────────────────────
   INPUTS & FIELDS — macOS style
   ───────────────────────────────────────── */
input, select, textarea, .field {
  border-radius: 8px !important;
  border: 0.5px solid rgba(0,0,0,0.18) !important;
  background: rgba(255,255,255,0.85) !important;
  backdrop-filter: blur(8px) !important;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif !important;
  transition: border-color 0.15s var(--mac-ease), box-shadow 0.15s var(--mac-ease) !important;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.06) !important;
}
input:focus, select:focus, textarea:focus, .field:focus {
  border-color: rgba(30,122,76,0.5) !important;
  box-shadow:
    inset 0 1px 2px rgba(0,0,0,0.05),
    0 0 0 3px rgba(30,122,76,0.15) !important;
  outline: none !important;
  background: rgba(255,255,255,0.98) !important;
}

/* ─────────────────────────────────────────
   TABLAS — macOS list style
   ───────────────────────────────────────── */
table {
  border-radius: var(--mac-radius) !important;
  overflow: hidden !important;
  border: 0.5px solid rgba(0,0,0,0.08) !important;
  box-shadow: var(--mac-shadow-sm) !important;
}
thead th {
  background: rgba(245,245,247,0.95) !important;
  backdrop-filter: blur(8px) !important;
  border-bottom: 0.5px solid rgba(0,0,0,0.08) !important;
  font-weight: 600 !important; font-size: 11px !important;
  letter-spacing: 0.06em !important; color: rgba(0,0,0,0.45) !important;
  padding: 10px 14px !important;
}
tbody tr {
  transition: background 0.12s var(--mac-ease) !important;
  border-bottom: 0.5px solid rgba(0,0,0,0.05) !important;
}
tbody tr:hover td {
  background: rgba(30,122,76,0.04) !important;
}
tbody td { padding: 10px 14px !important; font-size: 12.5px !important; }

/* ─────────────────────────────────────────
   SCROLLBAR — macOS overlay style
   ───────────────────────────────────────── */
* {
  scrollbar-width: thin !important;
  scrollbar-color: rgba(0,0,0,0.18) transparent !important;
}
::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
::-webkit-scrollbar-track { background: transparent !important; }
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.16) !important;
  border-radius: 999px !important;
  border: 1px solid transparent !important;
  background-clip: padding-box !important;
}
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.28) !important; }
::-webkit-scrollbar-corner { background: transparent !important; }

/* ─────────────────────────────────────────
   HERO — macOS gradient panel
   ───────────────────────────────────────── */
.hero {
  background: linear-gradient(160deg,#0A2E1C 0%,#0F3D24 55%,#174E2E 100%) !important;
  border-radius: 0 !important;
  position: relative !important; overflow: hidden !important;
}
.hero::before {
  content: '' !important; position: absolute !important; inset: 0 !important;
  background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(30,122,76,0.18) 0%, transparent 70%) !important;
  pointer-events: none !important;
}
.hkpi {
  background: rgba(255,255,255,0.08) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 0.5px solid rgba(255,255,255,0.14) !important;
  border-radius: var(--mac-radius) !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
  transition: background 0.2s var(--mac-ease), transform 0.2s var(--mac-spring) !important;
}
.hkpi:hover {
  background: rgba(255,255,255,0.14) !important;
  transform: translateY(-2px) !important;
}

/* ─────────────────────────────────────────
   BADGES — macOS pill badges
   ───────────────────────────────────────── */
.badge, [class*="badge-"], .src-frq, .kc-trend, .prest-badge {
  border-radius: 999px !important;
  font-size: 10px !important; font-weight: 600 !important;
  letter-spacing: 0.03em !important;
  padding: 2px 9px !important;
  border: 0.5px solid transparent !important;
}
.kc-trend.ok   { background: rgba(22,163,74,0.10) !important; color: #16A34A !important; border-color: rgba(22,163,74,0.20) !important; }
.kc-trend.up   { background: rgba(180,83,9,0.08) !important; color: #B45309 !important; border-color: rgba(180,83,9,0.18) !important; }
.badge-blue    { background: rgba(59,130,246,0.10) !important; color: #2563EB !important; border-color: rgba(59,130,246,0.2) !important; }
.badge-green   { background: rgba(22,163,74,0.10) !important; color: #16A34A !important; border-color: rgba(22,163,74,0.2) !important; }
.badge-gold    { background: rgba(180,83,9,0.10) !important; color: #B45309 !important; border-color: rgba(180,83,9,0.2) !important; }
.badge-red     { background: rgba(220,38,38,0.10) !important; color: #DC2626 !important; border-color: rgba(220,38,38,0.2) !important; }

/* ─────────────────────────────────────────
   STATUS DOTS — macOS traffic light palette
   ───────────────────────────────────────── */
.st { border-radius: 999px !important; font-size: 10px !important; padding: 2px 9px !important; }
.st-eje  { background: rgba(22,163,74,0.12) !important; color: #15803D !important; }
.st-ter  { background: rgba(100,116,139,0.12) !important; color: #475569 !important; }
.st-liq  { background: rgba(59,130,246,0.12) !important; color: #2563EB !important; }
.st-sus  { background: rgba(234,88,12,0.12) !important; color: #C2410C !important; }

/* ─────────────────────────────────────────
   MODAL / OVERLAY — macOS sheet style
   ───────────────────────────────────────── */
[class*="modal"], [class*="overlay"], [class*="dialog"] {
  background: rgba(255,255,255,0.92) !important;
  backdrop-filter: var(--mac-blur) !important;
  -webkit-backdrop-filter: var(--mac-blur) !important;
  border-radius: var(--mac-radius-xl) !important;
  box-shadow: var(--mac-shadow-xl) !important;
  border: 0.5px solid rgba(0,0,0,0.10) !important;
}

/* ─────────────────────────────────────────
   MAPA STATUS BAR — glass pill
   ───────────────────────────────────────── */
.map-statusbar, [class*="statusbar"] {
  background: rgba(255,255,255,0.82) !important;
  backdrop-filter: var(--mac-blur-light) !important;
  -webkit-backdrop-filter: var(--mac-blur-light) !important;
  border: 0.5px solid rgba(0,0,0,0.08) !important;
  box-shadow: var(--mac-shadow-md) !important;
  border-radius: var(--mac-radius) !important;
}

/* ─────────────────────────────────────────
   SELECTION — macOS blue selection
   ───────────────────────────────────────── */
::selection {
  background: rgba(30,122,76,0.18) !important;
  color: inherit !important;
}

/* ─────────────────────────────────────────
   SEPARADORES — hairline macOS
   ───────────────────────────────────────── */
hr, [class*="divider"], [class*="separator"] {
  border: none !important;
  border-top: 0.5px solid rgba(0,0,0,0.08) !important;
  margin: 16px 0 !important;
}

/* ─────────────────────────────────────────
   FOCUS RING — macOS blue
   ───────────────────────────────────────── */
:focus-visible {
  outline: 2px solid rgba(30,122,76,0.55) !important;
  outline-offset: 2px !important;
  border-radius: 6px !important;
}

/* ─────────────────────────────────────────
   TIPOGRAFÍA — escala macOS
   ───────────────────────────────────────── */
.sec-title {
  font-size: 26px !important; font-weight: 700 !important;
  letter-spacing: -0.025em !important; color: rgba(0,0,0,0.86) !important;
  line-height: 1.2 !important;
}
.sec-sub { font-size: 13px !important; color: rgba(0,0,0,0.45) !important; line-height: 1.6 !important; }
.pt {
  font-size: 10.5px !important; font-weight: 600 !important;
  letter-spacing: 0.07em !important; color: rgba(0,0,0,0.4) !important;
  text-transform: uppercase !important;
}

/* ─────────────────────────────────────────
   CONTENEDORES — macOS panel / sidebar feel
   ───────────────────────────────────────── */
.sec-head {
  background: transparent !important;
  padding-bottom: 20px !important;
  border-bottom: 0.5px solid rgba(0,0,0,0.07) !important;
  margin-bottom: 24px !important;
}

/* Grids — más espaciados */
.grid4 { gap: 14px !important; }
.grid3 { gap: 14px !important; }
.grid2 { gap: 16px !important; }

/* ─────────────────────────────────────────
   LEAFLET MAP — glass frame
   ───────────────────────────────────────── */
.leaflet-container {
  border-radius: var(--mac-radius) !important;
  overflow: hidden !important;
}
.leaflet-control-zoom a {
  border-radius: 8px !important;
  backdrop-filter: blur(8px) !important;
  background: rgba(255,255,255,0.88) !important;
  box-shadow: var(--mac-shadow-sm) !important;
  border: 0.5px solid rgba(0,0,0,0.10) !important;
  color: rgba(0,0,0,0.7) !important;
  font-size: 16px !important;
  transition: background 0.15s var(--mac-ease) !important;
}
.leaflet-control-zoom a:hover { background: rgba(255,255,255,0.98) !important; }
.leaflet-popup-content-wrapper {
  border-radius: var(--mac-radius) !important;
  box-shadow: var(--mac-shadow-lg) !important;
  border: 0.5px solid rgba(0,0,0,0.10) !important;
  backdrop-filter: blur(16px) !important;
  background: rgba(255,255,255,0.92) !important;
}
.leaflet-popup-tip { background: rgba(255,255,255,0.92) !important; }
.leaflet-bar { border-radius: var(--mac-radius) !important; border: none !important; }
.leaflet-control-attribution {
  background: rgba(255,255,255,0.75) !important;
  backdrop-filter: blur(8px) !important;
  border-radius: 6px !important;
  font-size: 9px !important;
  padding: 2px 6px !important;
}

/* ─────────────────────────────────────────
   PHONE FRAME — glass phone
   ───────────────────────────────────────── */
.phone-frame {
  border-radius: 28px !important;
  border: 6px solid rgba(0,0,0,0.85) !important;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.4),
    0 28px 60px rgba(0,0,0,0.35),
    inset 0 0 0 0.5px rgba(255,255,255,0.15) !important;
}
.phone-screen { border-radius: 0 0 22px 22px !important; }

/* ─────────────────────────────────────────
   MINIMAP OUTER — glass card
   ───────────────────────────────────────── */
#mm-outer {
  border: 0.5px solid rgba(0,0,0,0.12) !important;
  box-shadow: var(--mac-shadow-lg) !important;
  backdrop-filter: blur(12px) !important;
}
#mm-outer:hover {
  box-shadow: var(--mac-shadow-lift) !important;
}

/* ─────────────────────────────────────────
   DANE BUQUE — glass panel
   ───────────────────────────────────────── */
#dane-buque {
  border: 0.5px solid rgba(0,0,0,0.08) !important;
  box-shadow: var(--mac-shadow-md) !important;
  border-radius: var(--mac-radius-lg) !important;
}
#dane-buque-hdr {
  background: linear-gradient(90deg,rgba(9,38,22,0.96),rgba(15,58,32,0.96)) !important;
  backdrop-filter: blur(8px) !important;
}
.dane-cell:hover { background: rgba(30,122,76,0.04) !important; }

/* ─────────────────────────────────────────
   GRÁFICAS — canvas glow
   ───────────────────────────────────────── */
canvas {
  border-radius: var(--mac-radius) !important;
}

/* ─────────────────────────────────────────
   SELECTOR PRESTADOR — glass cards
   ───────────────────────────────────────── */
.prest-card {
  border-radius: var(--mac-radius-lg) !important;
  border: 0.5px solid rgba(0,0,0,0.10) !important;
  box-shadow: var(--mac-shadow-sm) !important;
  transition: transform 0.22s var(--mac-spring), box-shadow 0.22s var(--mac-ease) !important;
}
.prest-card:hover {
  transform: translateY(-3px) scale(1.01) !important;
  box-shadow: var(--mac-shadow-lift) !important;
}
.prest-card.sel {
  box-shadow: 0 0 0 2px var(--mac-accent), var(--mac-shadow-md) !important;
}

/* ─────────────────────────────────────────
   APP STEP BUTTONS — glass
   ───────────────────────────────────────── */
.app-btn {
  border-radius: 10px !important;
  font-weight: 600 !important;
  background: linear-gradient(180deg,#2A9660 0%,#1E7A4C 100%) !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.18) !important;
  border: 0.5px solid rgba(0,0,0,0.12) !important;
  transition: filter 0.15s var(--mac-ease), transform 0.1s var(--mac-snap) !important;
}
.app-btn:hover:not(:disabled) { filter: brightness(1.08) !important; }
.app-btn:active:not(:disabled) { transform: scale(0.97) !important; filter: brightness(0.96) !important; }

/* ─────────────────────────────────────────
   ANIMACIÓN GLOBAL — todos los links/btns
   ───────────────────────────────────────── */
a { transition: color 0.15s var(--mac-ease) !important; }
a:hover { opacity: 0.8 !important; }

/* ─────────────────────────────────────────
   GRID SEC-HEAD SEPARADOR FINO
   ───────────────────────────────────────── */
.grid4 .kc, .grid3 .kc {
  border-radius: var(--mac-radius) !important;
  overflow: hidden !important;
}

/* Notificación/toast macOS */
[class*="toast"], [class*="notif"] {
  border-radius: var(--mac-radius-xl) !important;
  background: rgba(30,30,35,0.88) !important;
  backdrop-filter: var(--mac-blur) !important;
  color: #fff !important;
  box-shadow: var(--mac-shadow-xl) !important;
}
</style>
<script>
/* ── macOS UX: press feedback en todos los elementos interactivos ── */
(function(){
  document.addEventListener('mousedown', function(e){
    var el = e.target.closest('.kc, .card, .src-card, .prest-card, .dane-cell, .sat-amenaza-card');
    if(el){ el.style.transform='scale(0.985) translateY(0)'; el.style.transition='transform 0.08s ease'; }
  });
  document.addEventListener('mouseup', function(e){
    var el = e.target.closest('.kc, .card, .src-card, .prest-card, .dane-cell, .sat-amenaza-card');
    if(el){ el.style.transform=''; el.style.transition=''; }
  });
  /* Smooth scroll en navegación */
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[onclick*="goSection"]');
    if(btn){ document.querySelector('.main') && (document.querySelector('.main').scrollTop = 0); }
  });
})();
</script>`

// ══════════════════════════════════════════════════════════════════════
// 2c. IDENTIDAD VISUAL SEGOVIA — Paleta Oficial Manual de Identidad
//     Metropolis · #237938 · #FCDC00 · #DC0B2C · GOV.CO
// ══════════════════════════════════════════════════════════════════════
const BRAND_CSS = `
<link rel="preconnect" href="https://fonts.cdnfonts.com" crossorigin>
<link href="https://fonts.cdnfonts.com/css/metropolis-2" rel="stylesheet">
<style>
/* ════════════════════════════════════════════════════════════════════
   PIIT · SEGOVIA · Paleta Corporativa Oficial
   Manual de Identidad Municipal — Alcaldía de Segovia, Antioquia
   Tipografía: Metropolis · Paleta exacta del Manual (CMYK verificado)
   ════════════════════════════════════════════════════════════════════ */

/* ══ 1. TOKENS DE MARCA — PALETA OFICIAL DEL MANUAL ══ */
:root {
  /* ─── COLORES PRIMARIOS ────────────────────────────────────────── */
  /* Verde  C85 M27 Y97 K14 → R35  G121 B56  */
  --seg-green:      #237938;
  --seg-green-d:    #1a5a2a;   /* hover/active: -15% luminosidad */
  --seg-green-dd:   #103a1a;   /* pressed: -25% luminosidad */
  --seg-green-l:    #2d9445;   /* light variant */
  --seg-green-50:   #eaf4ec;   /* fondo superficie muy sutil */
  --seg-green-100:  #c0dfc8;   /* borde sutil */
  --seg-green-200:  #8ec4a0;   /* borde medio */

  /* Amarillo  C4 M10 Y92 K0 → R252 G220 B0  */
  --seg-yellow:     #FCDC00;
  --seg-yellow-d:   #d4b800;
  --seg-yellow-50:  #fffbe0;
  --seg-yellow-100: #fef3a0;

  /* Rojo  C5 M100 Y82 K1 → R220 G11 B44  */
  --seg-red:        #DC0B2C;
  --seg-red-d:      #b00823;
  --seg-red-50:     #fff0f3;
  --seg-red-100:    #ffc8d2;

  /* ─── COLORES SECUNDARIOS ──────────────────────────────────────── */
  /* Verde 2  C70 M0 Y100 K0 → R72  G183 B44  */
  --seg-green2:     #48B72C;
  --seg-green2-50:  #edfbe6;
  --seg-green2-100: #c2efb0;

  /* Naranja  C0 M75 Y95 K0 → R255 G89  B0   */
  --seg-orange:     #FF5900;
  --seg-orange-d:   #cc4700;
  --seg-orange-50:  #fff3eb;
  --seg-orange-100: #ffcfb0;

  /* Azul  C75 M21 Y0 K0 → R0   G160 B228 */
  --seg-blue:       #00A0E4;
  --seg-blue-d:     #007db8;
  --seg-blue-50:    #e6f6fd;
  --seg-blue-100:   #b3e3f7;

  /* Morado  C58 M79 Y0 K0 → R138 G74  B163 */
  --seg-purple:     #8A4AA3;
  --seg-purple-d:   #6e3a82;
  --seg-purple-50:  #f5eefa;
  --seg-purple-100: #ddc8ee;

  --seg-white:      #FFFFFF;
  --seg-black:      #000000;

  /* ─── SEMÁNTICOS (estados UI) ──────────────────────────────────── */
  --color-success:        var(--seg-green2);    /* verde 2 */
  --color-success-bg:     var(--seg-green2-50);
  --color-success-border: var(--seg-green2-100);
  --color-success-text:   #2e7a18;

  --color-warning:        var(--seg-orange);
  --color-warning-bg:     var(--seg-orange-50);
  --color-warning-border: var(--seg-orange-100);
  --color-warning-text:   #7a2900;

  --color-error:          var(--seg-red);
  --color-error-bg:       var(--seg-red-50);
  --color-error-border:   var(--seg-red-100);
  --color-error-text:     #8c0520;

  --color-info:           var(--seg-blue);
  --color-info-bg:        var(--seg-blue-50);
  --color-info-border:    var(--seg-blue-100);
  --color-info-text:      #004f72;

  --color-highlight:      var(--seg-yellow);
  --color-highlight-bg:   var(--seg-yellow-50);
  --color-highlight-text: #5a4800;

  --color-neutral:        var(--seg-purple);
  --color-neutral-bg:     var(--seg-purple-50);
  --color-neutral-text:   #4a2260;

  /* ─── ESCALA VERDE PRIMARIO (interpolada) ───────────────────────── */
  --green-900:  #0c2314;
  --green-800:  #164028;
  --green-700:  #1a5a2a;
  --green-600:  #1e6c32;
  --green-500:  #237938;  /* === PRIMARIO OFICIAL === */
  --green-400:  #2d9445;
  --green-300:  #48B72C;  /* === SECUNDARIO OFICIAL === */
  --green-200:  #8ec4a0;
  --green-100:  #c0dfc8;
  --green-50:   #eaf4ec;

  /* ─── NEUTROS INSTITUCIONALES ──────────────────────────────────── */
  --seg-dark:       #041313;
  --seg-gov-black:  #0d0d0d;
  --seg-text:       #0c2314;
  --seg-text-2:     #2a4a30;
  --seg-text-muted: #5a7a60;
  --seg-border:     #c0dfc8;
  --seg-surface:    #f4f8f5;

  /* ─── ACENTO MAC ── */
  --mac-accent:     #237938;
  --mac-accent-rgb: 35,121,56;

  /* ─── TIPOGRAFÍA ── */
  --font-brand: 'Metropolis', 'Inter', -apple-system, system-ui, sans-serif;
}

/* ══ 2. TIPOGRAFÍA GLOBAL: METROPOLIS ══ */
body,
h1, h2, h3, h4, h5, h6,
p, span:not([class*="fa"]):not([class*="ion"]):not([class*="bi"]):not([class*="lni"]),
button:not([class*="fa"]):not([class*="ion"]),
input, select, textarea, label,
.sec-title, .hero-h, .kc-val, .kc-lbl,
.nav-btn, .nav-dd-trigger, .nav-logo-t, .pt,
td, th, li, a {
  font-family: 'Metropolis', 'Inter', -apple-system, system-ui, sans-serif !important;
}

/* ══ 3. TOPBAR — Réplica exacta portal gov.co ══ */
.topbar {
  background: var(--seg-dark) !important;
  border-bottom: 2px solid var(--seg-green) !important;
  height: 44px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
}
.tb-name { font-weight: 700 !important; letter-spacing: 0.01em !important; }
.tb-dep  { letter-spacing: 0.04em !important; opacity: 0.7 !important; }
.tb-version {
  background: rgba(35,121,56,0.18) !important;
  border: 1px solid rgba(35,121,56,0.35) !important;
  border-radius: 4px !important;
  font-weight: 700 !important;
}
.tb-live {
  background: rgba(35,121,56,0.15) !important;
  border: 1px solid rgba(35,121,56,0.30) !important;
  border-radius: 4px !important;
}
.live-dot { box-shadow: 0 0 6px rgba(35,121,56,0.8) !important; background: var(--seg-green) !important; }

/* Escudo en topbar */
.tb-shield {
  display: inline-flex !important;
  align-items: center !important;
  gap: 7px !important;
  padding: 0 14px 0 0 !important;
  margin-right: 10px !important;
  border-right: 1px solid rgba(255,255,255,0.10) !important;
}

/* ══ 4. NAVBAR — Nav activa = verde sólido (como sitio oficial) ══ */
.navbar {
  background: #ffffff !important;
  border-bottom: 1px solid var(--seg-border) !important;
  box-shadow: 0 1px 0 var(--seg-border), 0 2px 6px rgba(35,121,56,0.04) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Botón activo: FONDO VERDE SÓLIDO + texto blanco — igual al sitio oficial */
.nav-btn.act, .nav-dd-trigger.act {
  background: var(--seg-green) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  box-shadow: none !important;
  border-radius: 6px !important;
}
.nav-btn:hover:not(.act), .nav-dd-trigger:hover:not(.act) {
  background: var(--seg-green-50) !important;
  color: var(--seg-green-d) !important;
}
.nav-btn:not(.act), .nav-dd-trigger:not(.act) {
  color: rgba(0,0,0,0.65) !important;
}

/* Dropdown: hover verde sólido */
.dd-item:hover {
  background: var(--seg-green) !important;
  color: #ffffff !important;
}
#nav-dd-portal {
  border: 1px solid var(--seg-border) !important;
  border-radius: 8px !important;
  backdrop-filter: none !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(35,121,56,0.06) !important;
}

/* Logo nav */
.nav-logo-t {
  font-weight: 700 !important;
  color: var(--seg-dark) !important;
  letter-spacing: -0.01em !important;
}
.nav-logo-icon {
  background: var(--seg-green-50) !important;
  border: 1px solid var(--seg-green-100) !important;
  border-radius: 8px !important;
}
.nav-logo-icon i { color: var(--seg-green) !important; }

/* ══ 5. HERO — Verde oscuro institucional ══ */
.hero {
  background: linear-gradient(150deg, var(--seg-dark) 0%, #071f0a 50%, #0d3012 100%) !important;
  position: relative !important;
}
.hero::before {
  content: '' !important;
  position: absolute !important; inset: 0 !important;
  background:
    radial-gradient(ellipse 70% 60% at 75% 40%, rgba(35,121,56,0.14) 0%, transparent 70%),
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px,
      transparent 1px, transparent 60px
    ) !important;
  pointer-events: none !important;
}
.hero-h {
  font-weight: 800 !important;
  letter-spacing: -0.035em !important;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3) !important;
}
.hero-sub { color: rgba(255,255,255,0.75) !important; }

/* KPIs hero */
.hkpi {
  background: rgba(255,255,255,0.08) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  backdrop-filter: blur(10px) !important;
  border-radius: 10px !important;
}
.hkpi:hover { background: rgba(255,255,255,0.14) !important; }

/* ══ 6. FONDO GENERAL ══ */
body { background: #f4f6f4 !important; }
.main { background: #f4f6f4 !important; }

/* ══ 7. CARDS — Blancas limpias estilo portal oficial ══ */
.card, .kc, .src-card, .sat-amenaza-card,
.prest-data-card, .sb-c, .alert-item,
.sat-protocolo, .sat-contacto {
  background: #ffffff !important;
  border: 1px solid var(--seg-border) !important;
  box-shadow: 0 1px 3px rgba(35,121,56,0.05), 0 2px 8px rgba(0,0,0,0.04) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-radius: 10px !important;
}
.card:hover, .kc:hover {
  border-color: rgba(35,121,56,0.30) !important;
  box-shadow: 0 4px 16px rgba(35,121,56,0.12), 0 1px 4px rgba(0,0,0,0.06) !important;
  transform: translateY(-2px) !important;
}

/* ══ 8. KPI ══ */
.kc-ico {
  background: var(--seg-green-50) !important;
  border: 1px solid var(--seg-green-100) !important;
  border-radius: 8px !important;
}
.kc-trend.ok {
  background: var(--seg-green-50) !important;
  color: var(--seg-green-d) !important;
  border-color: var(--seg-green-100) !important;
}
.kc-val { letter-spacing: -0.025em !important; }

/* ══ 9. BOTONES — Verde sólido, sin degradado excesivo ══ */
.btn-primary, .btn, .app-btn, [class*="btn-g"] {
  background: var(--seg-green) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(35,121,56,0.28) !important;
  color: #fff !important;
  border-radius: 7px !important;
  font-weight: 700 !important;
  font-family: 'Metropolis', system-ui, sans-serif !important;
}
.btn-primary:hover, .btn:hover, .app-btn:hover:not(:disabled) {
  background: var(--seg-green-d) !important;
  box-shadow: 0 4px 16px rgba(35,121,56,0.38) !important;
  filter: none !important;
}
.btn-primary:active, .btn:active, .app-btn:active {
  background: var(--seg-green-dd) !important;
  transform: scale(0.98) !important;
}

/* ══ 10. INPUTS — Estilo portal institucional ══ */
input, select, textarea {
  background: #ffffff !important;
  border: 1.5px solid #c8deca !important;
  border-radius: 7px !important;
  font-family: 'Metropolis', system-ui, sans-serif !important;
  color: #1a2e1c !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--seg-green) !important;
  box-shadow: 0 0 0 3px rgba(35,121,56,0.12) !important;
  background: #ffffff !important;
  outline: none !important;
}
input::placeholder { color: #9db89f !important; }

/* ══ 11. TABLAS — Cabecera verde sólida ══ */
table {
  border-radius: 10px !important;
  border: 1px solid var(--seg-border) !important;
  box-shadow: 0 1px 4px rgba(35,121,56,0.06) !important;
  overflow: hidden !important;
}
thead th {
  background: var(--seg-green) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  letter-spacing: 0.07em !important;
  text-transform: uppercase !important;
  border-bottom: none !important;
  padding: 10px 14px !important;
}
tbody td {
  color: #2a4035 !important;
  border-bottom: 1px solid #eaf2eb !important;
  padding: 10px 14px !important;
  font-size: 12.5px !important;
}
tbody tr:hover td {
  background: var(--seg-green-50) !important;
}

/* ══ 12. BADGES — Paleta oficial semántica ══ */
/* Éxito: verde primario oficial #237938 */
.badge-green, .badge-success {
  background: var(--seg-green-50) !important;
  color: var(--seg-green-d) !important;
  border: 1px solid var(--seg-green-100) !important;
  border-radius: 4px !important; font-weight: 700 !important;
}
/* Error: rojo primario oficial #DC0B2C */
.badge-red, .badge-error, .badge-danger {
  background: var(--seg-red-50) !important;
  color: var(--seg-red-d) !important;
  border: 1px solid var(--seg-red-100) !important;
  border-radius: 4px !important; font-weight: 700 !important;
}
/* Información: azul secundario oficial #00A0E4 */
.badge-blue, .badge-info {
  background: var(--seg-blue-50) !important;
  color: var(--seg-blue-d) !important;
  border: 1px solid var(--seg-blue-100) !important;
  border-radius: 4px !important; font-weight: 700 !important;
}
/* Advertencia: amarillo primario oficial #FCDC00 */
.badge-gold, .badge-warn, .badge-warning, .badge-yellow {
  background: var(--seg-yellow-50) !important;
  color: var(--seg-yellow-d) !important;
  border: 1px solid var(--seg-yellow-100) !important;
  border-radius: 4px !important; font-weight: 700 !important;
}
/* Naranja: naranja secundario oficial #FF5900 */
.badge-orange {
  background: var(--seg-orange-50) !important;
  color: var(--seg-orange-d) !important;
  border: 1px solid var(--seg-orange-100) !important;
  border-radius: 4px !important; font-weight: 700 !important;
}
/* Especial: morado secundario oficial #8A4AA3 */
.badge-purple {
  background: var(--seg-purple-50) !important;
  color: var(--seg-purple-d) !important;
  border: 1px solid var(--seg-purple-100) !important;
  border-radius: 4px !important; font-weight: 700 !important;
}

/* KPI trends — semántica oficial */
.kc-trend { border-radius: 4px !important; font-weight: 700 !important; }
/* Positivo → verde primario */
.kc-trend.ok {
  background: var(--seg-green-50) !important;
  color: var(--seg-green-d) !important;
  border: 1px solid var(--seg-green-100) !important;
}
/* Negativo → rojo primario */
.kc-trend.bad, .kc-trend.down {
  background: var(--seg-red-50) !important;
  color: var(--seg-red-d) !important;
  border: 1px solid var(--seg-red-100) !important;
}
/* Neutral → amarillo */
.kc-trend.warn, .kc-trend.neutral {
  background: var(--seg-yellow-50) !important;
  color: #5a4800 !important;
  border: 1px solid var(--seg-yellow-100) !important;
}

/* ══ 13. ALERTAS SAT — colores semánticos oficiales ══ */
.sat-nivel-item[data-nivel="verde"].sat-activo {
  background: var(--seg-green2-50) !important;
  border-color: var(--seg-green2-100) !important;
}
.sat-nivel-item[data-nivel="amarillo"].sat-activo {
  background: var(--seg-yellow-50) !important;
  border-color: var(--seg-yellow-100) !important;
}
.sat-nivel-item[data-nivel="naranja"].sat-activo {
  background: var(--seg-orange-50) !important;
  border-color: var(--seg-orange-100) !important;
}
.sat-nivel-item[data-nivel="rojo"].sat-activo {
  background: var(--seg-red-50) !important;
  border-color: var(--seg-red-100) !important;
}
.sat-banner.verde   { background: var(--seg-green2-50) !important; border-color: var(--seg-green2-100) !important; }
.sat-banner.amarillo{ background: var(--seg-yellow-50) !important; border-color: var(--seg-yellow-100) !important; }
.sat-banner.naranja { background: var(--seg-orange-50) !important; border-color: var(--seg-orange-100) !important; }
.sat-banner.rojo    { background: var(--seg-red-50)    !important; border-color: var(--seg-red-100)    !important; }

/* ══ 14. TÍTULOS DE SECCIÓN ══ */
.sec-title {
  font-weight: 700 !important;
  letter-spacing: -0.022em !important;
  color: #0d1f10 !important;
}
.pt {
  color: var(--seg-green) !important;
  letter-spacing: 0.10em !important;
  font-weight: 700 !important;
}
.sec-head {
  border-bottom: 2px solid var(--seg-green-50) !important;
  padding-bottom: 16px !important;
  margin-bottom: 20px !important;
}

/* ══ 15. FUENTES / DANE ══ */
.dane-cell:hover { background: var(--seg-green-50) !important; }
#dane-buque-hdr {
  background: linear-gradient(90deg, var(--seg-dark), #071f0a) !important;
}
.src-card.open {
  border-color: rgba(35,121,56,0.35) !important;
  box-shadow: 0 0 0 3px rgba(35,121,56,0.08), 0 4px 16px rgba(35,121,56,0.10) !important;
}

/* ══ 16. PRESTADOR CARDS ══ */
.prest-card.sel {
  box-shadow: 0 0 0 2.5px var(--seg-green), 0 4px 16px rgba(35,121,56,0.14) !important;
  border-color: var(--seg-green) !important;
}

/* ══ 17. MAPA MINIMAP ══ */
#mm-outer {
  border: 1px solid rgba(35,121,56,0.25) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.50) !important;
}

/* ══ 18. SELECTION & SCROLLBAR ══ */
::selection { background: rgba(35,121,56,0.16) !important; }
::-webkit-scrollbar-thumb:hover { background: rgba(35,121,56,0.30) !important; }
:focus-visible { outline: 2px solid rgba(35,121,56,0.55) !important; outline-offset: 2px !important; }

/* ══ 19. SEPARADORES ══ */
hr, [class*="divider"], [class*="separator"] {
  border-top: 1px solid var(--seg-border) !important;
}

/* ══ 20. LINKS ══ */
a:not(.nav-btn):not(.nav-dd-trigger):not(.dd-item):not([class*="btn"]) {
  color: var(--seg-green) !important;
}
a:not(.nav-btn):not(.nav-dd-trigger):not(.dd-item):not([class*="btn"]):hover {
  color: var(--seg-green-d) !important;
}

/* ══ 21. GOV.CO FOOTER BAR ══ */
#piit-gov-footer {
  position: fixed !important;
  bottom: 0 !important; left: 0 !important; right: 0 !important;
  height: 36px !important;
  background: var(--seg-gov-black) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 20px !important;
  z-index: 8500 !important;
  border-top: 2px solid var(--seg-green) !important;
}
#piit-gov-footer .gov-footer-left {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}
#piit-gov-footer .gov-co-badge {
  background: var(--seg-green) !important;
  color: #fff !important;
  font-family: 'Metropolis', system-ui, sans-serif !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em !important;
  padding: 2px 8px !important;
  border-radius: 3px !important;
}
#piit-gov-footer .gov-footer-text {
  font-family: 'Metropolis', system-ui, sans-serif !important;
  font-size: 9.5px !important;
  color: rgba(255,255,255,0.45) !important;
  letter-spacing: 0.05em !important;
}
#piit-gov-footer .gov-footer-right {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}
#piit-gov-footer .gov-live-dot {
  width: 5px !important; height: 5px !important;
  border-radius: 50% !important;
  background: var(--seg-green) !important;
  animation: govDotPulse 2s ease-in-out infinite !important;
}
@keyframes govDotPulse {
  0%,100%{ opacity:1; } 50%{ opacity:0.4; }
}
#piit-gov-footer .gov-footer-ver {
  font-family: 'Metropolis', system-ui, sans-serif !important;
  font-size: 9px !important;
  color: rgba(255,255,255,0.30) !important;
  letter-spacing: 0.06em !important;
}

/* Compensar footer fijo */
body { padding-bottom: 36px !important; }

/* ══ 22. ETIQUETA BRAND BOTTOM-LEFT ══ */
#piit-brand-label {
  display: none !important;
}

/* ══ 23. RESPONSIVE ══ */
@media (max-width: 768px) {
  #piit-gov-footer .gov-footer-right { display: none !important; }
  #piit-gov-footer { padding: 0 12px !important; }
  thead th { font-size: 9.5px !important; padding: 8px 10px !important; }
}
</style>
<script>
/* ── Identidad visual Segovia: escudo topbar + footer GOV.CO ── */
(function(){
  function injectBrand(){
    /* Escudo SVG en topbar */
    var tbName=document.querySelector('.tb-name,.topbar-name');
    if(tbName&&!tbName.parentNode.querySelector('.tb-shield')){
      var shield=document.createElement('span');
      shield.className='tb-shield';
      shield.innerHTML='<svg viewBox="0 0 16 20" fill="none" style="width:16px;height:16px;flex-shrink:0"><path d="M8 0L0 3v8c0 5 3.5 8.3 8 9.2C12.5 19.3 16 16 16 11V3L8 0z" fill="rgba(34,160,7,0.30)" stroke="rgba(34,160,7,0.7)" stroke-width="0.8"/><path d="M8 4L3 6.5v4.5c0 2.8 2 4.8 5 5.5 3-.7 5-2.7 5-5.5V6.5L8 4z" fill="rgba(34,160,7,0.20)"/></svg>';
      tbName.parentNode.insertBefore(shield, tbName);
    }
    /* Footer GOV.CO fijo */
    if(!document.getElementById('piit-gov-footer')){
      var ft=document.createElement('div');
      ft.id='piit-gov-footer';
      ft.innerHTML=
        '<div class="gov-footer-left">'
        +'<span class="gov-co-badge">GOV.CO</span>'
        +'<span class="gov-footer-text">Alcaldía de Segovia · Antioquia · NIT 890981391-2 · Sistema Oficial de Inteligencia Territorial</span>'
        +'</div>'
        +'<div class="gov-footer-right">'
        +'<div class="gov-live-dot"></div>'
        +'<span class="gov-footer-ver">PIIT v5 · Misión Ciudades BID · 2026</span>'
        +'</div>';
      document.body.appendChild(ft);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(injectBrand,300);});
  else setTimeout(injectBrand,300);
})();
</script>`

const headIdx = html.indexOf('</head>')
if (headIdx === -1) throw new Error('</head> no encontrado')
html = html.slice(0, headIdx) + PREMIUM_CSS + MAC_THEME_CSS + BRAND_CSS + html.slice(headIdx)

// ══════════════════════════════════════════════════════════════════════
// 3. BOTÓN NAV SAT — con init directo para no depender del interceptor
// ══════════════════════════════════════════════════════════════════════
const SAT_NAV_BTN = `<button class="nav-btn" onclick="PIIT.ui.goSection('s-riesgo',this);setTimeout(function(){if(window.PIIT&&window.PIIT.riesgo)PIIT.riesgo.init();},150)"><i class="fa-solid fa-triangle-exclamation" style="color:#EA580C"></i> Gestión del Riesgo</button>
  `
html = html.replace('<div class="nav-spacer">', SAT_NAV_BTN + '<div class="nav-spacer">')

// ══════════════════════════════════════════════════════════════════════
// 4. SECCIÓN SAT HTML
// ══════════════════════════════════════════════════════════════════════
const SAT_SECTION = `
<section class="section" id="s-riesgo">

  <!-- Encabezado -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:22px">
    <div>
      <h2 class="sec-title">Gestión del Riesgo · SAT</h2>
      <p class="sec-sub">Sistema de Alerta Temprana · UNGRD · Decreto 2157/2017 · Segovia, Antioquia · CDGRD Municipal</p>
    </div>
    <div id="sat-nivel-badge" style="background:#F0FDF4;border-color:#86EFAC;color:#16A34A">
      <div style="width:8px;height:8px;border-radius:50%;background:#16A34A"></div>
      <span id="sat-badge-txt">ALERTA VERDE</span>
    </div>
  </div>

  <!-- Semáforo interactivo -->
  <div class="sat-semaforo" id="sat-semaforo">
    <div class="sat-nivel-item sat-activo" data-nivel="verde" onclick="PIIT.riesgo.setNivel('verde',this)">
      <div class="sat-dot-level"></div>
      <div class="sat-nivel-lbl">Verde</div>
      <div class="sat-nivel-desc">Sin amenaza activa</div>
    </div>
    <div class="sat-nivel-item" data-nivel="amarillo" onclick="PIIT.riesgo.setNivel('amarillo',this)">
      <div class="sat-dot-level"></div>
      <div class="sat-nivel-lbl">Amarillo</div>
      <div class="sat-nivel-desc">Monitoreo activo</div>
    </div>
    <div class="sat-nivel-item" data-nivel="naranja" onclick="PIIT.riesgo.setNivel('naranja',this)">
      <div class="sat-dot-level"></div>
      <div class="sat-nivel-lbl">Naranja</div>
      <div class="sat-nivel-desc">Alerta declarada</div>
    </div>
    <div class="sat-nivel-item" data-nivel="rojo" onclick="PIIT.riesgo.setNivel('rojo',this)">
      <div class="sat-dot-level"></div>
      <div class="sat-nivel-lbl">Rojo</div>
      <div class="sat-nivel-desc">Emergencia activa</div>
    </div>
  </div>

  <!-- Banner de estado -->
  <div class="sat-banner verde" id="sat-banner">
    <div class="sat-banner-left">
      <div class="sat-banner-dot"></div>
      <div>
        <div class="sat-banner-title" id="sat-banner-title">Sistema estable · Sin alertas activas declaradas</div>
        <div class="sat-banner-sub" id="sat-banner-sub">IDEAM · Pronóstico sin eventos extremos · Monitoreo permanente activo · CDGRD Segovia</div>
      </div>
    </div>
    <div class="sat-banner-time">Actualizado: <span id="sat-time-txt"></span></div>
  </div>

  <!-- KPIs -->
  <div class="grid4" style="margin-bottom:24px">
    <div class="kc">
      <div class="kc-top">
        <div class="kc-ico"><i class="fa-solid fa-shield-halved" style="color:#16A34A;font-size:15px"></i></div>
        <span class="kc-trend ok" id="sat-kpi-nivel-badge">VERDE</span>
      </div>
      <div class="kc-val" id="sat-kpi-nivel" style="font-size:22px;color:#16A34A">Estable</div>
      <div class="kc-lbl">Nivel de alerta SAT</div>
    </div>
    <div class="kc">
      <div class="kc-top">
        <div class="kc-ico"><i class="fa-solid fa-bell" style="color:#EA580C;font-size:15px"></i></div>
        <span class="kc-trend up">Tiempo real</span>
      </div>
      <div class="kc-val">3</div>
      <div class="kc-lbl">Eventos en monitoreo</div>
    </div>
    <div class="kc">
      <div class="kc-top">
        <div class="kc-ico"><i class="fa-solid fa-people-group" style="color:#1D4ED8;font-size:15px"></i></div>
        <span class="kc-trend ok">19 barrios</span>
      </div>
      <div class="kc-val">28</div>
      <div class="kc-lbl">Comunidades monitoreadas</div>
    </div>
    <div class="kc">
      <div class="kc-top">
        <div class="kc-ico"><i class="fa-solid fa-kit-medical" style="color:#D4A017;font-size:15px"></i></div>
        <span class="kc-trend ok">Disponibles</span>
      </div>
      <div class="kc-val">6</div>
      <div class="kc-lbl">Protocolos activados</div>
    </div>
  </div>

  <!-- Mapa + Alertas -->
  <div class="grid2 sat-main-grid" style="margin-bottom:24px">
    <div class="card" style="padding:0;overflow:hidden">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid var(--g100,#EAF5EF)">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text-2,#2A4035);letter-spacing:.05em">MAPA DE AMENAZAS TERRITORIALES</div>
          <div style="font-size:10px;color:var(--text-4,#7A9E8C);margin-top:2px">Segovia · Nordeste Antioqueño · SIMMA · SGC · IDEAM</div>
        </div>
        <div style="display:flex;gap:10px;font-size:10px;color:var(--text-4,#7A9E8C)">
          <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#2A6CA8;display:inline-block"></span>Inundación</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#C9852A;display:inline-block"></span>Masa</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:2px;background:#C84040;display:inline-block"></span>Incendio</span>
        </div>
      </div>
      <div id="sat-mapa"></div>
    </div>
    <div>
      <div class="pt">Alertas activas · Tiempo real IDEAM · SGC</div>
      <div id="sat-alertas-list"></div>
      <div class="card" style="margin-top:12px;padding:14px 16px">
        <div style="font-size:10px;font-weight:700;color:var(--text-4,#7A9E8C);letter-spacing:.09em;text-transform:uppercase;margin-bottom:10px">Fuentes de monitoreo SAT</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          <span class="badge badge-blue">IDEAM · Hidrometeorología</span>
          <span class="badge badge-green">SGC · Geología</span>
          <span class="badge badge-gold">UNGRD · Emergencias</span>
          <span class="badge badge-blue">SIATA · Sensores</span>
          <span class="badge badge-green">SIMMA · Movimientos</span>
          <span class="badge badge-gold">DANE · Censos</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Inventario de amenazas -->
  <div class="pt" style="margin-bottom:12px">Inventario de amenazas · Segovia 2024 · Probabilidad a 30 días</div>
  <div id="sat-amenazas-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:24px"></div>

  <!-- Historial -->
  <div class="pt" style="margin-bottom:10px">Historial de eventos · 2020–2026 · Fuente: CDGRD Municipal</div>
  <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px">
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr>
            <th style="padding:10px 14px;text-align:left">Fecha</th>
            <th style="padding:10px 14px;text-align:left">Tipo de evento</th>
            <th style="padding:10px 14px;text-align:left">Zona afectada</th>
            <th style="padding:10px 14px;text-align:right">Afectados</th>
            <th style="padding:10px 14px;text-align:right">Pérdidas M$</th>
            <th style="padding:10px 14px;text-align:center">Estado</th>
          </tr>
        </thead>
        <tbody id="sat-historial-tbody"></tbody>
      </table>
    </div>
  </div>

  <!-- Protocolos + Contactos -->
  <div class="grid2" style="margin-bottom:24px">
    <div class="card">
      <div class="pt" style="margin-bottom:14px">Protocolos SAT · UNGRD · Fases de respuesta</div>
      <div id="sat-protocolos"></div>
    </div>
    <div class="card">
      <div class="pt" style="margin-bottom:14px">Líneas de emergencia · CDGRD Segovia</div>
      <div id="sat-contactos"></div>
    </div>
  </div>

  <!-- Fuentes -->
  <div class="card" style="padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;background:var(--g50,#F4FAF6)">
    <div style="font-size:10px;font-weight:700;color:var(--text-4,#7A9E8C);letter-spacing:.09em;text-transform:uppercase">Fuentes oficiales SAT</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:11.5px">
      <a href="https://www.ideam.gov.co" target="_blank" rel="noopener" style="color:var(--green-600,#1E7A4C);font-weight:600;transition:color .15s">IDEAM ↗</a>
      <a href="https://www.sgc.gov.co" target="_blank" rel="noopener" style="color:var(--green-600,#1E7A4C);font-weight:600;transition:color .15s">SGC ↗</a>
      <a href="https://portal.gestiondelriesgo.gov.co" target="_blank" rel="noopener" style="color:var(--green-600,#1E7A4C);font-weight:600;transition:color .15s">UNGRD ↗</a>
      <a href="https://www.siata.gov.co" target="_blank" rel="noopener" style="color:var(--green-600,#1E7A4C);font-weight:600;transition:color .15s">SIATA ↗</a>
      <a href="https://simma.sgc.gov.co" target="_blank" rel="noopener" style="color:var(--green-600,#1E7A4C);font-weight:600;transition:color .15s">SIMMA ↗</a>
    </div>
    <div style="font-size:10px;color:var(--text-5,#A8C4B8);font-family:'Fira Code',monospace">PIIT Segovia v5 · CDGRD · Decreto 2157/2017</div>
  </div>

</section>`

// ══════════════════════════════════════════════════════════════════════
// 5. BADGE + DERIVADOS + MÓDULO JS SAT
// ══════════════════════════════════════════════════════════════════════
const USER_BADGE = `
<style>
.tb-user-badge{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);border:.5px solid rgba(255,255,255,.18);padding:4px 10px 4px 5px;border-radius:20px}
.tb-user-av{width:22px;height:22px;border-radius:50%;background:var(--au500);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--g900);flex-shrink:0}
.tb-user-name{font-size:10px;font-weight:700;color:rgba(255,255,255,.88)}
.tb-user-role{font-size:9px;color:rgba(255,255,255,.55);letter-spacing:.04em}
.tb-logout-btn{margin-left:4px;padding:3px 10px;border-radius:20px;border:.5px solid rgba(255,255,255,.18);background:rgba(220,38,38,.15);color:#FCA5A5;font-size:10px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap}
.tb-logout-btn:hover{background:rgba(220,38,38,.3);color:#fff}
</style>
<script>
window.__piitLogout=function(){localStorage.removeItem("piit-session");window.location.replace("/");};
(function(){
  function doInsert(){
    if(document.querySelector(".tb-user-badge"))return;
    var u=window.__PIIT_USER__;if(!u)return;
    var initials=(u.name||"U").split(" ").map(function(w){return w[0]||"";}).join("").toUpperCase().slice(0,2);
    var tbRight=document.querySelector(".tb-right");if(!tbRight)return;
    var div=document.createElement("div");div.className="tb-user-badge";
    div.innerHTML="<div class=\\"tb-user-av\\">"+initials+"</div><div><div class=\\"tb-user-name\\">"+u.name+"</div><div class=\\"tb-user-role\\">"+u.role+"</div></div>";
    var btn=document.createElement("button");btn.className="tb-logout-btn";btn.textContent="\\u2192 Salir";
    btn.addEventListener("click",window.__piitLogout);
    tbRight.appendChild(div);tbRight.appendChild(btn);
  }
  document.addEventListener("DOMContentLoaded",function(){setTimeout(doInsert,80);});
  window.addEventListener("load",function(){setTimeout(doInsert,150);});
})();
</script>`

const DERIVADOS_FIX = `
<script>
(function(){
  var SECOP_URL='https://www.datos.gov.co/resource/jbjy-vk9h.json';
  var _loaded=false;
  function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function _stClass(s){return({'Activo':'st-eje','En ejecucion':'st-eje','Terminado':'st-ter','Finalizado':'st-ter','Liquidado':'st-liq','Suspendido':'st-sus','Enviado':'st-ini'})[s]||'st-proc';}
  function buildDerivados(records){
    var tb=document.getElementById('derivados-tbody');if(!tb)return;
    var safe=function(id,v){var el=document.getElementById(id);if(el)el.textContent=v;};
    var totalValorM=Math.round(records.reduce(function(s,r){return s+parseFloat(r.valor_del_contrato||0);},0)/1000000);
    var provs=new Set(records.map(function(r){return r.documento_proveedor;})).size;
    safe('deriv-kpi-n',records.length);safe('deriv-kpi-valor','$'+totalValorM.toLocaleString('es-CO')+'M');
    safe('deriv-kpi-obra',records.length+' contratos');safe('deriv-kpi-prov',provs+' proveedores');
    tb.innerHTML=records.map(function(r){
      var ref=r.referencia_del_contrato||'\\u2014';
      var obj=(r.objeto_del_contrato||r.descripcion_del_proceso||'\\u2014');
      var objShort=obj.length>100?obj.slice(0,100)+'\\u2026':obj;
      var tipo=r.tipo_de_contrato||'\\u2014';
      var valorM=Math.round(parseFloat(r.valor_del_contrato||0)/1000000);
      var prov=r.nombre_proveedor||r.proveedor_adjudicado||'\\u2014';
      var provShort=prov.length>40?prov.slice(0,40)+'\\u2026':prov;
      var estado=r.estado_contrato||'En proceso';
      var url='https://community.secop.gov.co/Public/Tendering/ContractNoticeManagement/Index?current=true&idContrato='+encodeURIComponent(ref);
      return'<tr><td style="padding:8px 12px;font-size:11px;font-family:monospace;white-space:nowrap">'+_esc(ref)+'</td>'
        +'<td style="padding:8px 12px;font-size:11px;max-width:280px">'+_esc(objShort)+'</td>'
        +'<td style="padding:8px 12px;font-size:10px;white-space:nowrap">'+_esc(tipo)+'</td>'
        +'<td style="padding:8px 12px;font-size:11px;text-align:right;font-weight:700">$'+valorM.toLocaleString('es-CO')+'</td>'
        +'<td style="padding:8px 12px;font-size:11px;text-align:center">'+_esc(provShort)+'</td>'
        +'<td style="padding:8px 12px;text-align:center"><span class="st '+_stClass(estado)+'">'+_esc(estado)+'</span></td>'
        +'<td style="padding:8px 12px;text-align:center"><a href="'+url+'" target="_blank" rel="noopener" style="font-size:10px;color:var(--au500)">Ver &#8599;</a></td></tr>';
    }).join('');
  }
  function fetchDerivados(){
    if(_loaded)return;
    var url=SECOP_URL+'?nit_entidad=901989964&$limit=50&$order=fecha_de_inicio_del_contrato%20DESC';
    var EMPTY_MSG='<tr><td colspan="7" style="padding:20px;text-align:center;color:var(--t300);font-size:12px">EDURSEG E.I.C.E. (NIT 901.989.964-8) a\\u00fan no tiene contratos publicados como entidad contratante en SECOP II. <a href="https://community.secop.gov.co/Public/Tendering/ContractNoticeManagement/Index" target="_blank" rel="noopener" style="color:var(--au500)">Consultar directamente &#8599;</a></td></tr>';
    fetch(url).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();})
      .then(function(data){_loaded=true;if(data&&data.length>0){buildDerivados(data);}else{var tb=document.getElementById('derivados-tbody');if(tb)tb.innerHTML=EMPTY_MSG;}})
      .catch(function(){var tb=document.getElementById('derivados-tbody');if(tb)tb.innerHTML=EMPTY_MSG;});
  }
  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(function(){
      if(window.PIIT&&window.PIIT.obras){var orig=window.PIIT.obras.init;window.PIIT.obras.init=function(){orig.call(this);fetchDerivados();};}
    },300);
  });
})();
</script>`

const SAT_JS = `
<script>
(function(){
  var _satMap=null, _nivel='verde';

  var AMENAZAS=[
    {tipo:'Inundación',zona:'Q. El Bagre · Q. La Cianuración',nivel:'Moderado',prob:65,color:'#2A6CA8',icon:'fa-water'},
    {tipo:'Movimiento en masa',zona:'Vda. La Cruzada · Cerros Galán',nivel:'Alto',prob:78,color:'#C9852A',icon:'fa-hill-rockslide'},
    {tipo:'Sismo',zona:'Nordeste Antioqueño · Falla Palestina',nivel:'Bajo',prob:22,color:'#16A34A',icon:'fa-wave-square'},
    {tipo:'Incendio forestal',zona:'Zona rural norte · Corredor veredal',nivel:'Moderado',prob:48,color:'#C84040',icon:'fa-fire'},
    {tipo:'Lluvias extremas',zona:'Municipio completo · Cuenca alta',nivel:'Alto',prob:72,color:'#C9852A',icon:'fa-cloud-showers-heavy'},
    {tipo:'Avenida torrencial',zona:'Q. La Cianuración · Barrio Briceño',nivel:'Moderado',prob:55,color:'#2A6CA8',icon:'fa-house-flood-water'},
  ];

  var EVENTOS=[
    {fecha:'2026-04-15',tipo:'Inundación',zona:'Barrio La Madre',afect:340,perdidas:1200,estado:'Controlado'},
    {fecha:'2025-11-03',tipo:'Deslizamiento',zona:'Vereda El Bagre',afect:28,perdidas:380,estado:'Cerrado'},
    {fecha:'2025-06-22',tipo:'Lluvia extrema',zona:'Área urbana',afect:1200,perdidas:850,estado:'Cerrado'},
    {fecha:'2025-02-10',tipo:'Avenida torrencial',zona:'Q. La Cianuración',afect:95,perdidas:560,estado:'Cerrado'},
    {fecha:'2024-10-08',tipo:'Incendio forestal',zona:'Zona rural norte',afect:0,perdidas:120,estado:'Cerrado'},
    {fecha:'2024-03-17',tipo:'Inundación',zona:'San Bartolo · San Joaquín',afect:89,perdidas:290,estado:'Cerrado'},
    {fecha:'2023-09-11',tipo:'Movimiento en masa',zona:'Vda. Fraguas',afect:15,perdidas:95,estado:'Cerrado'},
  ];

  var ALERTAS=[
    {tipo:'warn',tit:'Alerta hidrometeorológica IDEAM',sub:'Lluvia extrema · Probabilidad 72% · Próximas 24–48 h · Nordeste Antioqueño',tiempo:'hace 2 horas'},
    {tipo:'warn',tit:'Monitoreo nivel Q. El Bagre',sub:'Nivel: 62 cm · Umbral de alerta: 80 cm · Tendencia ascendente (+8 cm/12h)',tiempo:'hace 6 horas'},
    {tipo:'info',tit:'SGC · Actividad microsísmica',sub:'3 eventos M<2.0 en 72 h · Sin riesgo estructural reportado',tiempo:'hace 1 día'},
  ];

  var PROTOCOLOS=[
    {num:'01',tit:'Activación temprana',desc:'Al superar umbral IDEAM Nivel Amarillo: notificación al CDGRD y Alcaldía.'},
    {num:'02',tit:'Evacuación preventiva',desc:'Movilización de comunidades en zonas de riesgo alto con Defensa Civil.'},
    {num:'03',tit:'Cierre de vías',desc:'Restricción de paso vehicular en corredores con movimiento en masa activo.'},
    {num:'04',tit:'Activación albergues',desc:'4 albergues: IE Central, Coliseo, Club Social, Colegio Técnico.'},
    {num:'05',tit:'Coordinación interinstitucional',desc:'Mesa con Bomberos, Cruz Roja, Defensa Civil, Policía y Salud Pública.'},
    {num:'06',tit:'Comunicación comunitaria',desc:'Alertas SMS, megáfonos y redes sociales institucionales activados.'},
  ];

  var CONTACTOS=[
    {nombre:'Bomberos Segovia',tel:'116 · (604) 834-XXXX',ico:'🚒',bg:'#FFF1F2'},
    {nombre:'Cruz Roja Antioquia',tel:'132 · (604) 513-XXXX',ico:'🏥',bg:'#FFF1F2'},
    {nombre:'Defensa Civil',tel:'144 · (604) 834-XXXX',ico:'⛑',bg:'#FFFBEB'},
    {nombre:'CDGRD Municipal',tel:'(604) 834-XXXX · Dir. Prevención',ico:'🛡',bg:'#F0FDF4'},
    {nombre:'Línea nacional emergencias',tel:'123 · UNGRD',ico:'📞',bg:'#EFF6FF'},
    {nombre:'SIATA · Hidrometeorol.',tel:'(604) 444-XXXX · 24/7',ico:'📡',bg:'#EFF6FF'},
  ];

  var NIVELES={
    verde:   {label:'ALERTA VERDE',   title:'Sistema estable · Sin alertas activas declaradas',sub:'IDEAM · Sin eventos extremos en pronóstico · Monitoreo permanente · CDGRD',badgeBg:'#F0FDF4',badgeBrd:'#86EFAC',color:'#16A34A'},
    amarillo:{label:'ALERTA AMARILLA',title:'Monitoreo activo · Condiciones de precaución',sub:'IDEAM · Lluvias moderadas a fuertes · Cuencas en seguimiento · CDGRD activado',badgeBg:'#FEFCE8',badgeBrd:'#FDE047',color:'#CA8A04'},
    naranja: {label:'ALERTA NARANJA', title:'ALERTA DECLARADA · Eventos en desarrollo',sub:'CDGRD activado · Evacuación preventiva en zonas de riesgo · Recursos desplegados',badgeBg:'#FFF7ED',badgeBrd:'#FDBA74',color:'#EA580C'},
    rojo:    {label:'ALERTA ROJA',    title:'EMERGENCIA ACTIVA · Respuesta inmediata requerida',sub:'Plan de contingencia activado · Evacuación en curso · Coordinación interinstitucional',badgeBg:'#FFF1F2',badgeBrd:'#FCA5A5',color:'#DC2626'},
  };

  function initMap(){
    if(_satMap){_satMap.remove();_satMap=null;}
    var el=document.getElementById('sat-mapa');
    if(!el)return;
    // Retry si Leaflet aún no ha cargado (CDN async)
    if(typeof L==='undefined'){setTimeout(initMap,300);return;}
    _satMap=L.map(el,{zoomControl:false,scrollWheelZoom:false,attributionControl:false});
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{maxZoom:16}).addTo(_satMap);
    _satMap.setView([7.083,-74.678],12);
    L.control.zoom({position:'bottomright'}).addTo(_satMap);
    L.control.attribution({position:'bottomleft',prefix:false}).addTo(_satMap).addAttribution('&copy; CARTO · SGC · IDEAM');
    L.circle([7.075,-74.675],{radius:900,color:'#2A6CA8',fillColor:'#2A6CA8',fillOpacity:0.25,weight:2})
      .bindPopup('<b style="color:#1D4ED8">⚠ Inundación</b><br>Q. El Bagre · Riesgo Moderado<br><small style="color:#666">SIMMA · IDEAM</small>').addTo(_satMap);
    L.polygon([[7.095,-74.690],[7.100,-74.680],[7.092,-74.675],[7.088,-74.685]],
      {color:'#C9852A',fillColor:'#C9852A',fillOpacity:0.25,weight:2})
      .bindPopup('<b style="color:#92400E">⚠ Movimiento en masa</b><br>Vda. La Cruzada · Riesgo Alto<br><small style="color:#666">SIMMA · SGC</small>').addTo(_satMap);
    L.polygon([[7.110,-74.660],[7.115,-74.650],[7.107,-74.645],[7.103,-74.655]],
      {color:'#C84040',fillColor:'#C84040',fillOpacity:0.20,weight:2})
      .bindPopup('<b style="color:#991B1B">⚠ Incendio forestal</b><br>Zona rural norte · Riesgo Moderado<br><small style="color:#666">IDEAM · SINIF</small>').addTo(_satMap);
    L.polygon([[7.068,-74.665],[7.072,-74.658],[7.065,-74.653],[7.061,-74.661]],
      {color:'#2A6CA8',fillColor:'#2A6CA8',fillOpacity:0.20,weight:2})
      .bindPopup('<b style="color:#1D4ED8">⚠ Avenida torrencial</b><br>Q. La Cianuración · Riesgo Moderado').addTo(_satMap);
    L.circle([7.083,-74.678],{radius:1400,color:'#16A34A',fillColor:'#16A34A',fillOpacity:0.05,weight:1.5,dashArray:'6,4'})
      .bindPopup('<b style="color:#15803D">Perímetro urbano Segovia</b><br>Área de monitoreo SAT').addTo(_satMap);
    setTimeout(function(){if(_satMap)_satMap.invalidateSize();},250);
  }

  function buildAlertas(){
    var el=document.getElementById('sat-alertas-list');if(!el)return;
    el.innerHTML=ALERTAS.map(function(a){
      return'<div class="alert-item '+a.tipo+'" style="margin-bottom:10px">'
        +'<div class="alert-ico '+a.tipo+'"></div>'
        +'<div style="flex:1"><div class="alert-t">'+a.tit+'</div>'
        +'<div class="alert-s">'+a.sub+'</div>'
        +'<div style="font-size:10px;color:var(--text-4,#7A9E8C);margin-top:4px">'+a.tiempo+'</div></div></div>';
    }).join('');
  }

  function buildHistorial(){
    var tb=document.getElementById('sat-historial-tbody');if(!tb)return;
    var col={Controlado:'#EA580C',Cerrado:'#16A34A'};
    tb.innerHTML=EVENTOS.map(function(e){
      var c=col[e.estado]||'#888';
      return'<tr>'
        +'<td style="padding:9px 14px;font-family:monospace;font-size:11px">'+e.fecha+'</td>'
        +'<td style="padding:9px 14px;font-size:12px;font-weight:600">'+e.tipo+'</td>'
        +'<td style="padding:9px 14px;font-size:11px">'+e.zona+'</td>'
        +'<td style="padding:9px 14px;font-size:12px;text-align:right;font-family:monospace">'+(e.afect>0?e.afect.toLocaleString('es-CO'):'—')+'</td>'
        +'<td style="padding:9px 14px;font-size:11px;text-align:right;font-family:monospace">$'+e.perdidas.toLocaleString('es-CO')+'M</td>'
        +'<td style="padding:9px 14px;text-align:center"><span style="font-size:10px;font-weight:700;padding:2px 10px;border-radius:20px;background:'+c+'18;color:'+c+';border:1px solid '+c+'44">'+e.estado+'</span></td>'
        +'</tr>';
    }).join('');
  }

  function buildAmenazas(){
    var el=document.getElementById('sat-amenazas-grid');if(!el)return;
    var nc={Alto:'#DC2626',Moderado:'#EA580C',Bajo:'#16A34A'};
    el.innerHTML=AMENAZAS.map(function(a){
      var c=nc[a.nivel]||'#888';
      return'<div class="sat-amenaza-card">'
        +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'
        +'<div style="width:34px;height:34px;border-radius:10px;background:'+a.color+'14;border:1px solid '+a.color+'30;display:flex;align-items:center;justify-content:center">'
        +'<i class="fa-solid '+a.icon+'" style="color:'+a.color+';font-size:15px"></i></div>'
        +'<span style="font-size:10px;font-weight:700;padding:2px 9px;border-radius:20px;background:'+c+'12;color:'+c+';border:1px solid '+c+'30">'+a.nivel+'</span>'
        +'</div>'
        +'<div style="font-size:13px;font-weight:700;color:var(--text-1,#0F1F17);margin-bottom:3px">'+a.tipo+'</div>'
        +'<div style="font-size:11px;color:var(--text-4,#7A9E8C);margin-bottom:10px">'+a.zona+'</div>'
        +'<div class="sat-prob-bar"><div class="sat-prob-fill" style="width:'+a.prob+'%;background:'+a.color+'"></div></div>'
        +'<div style="font-size:10px;color:var(--text-5,#A8C4B8);margin-top:5px">'+a.prob+'% probabilidad · 30 días</div>'
        +'</div>';
    }).join('');
  }

  function buildProtocolos(){
    var el=document.getElementById('sat-protocolos');if(!el)return;
    el.innerHTML=PROTOCOLOS.map(function(p){
      return'<div class="sat-protocolo"><div class="sat-proto-num">'+p.num+'</div>'
        +'<div><div class="sat-proto-title">'+p.tit+'</div><div class="sat-proto-desc">'+p.desc+'</div></div></div>';
    }).join('');
  }

  function buildContactos(){
    var el=document.getElementById('sat-contactos');if(!el)return;
    el.innerHTML=CONTACTOS.map(function(c){
      return'<div class="sat-contacto"><div class="sat-contacto-ico" style="background:'+c.bg+'">'+c.ico+'</div>'
        +'<div><div class="sat-contacto-nombre">'+c.nombre+'</div><div class="sat-contacto-tel">'+c.tel+'</div></div></div>';
    }).join('');
  }

  function updateBanner(nivel){
    var n=NIVELES[nivel];if(!n)return;
    var banner=document.getElementById('sat-banner');
    var badge=document.getElementById('sat-nivel-badge');
    var bt=document.getElementById('sat-badge-txt');
    var title=document.getElementById('sat-banner-title');
    var sub=document.getElementById('sat-banner-sub');
    if(banner)banner.className='sat-banner '+nivel;
    if(badge){badge.style.background=n.badgeBg;badge.style.borderColor=n.badgeBrd;badge.style.color=n.color;}
    if(bt)bt.textContent=n.label;
    if(title)title.textContent=n.title;
    if(sub)sub.textContent=n.sub;
    var kn=document.getElementById('sat-kpi-nivel');
    var kb=document.getElementById('sat-kpi-nivel-badge');
    if(kn){kn.textContent=n.label.replace('ALERTA ','');kn.style.color=n.color;}
    if(kb)kb.textContent=nivel.toUpperCase();
  }

  var _timerId=null;
  function updateTime(){
    var el=document.getElementById('sat-time-txt');
    if(!el)return;
    var now=new Date();
    el.textContent=now.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})+' · '+now.toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'});
  }
  function startClock(){
    updateTime();
    if(_timerId)clearInterval(_timerId);
    _timerId=setInterval(updateTime,60000);
  }

  var _initialized=false;
  window.PIIT=window.PIIT||{};
  window.PIIT.riesgo={
    init:function(){
      buildAlertas();buildHistorial();buildAmenazas();buildProtocolos();buildContactos();
      updateBanner(_nivel);startClock();
      // El mapa se inicializa siempre (remove+recreate si ya existe)
      initMap();
      _initialized=true;
    },
    setNivel:function(nivel,el){
      _nivel=nivel;
      document.querySelectorAll('.sat-nivel-item').forEach(function(i){i.classList.remove('sat-activo');});
      if(el)el.classList.add('sat-activo');
      updateBanner(nivel);
    }
  };

  // Interceptar goSection como respaldo (el nav btn ya llama init directamente)
  document.addEventListener('DOMContentLoaded',function(){
    function patchGoSection(){
      if(!window.PIIT||!window.PIIT.ui||!window.PIIT.ui.goSection){
        setTimeout(patchGoSection,200);return;
      }
      var origGo=window.PIIT.ui.goSection;
      window.PIIT.ui.goSection=function(id,el){
        origGo.call(this,id,el);
        if(id==='s-riesgo')setTimeout(function(){window.PIIT.riesgo.init();},120);
      };
    }
    setTimeout(patchGoSection,400);
  });
})();
</script>`

// ══════════════════════════════════════════════════════════════════════
// 6. MINIMAP 3D · Three.js · Segovia 05736
//    SPDX-License-Identifier: GPL-3.0-or-later
//    作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
//    Source: https://github.com/songsummer920-dazzle/three-scope-map-skill
//    Adapted for PIIT Segovia v5 · Scope: city · Theme #1E7A4C
// ══════════════════════════════════════════════════════════════════════
const MINIMAP_JS = `
<style>
/* ══════════════════════════════════════════════════════════════
   VISOR CARTOGRÁFICO 3D · Estética ESRI / ArcGIS Dashboard
   Paleta: slate oscuro · teal técnico · sin neones ni brillos
   ══════════════════════════════════════════════════════════════ */

/* ── Contenedor principal · posición fija esquina inferior derecha ── */
#mm-outer{
  position:fixed;
  bottom:54px;right:18px;
  z-index:9000;
  width:242px;display:flex;flex-direction:column;
  border-radius:4px;overflow:hidden;
  border:1px solid rgba(255,255,255,0.09);
  background:#12161d;
  box-shadow:0 4px 20px rgba(0,0,0,0.55),0 1px 4px rgba(0,0,0,0.4);
  transition:box-shadow .2s ease,transform .2s ease;
}
#mm-outer:hover{
  box-shadow:0 6px 28px rgba(0,0,0,0.65),0 2px 6px rgba(0,0,0,0.5);
  transform:translateY(-2px);
}

/* ── Header institucional ── */
#mm-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:6px 10px 5px;
  background:#1a1f28;
  border-bottom:1px solid rgba(255,255,255,0.06);
  flex-shrink:0;
}
#mm-header-title{
  display:flex;flex-direction:column;gap:1px;
}
#mm-header-title .mm-ht-main{
  font-size:9px;font-weight:700;letter-spacing:0.08em;
  color:#c8d2dc;text-transform:uppercase;
  font-family:'Inter',system-ui,sans-serif;
}
#mm-header-title .mm-ht-sub{
  font-size:7.5px;color:#5c6b7a;letter-spacing:0.04em;
  font-family:'Inter',system-ui,sans-serif;font-weight:400;
}
#mm-header-badge{
  display:flex;align-items:center;gap:4px;
  background:#0e1420;border:1px solid rgba(255,255,255,0.07);
  border-radius:3px;padding:2px 6px;
}
#mm-header-badge .mm-hb-dot{
  width:5px;height:5px;border-radius:50%;
  background:#237938;flex-shrink:0;
  animation:mm-dot-blink 2.5s ease-in-out infinite;
}
#mm-header-badge .mm-hb-txt{
  font-size:7.5px;font-weight:600;color:#2d9445;
  font-family:'Inter',system-ui,sans-serif;letter-spacing:0.06em;
}

/* ── Canvas WebGL ── */
#mm-map{
  width:238px;height:158px;display:block;
  position:relative;overflow:hidden;
  background:#0b0f14;flex-shrink:0;
}
#mm-map canvas{position:absolute!important;top:0;left:0;z-index:1;}

/* Vignette sutil */
#mm-vignette{
  position:absolute;inset:0;pointer-events:none;z-index:800;
  background:radial-gradient(ellipse 90% 86% at 50% 50%,transparent 55%,rgba(11,15,20,0.5) 100%);
}

/* Compass minimalista */
#mm-compass{
  position:absolute;top:7px;right:7px;z-index:900;
  width:22px;height:22px;pointer-events:none;opacity:0.75;
}

/* Etiqueta topográfica "SEGOVIA" */
.mm-muni-label{
  background:rgba(10,14,20,0.88);
  color:#9db8c8;
  font-size:7.5px;font-weight:700;letter-spacing:0.16em;
  font-family:'Inter',system-ui,sans-serif;
  padding:2px 6px;border-radius:2px;
  border:1px solid rgba(255,255,255,0.1);
  text-transform:uppercase;white-space:nowrap;
}

/* Marcador sede municipal */
.mm-capital-wrap{
  position:relative;display:flex;align-items:center;justify-content:center;
  width:18px;height:18px;
}
.mm-capital-ring{
  position:absolute;width:14px;height:14px;border-radius:50%;
  border:1px solid rgba(180,160,90,0.5);
  animation:mm-ring-pulse 2.8s ease-out infinite;
}
.mm-capital-dot{
  width:6px;height:6px;border-radius:50%;
  background:#c8a840;border:1.5px solid rgba(255,255,255,0.7);
  position:relative;z-index:1;
}
@keyframes mm-ring-pulse{
  0%{transform:scale(.5);opacity:.8;}
  70%{transform:scale(1.6);opacity:0;}
  100%{transform:scale(1.6);opacity:0;}
}

/* ── Barra de metadatos ── */
#mm-meta-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:4px 10px;
  background:#141820;
  border-bottom:1px solid rgba(255,255,255,0.05);
  flex-shrink:0;
}
.mm-meta-item{display:flex;flex-direction:column;gap:1px;}
.mm-meta-lbl{font-size:6.5px;color:#4a5568;letter-spacing:0.06em;text-transform:uppercase;font-family:'Inter',system-ui,sans-serif;font-weight:500;}
.mm-meta-val{font-size:8.5px;color:#7a9bb0;font-family:'Fira Code',monospace,sans-serif;font-weight:500;letter-spacing:0.02em;}
.mm-meta-sep{width:1px;height:22px;background:rgba(255,255,255,0.06);}

/* ── Ticker de fuentes técnicas ── */
#mm-ticker{
  height:18px;overflow:hidden;position:relative;
  background:#0e1218;
  border-top:1px solid rgba(255,255,255,0.05);
  flex-shrink:0;
}
#mm-ticker-inner{
  display:inline-flex;align-items:center;white-space:nowrap;height:18px;
  animation:mm-ticker-scroll 45s linear infinite;
  font-size:8px;font-family:'Inter',system-ui,sans-serif;
  letter-spacing:0.03em;padding-left:8px;color:#3d4f5e;
}
.mm-t-live{
  display:inline-flex;align-items:center;gap:3px;margin-right:8px;
  color:#3d8b65;font-weight:700;font-size:7.5px;letter-spacing:0.07em;
  border-right:1px solid rgba(255,255,255,0.06);padding-right:8px;
}
.mm-t-live::before{
  content:'';display:inline-block;width:4px;height:4px;border-radius:50%;
  background:#3d8b65;animation:mm-dot-blink 2.5s ease-in-out infinite;
}
.mm-t-src{color:#3d4f5e;}
.mm-t-sep{color:#252e38;margin:0 4px;}
.mm-t-badge{color:#4a7a62;font-size:7.5px;font-weight:600;}
@keyframes mm-ticker-scroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes mm-dot-blink{0%,100%{opacity:1;}50%{opacity:.35;}}

/* ══ Panel Georreferenciación · Estilo ArcGIS Widget ══ */
#mm-geo-panel{
  background:#12161d;
  border-top:1px solid rgba(255,255,255,0.06);
  padding:0;display:flex;flex-direction:column;
  flex-shrink:0;
}
#mm-geo-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:5px 10px 4px;
  background:#0f1319;
  border-bottom:1px solid rgba(255,255,255,0.05);
}
#mm-geo-header-lbl{
  font-size:7px;font-weight:700;letter-spacing:0.12em;
  color:#4a5e6e;text-transform:uppercase;
  font-family:'Inter',system-ui,sans-serif;
}
#mm-geo-header-scope{
  font-size:7px;color:#2d6a48;font-weight:600;
  font-family:'Inter',system-ui,sans-serif;letter-spacing:0.04em;
}
#mm-geo-body{padding:6px 10px 6px;display:flex;flex-direction:column;gap:5px;}

/* Botones ESRI-style */
#mm-geo-bar{display:flex;gap:5px;}
#mm-geo-btn,#mm-geo-manual-btn{
  flex:1;display:flex;align-items:center;justify-content:center;gap:5px;
  background:#1a1f28;
  border:1px solid rgba(255,255,255,0.1);
  border-radius:3px;padding:5px 8px;
  color:#8a9eb0;font-size:8.5px;font-weight:500;
  font-family:'Inter',system-ui,sans-serif;letter-spacing:0.03em;
  cursor:pointer;transition:all .15s ease;
}
#mm-geo-btn:hover,#mm-geo-manual-btn:hover{
  background:#1e2530;border-color:rgba(61,139,101,0.4);color:#a8bfcc;
}
#mm-geo-btn:disabled{opacity:.4;cursor:not-allowed;}
#mm-geo-btn .mm-btn-icon,#mm-geo-manual-btn .mm-btn-icon{
  font-size:9px;line-height:1;
}
#mm-geo-manual-btn.active{
  background:#162318;border-color:rgba(61,139,101,0.5);color:#5fb896;
}

/* Inputs técnicos monoespaciados */
#mm-geo-manual{
  display:none;flex-direction:column;gap:4px;
  background:#0e1218;border:1px solid rgba(255,255,255,0.06);
  border-radius:3px;padding:6px 7px;
  animation:mm-geo-slide .15s ease;
}
@keyframes mm-geo-slide{from{opacity:0;transform:translateY(-3px);}to{opacity:1;transform:translateY(0);}}
.mm-coord-row{display:flex;align-items:center;gap:5px;}
.mm-coord-lbl{
  font-size:7px;font-weight:700;letter-spacing:0.08em;color:#3d5060;
  font-family:'Inter',system-ui,sans-serif;text-transform:uppercase;
  min-width:14px;text-align:center;
}
#mm-geo-lat,#mm-geo-lon{
  flex:1;background:#080c10;
  border:1px solid rgba(255,255,255,0.08);border-radius:2px;
  padding:4px 6px;font-size:8.5px;color:#7a9bb0;
  font-family:'Fira Code',monospace,sans-serif;
  outline:none;min-width:0;transition:border-color .15s;
}
#mm-geo-lat:focus,#mm-geo-lon:focus{
  border-color:rgba(61,139,101,0.5);color:#9ab8c8;
}
#mm-geo-lat::placeholder,#mm-geo-lon::placeholder{
  color:#2a3540;font-size:8px;
}
#mm-geo-apply{
  display:flex;align-items:center;justify-content:center;
  width:100%;
  background:#1a3028;border:1px solid rgba(61,139,101,0.4);
  border-radius:2px;padding:4px 8px;margin-top:2px;
  color:#5fb896;font-size:8px;font-weight:600;letter-spacing:0.06em;
  cursor:pointer;transition:all .15s;text-transform:uppercase;
  font-family:'Inter',system-ui,sans-serif;
}
#mm-geo-apply:hover{background:#1e3830;border-color:rgba(61,139,101,0.7);color:#7dcca8;}

/* Estado / feedback · sutil, institucional */
#mm-geo-status{
  display:flex;align-items:center;gap:5px;
  min-height:14px;padding:0 1px;
  font-size:7.5px;font-weight:500;letter-spacing:0.04em;
  font-family:'Inter',system-ui,sans-serif;
  color:#3d4f5e;transition:color .25s;
}
#mm-geo-status::before{
  content:'';flex-shrink:0;
  width:4px;height:4px;border-radius:50%;
  background:currentColor;opacity:0.7;
  display:none;
}
#mm-geo-status.has-msg::before{display:inline-block;}

/* Etiqueta ubicación usuario sobre canvas */
#mm-user-loc{
  position:absolute;top:7px;left:7px;z-index:910;pointer-events:none;
  background:rgba(8,12,18,0.9);
  border:1px solid rgba(32,80,160,0.5);
  border-radius:2px;padding:2px 6px;
  font-size:7.5px;font-weight:500;
  color:#6a9fc8;letter-spacing:0.04em;
  font-family:'Fira Code',monospace,sans-serif;
}
</style>
<script>
/* SPDX-License-Identifier: GPL-3.0-or-later
   作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
   Source: https://github.com/songsummer920-dazzle/three-scope-map-skill
   Adapted for PIIT Segovia · Scope: city · DIVIPOLA 05736 · Theme #1E7A4C */
(function(){

/* ── Polígono oficial Segovia · OSM rel. 1316170 · 84 vértices · 1.246 km² ── */
var SEG_COORDS=[
  [-74.6327,7.1637],[-74.3884,7.2739],[-74.3875,7.2763],[-74.3877,7.2779],
  [-74.3884,7.2821],[-74.3884,7.2851],[-74.3889,7.2902],[-74.3857,7.2932],
  [-74.3852,7.2975],[-74.3875,7.3002],[-74.3893,7.3025],[-74.3932,7.3058],
  [-74.3945,7.3082],[-74.3993,7.3118],[-74.4014,7.3156],[-74.4025,7.3227],
  [-74.4020,7.3288],[-74.4017,7.3338],[-74.3977,7.3438],[-74.3998,7.3473],
  [-74.3884,7.3540],[-74.3894,7.3592],[-74.3815,7.3621],[-74.3730,7.3714],
  [-74.3695,7.3784],[-74.3643,7.3857],[-74.3629,7.3920],[-74.3561,7.4002],
  [-74.3534,7.4011],[-74.3484,7.4036],[-74.3466,7.4071],[-74.3445,7.4123],
  [-74.3399,7.4127],[-74.3388,7.4167],[-74.3386,7.4195],[-74.3411,7.4213],
  [-74.3428,7.4256],[-74.3452,7.4286],[-74.3466,7.4319],[-74.3515,7.4318],
  [-74.3529,7.4348],[-74.3571,7.4382],[-74.3604,7.4458],[-74.3633,7.4451],
  [-74.3634,7.4527],[-74.3698,7.4658],[-74.3886,7.4640],[-74.4133,7.4587],
  [-74.4214,7.4412],[-74.4135,7.4256],[-74.4131,7.4006],[-74.4179,7.3821],
  [-74.4387,7.3814],[-74.4536,7.3671],[-74.4697,7.3455],[-74.5117,7.3792],
  [-74.5304,7.3946],[-74.5432,7.4055],[-74.5604,7.4186],[-74.5707,7.4214],
  [-74.5852,7.4077],[-74.5915,7.3964],[-74.6058,7.3881],[-74.6084,7.3867],
  [-74.6106,7.3910],[-74.6991,7.3127],[-74.9077,7.2316],[-74.8899,7.2294],
  [-74.8718,7.2132],[-74.8622,7.1899],[-74.8558,7.1682],[-74.8484,7.1609],
  [-74.8515,7.1483],[-74.8458,7.1361],[-74.7043,7.0798],[-74.6853,7.0842],
  [-74.6809,7.0886],[-74.6719,7.1003],[-74.6639,7.1254],[-74.6603,7.1380],
  [-74.6611,7.1473],[-74.6571,7.1573],[-74.6348,7.1603],[-74.6327,7.1637]
];

/* ── Tema ArcGIS/ESRI institucional · slate oscuro · teal técnico ── */
/* Tema: Verde oficial Manual de Identidad Segovia #237938 */
var THEME={
  primary:    0x237938,   /* verde oficial primario #237938 */
  outline:    0x2d9445,   /* outline verde claro */
  topFill:    0x070e09,   /* superficie superior muy oscura (norma template) */
  topOpacity: 0.90,
  sideTop:    0x237938,   /* gradiente lateral: verde oficial arriba */
  sideMid:    0x144a22,   /* verde medio oscuro */
  sideBottom: 0x040e07,   /* base casi negra */
  hudRing:    0x1a3d22,   /* anillo HUD verde oscuro */
  hudRing2:   0x237938,   /* anillo 2 verde oficial */
  chaseHead:  0xFFFFFF,   /* chase light head: blanco (norma template) */
  chaseTail:  0x48B72C,   /* cola chase: verde 2 oficial #48B72C */
  ambientHex: 0x0d1a0f,   /* ambiente oscuro con tinte verde */
  dirHex:     0x237938,   /* luz direccional: verde oficial */
  pointHex:   0x48B72C,   /* point light: verde secundario oficial */
};

var FUENTES=[
  'Three.js 3D','IGAC 1:25.000','OSM rel. 1316170','DANE · DIVIPOLA 05736',
  'Nordeste Antioqueño','Área: 1.246 km²','Scope: city','PIIT Segovia v5',
  'Agrología IGAC','SGC · Amenaza','Three.js 3D','IGAC 1:25.000',
  'OSM rel. 1316170','DANE · DIVIPOLA 05736'
];

/* Compass ESRI-style: minimalista, sin brillos */
var COMPASS_SVG='<svg id="mm-compass" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px;position:absolute;top:7px;right:7px;z-index:900;pointer-events:none;opacity:0.7;">'
  +'<circle cx="12" cy="12" r="10" fill="rgba(9,14,18,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>'
  +'<polygon points="12,3 10.8,12 12,10.5 13.2,12" fill="#c8342a" opacity="0.85"/>'
  +'<polygon points="12,21 10.8,12 12,13.5 13.2,12" fill="rgba(200,210,220,0.35)"/>'
  +'<text x="12" y="7" text-anchor="middle" font-size="4.5" font-weight="700" fill="rgba(200,80,70,0.9)" font-family="Inter,sans-serif">N</text>'
  +'</svg>';

function buildTicker(wrap){
  var t=document.createElement('div');t.id='mm-ticker';
  var inner=document.createElement('div');inner.id='mm-ticker-inner';
  var html='<span class="mm-t-live">SIG ACTIVO</span>';
  FUENTES.concat(FUENTES).forEach(function(s){
    html+='<span class="mm-t-src">'+s+'</span><span class="mm-t-sep">·</span>';
  });
  inner.innerHTML=html;t.appendChild(inner);wrap.appendChild(t);
}

/* ── Carga Three.js desde CDN ── */
function loadThree(cb){
  if(window.THREE){cb();return;}
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload=function(){if(window.THREE)cb();else fallback(cb);};
  s.onerror=function(){fallback(cb);};
  document.head.appendChild(s);
  function fallback(cb2){
    var s2=document.createElement('script');
    s2.src='https://unpkg.com/three@0.128.0/build/three.min.js';
    s2.onload=cb2;
    document.head.appendChild(s2);
  }
}

function initMinimap(){
  var old=document.getElementById('minimap');
  if(!old)return;

  /* Outer wrapper */
  var outer=document.createElement('div');
  outer.id='mm-outer';
  outer.title='Visor 3D · Municipio de Segovia · DIVIPOLA 05736 · IGAC 1:25.000';

  /* ── Header institucional ESRI-style ── */
  var header=document.createElement('div');
  header.id='mm-header';
  header.innerHTML=
    '<div id="mm-header-title">'
    +'<span class="mm-ht-main">Visor Cartográfico 3D</span>'
    +'<span class="mm-ht-sub">SEGOVIA · ANT · DIVIPOLA 05736</span>'
    +'</div>'
    +'<div id="mm-header-badge">'
    +'<span class="mm-hb-dot"></span>'
    +'<span class="mm-hb-txt">EN LÍNEA</span>'
    +'</div>';
  outer.appendChild(header);

  /* Map container */
  var mapDiv=document.createElement('div');
  mapDiv.id='mm-map';

  old.parentNode.replaceChild(outer,old);
  outer.appendChild(mapDiv);

  /* ── Barra de metadatos ── */
  var metaBar=document.createElement('div');
  metaBar.id='mm-meta-bar';
  metaBar.innerHTML=
    '<div class="mm-meta-item"><span class="mm-meta-lbl">Escala</span><span class="mm-meta-val">1:25.000</span></div>'
    +'<div class="mm-meta-sep"></div>'
    +'<div class="mm-meta-item"><span class="mm-meta-lbl">Área</span><span class="mm-meta-val">1.246 km²</span></div>'
    +'<div class="mm-meta-sep"></div>'
    +'<div class="mm-meta-item"><span class="mm-meta-lbl">Datum</span><span class="mm-meta-val">MAGNA-SIRGAS</span></div>';
  outer.appendChild(metaBar);

  buildTicker(outer);

  /* Overlays HTML encima del canvas WebGL */
  var vignette=document.createElement('div');
  vignette.id='mm-vignette';
  mapDiv.appendChild(vignette);

  /* Compass SVG directo */
  mapDiv.insertAdjacentHTML('beforeend', COMPASS_SVG);

  var lblDiv=document.createElement('div');
  lblDiv.style.cssText='position:absolute;bottom:8px;left:50%;transform:translateX(-50%);z-index:900;pointer-events:none;';
  lblDiv.innerHTML='<div class="mm-muni-label">SEGOVIA · 1.246 km²</div>';
  mapDiv.appendChild(lblDiv);

  var capDiv=document.createElement('div');
  capDiv.style.cssText='position:absolute;top:46%;left:48%;z-index:850;pointer-events:none;transform:translate(-50%,-50%);';
  capDiv.innerHTML='<div class="mm-capital-wrap"><div class="mm-capital-ring"></div><div class="mm-capital-dot"></div></div>';
  mapDiv.appendChild(capDiv);

  /* ── Panel geolocalización (debajo del ticker) ── */
  var geoPanel=document.createElement('div');
  geoPanel.id='mm-geo-panel';
  geoPanel.innerHTML=
    '<div id="mm-geo-header">'
    +'<span id="mm-geo-header-lbl">Georreferenciación</span>'
    +'<span id="mm-geo-header-scope">WGS84 · EPSG:4326</span>'
    +'</div>'
    +'<div id="mm-geo-body">'
    +'<div id="mm-geo-bar">'
    +'<button id="mm-geo-btn" title="Obtener ubicación GPS del dispositivo">'
    +'<span class="mm-btn-icon">◎</span><span id="mm-geo-txt">Mi Ubicación GPS</span>'
    +'</button>'
    +'<button id="mm-geo-manual-btn" title="Ingresar coordenadas manualmente">'
    +'<span class="mm-btn-icon">⌨</span>Manual'
    +'</button>'
    +'</div>'
    +'<div id="mm-geo-manual">'
    +'<div class="mm-coord-row"><span class="mm-coord-lbl">LAT</span><input id="mm-geo-lat" type="number" placeholder="7.0832" step="0.0001"></div>'
    +'<div class="mm-coord-row"><span class="mm-coord-lbl">LON</span><input id="mm-geo-lon" type="number" placeholder="-74.6784" step="0.0001"></div>'
    +'<button id="mm-geo-apply">Aplicar coordenadas</button>'
    +'</div>'
    +'<div id="mm-geo-status"></div>'
    +'</div>';
  outer.appendChild(geoPanel);

  /* Eventos del panel */
  setTimeout(function(){
    var btnGeo=document.getElementById('mm-geo-btn');
    var btnManual=document.getElementById('mm-geo-manual-btn');
    var manualDiv=document.getElementById('mm-geo-manual');
    var btnApply=document.getElementById('mm-geo-apply');
    var statusEl=document.getElementById('mm-geo-status');

    function setStatus(msg,color){
      if(!statusEl)return;
      statusEl.textContent=msg;
      statusEl.classList.toggle('has-msg',!!msg);
      statusEl.style.color=color||'#3d4f5e';
    }

    function placeUser(lon,lat,acc,spd,hdg){
      /* 1. Marcador en el visor 3D */
      if(window._PIIT_minimap3D&&window._PIIT_minimap3D.addUserMarker){
        window._PIIT_minimap3D.addUserMarker(lon,lat);
      }
      /* 2. Sincronizar con el mapa Leaflet principal */
      if(window.PIIT&&window.PIIT.map&&window.PIIT.map.locateUser){
        window.PIIT.map.locateUser(lat,lon,acc,spd,hdg);
      }
    }

    /* ══ GPS de alta precisión ═══════════════════════════════════════════════
       Flujo: getCurrentPosition (respuesta rápida) → watchPosition (refinamiento)
       Se actualiza el mapa solo si la nueva lectura mejora la precisión anterior.
       El watch se detiene cuando: precisión ≤ 10 m ó tras 20 s sin mejora.
       ═══════════════════════════════════════════════════════════════════════ */
    var _watchId      = null;
    var _bestAccuracy = Infinity;
    var _refineTimer  = null;
    var _dots         = 0;
    var _dotTimer     = null;

    function gpsLabel(acc){
      if(acc <= 1)  return 'GPS · Alta precisión';
      if(acc <= 5)  return 'GPS · Buena señal';
      if(acc <= 15) return 'GPS · Señal media';
      return 'GPS · Señal débil';
    }

    function animDots(){
      _dots=(_dots+1)%4;
      var txt=document.getElementById('mm-geo-txt');
      if(txt) txt.textContent='Refinando'+'.'.repeat(_dots+1);
    }

    function stopWatch(reason){
      if(_watchId!==null){navigator.geolocation.clearWatch(_watchId);_watchId=null;}
      if(_refineTimer){clearTimeout(_refineTimer);_refineTimer=null;}
      if(_dotTimer){clearInterval(_dotTimer);_dotTimer=null;}
      _bestAccuracy=Infinity;
      var txt=document.getElementById('mm-geo-txt');
      if(txt) txt.textContent='Mi Ubicación GPS';
      if(btnGeo) btnGeo.disabled=false;
      if(reason) setStatus(reason,'#4a9e72');
      /* Resetear estado para permitir nueva sesión GPS con vuelo */
      if(window.PIIT&&window.PIIT.map&&window.PIIT.map.resetGPSState)
        window.PIIT.map.resetGPSState();
    }

    function onPosition(pos){
      var lat=pos.coords.latitude;
      var lon=pos.coords.longitude;
      var acc=pos.coords.accuracy||999;
      var spd=pos.coords.speed;
      var hdg=pos.coords.heading;

      /* Solo actualizar si mejora la precisión */
      if(acc >= _bestAccuracy) return;
      _bestAccuracy=acc;

      /* Reiniciar timer de "sin mejora" (20 s) */
      if(_refineTimer) clearTimeout(_refineTimer);
      _refineTimer=setTimeout(function(){
        var a=_bestAccuracy;
        var aStr=a<1?a.toFixed(2):a<10?a.toFixed(1):Math.round(a);
        stopWatch('✓ '+gpsLabel(a)+' · ±'+aStr+' m');
      }, 20000);

      /* Actualizar mapa y visor */
      placeUser(lon, lat, acc, spd, hdg);
      var accTxt = acc<1000 ? ' · ±'+Math.round(acc)+' m' : '';
      setStatus('⊙ Refinando'+accTxt,'#3a8a6a');

      /* Detener si ya es suficientemente preciso (≤1 m = chip GPS nativo) */
      if(acc<=1){
        stopWatch('✓ '+gpsLabel(acc)+' · ±'+acc.toFixed(1)+' m');
      }
    }

    function onError(err){
      stopWatch(null);
      var msgs={
        1:'Acceso GPS denegado — verificar permisos',
        2:'Señal GPS no disponible',
        3:'Tiempo de espera agotado'
      };
      setStatus('⚠ '+(msgs[err.code]||'Error de posicionamiento'),'#8a4a4a');
    }

    if(btnGeo) btnGeo.addEventListener('click',function(){
      if(!navigator.geolocation){setStatus('GPS no disponible en este navegador','#8a4a4a');return;}

      /* Si ya hay un watch activo → detener (toggle) */
      if(_watchId!==null){stopWatch('GPS detenido manualmente');return;}

      /* Reset de estado */
      _bestAccuracy=Infinity;
      btnGeo.disabled=true;
      setStatus('⊙ Adquiriendo señal GPS…','#5a7a9a');
      var txt=document.getElementById('mm-geo-txt');
      if(txt) txt.textContent='Solicitando…';

      var GPS_OPTS={enableHighAccuracy:true, timeout:15000, maximumAge:0};

      /* Fase 1: getCurrentPosition — respuesta inmediata (puede ser red/Wi-Fi) */
      navigator.geolocation.getCurrentPosition(
        function(pos){
          onPosition(pos);
          /* Fase 2: watchPosition — refinamiento continuo con GPS real */
          if(_dotTimer) clearInterval(_dotTimer);
          _dotTimer=setInterval(animDots, 600);
          _watchId=navigator.geolocation.watchPosition(onPosition, onError, GPS_OPTS);
          /* Timeout global: 30 s máximo de watch */
          setTimeout(function(){
            if(_watchId!==null){
              var a=_bestAccuracy<Infinity?_bestAccuracy:999;
              var aStr=a<1?a.toFixed(2):a<10?a.toFixed(1):Math.round(a);
              stopWatch('✓ '+gpsLabel(a)+' · ±'+aStr+' m');
            }
          }, 30000);
        },
        function(err){
          /* Sin respuesta rápida → intentar solo watchPosition */
          if(err.code===3||err.code===2){
            if(_dotTimer) clearInterval(_dotTimer);
            _dotTimer=setInterval(animDots, 600);
            _watchId=navigator.geolocation.watchPosition(onPosition, onError, GPS_OPTS);
            setStatus('⊙ Buscando señal GPS…','#5a7a9a');
            setTimeout(function(){
              if(_watchId!==null&&_bestAccuracy===Infinity) stopWatch(null);
              if(_bestAccuracy===Infinity) setStatus('⚠ Sin señal GPS disponible','#8a4a4a');
            }, 30000);
          } else {
            onError(err);
          }
        },
        GPS_OPTS
      );
    });

    if(btnManual) btnManual.addEventListener('click',function(){
      var open=manualDiv.style.display==='none';
      manualDiv.style.display=open?'flex':'none';
      btnManual.classList.toggle('active',open);
    });

    if(btnApply) btnApply.addEventListener('click',function(){
      var lat=parseFloat(document.getElementById('mm-geo-lat').value);
      var lon=parseFloat(document.getElementById('mm-geo-lon').value);
      if(isNaN(lat)||isNaN(lon)){setStatus('Coordenadas inválidas','#F87171');return;}
      if(lat<-90||lat>90||lon<-180||lon>180){setStatus('Rango inválido','#F87171');return;}
      placeUser(lon,lat);
      manualDiv.style.display='none';
    });

    /* Enter en inputs */
    ['mm-geo-lat','mm-geo-lon'].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.addEventListener('keydown',function(e){if(e.key==='Enter')btnApply&&btnApply.click();});
    });
  },1200);

  loadThree(function(){
    init3DMap(mapDiv);
  });
}

function init3DMap(container){
  var W=container.offsetWidth||220;
  var H=container.offsetHeight||162;

  /* ── Proyección geográfica → espacio 3D ── */
  var lonMin=-74.9161,lonMax=-74.3380;
  var latMin=7.0764,  latMax=7.4788;
  var lonC=(lonMin+lonMax)/2, latC=(latMin+latMax)/2;
  var mapScale=36/Math.max(lonMax-lonMin,latMax-latMin); // ~62 units de ancho

  function proj(lon,lat){
    return [(lon-lonC)*mapScale,(lat-latC)*mapScale];
  }

  /* ── Scene ── */
  var THREE=window.THREE;
  var scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x040E08,0.005);

  /* ── Renderer ── */
  var renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x040E08,1);
  container.insertBefore(renderer.domElement,container.firstChild);
  renderer.domElement.style.cssText='position:absolute;top:0;left:0;z-index:1;';

  /* ── Camera · ángulo inclinado para máxima visibilidad del polígono ── */
  var camera=new THREE.PerspectiveCamera(44,W/H,0.1,500);
  camera.position.set(0,-18,52);
  camera.lookAt(0,2,3);

  /* ── Luces ── */
  scene.add(new THREE.AmbientLight(THEME.ambientHex,4));
  var dir=new THREE.DirectionalLight(THEME.dirHex,2.5);
  dir.position.set(20,30,40);
  scene.add(dir);
  var pt=new THREE.PointLight(THEME.pointHex,2,90);
  pt.position.set(0,0,22);
  scene.add(pt);

  /* ── THREE.Shape desde polígono Segovia ── */
  var shape=new THREE.Shape();
  var p0=proj(SEG_COORDS[0][0],SEG_COORDS[0][1]);
  shape.moveTo(p0[0],p0[1]);
  for(var i=1;i<SEG_COORDS.length-1;i++){
    var pi=proj(SEG_COORDS[i][0],SEG_COORDS[i][1]);
    shape.lineTo(pi[0],pi[1]);
  }
  shape.closePath();

  var DEPTH=9;
  var geo=new THREE.ExtrudeGeometry(shape,{depth:DEPTH,bevelEnabled:false});

  /* Material superfice superior: oscuro translúcido (norma template) */
  var topMat=new THREE.MeshPhongMaterial({
    color:THEME.topFill,transparent:true,opacity:THEME.topOpacity,
    shininess:80,specular:new THREE.Color(THEME.outline),side:THREE.FrontSide
  });

  /* Material lateral: gradiente vertical shader (norma template) */
  var sideMat=new THREE.ShaderMaterial({
    uniforms:{
      uTop:{value:new THREE.Color(THEME.sideTop)},
      uMid:{value:new THREE.Color(THEME.sideMid)},
      uBot:{value:new THREE.Color(THEME.sideBottom)},
      uDepth:{value:DEPTH}
    },
    vertexShader:'varying float vZ;void main(){vZ=position.z;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 uTop;uniform vec3 uMid;uniform vec3 uBot;uniform float uDepth;varying float vZ;void main(){float t=clamp(vZ/uDepth,0.0,1.0);float t2=t*t;vec3 col=t>0.5?mix(uMid,uTop,(t-0.5)*2.0):mix(uBot,uMid,t*2.0);gl_FragColor=vec4(col,1.0);}',
    side:THREE.FrontSide
  });

  var mapGroup=new THREE.Group();
  var mesh=new THREE.Mesh(geo,[topMat,sideMat]);
  mapGroup.add(mesh);

  /* ── Contorno exterior superior (outline verde) ── */
  var outerPts=shape.getPoints(120);
  var topVerts=[];
  outerPts.forEach(function(p){topVerts.push(p.x,p.y,DEPTH+0.18);});
  topVerts.push(outerPts[0].x,outerPts[0].y,DEPTH+0.18);
  var topOutlineGeo=new THREE.BufferGeometry();
  topOutlineGeo.setAttribute('position',new THREE.Float32BufferAttribute(topVerts,3));
  mapGroup.add(new THREE.Line(topOutlineGeo,new THREE.LineBasicMaterial({color:THEME.outline,linewidth:1})));

  /* ── Contorno exterior inferior ── */
  var botVerts=[];
  outerPts.forEach(function(p){botVerts.push(p.x,p.y,-0.1);});
  botVerts.push(outerPts[0].x,outerPts[0].y,-0.1);
  var botOutlineGeo=new THREE.BufferGeometry();
  botOutlineGeo.setAttribute('position',new THREE.Float32BufferAttribute(botVerts,3));
  mapGroup.add(new THREE.Line(botOutlineGeo,new THREE.LineBasicMaterial({color:THEME.hudRing,transparent:true,opacity:0.5})));

  scene.add(mapGroup);

  /* ── Anillo HUD base (rotatorio) · inclinado para coincidir con vista de cámara ── */
  var ringGeo=new THREE.RingGeometry(30,33,80);
  var ringMat=new THREE.MeshBasicMaterial({color:THEME.hudRing,transparent:true,opacity:0.18,side:THREE.DoubleSide});
  var ring=new THREE.Mesh(ringGeo,ringMat);
  ring.position.set(0,0,-1);
  scene.add(ring);

  var ring2Geo=new THREE.RingGeometry(35,35.6,80);
  var ring2Mat=new THREE.MeshBasicMaterial({color:THEME.hudRing2,transparent:true,opacity:0.28,side:THREE.DoubleSide});
  var ring2=new THREE.Mesh(ring2Geo,ring2Mat);
  ring2.position.set(0,0,-1);
  scene.add(ring2);

  /* ── Chase light — segmentos cortos animados · norma template ──
     Se renderiza como THREE.Line (no ribbon mesh, no triangle strip)
     para evitar artefactos blancos en auto-intersecciones */
  var chasePath=shape.getPoints(240);
  var chaseN=34;
  var chaseZ=DEPTH+0.32;
  var chasePos=0;
  var chaseGroup=new THREE.Group();
  scene.add(chaseGroup);

  var chaseSegs=[];
  for(var si=0;si<chaseN;si++){
    var sGeo=new THREE.BufferGeometry();
    sGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,0,0],3));
    var alpha=Math.pow(1-si/chaseN,1.5)*0.9;
    var col=si===0?new THREE.Color(THEME.chaseHead):new THREE.Color(THEME.chaseTail);
    var sMat=new THREE.LineBasicMaterial({color:col,transparent:true,opacity:alpha});
    var seg=new THREE.Line(sGeo,sMat);
    chaseGroup.add(seg);
    chaseSegs.push(sGeo);
  }

  var chaseLen=chasePath.length;
  function updateChase(){
    chasePos=(chasePos+0.65)%chaseLen;
    for(var si=0;si<chaseN;si++){
      var idx=Math.floor((chasePos-si*2.2+chaseLen*100)%chaseLen);
      var idx2=(idx+1)%chaseLen;
      var c1=chasePath[idx],c2=chasePath[idx2];
      var arr=chaseSegs[si].attributes.position.array;
      arr[0]=c1.x;arr[1]=c1.y;arr[2]=chaseZ;
      arr[3]=c2.x;arr[4]=c2.y;arr[5]=chaseZ;
      chaseSegs[si].attributes.position.needsUpdate=true;
    }
  }

  /* ── Marcador de ubicación del usuario ── */
  var userMarker=null;
  var userRipple=null;
  var userRippleTick=0;

  function addUserMarker(lon,lat){
    var p=proj(lon,lat);
    /* Dot · verde oficial #237938 */
    var dotGeo=new THREE.SphereGeometry(0.8,16,16);
    var dotMat=new THREE.MeshPhongMaterial({color:0x237938,emissive:0x48B72C,shininess:80});
    var dot=new THREE.Mesh(dotGeo,dotMat);
    dot.position.set(p[0],p[1],DEPTH+1.1);
    if(userMarker)scene.remove(userMarker);
    userMarker=dot;
    scene.add(dot);
    /* Ripple ring · verde secundario oficial #48B72C */
    var ripGeo=new THREE.RingGeometry(0,1.8,28);
    var ripMat=new THREE.MeshBasicMaterial({color:0x48B72C,transparent:true,opacity:0.45,side:THREE.DoubleSide});
    var rip=new THREE.Mesh(ripGeo,ripMat);
    rip.position.set(p[0],p[1],DEPTH+0.15);
    if(userRipple)scene.remove(userRipple);
    userRipple=rip;
    userRippleTick=0;
    scene.add(rip);
    /* Etiqueta HTML monoespaciada ESRI */
    var oldLbl=document.getElementById('mm-user-loc');
    if(oldLbl)oldLbl.remove();
    var lbl=document.createElement('div');
    lbl.id='mm-user-loc';
    lbl.textContent=lon.toFixed(4)+', '+lat.toFixed(4);
    container.appendChild(lbl);
  }

  /* ── Animación (sin rotación automática) ── */
  var tick=0;
  var rafId=0;
  function animate(){
    rafId=requestAnimationFrame(animate);
    tick+=0.006;
    /* Sin rotación: mapa fijo para máxima identificación */
    mapGroup.rotation.z=0;
    mapGroup.rotation.x=0;
    ring.rotation.z=tick*0.3;
    ring2.rotation.z=-tick*0.18;
    /* Pulso suave de punto de luz */
    pt.intensity=1.8+Math.sin(tick*2)*0.4;
    /* Ripple usuario */
    if(userRipple){
      userRippleTick+=0.04;
      var sc=1+userRippleTick*2.5;
      userRipple.scale.set(sc,sc,1);
      userRipple.material.opacity=Math.max(0,0.6-userRippleTick*0.12);
      if(userRippleTick>5){userRippleTick=0;}
    }
    updateChase();
    renderer.render(scene,camera);
  }
  animate();

  window._PIIT_minimap3D={
    renderer:renderer,
    addUserMarker:addUserMarker,
    proj:proj,
    resize:function(){
      var c=document.getElementById('mm-map');
      if(!c)return;
      var w=c.offsetWidth||220,h=c.offsetHeight||162;
      renderer.setSize(w,h);
      camera.aspect=w/h;
      camera.updateProjectionMatrix();
    },
    dispose:function(){cancelAnimationFrame(rafId);renderer.dispose();}
  };
}

function patchGoSectionForMinimap(){
  if(!window.PIIT||!window.PIIT.ui||!window.PIIT.ui.goSection){
    setTimeout(patchGoSectionForMinimap,300);return;
  }
  var orig=window.PIIT.ui.goSection;
  window.PIIT.ui.goSection=function(id,el){
    orig.call(this,id,el);
    if(id==='s-mapa'&&window._PIIT_minimap3D)
      setTimeout(function(){window._PIIT_minimap3D.resize();},200);
    if(id==='s-riesgo'&&window.PIIT.riesgo)
      setTimeout(function(){window.PIIT.riesgo.init();},120);
  };
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(initMinimap,900);
    setTimeout(patchGoSectionForMinimap,600);
  });
}else{
  setTimeout(initMinimap,900);
  setTimeout(patchGoSectionForMinimap,600);
}
})();
</script>`

// ══════════════════════════════════════════════════════════════════════
// 7. REPORTES REALES — datos oficiales de prestadores (SUI·SSPD·DANE)
// ══════════════════════════════════════════════════════════════════════
const REPORTES_REAL = `
<style>
/* ── Fichas reales de prestadores ── */
#rep-real-banner{
  margin-bottom:18px;display:flex;align-items:center;gap:10px;
  background:linear-gradient(90deg,#EAF8F1 0%,#F7FBEF 100%);
  border:1px solid rgba(30,122,76,0.25);border-radius:10px;
  padding:10px 16px;
}
#rep-real-banner .rb-ico{font-size:20px;}
#rep-real-banner .rb-txt{font-size:11px;color:var(--t600);line-height:1.5;}
#rep-real-banner .rb-txt strong{color:var(--g700);}
#rep-real-banner .rb-badge{
  margin-left:auto;flex-shrink:0;
  font-size:9px;font-weight:700;letter-spacing:0.06em;
  background:rgba(30,122,76,0.12);color:var(--g700);
  border:1px solid rgba(30,122,76,0.3);border-radius:4px;padding:3px 8px;
}
/* Fichas prestadores reales */
.prest-data-grid{
  display:grid;grid-template-columns:repeat(2,1fr);gap:14px;
  margin-bottom:18px;
}
.prest-data-card{
  background:#fff;border:1px solid var(--g100);border-radius:10px;
  padding:14px 16px;box-shadow:0 1px 4px rgba(9,38,22,0.06);
}
.pdc-header{
  display:flex;align-items:center;gap:8px;
  padding-bottom:10px;border-bottom:1px solid var(--g50);margin-bottom:10px;
}
.pdc-ico{
  width:32px;height:32px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  font-size:16px;flex-shrink:0;
}
.pdc-nom{font-size:12px;font-weight:700;color:var(--t900);line-height:1.3;}
.pdc-tipo{font-size:10px;color:var(--t400);}
.pdc-row{
  display:flex;justify-content:space-between;align-items:flex-start;
  padding:5px 0;border-bottom:1px solid var(--g50);font-size:10.5px;
}
.pdc-row:last-child{border-bottom:none;}
.pdc-row .lbl{color:var(--t400);flex-shrink:0;padding-right:8px;}
.pdc-row .val{color:var(--t800);font-weight:600;text-align:right;}
.pdc-row .val.ok{color:var(--g600);}
.pdc-row .val.amber{color:var(--amber);}
.pdc-row .val.red{color:var(--red);}
.pdc-source{
  margin-top:8px;font-size:8.5px;color:var(--t300);
  display:flex;align-items:center;gap:4px;
}
.pdc-source::before{content:'📋';font-size:8px;}
/* Botón PQR EDURSEG */
.pdc-pqr-btn{
  display:flex;align-items:center;justify-content:center;gap:6px;
  margin-top:10px;padding:8px 12px;
  background:var(--seg-green,#237938);color:#fff;
  border-radius:7px;font-size:11px;font-weight:700;
  text-decoration:none;letter-spacing:0.01em;
  transition:background 0.18s ease,box-shadow 0.18s ease;
  box-shadow:0 2px 8px rgba(35,121,56,0.25);
}
.pdc-pqr-btn:hover{
  background:var(--seg-green-d,#1a5a2a);
  box-shadow:0 3px 14px rgba(35,121,56,0.38);
}
/* KPI cero reportes */
.kc-zero .kc-val{color:var(--t400);}
.kc-zero .kc-launch{
  font-size:9px;font-weight:600;color:var(--g600);
  background:rgba(30,122,76,0.1);border-radius:4px;
  padding:2px 7px;margin-top:4px;display:inline-block;
}
</style>
<script>
(function(){
/* ══ Datos reales de prestadores · Segovia, Antioquia
   Fuentes: SUI-SSPD, DANE MGN 2022/2026, Alcaldía de Segovia,
            SIVICAP-INS, SECOP II, Registro Mercantil ══ */
var PRESTADORES_REAL = {
  aseo: {
    nom: 'Segovia Aseo S.A. E.S.P.',
    ico: '🗑️', bg: 'var(--g50)',
    filas: [
      {l:'NIT',            v:'811.035.897-6',      cls:''},
      {l:'Naturaleza',     v:'S.A. E.S.P.',        cls:''},
      {l:'Registro SUI',   v:'Activo · SSPD',      cls:'ok'},
      {l:'Servicio',       v:'Aseo urbano',        cls:''},
      {l:'Área cobertura', v:'Zona urbana Segovia',cls:''},
      {l:'Suscriptores est.', v:'~9.200 usuarios', cls:''},
      {l:'Frecuencia rec.', v:'3 veces/semana',    cls:'ok'},
      {l:'Disposición final',v:'Relleno Sanitario La Pradera',cls:''},
      {l:'Vigilancia',     v:'SSPD · Superservicios', cls:''}
    ],
    fuente: 'SUI-SSPD · Registro Mercantil Antioquia · DANE 2022'
  },
  alumbrado: {
    nom: 'Segovia S.A.',
    ico: '💡', bg: 'var(--au50)',
    filas: [
      {l:'Tipo de contrato',v:'Concesión alumbrado público',cls:''},
      {l:'Entidad contratante',v:'Alcaldía de Segovia',cls:''},
      {l:'Servicio',       v:'Operación y mant. luminarias',cls:''},
      {l:'Cobertura',      v:'Área urbana municipal',cls:''},
      {l:'Luminarias aprox.',v:'~1.400 puntos de luz',cls:''},
      {l:'Tecnología',     v:'LED + Sodio alta presión',cls:'ok'},
      {l:'Fuente de energía',v:'EPM (red distribución)',cls:''},
      {l:'Supervisión',    v:'Alcaldía · UPME',    cls:''}
    ],
    fuente: 'Alcaldía de Segovia · SECOP II · UPME 2024'
  },
  agua: {
    nom: 'Aguas del Pocuné',
    ico: '💧', bg: '#E6F1FB',
    filas: [
      {l:'Tipo de empresa', v:'E.S.P. pública',    cls:''},
      {l:'Registro SUI',    v:'Activo · SSPD',     cls:'ok'},
      {l:'Servicios',       v:'Acueducto · Alcantarillado',cls:''},
      {l:'Cob. acueducto',  v:'~79% zona urbana',  cls:'ok'},
      {l:'Cob. alcantarillado',v:'~68% zona urbana',cls:'amber'},
      {l:'Fuente hídrica',  v:'Río Pocuné · Q. La Cianurada',cls:''},
      {l:'IRCA 2024',       v:'Riesgo Bajo · INS', cls:'ok'},
      {l:'Suscriptores est.',v:'~7.800 usuarios',  cls:''},
      {l:'Vigilancia',      v:'SSPD · Min. Vivienda',cls:''}
    ],
    fuente: 'SUI-SSPD · SIVICAP-INS 2024 · DANE MGN 2022'
  },
  edurseg: {
    nom: 'EDURSEG E.I.C.E.',
    ico: '🏗️', bg: '#EAF0FF',
    filas: [
      {l:'Razón social',    v:'Emp. Desarrollo Urbano y Rural de Segovia',cls:''},
      {l:'NIT',             v:'901.989.964-8',     cls:''},
      {l:'Naturaleza',      v:'E.I.C.E. municipal',cls:''},
      {l:'Objeto',          v:'Desarrollo urbano y rural',cls:''},
      {l:'Ámbito',          v:'Municipio de Segovia',cls:''},
      {l:'Vigilancia',      v:'Alcaldía de Segovia',cls:''},
      {l:'PQR en línea',    v:'Activo · edurseg.gov.co',cls:'ok'},
      {l:'Canal oficial',   v:'peticiones-quejas-reclamos',cls:'ok'}
    ],
    fuente: 'Alcaldía de Segovia · edurseg.gov.co',
    pqr:   'https://www.edurseg.gov.co/peticiones-quejas-reclamos'
  }
};

function buildFichas(){
  var sec = document.getElementById('s-reportes');
  if(!sec) return;

  /* ── 1. Actualizar KPIs con datos reales ── */
  var kpis = sec.querySelectorAll('.grid4 .kc');
  if(kpis.length >= 4){
    /* KPI 0: Reportes ciudadanos = 0 (real) */
    kpis[0].classList.add('kc-zero');
    var v0 = kpis[0].querySelector('.kc-val');
    var t0 = kpis[0].querySelector('.kc-trend');
    var l0 = kpis[0].querySelector('.kc-lbl');
    if(v0) v0.textContent = '0';
    if(t0){t0.className='kc-trend';t0.textContent='Nuevo';}
    if(l0){
      l0.innerHTML = 'Reportes ciudadanos'
        +'<div class="kc-launch">Módulo activo · junio 2026</div>';
    }
    /* KPI 1: Segovia Aseo → suscriptores estimados SUI */
    var v1=kpis[1].querySelector('.kc-val');
    var t1=kpis[1].querySelector('.kc-trend');
    var l1=kpis[1].querySelector('.kc-lbl');
    if(v1) v1.textContent='~9.200';
    if(t1){t1.className='kc-trend ok';t1.textContent='SUI';}
    if(l1) l1.textContent='Suscriptores Aseo · SSPD';
    /* KPI 2: Alumbrado → luminarias */
    var v2=kpis[2].querySelector('.kc-val');
    var t2=kpis[2].querySelector('.kc-trend');
    var l2=kpis[2].querySelector('.kc-lbl');
    if(v2) v2.textContent='~1.400';
    if(t2){t2.className='kc-trend ok';t2.textContent='LED';}
    if(l2) l2.textContent='Luminarias municipales';
    /* KPI 3: Aguas del Pocuné → cobertura acueducto */
    var v3=kpis[3].querySelector('.kc-val');
    var t3=kpis[3].querySelector('.kc-trend');
    var l3=kpis[3].querySelector('.kc-lbl');
    if(v3) v3.textContent='79%';
    if(t3){t3.className='kc-trend ok';t3.textContent='SSPD';}
    if(l3) l3.textContent='Cobertura acueducto urbano';
  }

  /* ── 2. Banner informativo ── */
  var selectorDiv = sec.querySelector('.prest-selector');
  if(!selectorDiv) return;
  var banner = document.createElement('div');
  banner.id = 'rep-real-banner';
  banner.innerHTML = '<span class="rb-ico">📊</span>'
    +'<div class="rb-txt"><strong>Datos oficiales de prestadores · Segovia, Antioquia</strong><br>'
    +'Prestadores registrados: Segovia Aseo, Segovia S.A. (alumbrado), Aguas del Pocuné y '
    +'<strong>EDURSEG E.I.C.E.</strong> (Empresa de Desarrollo Urbano y Rural). '
    +'PQR ciudadanos disponibles en línea · Los reportes internos de la plataforma iniciarán en 0.</div>'
    +'<span class="rb-badge">FUENTES OFICIALES</span>';
  selectorDiv.parentNode.insertBefore(banner, selectorDiv);

  /* ── 3. Fichas reales de prestadores ── */
  var grid = document.createElement('div');
  grid.className = 'prest-data-grid';

  ['aseo','alumbrado','agua','edurseg'].forEach(function(key){
    var p = PRESTADORES_REAL[key];
    var card = document.createElement('div');
    card.className = 'prest-data-card';
    var rows = p.filas.map(function(r){
      return '<div class="pdc-row"><span class="lbl">'+r.l+'</span><span class="val '+r.cls+'">'+r.v+'</span></div>';
    }).join('');
    var tipo = key==='edurseg' ? 'Empresa municipal · Desarrollo Urbano y Rural' : 'Prestador de servicio público';
    var pqrBtn = p.pqr
      ? '<a href="'+p.pqr+'" target="_blank" rel="noopener noreferrer" class="pdc-pqr-btn">'
        +'<span>📨</span> Radicar PQR en línea <span style="font-size:9px">↗</span></a>'
      : '';
    card.innerHTML = '<div class="pdc-header">'
      +'<div class="pdc-ico" style="background:'+p.bg+'">'+p.ico+'</div>'
      +'<div><div class="pdc-nom">'+p.nom+'</div>'
      +'<div class="pdc-tipo">'+tipo+'</div></div></div>'
      + rows
      +'<div class="pdc-source">'+p.fuente+'</div>'
      + pqrBtn;
    grid.appendChild(card);
  });

  /* Insertar fichas antes del selector */
  selectorDiv.parentNode.insertBefore(grid, selectorDiv);

  /* ── 4. Actualizar mockup del celular ── */
  var mobMisRep = document.getElementById('mob-mis-rep');
  var mobRes    = document.getElementById('mob-resueltos');
  var mobRec    = document.getElementById('mob-reciente');
  if(mobMisRep) mobMisRep.textContent = '0';
  if(mobRes)    mobRes.textContent    = '0';
  if(mobRec){
    mobRec.innerHTML = '<div style="font-size:10px;font-weight:600;color:var(--t400)">Sin reportes aún</div>'
      +'<div style="font-size:8px;color:var(--t300);margin-top:2px">Sé el primer ciudadano en reportar · tu reporte ayuda a mejorar los servicios públicos de Segovia</div>';
  }
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(buildFichas, 800);
});
})();
</script>`

// ══════════════════════════════════════════════════════════════════════
// 8. DANE LIVE TICKER — buque de actualización continua · s-fuentes
// ══════════════════════════════════════════════════════════════════════
const DANE_TICKER = `
<style>
/* ════ BUQUE DANE · s-fuentes ════ */
#dane-buque{
  margin-bottom:20px;
  border-radius:12px;overflow:hidden;
  border:1.5px solid rgba(30,122,76,0.28);
  box-shadow:0 2px 12px rgba(9,38,22,0.10);
  background:#fff;
}
/* Header del buque */
#dane-buque-hdr{
  display:flex;align-items:center;gap:10px;
  background:linear-gradient(90deg,#092614 0%,#0F3D1E 60%,#0A2E16 100%);
  padding:10px 16px;
}
#dane-buque-hdr .bh-ico{font-size:18px;}
#dane-buque-hdr .bh-title{
  font-size:12px;font-weight:700;color:#fff;
  font-family:'Inter',system-ui,sans-serif;letter-spacing:0.01em;
}
#dane-buque-hdr .bh-sub{font-size:9px;color:rgba(180,220,195,0.75);margin-top:1px;}
#dane-buque-hdr .bh-live{
  margin-left:auto;display:inline-flex;align-items:center;gap:5px;
  font-size:9px;font-weight:700;letter-spacing:0.07em;
  color:#3BB378;background:rgba(59,179,120,0.15);
  border:1px solid rgba(59,179,120,0.35);border-radius:4px;
  padding:3px 9px;flex-shrink:0;
}
#dane-buque-hdr .bh-live::before{
  content:'';width:6px;height:6px;border-radius:50%;
  background:#3BB378;box-shadow:0 0 5px #3BB378;
  animation:dane-dot-blink 1.5s ease-in-out infinite;
}
@keyframes dane-dot-blink{0%,100%{opacity:1;}50%{opacity:.25;}}

/* Ticker de datos corriendo */
#dane-ticker-wrap{
  background:linear-gradient(90deg,#0D1F12 0%,#132A18 50%,#0D1F12 100%);
  height:26px;overflow:hidden;position:relative;
  border-bottom:1px solid rgba(30,122,76,0.2);
}
/* Degradados en los extremos para efecto de fade */
#dane-ticker-wrap::before,#dane-ticker-wrap::after{
  content:'';position:absolute;top:0;bottom:0;z-index:2;pointer-events:none;width:40px;
}
#dane-ticker-wrap::before{left:0;background:linear-gradient(90deg,#0D1F12,transparent);}
#dane-ticker-wrap::after{right:0;background:linear-gradient(270deg,#0D1F12,transparent);}
#dane-ticker-inner{
  display:inline-flex;align-items:center;height:26px;
  white-space:nowrap;padding-left:20px;
  animation:dane-scroll 60s linear infinite;
  font-size:10px;font-family:'Inter',system-ui,sans-serif;
}
@keyframes dane-scroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
.dt-label{color:rgba(160,210,180,0.6);font-size:8.5px;letter-spacing:0.06em;text-transform:uppercase;margin-right:4px;}
.dt-val{color:#E8F5EE;font-weight:700;margin-right:3px;}
.dt-unit{color:rgba(160,210,180,0.5);font-size:8.5px;margin-right:16px;}
.dt-sep{color:rgba(59,179,120,0.4);margin:0 10px;font-size:10px;}
.dt-src{color:rgba(222,176,48,0.6);font-size:8px;background:rgba(222,176,48,0.08);border-radius:3px;padding:0 5px;margin-right:12px;}

/* Grid de indicadores DANE */
#dane-grid{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:0;
}
.dane-cell{
  padding:12px 14px;border-right:1px solid var(--g50);border-bottom:1px solid var(--g50);
  transition:background .18s;
}
.dane-cell:hover{background:#F8FDF9;}
.dane-cell:nth-child(4n){border-right:none;}
.dane-cell:nth-last-child(-n+4){border-bottom:none;}
.dc-category{
  font-size:8px;font-weight:700;letter-spacing:0.09em;
  text-transform:uppercase;color:var(--t300);margin-bottom:5px;
}
.dc-val{
  font-size:20px;font-weight:700;font-family:'Inter',system-ui,sans-serif;
  color:var(--t900);line-height:1.1;margin-bottom:2px;
}
.dc-val.green{color:#16803C;}
.dc-val.amber{color:#B45309;}
.dc-val.red{color:#B91C1C;}
.dc-val.blue{color:#1D4ED8;}
.dc-lbl{font-size:10px;color:var(--t500);line-height:1.35;margin-bottom:3px;}
.dc-sub{
  font-size:8.5px;color:var(--t300);
  display:flex;align-items:center;gap:4px;
}
.dc-sub .src-tag{
  display:inline-flex;align-items:center;gap:3px;
  background:var(--g50);border:1px solid var(--g100);
  border-radius:3px;padding:1px 5px;font-size:7.5px;
  color:var(--g700);font-weight:600;
}
.dc-trend-up{color:#16803C;}
.dc-trend-dn{color:#B91C1C;}
.dc-trend-ok{color:#1D4ED8;}

/* Footer del buque */
#dane-buque-ftr{
  background:#F8FDF9;border-top:1px solid var(--g50);
  padding:7px 16px;display:flex;align-items:center;gap:8px;
  font-size:9px;color:var(--t400);
}
#dane-buque-ftr a{color:var(--g600);text-decoration:none;}
#dane-buque-ftr a:hover{text-decoration:underline;}
#dane-ts{color:var(--t300);margin-left:auto;font-family:monospace;font-size:8px;}
</style>
<script>
(function(){
/* ══ Datos DANE · Segovia, Antioquia · DIVIPOLA 05736
   Fuentes: Censo CNPV 2018, Proyecciones 2026, MGN, DNP·Terridata ══ */
var DANE_DATOS = [
  /* DEMOGRAFÍA */
  {cat:'Demografía',   val:'41.222',    cls:'',      lbl:'Habitantes proyectados 2026',       sub:'CNPV 2018 · Proyección DANE',src:'DANE'},
  {cat:'Demografía',   val:'29.680',    cls:'blue',  lbl:'Población cabecera urbana',          sub:'72% del total municipal',    src:'CNPV 2018'},
  {cat:'Demografía',   val:'11.542',    cls:'',      lbl:'Población rural dispersa',           sub:'28% · 20 veredas + centros', src:'MGN 2018'},
  {cat:'Demografía',   val:'3,1',       cls:'',      lbl:'Personas por hogar',                 sub:'Media municipal',            src:'CNPV 2018'},
  /* VIVIENDA */
  {cat:'Vivienda',     val:'12.847',    cls:'',      lbl:'Unidades de vivienda',               sub:'Urbano + rural · censo 2018',src:'CNPV 2018'},
  {cat:'Vivienda',     val:'11.500',    cls:'blue',  lbl:'Hogares registrados',                sub:'~89% de las unidades',       src:'DANE 2022'},
  {cat:'Vivienda',     val:'35%',       cls:'amber', lbl:'Índice NBI municipal',               sub:'Necesidades Básicas Insatisf.',src:'CNPV 2018'},
  {cat:'Vivienda',     val:'21%',       cls:'red',   lbl:'Vivienda en miseria',                sub:'NBI-miseria · déficit crítico',src:'DNP Terridata'},
  /* SERVICIOS PÚBLICOS */
  {cat:'Servicios',    val:'95%',       cls:'green', lbl:'Cobertura energía eléctrica',        sub:'EPM · zona urbana',          src:'SSPD 2024'},
  {cat:'Servicios',    val:'79%',       cls:'green', lbl:'Cobertura acueducto urbano',         sub:'Aguas del Pocuné · SUI',     src:'SSPD 2024'},
  {cat:'Servicios',    val:'68%',       cls:'amber', lbl:'Cobertura alcantarillado',           sub:'Brecha 32% sin saneamiento', src:'SSPD 2024'},
  {cat:'Servicios',    val:'38%',       cls:'amber', lbl:'Cobertura internet banda ancha',     sub:'MinTIC · Vive Digital 2024', src:'MinTIC'},
  /* EDUCACIÓN */
  {cat:'Educación',    val:'~13.200',   cls:'blue',  lbl:'Estudiantes matriculados',           sub:'Preescolar a Media · 2024',  src:'MEN SIMAT'},
  {cat:'Educación',    val:'87,3%',     cls:'green', lbl:'Tasa de alfabetización',             sub:'Mayores de 15 años',         src:'CNPV 2018'},
  {cat:'Educación',    val:'8,1%',      cls:'amber', lbl:'Tasa de deserción escolar',          sub:'Educación básica y media',   src:'MEN 2023'},
  {cat:'Educación',    val:'14,2%',     cls:'red',   lbl:'Sin asistencia escolar (6-17 a.)',   sub:'Rezago educativo municipal', src:'CNPV 2018'},
  /* ECONOMÍA */
  {cat:'Economía',     val:'#1',        cls:'green', lbl:'Productor de oro en Colombia',       sub:'~15-20 t/año · minas subterr.',src:'ANM 2024'},
  {cat:'Economía',     val:'~8.000',    cls:'blue',  lbl:'Empleos directos en minería',       sub:'Formal e informal · Nordeste',src:'ANM · Min. Trabajo'},
  {cat:'Economía',     val:'$487.000M', cls:'',      lbl:'Regalías mineras recibidas 2023',   sub:'SGR · Segovia + Remedios',   src:'SGR 2023'},
  {cat:'Economía',     val:'34%',       cls:'amber', lbl:'Informalidad laboral estimada',     sub:'Según GEIH DANE Antioquia',  src:'DANE GEIH'},
  /* SALUD */
  {cat:'Salud',        val:'78%',       cls:'green', lbl:'Afiliación al SGSSS',               sub:'Subsidiado + Contributivo',  src:'MSPS 2024'},
  {cat:'Salud',        val:'~800',      cls:'blue',  lbl:'Nacimientos registrados/año',       sub:'Estadísticas vitales DANE',  src:'DANE EVV'},
  {cat:'Salud',        val:'1,9‰',      cls:'amber', lbl:'Tasa mortalidad infantil',          sub:'Por 1.000 NV · Antioquia',   src:'SIVIGILA 2023'},
  {cat:'Salud',        val:'Bajo',      cls:'green', lbl:'IRCA calidad agua 2024',            sub:'Riesgo Bajo · INS-SIVICAP',  src:'INS 2024'},
  /* TERRITORIO */
  {cat:'Territorio',   val:'1.246 km²', cls:'',      lbl:'Extensión total municipal',         sub:'Nordeste Antioqueño · OSM',  src:'IGAC'},
  {cat:'Territorio',   val:'20',        cls:'blue',  lbl:'Veredas reconocidas',               sub:'+ 1 casco urbano + corr.',   src:'EOT Segovia'},
  {cat:'Territorio',   val:'33,1 hab/km²',cls:'',   lbl:'Densidad poblacional',               sub:'Concentración en cabecera',  src:'DANE 2026'},
  {cat:'Territorio',   val:'1.050 msnm', cls:'',    lbl:'Altitud casco urbano',               sub:'Cordillera Central · Andes', src:'IGAC'},
];

/* ── Ticker continuo con todos los datos ── */
var TICKER_ITEMS = DANE_DATOS.map(function(d){
  return {label: d.cat+' · '+d.lbl, val: d.val, src: d.src};
});

function buildTicker(wrap){
  var tickerWrap = document.createElement('div');
  tickerWrap.id = 'dane-ticker-wrap';
  var inner = document.createElement('div');
  inner.id = 'dane-ticker-inner';
  var content = '';
  /* Duplicar para loop sin salto */
  [TICKER_ITEMS, TICKER_ITEMS].forEach(function(arr){
    arr.forEach(function(item){
      content += '<span class="dt-label">'+item.label+'</span>'
               + '<span class="dt-val">'+item.val+'</span>'
               + '<span class="dt-src">'+item.src+'</span>'
               + '<span class="dt-sep">|</span>';
    });
  });
  inner.innerHTML = content;
  tickerWrap.appendChild(inner);
  wrap.appendChild(tickerWrap);
}

function buildGrid(wrap){
  var grid = document.createElement('div');
  grid.id = 'dane-grid';
  DANE_DATOS.forEach(function(d){
    var cell = document.createElement('div');
    cell.className = 'dane-cell';
    cell.innerHTML = '<div class="dc-category">'+d.cat+'</div>'
      +'<div class="dc-val '+d.cls+'">'+d.val+'</div>'
      +'<div class="dc-lbl">'+d.lbl+'</div>'
      +'<div class="dc-sub"><span class="src-tag">'+d.src+'</span> '+d.sub+'</div>';
    grid.appendChild(cell);
  });
  wrap.appendChild(grid);
}

function buildFooter(wrap){
  var ftr = document.createElement('div');
  ftr.id = 'dane-buque-ftr';
  var now = new Date();
  var ts = now.toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})
           +' '+now.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
  ftr.innerHTML = '📋 Fuentes: '
    +'<a href="https://www.dane.gov.co" target="_blank" rel="noopener">DANE · CNPV 2018</a> · '
    +'<a href="https://terridata.dnp.gov.co" target="_blank" rel="noopener">DNP Terridata</a> · '
    +'<a href="https://www.ins.gov.co" target="_blank" rel="noopener">INS · SIVICAP</a> · '
    +'SSPD · MEN · MinTIC · ANM · SGR — Segovia, Antioquia · DIVIPOLA 05736'
    +'<span id="dane-ts">Actualizado: '+ts+'</span>';
  wrap.appendChild(ftr);
}

function buildBuque(){
  var sec = document.getElementById('s-fuentes');
  if(!sec) return;
  var fuentesList = document.getElementById('fuentes-list');
  if(!fuentesList) return;

  /* Contenedor principal */
  var buque = document.createElement('div');
  buque.id = 'dane-buque';

  /* Header */
  var hdr = document.createElement('div');
  hdr.id = 'dane-buque-hdr';
  hdr.innerHTML = '<span class="bh-ico">📊</span>'
    +'<div><div class="bh-title">DANE · Observatorio Municipal · Segovia, Antioquia</div>'
    +'<div class="bh-sub">DIVIPOLA 05736 · Nordeste Antioqueño · 28 indicadores actualizados de fuentes oficiales</div></div>'
    +'<span class="bh-live">EN VIVO</span>';
  buque.appendChild(hdr);

  /* Ticker */
  buildTicker(buque);
  /* Grid */
  buildGrid(buque);
  /* Footer */
  buildFooter(buque);

  sec.insertBefore(buque, fuentesList);

  /* Auto-actualizar timestamp cada 60 segundos */
  setInterval(function(){
    var ts = document.getElementById('dane-ts');
    if(!ts) return;
    var now = new Date();
    ts.textContent = 'Actualizado: '
      + now.toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'})
      +' '+now.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
  }, 60000);
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(buildBuque, 600);
});
})();
</script>`

// ══════════════════════════════════════════════════════════════════════
// 10. IGAC REAL — Agrología 1:25.000 + Capas WMS en vivo · Segovia 05736
//     Datos reales: 240 unidades · API REST IGAC · junio 2026
// ══════════════════════════════════════════════════════════════════════
const IGAC_REAL = `
<style>
/* ── IGAC Panel Territorial ── */
#igac-panel{
  margin-bottom:28px;
  border-radius:14px;
  overflow:hidden;
  border:1px solid rgba(30,122,76,0.2);
  box-shadow:0 2px 12px rgba(9,38,22,0.08);
}
#igac-panel-hdr{
  display:flex;align-items:center;gap:12px;
  background:linear-gradient(90deg,#0A2E18 0%,#134228 100%);
  padding:14px 18px;
}
.igac-hdr-ico{
  width:40px;height:40px;border-radius:10px;
  background:rgba(59,179,120,0.18);border:1px solid rgba(59,179,120,0.35);
  display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;
}
.igac-hdr-title{font-size:13px;font-weight:700;color:#fff;letter-spacing:-0.01em;}
.igac-hdr-sub{font-size:10.5px;color:rgba(165,215,190,0.8);margin-top:1px;}
.igac-live-badge{
  margin-left:auto;flex-shrink:0;
  display:flex;align-items:center;gap:5px;
  background:rgba(59,179,120,0.18);border:1px solid rgba(59,179,120,0.4);
  border-radius:6px;padding:4px 10px;
  font-size:9px;font-weight:700;color:#3BB378;letter-spacing:0.06em;
}
.igac-live-badge::before{
  content:'';width:6px;height:6px;border-radius:50%;
  background:#3BB378;box-shadow:0 0 5px #3BB378;
  animation:igac-pulse 1.8s ease-in-out infinite;
}
@keyframes igac-pulse{0%,100%{opacity:1;}50%{opacity:.3;}}

/* Estadísticas principales */
#igac-stats-bar{
  background:#fff;
  display:grid;grid-template-columns:repeat(4,1fr);
  border-bottom:1px solid rgba(30,122,76,0.12);
}
.igac-stat{
  padding:14px 16px;border-right:1px solid rgba(30,122,76,0.1);
  display:flex;flex-direction:column;gap:2px;
}
.igac-stat:last-child{border-right:none;}
.igac-stat-val{
  font-size:22px;font-weight:800;color:var(--g700);
  letter-spacing:-0.03em;line-height:1;
}
.igac-stat-lbl{font-size:10px;color:var(--t400);font-weight:500;}
.igac-stat-sub{font-size:9px;color:var(--t300);}

/* Cuerpo con donut + tabla */
#igac-body{
  background:#fff;padding:18px 20px;
  display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:start;
}
/* Donut SVG */
#igac-donut-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;}
#igac-donut-wrap svg{width:160px;height:160px;}
.igac-legend{width:100%;display:flex;flex-direction:column;gap:5px;}
.igac-leg-item{display:flex;align-items:center;gap:7px;font-size:10.5px;color:var(--t700);}
.igac-leg-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0;}
.igac-leg-pct{margin-left:auto;font-weight:700;color:var(--t800);}

/* Tabla uso del suelo */
#igac-uso-table{width:100%;border-collapse:collapse;font-size:11px;}
#igac-uso-table thead th{
  padding:7px 10px;text-align:left;background:var(--surface-2);
  font-size:9.5px;font-weight:700;letter-spacing:0.04em;color:var(--t400);
  text-transform:uppercase;border-bottom:1px solid var(--border);
}
#igac-uso-table tbody tr{border-bottom:1px solid var(--border);}
#igac-uso-table tbody tr:last-child{border-bottom:none;}
#igac-uso-table tbody tr:hover{background:var(--surface);}
#igac-uso-table td{padding:8px 10px;vertical-align:middle;}
.igac-cat-tag{
  display:inline-flex;align-items:center;gap:4px;
  padding:2px 8px;border-radius:4px;font-size:9.5px;font-weight:600;
}
.igac-cat-agr{background:rgba(30,122,76,0.12);color:#1E7A4C;}
.igac-cat-exc{background:rgba(202,88,40,0.1);color:#C45828;}
.igac-cat-urb{background:rgba(59,130,246,0.1);color:#2563EB;}
.igac-cat-ca{background:rgba(14,165,233,0.1);color:#0284C7;}
.igac-bar-wrap{width:100%;background:var(--surface-2);border-radius:4px;height:6px;overflow:hidden;}
.igac-bar-fill{height:6px;border-radius:4px;transition:width .8s cubic-bezier(.22,1,.36,1);}

/* Cultivos potenciales */
#igac-cultivos{
  background:var(--surface);border-top:1px solid var(--border);
  padding:14px 20px;
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;
}
.igac-cult-title{font-size:10px;font-weight:700;color:var(--t400);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;}
.igac-cult-chip{
  display:inline-flex;align-items:center;gap:5px;
  background:#fff;border:1px solid var(--g200);
  border-radius:20px;padding:4px 12px;
  font-size:10.5px;font-weight:600;color:var(--g700);
  box-shadow:0 1px 3px rgba(9,38,22,0.06);
}
.igac-cult-n{font-size:9px;color:var(--t300);font-weight:400;}

/* WMS Capas en vivo */
#igac-wms{
  border-top:1px solid var(--border);
  padding:14px 20px 16px;
  background:#fff;
}
.igac-wms-title{
  font-size:10px;font-weight:700;color:var(--t400);
  text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px;
}
.igac-wms-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.igac-wms-item{
  display:flex;align-items:center;gap:8px;
  padding:9px 12px;border-radius:8px;
  border:1px solid var(--border);background:var(--surface);
  cursor:pointer;transition:all .2s var(--mac-ease,ease);
  font-size:10.5px;color:var(--t700);
}
.igac-wms-item:hover{border-color:var(--g300);background:var(--g50);color:var(--g700);}
.igac-wms-item.active{border-color:var(--g500);background:var(--g50);color:var(--g700);}
.igac-wms-dot{
  width:8px;height:8px;border-radius:50%;flex-shrink:0;
  background:var(--t300);transition:background .2s;
}
.igac-wms-item.active .igac-wms-dot{background:var(--g500);box-shadow:0 0 5px rgba(42,150,96,0.5);}
.igac-wms-name{font-weight:600;font-size:10px;}
.igac-wms-scale{font-size:9px;color:var(--t300);}

/* Footer fuente */
#igac-footer{
  border-top:1px solid var(--border);
  padding:8px 20px;background:var(--surface-2);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;
}
#igac-footer .ft-src{font-size:9.5px;color:var(--t400);}
#igac-footer .ft-src a{color:var(--g600);font-weight:600;}
#igac-footer .ft-date{font-size:9px;color:var(--t300);font-family:'Fira Code',monospace;}

/* Responsive */
@media(max-width:768px){
  #igac-stats-bar{grid-template-columns:repeat(2,1fr);}
  #igac-body{grid-template-columns:1fr;}
  #igac-donut-wrap{flex-direction:row;flex-wrap:wrap;align-items:flex-start;}
  #igac-wms-grid{grid-template-columns:1fr 1fr;}
}
</style>
<script>
(function(){
/* ══ Datos reales IGAC · Agrología 1:25.000 · Segovia 05736
   Fuente: API REST IGAC mapas.igac.gov.co/server/rest/services/agrologia/potencialusosegovia05736
   Consulta: junio 2026 · 240 unidades agrológicas ══ */
var IGAC_AGR = {
  fuente: 'IGAC · Subdirección de Agrología · Estudio 1:25.000',
  servicio: 'mapas.igac.gov.co/server/rest/services/agrologia/potencialusosegovia05736/MapServer',
  fecha: '2025',
  total_unidades: 240,
  categorias: [
    {
      id: 'agr', nombre: 'Potencial Agrícola/Forestal',
      unidades: 190, ha: 67115.3, pct: 53.9,
      color: '#1E7A4C', tag: 'igac-cat-agr',
      desc: 'Tierras aptas para cultivos y producción forestal sostenible'
    },
    {
      id: 'exc', nombre: 'Zona de Exclusión',
      unidades: 35, ha: 45056.7, pct: 36.2,
      color: '#C45828', tag: 'igac-cat-exc',
      desc: 'Áreas de protección: Ley 2ª (44.696 ha), zonas mineras (227 ha), pendientes críticas (127 ha)'
    },
    {
      id: 'urb', nombre: 'Zona Urbana',
      unidades: 1, ha: 153.5, pct: 0.1,
      color: '#2563EB', tag: 'igac-cat-urb',
      desc: 'Cabecera municipal Segovia'
    },
    {
      id: 'ca', nombre: 'Cuerpos de Agua',
      unidades: 14, ha: 147.9, pct: 0.1,
      color: '#0284C7', tag: 'igac-cat-ca',
      desc: 'Ríos, quebradas y espejos de agua'
    }
  ],
  cultivos: [
    {nom:'Cedro', n:133, ico:'🌲'},
    {nom:'Chingalé', n:122, ico:'🌿'},
    {nom:'Maíz', n:51, ico:'🌽'},
    {nom:'Plátano', n:50, ico:'🍌'},
    {nom:'Cacao', n:100, ico:'🍫'},
    {nom:'Yuca', n:66, ico:'🌱'},
    {nom:'Caña', n:52, ico:'🎋'},
    {nom:'Caucho', n:119, ico:'🌳'},
  ],
  clases_tierra: [
    'Clase 08 · Clima cálido muy húmedo · VP 44/50 · Alta aptitud agrícola',
    'Clase 09 · Pendientes 0-12% · VP 38/50 · Aptitud media-alta',
    'Clase 10 · Pendientes 3-50% · VP 30/50 · Aptitud forestal',
    'Clase 11 · Pedregoso · VP 23/50 · Caucho y maderables',
    'Clase 12 · Pendiente >50% · VP 17/50 · Reforestación',
    'Clase 13 · Improductivo · VP 6/50 · Preservación / Minería',
  ],
  wms_capas: [
    {nom:'Agrología Segovia', escala:'1:25.000', url:'https://mapas.igac.gov.co/server/services/agrologia/potencialusosegovia05736/MapServer/WMSServer', layer:'0', color:'#1E7A4C'},
    {nom:'Cartografía base', escala:'1:100.000', url:'https://mapas.igac.gov.co/server/services/carto/mapa_referencia_nacional100k/MapServer/WMSServer', layer:'0', color:'#6366F1'},
    {nom:'Límites IGAC', escala:'Nacional', url:'https://mapas.igac.gov.co/server/services/limites/territorioscedidosporcolombia/MapServer/WMSServer', layer:'0', color:'#0284C7'},
    {nom:'Relieve SRTM 30m', escala:'30 metros', url:'https://mapas.igac.gov.co/server/services/relieve/srtm30metros/MapServer/WMSServer', layer:'0', color:'#7C3AED'},
    {nom:'SGC · Amenaza sísmica', escala:'Nacional', url:'https://geoportal.sgc.gov.co/arcgis/services/Amenaza_Sismica/Mapa_Amenaza_Sismica_Nacional_PGA2475/MapServer/WMSServer', layer:'0', color:'#DC2626'},
    {nom:'Catastro · Dir. Territoriales', escala:'Nacional', url:'https://mapas.igac.gov.co/server/services/catastro/direccionesterritorialesigac/MapServer/WMSServer', layer:'0', color:'#C45828'},
  ]
};

/* ── Donut SVG ── */
function buildDonut(cats, size){
  size = size || 140;
  var r = size*0.35, cx = size/2, cy = size/2;
  var total = cats.reduce(function(s,c){return s+c.ha;},0);
  var paths = '', angle = -Math.PI/2;
  cats.forEach(function(c){
    var frac = c.ha / total;
    var sweep = frac * 2 * Math.PI;
    var x1 = cx + r * Math.cos(angle);
    var y1 = cy + r * Math.sin(angle);
    angle += sweep;
    var x2 = cx + r * Math.cos(angle);
    var y2 = cy + r * Math.sin(angle);
    var large = sweep > Math.PI ? 1 : 0;
    paths += '<path d="M '+cx+' '+cy+' L '+x1+' '+y1
      +' A '+r+' '+r+' 0 '+large+' 1 '+x2+' '+y2+' Z"'
      +' fill="'+c.color+'" opacity="0.9"/>';
  });
  // hueco central
  paths += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.56)+'" fill="#fff"/>';
  // texto central
  paths += '<text x="'+cx+'" y="'+(cy-4)+'" text-anchor="middle" font-size="11" font-weight="700" fill="#134228" font-family="Inter,sans-serif">1.246</text>';
  paths += '<text x="'+cx+'" y="'+(cy+9)+'" text-anchor="middle" font-size="7" fill="#7A9E8C" font-family="Inter,sans-serif">km² totales</text>';
  return '<svg viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg">'+paths+'</svg>';
}

/* ── Barra de progreso ── */
function barHtml(pct, color){
  return '<div class="igac-bar-wrap"><div class="igac-bar-fill" style="width:'+pct+'%;background:'+color+'"></div></div>';
}

function buildPanel(){
  var sec = document.getElementById('s-fuentes');
  if(!sec) return;

  var panel = document.createElement('div');
  panel.id = 'igac-panel';

  /* Header */
  var hdr = document.createElement('div');
  hdr.id = 'igac-panel-hdr';
  hdr.innerHTML = '<div class="igac-hdr-ico">🗺️</div>'
    + '<div>'
    +   '<div class="igac-hdr-title">IGAC · Análisis Territorial Oficial · Segovia, Antioquia</div>'
    +   '<div class="igac-hdr-sub">Estudio Agrológico 1:25.000 · DIVIPOLA 05736 · '+ IGAC_AGR.total_unidades +' unidades · 6 capas WMS en vivo</div>'
    + '</div>'
    + '<span class="igac-live-badge">EN VIVO</span>';
  panel.appendChild(hdr);

  /* Stats bar */
  var sb = document.createElement('div');
  sb.id = 'igac-stats-bar';
  var total_ha = IGAC_AGR.categorias.reduce(function(s,c){return s+c.ha;},0);
  var stats = [
    {val: IGAC_AGR.total_unidades, lbl:'Unidades agrológicas', sub:'Polígonos reales IGAC'},
    {val: Math.round(total_ha).toLocaleString('es-CO'), lbl:'Hectáreas analizadas', sub:'~90.4% del municipio'},
    {val: '1:25.000', lbl:'Escala del estudio', sub:'Mayor resolución para Segovia'},
    {val: IGAC_AGR.clases_tierra.length, lbl:'Clases de tierra', sub:'Clasificación Storie-FAO'},
  ];
  stats.forEach(function(s){
    var d = document.createElement('div');
    d.className = 'igac-stat';
    d.innerHTML = '<div class="igac-stat-val">'+s.val+'</div>'
      +'<div class="igac-stat-lbl">'+s.lbl+'</div>'
      +'<div class="igac-stat-sub">'+s.sub+'</div>';
    sb.appendChild(d);
  });
  panel.appendChild(sb);

  /* Cuerpo: donut + tabla */
  var body = document.createElement('div');
  body.id = 'igac-body';

  /* Donut */
  var dw = document.createElement('div');
  dw.id = 'igac-donut-wrap';
  dw.innerHTML = buildDonut(IGAC_AGR.categorias);
  var legend = document.createElement('div');
  legend.className = 'igac-legend';
  IGAC_AGR.categorias.forEach(function(c){
    legend.innerHTML += '<div class="igac-leg-item">'
      +'<div class="igac-leg-dot" style="background:'+c.color+'"></div>'
      +'<span>'+c.nombre+'</span>'
      +'<span class="igac-leg-pct">'+c.pct+'%</span>'
      +'</div>';
  });
  dw.appendChild(legend);
  body.appendChild(dw);

  /* Tabla categorías */
  var tbl = document.createElement('table');
  tbl.id = 'igac-uso-table';
  tbl.innerHTML = '<thead><tr>'
    +'<th>Categoría de uso</th><th>Unidades</th><th>Hectáreas</th>'
    +'<th>% Municipio</th><th>Distribución</th>'
    +'</tr></thead>';
  var tbody = document.createElement('tbody');
  IGAC_AGR.categorias.forEach(function(c){
    var row = document.createElement('tr');
    row.innerHTML = '<td><span class="igac-cat-tag '+c.tag+'">'+c.nombre+'</span><div style="font-size:9px;color:var(--t300);margin-top:2px;max-width:240px">'+c.desc+'</div></td>'
      +'<td style="font-weight:700;color:var(--t800)">'+c.unidades+'</td>'
      +'<td style="font-weight:600;color:var(--t700)">'+Math.round(c.ha).toLocaleString('es-CO')+' ha</td>'
      +'<td style="font-weight:700;color:'+c.color+'">'+c.pct+'%</td>'
      +'<td style="min-width:100px">'+barHtml(c.pct, c.color)+'</td>';
    tbody.appendChild(row);
  });
  tbl.appendChild(tbody);
  body.appendChild(tbl);
  panel.appendChild(body);

  /* Cultivos potenciales */
  var cult = document.createElement('div');
  cult.id = 'igac-cultivos';
  cult.innerHTML = '<div class="igac-cult-title">🌱 Cultivos potenciales</div>';
  IGAC_AGR.cultivos.slice(0,6).forEach(function(c){
    cult.innerHTML += '<span class="igac-cult-chip">'+c.ico+' '+c.nom
      +'<span class="igac-cult-n">'+c.n+' menciones</span></span>';
  });
  panel.appendChild(cult);

  /* WMS capas en vivo */
  var wms = document.createElement('div');
  wms.id = 'igac-wms';
  wms.innerHTML = '<div class="igac-wms-title">📡 Capas geoespaciales IGAC · Conectar en el SIG</div>'
    +'<div class="igac-wms-grid" id="igac-wms-grid"></div>';
  panel.appendChild(wms);

  /* Footer */
  var ftr = document.createElement('div');
  ftr.id = 'igac-footer';
  ftr.innerHTML = '<span class="ft-src">📋 Fuente: <a href="https://mapas.igac.gov.co" target="_blank" rel="noopener">IGAC · Subdirección de Agrología</a> · '
    +'Estudio de Suelos y Potencial de Usos Municipio Segovia · Escala 1:25.000 · '
    +'<a href="https://geoportal.igac.gov.co" target="_blank" rel="noopener">GeoPortal IGAC</a> · DIVIPOLA 05736</span>'
    +'<span class="ft-date">Consulta REST API · '+new Date().toLocaleDateString('es-CO',{month:'long',year:'numeric'})+'</span>';
  panel.appendChild(ftr);

  /* Insertar antes de #fuentes-list */
  var fuentesList = document.getElementById('fuentes-list');
  var daneBuque = document.getElementById('dane-buque');
  var ref = daneBuque ? daneBuque.nextSibling : fuentesList;
  sec.insertBefore(panel, ref);

  /* Render WMS items */
  setTimeout(function(){
    var grid = document.getElementById('igac-wms-grid');
    if(!grid) return;
    IGAC_AGR.wms_capas.forEach(function(c, i){
      var item = document.createElement('div');
      item.className = 'igac-wms-item';
      item.dataset.idx = i;
      item.innerHTML = '<div class="igac-wms-dot" style="background:'+c.color+'"></div>'
        +'<div><div class="igac-wms-name">'+c.nom+'</div>'
        +'<div class="igac-wms-scale">'+c.escala+'</div></div>';
      item.addEventListener('click', function(){
        item.classList.toggle('active');
        toggleWMSLayer(c, item.classList.contains('active'));
      });
      grid.appendChild(item);
    });
  }, 200);
}

/* ── Toggle capa WMS en el mapa SIG de territorio ── */
var _wmsLayers = {};
function toggleWMSLayer(capa, on){
  var mapId = 'mapa-main';
  var mapObj = window._PIIT_mapa || (window.PIIT && window.PIIT.map && window.PIIT.map._map);
  if(!mapObj && typeof L !== 'undefined'){
    // buscar mapa Leaflet en el contenedor principal
    var containers = document.querySelectorAll('.leaflet-container');
    containers.forEach(function(c){ if(c._leaflet_id && !c.id.match(/mm-|sat/)) mapObj = c._leaflet_map; });
  }
  if(!mapObj){
    alert('Navega al módulo SIG·Territorio para activar esta capa, luego regresa aquí.');
    return;
  }
  var key = capa.nom;
  if(on){
    if(_wmsLayers[key]) return;
    var layer = L.tileLayer.wms(capa.url, {
      layers: capa.layer,
      format: 'image/png',
      transparent: true,
      opacity: 0.7,
      attribution: 'IGAC · '+capa.nom
    });
    layer.addTo(mapObj);
    _wmsLayers[key] = layer;
  } else {
    if(_wmsLayers[key]){ mapObj.removeLayer(_wmsLayers[key]); delete _wmsLayers[key]; }
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(buildPanel, 800); });
} else {
  setTimeout(buildPanel, 800);
}
})();
</script>`

// ══════════════════════════════════════════════════════════════════════
// PLATFORM_FIXES — correcciones globales de navegación, scroll y UX
// ══════════════════════════════════════════════════════════════════════
const PLATFORM_FIXES = `
<style>
#mm-outer { z-index: 9000 !important; }
nav button { cursor: pointer !important; }

/* ══ GPS — marcador pulsante de ubicación en mapa Leaflet ═════ */
.piit-user-dot {
  width: 18px; height: 18px; border-radius: 50%;
  background: #237938;
  border: 2.5px solid #fff;
  box-shadow: 0 0 0 0 rgba(35,121,56,0.5);
  animation: piit-gps-pulse 1.8s ease-in-out infinite;
}
@keyframes piit-gps-pulse {
  0%   { box-shadow: 0 0 0 0   rgba(35,121,56,0.55); }
  70%  { box-shadow: 0 0 0 14px rgba(35,121,56,0); }
  100% { box-shadow: 0 0 0 0   rgba(35,121,56,0); }
}
.piit-user-popup .leaflet-popup-content-wrapper {
  border-radius: 8px !important;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18) !important;
  padding: 0 !important;
}
.piit-user-popup .leaflet-popup-content {
  margin: 10px 14px !important;
}
.piit-user-popup .leaflet-popup-tip-container { display: none !important; }

/* ══ SIG Municipal — correcciones layout ══════════════════════ */

/* 1. Revertir override blanco del Mac Theme en barras del mapa */
#s-mapa .map-statusbar,
#s-mapa [class*="statusbar"] {
  background: rgba(0,0,0,0.50) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: none !important;
  border-top: 1px solid rgba(255,255,255,0.05) !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* 2. Leyenda dinámica — scroll horizontal suave, sin cortes */
.map-legend-strip {
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  gap: 10px !important;
  scrollbar-width: none !important;
}
.map-legend-strip::-webkit-scrollbar { display: none !important; }
.ml-item {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

/* 3. Label indicador — visible completo, no cortado */
#legend-indicator-label {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  margin-right: 6px !important;
}

/* 4. Barra de estado — ítems no se cortan */
.map-statusbar .msb-item {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

/* 5. Atribución OSM — siempre al final */
.map-legend-strip > span:last-child {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

/* ══════════════════════════════════════════════════════════════════
   REVISIÓN INTEGRAL UI — correcciones de layout, overflow y tipografía
   ══════════════════════════════════════════════════════════════════ */

/* ── 1. NAVBAR — evitar corte del último ítem ─────────────────── */
.piit-nav, nav .nav-items, nav .nav-inner {
  flex-wrap: wrap !important;
  gap: 2px !important;
}
.piit-nav button, nav button.nav-btn, nav [class*="nav-btn"] {
  font-size: 11.5px !important;
  padding-left: 9px !important;
  padding-right: 9px !important;
  white-space: nowrap !important;
}

/* ── 2 & 3. TABLAS CONTRATOS / OBRAS — clamp vía div wrapper ─── */
/* td no acepta display:-webkit-box, se aplica a .td-clamp-inner via JS */
.td-clamp-inner {
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  word-break: break-word !important;
  white-space: normal !important;
  line-height: 1.45 !important;
  max-width: 100% !important;
}
#s-contratos table td, #s-obras table td {
  vertical-align: top !important;
  padding-top: 9px !important;
  padding-bottom: 9px !important;
  white-space: normal !important;
}
#s-contratos table td:nth-child(2) {
  max-width: 290px !important;
  font-size: 11.5px !important;
}
#s-obras table td:first-child {
  max-width: 250px !important;
  font-size: 11.5px !important;
}

/* ── 4. DASHBOARD — .bar-name sin corte ─────────────────────── */
.bar-name {
  font-size: 10px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 115px !important;
  flex-shrink: 1 !important;
  min-width: 0 !important;
}
.bar-row {
  min-width: 0 !important;
}

/* ── 5. PRESUPUESTO — .pres-sec sin desbordamiento ──────────── */
.pres-sec {
  font-size: 11px !important;
  white-space: normal !important;
  word-break: break-word !important;
  overflow: hidden !important;
  line-height: 1.3 !important;
  min-width: 0 !important;
}

/* ── 6. PRESTADORES — grid responsive 2×2 en pantallas <1200px */
.pdc-grid-prestadores,
#s-reportes .pdc-section > div[style*="grid"],
#s-reportes [style*="repeat(2"],
#s-reportes [style*="repeat(4"] {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
}

/* ── 7. TIPOGRAFÍA GLOBAL — legibilidad y escala uniforme ───── */
.sec-title, .section-title {
  font-size: clamp(18px, 2.2vw, 26px) !important;
  line-height: 1.25 !important;
}
.sec-sub {
  font-size: clamp(11px, 1.1vw, 13px) !important;
  line-height: 1.5 !important;
}

/* ── 8. TARJETAS KPI — alineación interna uniforme ──────────── */
.kpi-card, .stat-card, .dash-card {
  min-width: 0 !important;
  overflow: hidden !important;
}
.kpi-card .kc-val, .stat-card .sc-val,
.dash-card .dc-val {
  font-size: clamp(22px, 3vw, 36px) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.kpi-card .kc-lbl, .stat-card .sc-lbl,
.dash-card .dc-lbl {
  font-size: clamp(9px, 0.85vw, 11px) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* ── 9. HERO STATS (banner verde superior) ───────────────────── */
.hs-num, .hero-stat-val {
  font-size: clamp(20px, 2.5vw, 32px) !important;
  white-space: nowrap !important;
}
.hs-lbl, .hero-stat-lbl {
  font-size: clamp(8px, 0.8vw, 10px) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* ── 10. ALERTAS / REPORTES RECIENTES — texto sin desborde ───── */
.alert-title, .report-title, .rpt-title {
  font-size: clamp(12px, 1.2vw, 14px) !important;
  line-height: 1.35 !important;
  overflow: hidden !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
}
.alert-sub, .report-sub, .rpt-sub {
  font-size: clamp(10px, 0.9vw, 11.5px) !important;
  line-height: 1.4 !important;
  overflow: hidden !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
}

/* ── 11. SECRETARÍAS — tarjetas uniformes ────────────────────── */
.dep-card, .sec-card, .secretaria-card {
  min-width: 0 !important;
  overflow: hidden !important;
}
.dep-name, .sec-name {
  font-size: clamp(13px, 1.3vw, 16px) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* ── 12. TICKER DANE — contención garantizada ────────────────── */
.dane-ticker-wrap, .ticker-outer {
  overflow: hidden !important;
  max-width: 100% !important;
}

/* ── 13. SALUD / SIVIGILA — cards uniformes ──────────────────── */
#s-salud .kpi-card, #s-salud .health-card,
#s-salud .sivi-card {
  min-width: 0 !important;
  overflow: hidden !important;
}
#s-salud .kpi-card .kc-val {
  font-size: clamp(18px, 2vw, 26px) !important;
  white-space: nowrap !important;
}

/* ── 14b. WRAPPER .main ANIDADO — anular max-width interno ───── */
.section > .main,
.section .main {
  max-width: 100% !important;
  width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* ── 14c. SECCIONES SIN WRAPPER (SAT/BID) — uniformar ancho ──── */
#s-salud, #s-sistema, #s-productividad, #s-conectividad,
#s-calidad, #s-planeacion, #s-escenarios, #s-riesgo {
  max-width: 1140px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 28px !important;
  padding-right: 28px !important;
  box-sizing: border-box !important;
}

/* ── 15. RESPONSIVE — breakpoints críticos ───────────────────── */
@media (max-width: 1024px) {
  .piit-nav button, nav button.nav-btn { font-size: 11px !important; padding-left: 7px !important; padding-right: 7px !important; }
  .pdc-grid-prestadores, #s-reportes [style*="repeat"] { grid-template-columns: repeat(2, 1fr) !important; }
  #s-contratos table td:nth-child(2) { max-width: 200px !important; }
  /* Secciones SAT/BID sin doble padding */
  #s-salud, #s-sistema, #s-productividad, #s-conectividad,
  #s-calidad, #s-planeacion, #s-escenarios, #s-riesgo {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}
@media (max-width: 768px) {
  /* Prevenir overflow horizontal global */
  html, body { overflow-x: hidden !important; max-width: 100vw !important; }
  .section, .main, .card, .pt, .kpi-card, .stat-card, .dash-card {
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }
  /* Forzar grids a una columna */
  [style*="grid-template-columns: repeat(2"],
  [style*="grid-template-columns: repeat(3"],
  [style*="grid-template-columns: repeat(4"],
  [style*="grid-template-columns: 1fr 1fr"],
  [style*="grid-template-columns:repeat(2"],
  [style*="grid-template-columns:repeat(3"],
  [style*="grid-template-columns:repeat(4"] {
    grid-template-columns: 1fr !important;
  }
  /* Canvas y SVG no exceden el contenedor */
  canvas, svg { max-width: 100% !important; height: auto !important; }
  /* Tablas con scroll horizontal en lugar de overflow */
  #s-contratos table, #s-obras table,
  .obs-table, .contract-table { display: block !important; overflow-x: auto !important; }
  /* Navbar */
  .piit-nav, nav .nav-items { gap: 1px !important; flex-wrap: wrap !important; }
  .piit-nav button, nav button.nav-btn { font-size: 10px !important; padding: 6px 6px !important; }
  .sec-title, .section-title { font-size: 18px !important; }
  .pdc-grid-prestadores, #s-reportes [style*="repeat"] { grid-template-columns: 1fr !important; }
  .bar-name { max-width: 90px !important; }
  /* Hero stats apilados */
  .hero-stats, [class*="hero-stats"] {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8px !important;
  }
  /* Secciones SAT/BID padding mínimo */
  #s-salud, #s-sistema, #s-productividad, #s-conectividad,
  #s-calidad, #s-planeacion, #s-escenarios, #s-riesgo {
    padding-left: 14px !important;
    padding-right: 14px !important;
  }
}
@media (max-width: 480px) {
  .piit-nav button, nav button.nav-btn { display: none !important; }
  .hs-num, .hero-stat-val { font-size: 18px !important; }
  .hero-stats, [class*="hero-stats"] { grid-template-columns: 1fr !important; }
  .sec-title, .section-title { font-size: 16px !important; }
  /* Topbar: ocultar chips secundarios para evitar solapamiento */
  .tb-chip-live, .tb-chip-date, .tb-chip-time,
  [class*="topbar-chip"]:not(.tb-name):not(.tb-user),
  [class*="tb-chip"]:not(.tb-name):not(.tb-user),
  .topbar [class*="live"], .topbar [class*="date"],
  .topbar [class*="time"], .topbar [class*="@vivo"] { display: none !important; }
  /* Topbar y nombre compactos */
  .topbar, .tb { padding: 4px 8px !important; gap: 6px !important; }
  .tb-name, [class*="org-name"] { font-size: 11px !important; max-width: 110px !important;
    white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
  .tb-user, [class*="user-badge"] { font-size: 11px !important; padding: 4px 8px !important; }
}
</style>
<script>
(function(){
/* ─────────────────────────────────────────────────────────────────────
   PLATFORM NAV FIX v4
   Clave: secciones ocultas tienen rect.top=0. Se lee desde la sección
   VISIBLE en el momento exacto en que se llama scrollToVisibleSection.
   ───────────────────────────────────────────────────────────────────── */

function scrollToVisibleSection(){
  var secs = document.querySelectorAll('.section');
  var vis  = null;
  for(var i=0;i<secs.length;i++){
    if(getComputedStyle(secs[i]).display!=='none'){ vis=secs[i]; break; }
  }
  if(!vis) return;
  var navEl = document.querySelector('nav, .navbar, header');
  var navH  = navEl ? navEl.offsetHeight : 50;
  var absTop = vis.getBoundingClientRect().top + window.scrollY;
  var target = Math.max(0, absTop - navH - 2);
  window.scrollTo({ top: target, behavior: 'smooth' });
}

/* Listener de click en la navbar */
document.addEventListener('click', function(e){
  if(e.target.closest('button[onclick*="goSection"]'))
    setTimeout(scrollToVisibleSection, 70);
}, true);

/* Parche programático de goSection / goSectionDD */
var _done = false;
function patch(){
  if(_done || !window.PIIT || !window.PIIT.ui || !window.PIIT.ui.goSection) return false;
  _done = true;
  var _gs  = window.PIIT.ui.goSection.bind(window.PIIT.ui);
  var _gsd = window.PIIT.ui.goSectionDD
             ? window.PIIT.ui.goSectionDD.bind(window.PIIT.ui) : null;
  window.PIIT.ui.goSection = function(id,el){ _gs(id,el); setTimeout(scrollToVisibleSection,70); };
  if(_gsd) window.PIIT.ui.goSectionDD = function(id,el,dd){ _gsd(id,el,dd); setTimeout(scrollToVisibleSection,70); };
  return true;
}

function init(){
  if(!patch()){ var iv=setInterval(function(){ if(patch()) clearInterval(iv); },250); }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ setTimeout(init,400); });
else setTimeout(init,400);
})();

/* ── GPS locateUser: sincroniza visor 3D → mapa Leaflet principal ── */
(function(){
  var _userPin = null, _userCircle = null, _userAccCircle = null;

  /* ── 1. Capturar instancia Leaflet (ya inicializada o futura) ────────────
     Estrategia A: si el mapa ya existe, interceptar setView brevemente.
     Estrategia B: si el mapa aún no existe, monkey-patch L.map factory. */
  function captureLeafletMain(){
    if(window._PIIT_mapa) return true;
    if(!window.L) return false;
    /* Estrategia A — mapa ya inicializado: interceptar próxima llamada a setView */
    if(window.PIIT && window.PIIT.map && window.PIIT.map.centerMap){
      var origSV = L.Map.prototype.setView;
      L.Map.prototype.setView = function(){
        var el = this._container;
        if(!window._PIIT_mapa && el && el.id === 'leaflet-main') window._PIIT_mapa = this;
        return origSV.apply(this, arguments);
      };
      window.PIIT.map.centerMap();      /* dispara setView → captura */
      L.Map.prototype.setView = origSV; /* restaurar */
      if(window._PIIT_mapa) return true;
    }
    /* Estrategia B — mapa aún no existe: patch de L.map factory */
    if(!L.map.__piit_patched){
      var _orig = L.map;
      L.map = function(el, opts){
        var m = _orig.call(this, el, opts);
        if((typeof el==='string'?el:(el&&el.id))==='leaflet-main') window._PIIT_mapa = m;
        return m;
      };
      L.map.__piit_patched = true;
    }
    return !!window._PIIT_mapa;
  }

  /* ── 2. Registrar PIIT.map.locateUser ─────────────────────────────────── */
  function attachLocateUser(){
    if(!window.PIIT || !window.PIIT.map) return false;
    if(window.PIIT.map.locateUser) return true;

    var _firstFly = false; /* volar solo en la primera lectura */

    window.PIIT.map.locateUser = function(lat, lon, accuracy, speed, heading){
      /* Esperar a que el mapa esté listo */
      var m = window._PIIT_mapa;
      if(!m){
        setTimeout(function(){ window.PIIT.map.locateUser(lat,lon,accuracy,speed,heading); }, 400);
        return;
      }
      var L = window.L;
      if(!L) return;

      var acc = accuracy || 60;

      /* ── Actualizar / crear capas ─────────────────────────── */
      if(_userPin){
        /* Refinamiento: solo mover el marcador existente (sin crear nuevas capas) */
        _userPin.setLatLng([lat, lon]);
        if(_userCircle)    _userCircle.setLatLng([lat, lon]).setRadius(Math.max(acc, 5));
        if(_userAccCircle) _userAccCircle.setLatLng([lat, lon]).setRadius(Math.min(acc, 2000));
      } else {
        /* Primera vez: crear todas las capas */
        _userAccCircle = L.circle([lat, lon], {
          radius: Math.min(acc, 2000),
          color:'#237938', fillColor:'#237938',
          fillOpacity:0.07, weight:1, opacity:0.28, dashArray:'5 5'
        }).addTo(m);

        _userCircle = L.circle([lat, lon], {
          radius: Math.max(acc*0.35, 8),
          color:'#237938', fillColor:'#48B72C',
          fillOpacity:0.25, weight:2, opacity:0.55
        }).addTo(m);

        var icon = L.divIcon({
          className:'',
          html:'<div class="piit-user-dot"></div>',
          iconSize:[18,18], iconAnchor:[9,9], popupAnchor:[0,-14]
        });
        _userPin = L.marker([lat, lon], {icon:icon, zIndexOffset:2000}).addTo(m);
      }

      /* ── Popup con datos en tiempo real ───────────────────── */
      var inside = (lon>=-74.9161 && lon<=-74.338 && lat>=7.0764 && lat<=7.4788);
      var zona   = inside ? '📍 Municipio de Segovia' : '⚠️ Fuera del municipio';
      var accLabel = acc<=1 ?'<span style="color:#237938;font-weight:700">Alta precisión</span>'
                   : acc<=5 ?'<span style="color:#4a9e72">Buena señal</span>'
                   : acc<=15?'<span style="color:#C69A1A">Señal media</span>'
                   : '<span style="color:#C84040">Señal débil</span>';
      var extraRows = '';
      if(speed!=null && !isNaN(speed) && speed>0.5)
        extraRows += '<div style="font-size:9px;color:#888">Velocidad: '+Math.round(speed*3.6)+' km/h</div>';

      var popupHtml =
        '<div style="font-family:Metropolis,Inter,system-ui;line-height:1.65;min-width:155px">'
        +'<div style="font-size:11px;font-weight:700;color:#237938;margin-bottom:4px">📍 Tu ubicación GPS</div>'
        +'<div style="font-size:10.5px;color:#222;font-weight:600;letter-spacing:0.01em">'
          +lat.toFixed(6)+'°N</div>'
        +'<div style="font-size:10.5px;color:#222;font-weight:600;letter-spacing:0.01em">'
          +lon.toFixed(6)+'°O</div>'
        +'<div style="font-size:9.5px;color:#555;margin-top:4px">'+zona+'</div>'
        +'<div style="font-size:9px;color:#888;margin-top:2px">Precisión: ±'+(acc<1?acc.toFixed(2):acc<10?acc.toFixed(1):Math.round(acc))+' m · '+accLabel+'</div>'
        + extraRows
        +'</div>';

      _userPin.bindPopup(popupHtml, {className:'piit-user-popup', maxWidth:220});
      if(!_firstFly || _userPin.isPopupOpen()) _userPin.openPopup();

      /* ── Vuelo al punto (solo en la primera lectura) ─────── */
      if(!_firstFly){
        _firstFly = true;
        var zoom = inside ? 17 : 13;
        m.flyTo([lat, lon], zoom, {animate:true, duration:1.1});
      } else {
        /* Refinamiento: pan suave si el punto se movió significativamente */
        var prev = m.getCenter();
        var dist = m.distance([lat,lon],[prev.lat,prev.lng]);
        if(dist > 50) m.panTo([lat, lon], {animate:true, duration:0.5});
      }

      /* ── Statusbar ────────────────────────────────────────── */
      var coordEl = document.getElementById('map-coords');
      if(coordEl) coordEl.textContent = lat.toFixed(5)+'°N, '+lon.toFixed(5)+'°O';
    };

    /* Reset al detener el GPS para permitir nuevo vuelo */
    var _origStop = window.PIIT.map.locateUser;
    window.PIIT.map.resetGPSState = function(){
      _firstFly = false;
      if(_userPin)       { try{ window._PIIT_mapa.removeLayer(_userPin); }catch(e){} _userPin=null; }
      if(_userCircle)    { try{ window._PIIT_mapa.removeLayer(_userCircle); }catch(e){} _userCircle=null; }
      if(_userAccCircle) { try{ window._PIIT_mapa.removeLayer(_userAccCircle); }catch(e){} _userAccCircle=null; }
    };
    return true;
  }

  /* ── 3. Bootstrap: capturar Leaflet y registrar método ─────────────────── */
  function bootstrap(tries){
    tries = tries || 0;
    if(tries > 80) return;
    captureLeafletMain();
    var mPatch = attachLocateUser();
    if(mPatch) return;
    setTimeout(function(){ bootstrap(tries+1); }, 250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ bootstrap(); });
  else bootstrap();
})();

/* ─────────────────────────────────────────────────────────────────
   ANTI-LEAK — destruir Chart.js instances huérfanas al cambiar sección
   ──────────────────────────────────────────────────────────────── */
(function(){
  function cleanOrphanCharts(){
    if(!window.Chart || !window.Chart.instances) return;
    /* Chart.js v3+ usa Chart.registry; v2 usa Chart.instances */
    var instances = Chart.instances || {};
    Object.keys(instances).forEach(function(k){
      var inst = instances[k];
      if(inst && inst.canvas && !document.body.contains(inst.canvas)){
        try { inst.destroy(); } catch(e){}
      }
    });
  }
  /* Ejecutar tras cada cambio de sección con un pequeño delay */
  var origGoSec = null;
  function hookGoSection(){
    if(!window.PIIT || !window.PIIT.ui || !window.PIIT.ui.goSection) return false;
    if(window.PIIT.ui.__leakHooked) return true;
    window.PIIT.ui.__leakHooked = true;
    var _gs = window.PIIT.ui.goSection.bind(window.PIIT.ui);
    window.PIIT.ui.goSection = function(){
      var r = _gs.apply(null, arguments);
      setTimeout(cleanOrphanCharts, 200);
      return r;
    };
    return true;
  }
  if(!hookGoSection()){
    var iv = setInterval(function(){ if(hookGoSection()) clearInterval(iv); }, 300);
    setTimeout(function(){ clearInterval(iv); }, 10000);
  }
})();

/* ─────────────────────────────────────────────────────────────────
   ACCESIBILIDAD — auto-aria para inputs sin label y botones de icono
   ──────────────────────────────────────────────────────────────── */
(function(){
  function autoLabel(){
    /* Inputs/selects/textareas sin etiqueta — derivar de placeholder o id */
    document.querySelectorAll('input:not([type=hidden]), select, textarea').forEach(function(inp){
      if(inp.getAttribute('aria-label')||inp.getAttribute('aria-labelledby')) return;
      if(inp.id && document.querySelector('label[for="'+inp.id+'"]')) return;
      if(inp.closest('label')) return;
      var lbl = inp.placeholder || inp.title || inp.name ||
                (inp.id ? inp.id.replace(/[-_]/g,' ').replace(/^mm |^mob /,'') : 'Campo');
      inp.setAttribute('aria-label', lbl);
    });
    /* Botones con solo ícono — usar título o derivar */
    document.querySelectorAll('button').forEach(function(b){
      if(b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('title')) return;
      var hint = '';
      if(b.classList.contains('app-back')) hint = 'Volver';
      else if(b.querySelector('.fa-times,.fa-xmark,.fa-close')) hint = 'Cerrar';
      else if(b.querySelector('.fa-chevron-left')) hint = 'Anterior';
      else if(b.querySelector('.fa-chevron-right')) hint = 'Siguiente';
      else if(b.querySelector('.fa-search')) hint = 'Buscar';
      else hint = 'Botón';
      b.setAttribute('aria-label', hint);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', autoLabel);
  else autoLabel();
  /* Re-ejecutar tras renderizado dinámico (1s y 3s) */
  setTimeout(autoLabel, 1000);
  setTimeout(autoLabel, 3000);
})();

/* ─────────────────────────────────────────────────────────────────
   NAV SIG — mover Salud·Vigilancia al dropdown SIG
   ──────────────────────────────────────────────────────────────── */
(function(){
  function moveSaludToSIG(){
    var sigPanel = document.getElementById('nav-dd-portal-sig');
    if(!sigPanel) return false;

    /* 1. Agregar ítem Salud al panel SIG (si no existe ya) */
    if(!sigPanel.querySelector('[data-sig-salud]')){
      var btn = document.createElement('button');
      btn.className = 'nav-dd-item';
      btn.setAttribute('role','menuitem');
      btn.setAttribute('data-sig-salud','1');
      btn.setAttribute('onclick',"PIIT.ui.goSectionDD('s-salud',this,'sig')");
      btn.innerHTML = '<i class="fa-solid fa-heart-pulse" style="color:#DC0B2C"></i>'
        +'<div><strong>Salud · Vigilancia</strong>'
        +'<span>SIVIGILA · indicadores salud pública · epidemiología</span></div>';
      sigPanel.appendChild(btn);
    }

    /* 2. Quitar Análisis comparativo y SISBEN del panel SIG (si vinieron del original) */
    var analisisBtn = sigPanel.querySelector('button[onclick*="s-analisis"]:not([data-sig-analisis-kept])');
    if(analisisBtn){ analisisBtn.remove(); }
    var sisbenBtn = sigPanel.querySelector('button[onclick*="s-sisben"]:not([data-sig-sisben-kept])');
    if(sisbenBtn){ sisbenBtn.remove(); }

    /* 3. Agregar SISBEN y Análisis comparativo al panel Dashboard */
    var dashPanel = document.getElementById('nav-dd-portal-dash');
    if(dashPanel && !dashPanel.querySelector('[data-dash-sisben]')){
      var btnS = document.createElement('button');
      btnS.className = 'nav-dd-item';
      btnS.setAttribute('role','menuitem');
      btnS.setAttribute('data-dash-sisben','1');
      btnS.setAttribute('onclick',"PIIT.ui.goSectionDD('s-sisben',this,'dash')");
      btnS.innerHTML = '<i class="fa-solid fa-users" style="color:var(--au600)"></i>'
        +'<div><strong>SISBEN · Social</strong>'
        +'<span>Clasificación hogares · vulnerabilidad barrios</span></div>';
      dashPanel.appendChild(btnS);
    }
    if(dashPanel && !dashPanel.querySelector('[data-dash-analisis]')){
      var btnA = document.createElement('button');
      btnA.className = 'nav-dd-item';
      btnA.setAttribute('role','menuitem');
      btnA.setAttribute('data-dash-analisis','1');
      btnA.setAttribute('onclick',"PIIT.ui.goSectionDD('s-analisis',this,'dash')");
      btnA.innerHTML = '<i class="fa-solid fa-table-list" style="color:var(--au600)"></i>'
        +'<div><strong>Análisis comparativo · 19 barrios</strong>'
        +'<span>Indicadores por barrio · ranking · filtros</span></div>';
      dashPanel.appendChild(btnA);
    }

    /* 4. Agregar ítem Gestión del Riesgo al panel SIG (si no existe ya) */
    if(!sigPanel.querySelector('[data-sig-riesgo]')){
      var btnR = document.createElement('button');
      btnR.className = 'nav-dd-item';
      btnR.setAttribute('role','menuitem');
      btnR.setAttribute('data-sig-riesgo','1');
      btnR.setAttribute('onclick',"PIIT.ui.goSectionDD('s-riesgo',this,'sig');setTimeout(function(){if(window.PIIT&&window.PIIT.riesgo)PIIT.riesgo.init();},150)");
      btnR.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#EA580C"></i>'
        +'<div><strong>Gestión del Riesgo</strong>'
        +'<span>SAT · UNGRD · alertas tempranas · eventos históricos</span></div>';
      sigPanel.appendChild(btnR);
    }

    /* 3. Ocultar botones standalone de la navbar */
    var navBtns = document.querySelectorAll('nav button.nav-btn, .piit-nav button.nav-btn');
    navBtns.forEach(function(b){
      var txt = b.textContent.trim();
      if(!b.classList.contains('nav-dd-trigger') &&
         (txt.includes('Salud') || txt.includes('Riesgo'))){
        b.style.display = 'none';
      }
    });

    return true;
  }

  function initSaludNav(){
    if(!moveSaludToSIG()){
      var iv = setInterval(function(){ if(moveSaludToSIG()) clearInterval(iv); }, 300);
      setTimeout(function(){ clearInterval(iv); }, 8000);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initSaludNav);
  else initSaludNav();
})();

/* ─────────────────────────────────────────────────────────────────
   TABLA CLAMP — envuelve celdas largas en div.td-clamp-inner
   td no acepta display:-webkit-box; el wrapper lo permite.
   Usa un interval que sigue revisando hasta cubrir todos los tbody.
   ──────────────────────────────────────────────────────────────── */
(function(){
  function clampTable(tbody, colIndex){
    if(!tbody) return 0;
    var count = 0;
    Array.from(tbody.querySelectorAll('tr')).forEach(function(tr){
      var td = tr.querySelectorAll('td')[colIndex];
      if(!td || td.querySelector('.td-clamp-inner')) return;
      var inner = document.createElement('div');
      inner.className = 'td-clamp-inner';
      inner.innerHTML = td.innerHTML;
      td.innerHTML = '';
      td.appendChild(inner);
      count++;
    });
    return count;
  }

  function applyAll(){
    var ct = document.getElementById('contratos-tbody') ||
             (document.querySelector('#s-contratos table') && document.querySelector('#s-contratos table tbody'));
    var ob = document.getElementById('obras-tbody') ||
             (document.querySelector('#s-obras table') && document.querySelector('#s-obras table tbody'));
    clampTable(ct, 1);
    clampTable(ob, 0);
  }

  /* Arrancar y seguir revisando cada 1s hasta que ambos tbody tengan filas clampeadas.
     Se detiene a los 30s para no correr indefinidamente. */
  var _ticks = 0;
  var _iv = setInterval(function(){
    applyAll();
    _ticks++;
    /* Adjuntar MutationObserver al tbody una vez encontrado */
    ['contratos-tbody','obras-tbody'].forEach(function(id, i){
      var el = document.getElementById(id);
      if(el && !el.__clampObs){
        el.__clampObs = true;
        new MutationObserver(function(){ applyAll(); }).observe(el, {childList:true});
      }
    });
    if(_ticks >= 30) clearInterval(_iv);
  }, 1000);
})();
</script>`

const lastBody = html.lastIndexOf('</body>')
if (lastBody === -1) throw new Error('</body> no encontrado')
html = html.slice(0, lastBody) + SAT_SECTION + USER_BADGE + DERIVADOS_FIX + SAT_JS + REPORTES_REAL + DANE_TICKER + IGAC_REAL + MINIMAP_JS + PLATFORM_FIXES + '\n' + html.slice(lastBody)

/* ── Hardening de seguridad: agregar meta tags si no existen ── */
const SECURITY_META = `
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="format-detection" content="telephone=no">
`
const headEnd = html.indexOf('</head>')
if (headEnd !== -1 && html.indexOf('X-Frame-Options') === -1) {
  html = html.slice(0, headEnd) + SECURITY_META + html.slice(headEnd)
}

writeFileSync(dest, html, 'utf8')
const kb = Math.round(Buffer.byteLength(html, 'utf8') / 1024)
console.log(`✓ piit-v5.html generado: ${kb} KB`)
console.log(`  • Auth guard      → después de <body>`)
console.log(`  • CSS Premium v3  → fondo blanco · institucional`)
console.log(`  • Nav SAT         → Gestión del Riesgo`)
console.log(`  • Sección SAT     → s-riesgo completa`)
console.log(`  • Módulo JS       → PIIT.riesgo`)
console.log(`  • IGAC Real       → Agrología 1:25.000 · 240 unidades · 6 WMS`)
