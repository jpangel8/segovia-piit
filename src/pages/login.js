import { AuthService } from "@/services/auth-service.js"
import { Router } from "@/config/router.js"

export function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>PIIT</h1>
          <p>Plataforma Integral de Innovación Tecnológica</p>
        </div>
        <form class="auth-form" id="login-form">
          <div class="auth-error" id="login-error"></div>
          <div class="form-group">
            <label for="login-email">Correo electrónico</label>
            <input type="email" id="login-email" placeholder="correo@ejemplo.com" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="login-password">Contraseña</label>
            <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button type="submit" class="auth-btn">Iniciar Sesión</button>
        </form>
        <div class="auth-divider">o</div>
        <div class="auth-info">
          Demo: <strong>admin@piit.dev</strong> / <strong>admin123</strong>
        </div>
        <div class="auth-switch">
          ¿No tienes cuenta? <a href="#/register">Regístrate</a>
        </div>
      </div>
    </div>`

  const form = container.querySelector("#login-form")
  const errorEl = container.querySelector("#login-error")

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    errorEl.classList.remove("visible")

    const email = container.querySelector("#login-email").value
    const password = container.querySelector("#login-password").value

    const result = AuthService.login({ email, password })

    if (result.ok) {
      Router.navigate("/")
    } else {
      errorEl.textContent = result.error
      errorEl.classList.add("visible")
    }
  })
}
