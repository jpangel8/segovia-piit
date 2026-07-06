import { AuthService } from "@/services/auth-service.js"
import { Router } from "@/config/router.js"

export function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-container">

      <!-- Panel izquierdo: Identidad institucional Segovia -->
      <div class="auth-brand-panel">

        <div class="auth-brand-header">
          <svg class="auth-brand-escudo" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L4 9v18c0 12 8 21.5 18 24 10-2.5 18-12 18-24V9L22 2z"
              fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
            <path d="M22 7L8 13v14c0 9 6 16 14 18.5C30 43 36 36 36 27V13L22 7z"
              fill="rgba(255,255,255,0.10)"/>
            <path d="M22 16l-6 3v5c0 3.5 2.5 6.5 6 7.5 3.5-1 6-4 6-7.5v-5L22 16z"
              fill="rgba(255,255,255,0.30)" stroke="rgba(255,255,255,0.50)" stroke-width="1"/>
          </svg>
          <div class="auth-brand-org">
            <span class="auth-brand-org-name">Alcaldía de Segovia</span>
            <span class="auth-brand-org-dep">Antioquia · Colombia · NIT 890981391-2</span>
          </div>
        </div>

        <div class="auth-brand-center">
          <div class="auth-brand-piit-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
                stroke="white" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
              <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9"/>
              <path d="M12 7V9.5M12 14.5V17" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
            </svg>
          </div>
          <div class="auth-brand-piit-title">PIIT</div>
          <div class="auth-brand-piit-sub">Plataforma Integral de<br>Inteligencia Territorial</div>
          <div class="auth-brand-chips">
            <span class="auth-brand-chip"><span class="auth-brand-chip-dot"></span>Dashboard Municipal</span>
            <span class="auth-brand-chip"><span class="auth-brand-chip-dot"></span>SIG · Territorio</span>
            <span class="auth-brand-chip"><span class="auth-brand-chip-dot"></span>Contratos SECOP II</span>
            <span class="auth-brand-chip"><span class="auth-brand-chip-dot"></span>Gestión del Riesgo</span>
            <span class="auth-brand-chip"><span class="auth-brand-chip-dot"></span>Salud · SIVIGILA</span>
            <span class="auth-brand-chip"><span class="auth-brand-chip-dot"></span>Misión Ciudades BID</span>
          </div>
        </div>

        <div class="auth-brand-footer">
          <span class="auth-brand-gov">GOV.CO</span>
          <span class="auth-brand-version">PIIT Segovia v5 · 2026</span>
        </div>

      </div>

      <!-- Panel derecho: Formulario de acceso -->
      <div class="auth-form-panel">
        <div class="auth-card">

          <div class="auth-logo">
            <h1>Acceso institucional</h1>
            <p>Sistema de Inteligencia Territorial<br>Alcaldía de Segovia · Antioquia</p>
          </div>

          <form class="auth-form" id="login-form" novalidate>
            <div class="auth-error" id="login-error" role="alert"></div>

            <div class="form-group">
              <label for="login-email">Correo institucional</label>
              <input
                type="email"
                id="login-email"
                placeholder="correo@segovia.gov.co"
                required
                autocomplete="email"
                inputmode="email"
              />
            </div>

            <div class="form-group">
              <label for="login-password">Contraseña</label>
              <input
                type="password"
                id="login-password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
            </div>

            <button type="submit" class="auth-btn" id="login-btn">
              Acceder a la plataforma
            </button>
          </form>

          <div class="auth-divider">acceso demo</div>

          <div class="auth-info">
            <strong>admin@piit.dev</strong> &nbsp;/&nbsp; <strong>admin123</strong>
          </div>

          <div class="auth-switch">
            ¿Sin cuenta? <a href="#/register">Solicitar acceso</a>
          </div>

        </div>

        <p class="auth-footer">Alcaldía de Segovia · Sistema Oficial de Inteligencia Territorial · 2026</p>
      </div>

    </div>`

  const form    = container.querySelector("#login-form")
  const errorEl = container.querySelector("#login-error")
  const btn     = container.querySelector("#login-btn")

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    errorEl.classList.remove("visible")
    btn.disabled = true
    btn.textContent = "Verificando…"

    const email    = container.querySelector("#login-email").value.trim()
    const password = container.querySelector("#login-password").value

    setTimeout(() => {
      const result = AuthService.login({ email, password })

      if (result.ok) {
        btn.textContent = "✓ Acceso concedido"
        setTimeout(() => { window.location.href = "/piit-v5.html" }, 350)
      } else {
        errorEl.textContent = result.error
        errorEl.classList.add("visible")
        btn.disabled = false
        btn.textContent = "Acceder a la plataforma"
      }
    }, 480)
  })
}
