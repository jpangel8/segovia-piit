/*
 * AuthService — autenticación del lado del cliente.
 *
 * LÍMITE IMPORTANTE (auditoría de seguridad nov-2026): PIIT es una aplicación
 * estática sin backend. Los usuarios viven en localStorage del propio
 * navegador y la sesión es un token SIN FIRMAR (base64). Eso significa que este
 * acceso es una puerta de cortesía/UX, NO una barrera de seguridad: cualquiera
 * con acceso al navegador puede editar localStorage. Para proteger información
 * sensible hace falta autenticación en servidor (contraseñas con bcrypt/argon2,
 * JWT firmado o cookie HttpOnly). No publicar datos reservados en esta app.
 *
 * Mejoras aplicadas aquí: contraseñas con PBKDF2-SHA256 + sal (antes un hash de
 * 32 bits reversible), sin credenciales por defecto en producción, el rol no se
 * puede elegir al registrarse, acciones de administración con verificación de
 * rol y freno a intentos de acceso repetidos.
 */
const USERS_KEY = "piit-users"
const SESSION_KEY = "piit-session"
const LOCK_KEY = "piit-login-lock"

const PBKDF2_ITERATIONS = 210000
const MIN_PASSWORD = 8
const MAX_ATTEMPTS = 5
const LOCK_MS = 60 * 1000

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/* ── Hash de contraseñas ─────────────────────────────────────────── */
const enc = new TextEncoder()

function toB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function fromB64(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"])
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256)
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const bits = await pbkdf2(password, salt, PBKDF2_ITERATIONS)
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toB64(salt)}$${toB64(bits)}`
}

/** Hash heredado (32 bits, inseguro). Solo se conserva para migrar cuentas antiguas. */
function legacyHash(password) {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash + password.charCodeAt(i)) | 0
  }
  return `hashed_${Math.abs(hash).toString(36)}`
}

async function verifyPassword(password, stored) {
  if (typeof stored !== "string") return { ok: false }
  if (stored.startsWith("pbkdf2$")) {
    const [, iter, saltB64, hashB64] = stored.split("$")
    const bits = await pbkdf2(password, fromB64(saltB64), parseInt(iter, 10))
    return { ok: toB64(bits) === hashB64, legacy: false }
  }
  // cuenta antigua: se valida y se migra a PBKDF2 tras el primer acceso correcto
  return { ok: stored === legacyHash(password), legacy: true }
}

/* ── Sesión ──────────────────────────────────────────────────────── */
function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }
  return btoa(JSON.stringify(payload)) // sin firma: ver nota de límite arriba
}

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

/* ── Freno a intentos repetidos (UX; no sustituye controles de servidor) ── */
function lockState() {
  try {
    return JSON.parse(localStorage.getItem(LOCK_KEY)) || { fails: 0, until: 0 }
  } catch {
    return { fails: 0, until: 0 }
  }
}
function registerFailure() {
  const s = lockState()
  s.fails += 1
  if (s.fails >= MAX_ATTEMPTS) {
    s.until = Date.now() + LOCK_MS
    s.fails = 0
  }
  localStorage.setItem(LOCK_KEY, JSON.stringify(s))
}
function clearFailures() {
  localStorage.removeItem(LOCK_KEY)
}

/* ── Cuenta de demostración: SOLO en desarrollo (npm run dev) ───────────
   Antes se creaba siempre un administrador con una clave fija y esa clave
   se mostraba en la pantalla de login. En producción ya no existe ninguna
   credencial por defecto. */
const ready = (async function seedDevAdmin() {
  if (!import.meta.env.DEV) return
  const users = getUsers()
  if (users.length === 0) {
    users.push({
      id: crypto.randomUUID(),
      name: "Administrador (demo local)",
      email: "admin@piit.dev",
      password: await hashPassword("admin123"),
      role: "admin",
      createdAt: new Date().toISOString(),
    })
    saveUsers(users)
  }
})()

const listeners = new Set()

function notify() {
  const user = AuthService.currentUser()
  for (const fn of listeners) fn(user)
}

export const AuthService = {
  ready,

  async register({ name, email, password, role }) {
    await ready
    const users = getUsers()
    const mail = String(email || "").trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return { ok: false, error: "Ingresa un correo electrónico válido" }
    }
    if (users.some((u) => u.email === mail)) {
      return { ok: false, error: "El correo ya está registrado" }
    }
    if (String(password || "").length < MIN_PASSWORD) {
      return { ok: false, error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres` }
    }

    // El rol NO se toma de quien se registra (evita escalada de privilegios);
    // solo un administrador autenticado puede asignarlo.
    const assignedRole = this.isAdmin() && role ? role : "user"

    const user = {
      id: crypto.randomUUID(),
      name: String(name || "").trim(),
      email: mail,
      password: await hashPassword(password),
      role: assignedRole,
      createdAt: new Date().toISOString(),
    }

    users.push(user)
    saveUsers(users)

    localStorage.setItem(SESSION_KEY, createToken(user))
    notify()

    return { ok: true, user: { ...user, password: undefined } }
  },

  async login({ email, password }) {
    await ready
    const lock = lockState()
    if (lock.until > Date.now()) {
      const s = Math.ceil((lock.until - Date.now()) / 1000)
      return { ok: false, error: `Demasiados intentos. Espera ${s} s e inténtalo de nuevo.` }
    }

    const mail = String(email || "").trim().toLowerCase()
    const users = getUsers()
    const user = users.find((u) => u.email === mail)

    let valid = false
    if (user) {
      const r = await verifyPassword(password || "", user.password)
      valid = r.ok
      if (valid && r.legacy) {
        user.password = await hashPassword(password)
        saveUsers(users)
      }
    } else {
      // gasto de tiempo similar para no revelar si el correo existe
      await pbkdf2(password || "", crypto.getRandomValues(new Uint8Array(16)), PBKDF2_ITERATIONS)
    }

    if (!valid) {
      registerFailure()
      return { ok: false, error: "Correo o contraseña incorrectos" }
    }

    clearFailures()
    localStorage.setItem(SESSION_KEY, createToken(user))
    notify()

    return { ok: true, user: { ...user, password: undefined } }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
    notify()
  },

  currentUser() {
    const token = localStorage.getItem(SESSION_KEY)
    if (!token) return null
    const payload = decodeToken(token)
    if (!payload) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return payload
  },

  isAuthenticated() {
    return this.currentUser() !== null
  },

  isAdmin() {
    const user = this.currentUser()
    return user?.role === "admin"
  },

  getAllUsers() {
    if (!this.isAdmin()) return []
    return getUsers().map((u) => ({ ...u, password: undefined }))
  },

  deleteUser(id) {
    if (!this.isAdmin()) return { ok: false, error: "No autorizado" }
    const current = this.currentUser()
    if (current?.id === id) return { ok: false, error: "No puedes eliminarte a ti mismo" }
    const users = getUsers().filter((u) => u.id !== id)
    saveUsers(users)
    return { ok: true }
  },

  updateRole(id, role) {
    if (!this.isAdmin()) return { ok: false, error: "No autorizado" }
    if (!["admin", "user"].includes(role)) return { ok: false, error: "Rol no válido" }
    const users = getUsers()
    const user = users.find((u) => u.id === id)
    if (!user) return { ok: false, error: "Usuario no encontrado" }
    user.role = role
    saveUsers(users)
    return { ok: true }
  },

  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
