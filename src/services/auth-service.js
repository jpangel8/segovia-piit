const USERS_KEY = "piit-users"
const SESSION_KEY = "piit-session"

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

function hashPassword(password) {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return `hashed_${Math.abs(hash).toString(36)}`
}

function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }
  return btoa(JSON.stringify(payload))
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

function seedDefaultAdmin() {
  const users = getUsers()
  if (users.length === 0) {
    users.push({
      id: crypto.randomUUID(),
      name: "Administrador",
      email: "admin@piit.dev",
      password: hashPassword("admin123"),
      role: "admin",
      createdAt: new Date().toISOString(),
    })
    saveUsers(users)
  }
}

seedDefaultAdmin()

const listeners = new Set()

function notify() {
  const user = AuthService.currentUser()
  for (const fn of listeners) fn(user)
}

export const AuthService = {
  register({ name, email, password, role = "user" }) {
    const users = getUsers()

    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "El correo ya está registrado" }
    }

    if (password.length < 6) {
      return { ok: false, error: "La contraseña debe tener al menos 6 caracteres" }
    }

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword(password),
      role,
      createdAt: new Date().toISOString(),
    }

    users.push(user)
    saveUsers(users)

    const token = createToken(user)
    localStorage.setItem(SESSION_KEY, token)
    notify()

    return { ok: true, user: { ...user, password: undefined } }
  },

  login({ email, password }) {
    const users = getUsers()
    const user = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === hashPassword(password)
    )

    if (!user) {
      return { ok: false, error: "Correo o contraseña incorrectos" }
    }

    const token = createToken(user)
    localStorage.setItem(SESSION_KEY, token)
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
    return getUsers().map((u) => ({ ...u, password: undefined }))
  },

  deleteUser(id) {
    const current = this.currentUser()
    if (current?.id === id) return { ok: false, error: "No puedes eliminarte a ti mismo" }
    const users = getUsers().filter((u) => u.id !== id)
    saveUsers(users)
    return { ok: true }
  },

  updateRole(id, role) {
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
