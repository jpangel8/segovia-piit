import { AuthService } from "@/services/auth-service.js"
import { Router } from "@/config/router.js"

export function renderRegister(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>PIIT</h1>
          <p>Crear nueva cuenta</p>
        </div>
        <form class="auth-form" id="register-form">
          <div class="auth-error" id="register-error"></div>
          <div class="form-group">
            <label for="reg-name">Nombre completo</label>
            <input type="text" id="reg-name" placeholder="Juan Pérez" required autocomplete="name" />
          </div>
          <div class="form-group">
            <label for="reg-email">Correo electrónico</label>
            <input type="email" id="reg-email" placeholder="correo@ejemplo.com" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="reg-password">Contraseña</label>
            <input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required minlength="6" autocomplete="new-password" />
          </div>
          <div class="form-group">
            <label for="reg-confirm">Confirmar contraseña</label>
            <input type="password" id="reg-confirm" placeholder="Repite la contraseña" required autocomplete="new-password" />
          </div>
          <button type="submit" class="auth-btn">Crear Cuenta</button>
        </form>
        <div class="auth-switch">
          ¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a>
        </div>
      </div>
    </div>`

  const form = container.querySelector("#register-form")
  const errorEl = container.querySelector("#register-error")

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    errorEl.classList.remove("visible")

    const name = container.querySelector("#reg-name").value
    const email = container.querySelector("#reg-email").value
    const password = container.querySelector("#reg-password").value
    const confirm = container.querySelector("#reg-confirm").value

    if (password !== confirm) {
      errorEl.textContent = "Las contraseñas no coinciden"
      errorEl.classList.add("visible")
      return
    }

    const result = AuthService.register({ name, email, password })

    if (result.ok) {
      Router.navigate("/")
    } else {
      errorEl.textContent = result.error
      errorEl.classList.add("visible")
    }
  })
}
