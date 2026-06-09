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

const app = document.querySelector("#app")

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
        `<a href="#${item.path}" class="nav-link ${activePath === item.path ? "active" : ""}">${item.icon} ${item.label}</a>`
    )
    .join("")

  app.innerHTML = `
    <div class="app-layout">
      <nav class="navbar">
        <span class="navbar-brand">PIIT</span>
        <div class="navbar-nav">${navLinks}</div>
        <div class="navbar-user">
          <div class="user-badge">
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
              <span class="user-name">${user.name}</span>
              <span class="user-role">${user.role}</span>
            </div>
          </div>
          <button class="btn-logout" id="btn-logout">Salir</button>
        </div>
      </nav>
      <div id="page-content"></div>
    </div>`

  app.querySelector("#btn-logout").addEventListener("click", () => {
    AuthService.logout()
    Router.navigate("/login")
  })

  return app.querySelector("#page-content")
}

Router.guard((path) => {
  if (PUBLIC_ROUTES.includes(path) && AuthService.isAuthenticated()) return "/"
  if (!PUBLIC_ROUTES.includes(path) && !AuthService.isAuthenticated()) return "/login"
  if (path === "/configuracion" && !AuthService.isAdmin()) return "/"
  return path
})

Router.register("/login", () => renderLogin(app))
Router.register("/register", () => renderRegister(app))

Router.register("/", () => {
  const layout = renderAppShell("/")
  if (layout) renderDashboard(app, layout)
})

Router.register("/territorio", () => {
  const layout = renderAppShell("/territorio")
  if (layout) renderTerritorio(app, layout)
})

Router.register("/indicadores", () => {
  const layout = renderAppShell("/indicadores")
  if (layout) renderIndicadores(app, layout)
})

Router.register("/configuracion", () => {
  const layout = renderAppShell("/configuracion")
  if (layout) renderConfiguracion(app, layout)
})

Router.register("*", () => Router.navigate("/"))

Router.start()
