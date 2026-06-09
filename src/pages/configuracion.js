import { AuthService } from "@/services/auth-service.js"
import { ExperimentEngine } from "@/config/experiment-engine.js"

function renderUsersTable() {
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
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Creado</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`
}

export function renderConfiguracion(container, layout) {
  const user = AuthService.currentUser()

  layout.innerHTML = `
    <div class="dashboard-content">
      <div class="page-header">
        <h2>Configuración</h2>
        <p>Ajustes de la plataforma y gestión de usuarios</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Versión</div>
          <div class="stat-value purple">0.1.0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Modo</div>
          <div class="stat-value green">${import.meta.env.VITE_MODE || "dev"}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Experimentos</div>
          <div class="stat-value blue">${Object.keys(ExperimentEngine.getConfig()).length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Tu Rol</div>
          <div class="stat-value orange">${user.role}</div>
        </div>
      </div>
      ${renderUsersTable()}
    </div>`

  if (AuthService.isAdmin()) {
    layout.querySelectorAll(".role-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        AuthService.updateRole(e.target.dataset.userId, e.target.value)
      })
    })

    layout.querySelectorAll(".btn-delete-user").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const result = AuthService.deleteUser(e.target.dataset.userId)
        if (result.ok) renderConfiguracion(container, layout)
      })
    })
  }
}
