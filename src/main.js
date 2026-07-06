import { AuthService } from "@/services/auth-service.js"
import { Router } from "@/config/router.js"
import { renderLogin } from "@/pages/login.js"
import { renderRegister } from "@/pages/register.js"
import { renderDashboard } from "@/pages/dashboard.js"
import { renderTerritorio } from "@/pages/territorio.js"
import { renderIndicadores } from "@/pages/indicadores.js"
import { renderConfiguracion } from "@/pages/configuracion.js"
import "./styles/style.css"
import "./styles/auth.css"
import "./styles/dashboard.css"
import "./styles/charts.css"
import "./styles/experiment-panel.css"
import "./styles/map.css"

const app = document.querySelector("#app")
const loader = document.querySelector("#app-loader")
const loaderStart = Date.now()
const LOADER_MIN_MS = 1800

function dismissLoader() {
  if (!loader) return
  const elapsed = Date.now() - loaderStart
  const remaining = Math.max(0, LOADER_MIN_MS - elapsed)
  setTimeout(() => {
    loader.classList.add("hidden")
    setTimeout(() => loader.remove(), 400)
  }, remaining)
}

const PUBLIC_ROUTES = ["/login", "/register"]

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "&#9632;" },
  { path: "/territorio", label: "Territorio", icon: "&#9673;" },
  { path: "/indicadores", label: "Indicadores", icon: "&#9650;" },
  { path: "/configuracion", label: "Configuración", icon: "&#9881;", admin: true },
]

function renderAppShell(activePath) {
  const user = AuthService.currentUser()
  if (!user) return

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const navLinks = NAV_ITEMS
    .filter((item) => !item.admin || AuthService.isAdmin())
    .map(
      (item) =>
        `<a href="#${item.path}" class="nav-link ${activePath === item.path ? "active" : ""}" aria-current="${activePath === item.path ? "page" : "false"}">${item.icon} ${item.label}</a>`
    )
    .join("")

  app.innerHTML = `
    <div class="app-layout">
      <nav class="navbar" role="navigation" aria-label="Navegación principal">
        <a class="navbar-brand" href="#/">
          <div class="navbar-brand-logo">PI</div>
          <div>
            <span class="navbar-brand-text">PIIT</span>
            <span class="navbar-brand-sub">Segovia · Inteligencia Territorial</span>
          </div>
        </a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false">&#9776;</button>
        <div class="navbar-nav" id="navbar-nav" role="menubar">${navLinks}</div>
        <div class="navbar-user">
          <div class="user-badge">
            <div class="user-avatar" aria-hidden="true">${initials}</div>
            <div class="user-info">
              <span class="user-name">${user.name}</span>
              <span class="user-role">${user.role}</span>
            </div>
          </div>
          <button class="btn-logout" id="btn-logout" aria-label="Cerrar sesión">Salir</button>
        </div>
      </nav>
      <main id="page-content" class="page-enter" tabindex="-1"></main>
    </div>`

  app.querySelector("#btn-logout").addEventListener("click", () => {
    AuthService.logout()
    Router.navigate("/login")
  })

  const toggle = app.querySelector("#nav-toggle")
  const nav = app.querySelector("#navbar-nav")
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open")
    toggle.setAttribute("aria-expanded", open)
    toggle.innerHTML = open ? "&#10005;" : "&#9776;"
  })

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open")
      toggle.setAttribute("aria-expanded", "false")
      toggle.innerHTML = "&#9776;"
    })
  })

  return app.querySelector("main")
}

Router.guard((path) => {
  if (AuthService.isAuthenticated()) {
    window.location.replace("/piit-v5.html")
    return path
  }
  if (!PUBLIC_ROUTES.includes(path)) return "/login"
  return path
})

Router.register("/login", () => {
  renderLogin(app)
  dismissLoader()
})

Router.register("/register", () => {
  renderRegister(app)
  dismissLoader()
})

Router.register("/", () => {
  const layout = renderAppShell("/")
  if (layout) renderDashboard(app, layout)
  dismissLoader()
})

Router.register("/territorio", () => {
  const layout = renderAppShell("/territorio")
  if (layout) renderTerritorio(app, layout)
  dismissLoader()
})

Router.register("/indicadores", () => {
  const layout = renderAppShell("/indicadores")
  if (layout) renderIndicadores(app, layout)
  dismissLoader()
})

Router.register("/configuracion", () => {
  const layout = renderAppShell("/configuracion")
  if (layout) renderConfiguracion(app, layout)
  dismissLoader()
})

Router.register("*", () => Router.navigate("/"))

Router.start()

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/sw.js")
}
