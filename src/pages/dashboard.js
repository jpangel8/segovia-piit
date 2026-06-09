import { animate } from "motion/mini"
import { AuthService } from "@/services/auth-service.js"
import { ExperimentEngine } from "@/config/experiment-engine.js"
import { createExperimentPanel } from "@/components/experiment-panel.js"
import { Router } from "@/config/router.js"

let currentAnimation = null

function runAnimation() {
  const box = document.querySelector("#box")
  if (!box) return
  if (currentAnimation) currentAnimation.stop()

  const params = ExperimentEngine.getAll()

  box.style.width = `${params.boxSize}px`
  box.style.height = `${params.boxSize}px`
  box.style.borderRadius = `${params.themeBorderRadius}px`
  box.style.background = `hsl(${params.themeHue}, 58%, 52%)`
  box.style.transform = ""

  currentAnimation = animate(
    box,
    { x: params.animationDistance, rotate: params.animationRotation, scale: params.animationScale },
    {
      duration: params.animationDuration,
      easing: params.animationEasing,
      onComplete: () => {
        if (params.autoReplay) {
          setTimeout(() => {
            box.style.transform = ""
            runAnimation()
          }, 400)
        }
      },
    }
  )
}

function renderAdminPanel() {
  if (!AuthService.isAdmin()) return ""

  const users = AuthService.getAllUsers()
  const rows = users
    .map(
      (u) => `<tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <select class="role-select" data-user-id="${u.id}">
          <option value="user" ${u.role === "user" ? "selected" : ""}>User</option>
          <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </td>
      <td>${new Date(u.createdAt).toLocaleDateString("es")}</td>
      <td><button class="btn-delete-user" data-user-id="${u.id}">Eliminar</button></td>
    </tr>`
    )
    .join("")

  return `
    <div class="admin-section">
      <h3>Gestión de Usuarios</h3>
      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`
}

export function renderDashboard(container) {
  const user = AuthService.currentUser()
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const totalUsers = AuthService.getAllUsers().length

  container.innerHTML = `
    <div class="app-layout">
      <nav class="navbar">
        <span class="navbar-brand">PIIT</span>
        <div class="navbar-nav">
          <a href="#/" class="nav-link active">Dashboard</a>
          ${AuthService.isAdmin() ? '<a href="#/" class="nav-link">Usuarios</a>' : ""}
        </div>
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
      <main class="dashboard-content">
        <div class="dashboard-welcome">
          <h2>Bienvenido, ${user.name.split(" ")[0]}</h2>
          <p>Panel de control de la plataforma PIIT</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Usuarios</div>
            <div class="stat-value purple">${totalUsers}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Experimentos</div>
            <div class="stat-value green">${Object.keys(ExperimentEngine.getConfig()).length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Modo</div>
            <div class="stat-value blue">${import.meta.env.VITE_MODE || "dev"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Rol</div>
            <div class="stat-value orange">${user.role}</div>
          </div>
        </div>
        <div class="demo-area">
          <h3>Motor de Animación</h3>
          <div id="box"></div>
        </div>
        ${renderAdminPanel()}
      </main>
    </div>`

  container.querySelector("#btn-logout").addEventListener("click", () => {
    AuthService.logout()
    Router.navigate("/login")
  })

  if (AuthService.isAdmin()) {
    container.querySelectorAll(".role-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        AuthService.updateRole(e.target.dataset.userId, e.target.value)
      })
    })

    container.querySelectorAll(".btn-delete-user").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const result = AuthService.deleteUser(e.target.dataset.userId)
        if (result.ok) renderDashboard(container)
      })
    })
  }

  const panel = createExperimentPanel()
  if (panel) container.appendChild(panel)

  ExperimentEngine.subscribe(() => runAnimation())
  setTimeout(() => runAnimation(), 100)
}
