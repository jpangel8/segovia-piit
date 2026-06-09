import EXPERIMENTS from "./experiments.js"

const STORAGE_KEY = "piit-experiments"
const listeners = new Set()

let state = loadState()

function loadState() {
  if (typeof localStorage === "undefined") return getDefaults()
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return getDefaults()
    const parsed = JSON.parse(saved)
    const defaults = getDefaults()
    return { ...defaults, ...parsed }
  } catch {
    return getDefaults()
  }
}

function getDefaults() {
  const defaults = {}
  for (const [key, config] of Object.entries(EXPERIMENTS)) {
    defaults[key] = config.value
  }
  return defaults
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function notify() {
  for (const fn of listeners) fn(state)
}

export const ExperimentEngine = {
  get(key) {
    return state[key] ?? EXPERIMENTS[key]?.value
  },

  set(key, value) {
    if (!(key in EXPERIMENTS)) return
    state[key] = value
    saveState()
    notify()
  },

  getAll() {
    return { ...state }
  },

  getConfig() {
    return EXPERIMENTS
  },

  getByGroup(group) {
    return Object.entries(EXPERIMENTS)
      .filter(([, config]) => config.group === group)
      .map(([key, config]) => ({ key, ...config, value: state[key] }))
  },

  getGroups() {
    const groups = new Set()
    for (const config of Object.values(EXPERIMENTS)) {
      groups.add(config.group)
    }
    return [...groups]
  },

  reset() {
    state = getDefaults()
    saveState()
    notify()
  },

  resetKey(key) {
    if (!(key in EXPERIMENTS)) return
    state[key] = EXPERIMENTS[key].value
    saveState()
    notify()
  },

  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  isEnabled() {
    return import.meta.env.VITE_EXPERIMENTS_ENABLED === "true"
  },

  isPanelVisible() {
    return import.meta.env.VITE_EXPERIMENTS_PANEL === "true"
  },

  exportState() {
    return JSON.stringify(state, null, 2)
  },

  importState(json) {
    try {
      const imported = JSON.parse(json)
      const defaults = getDefaults()
      state = { ...defaults, ...imported }
      saveState()
      notify()
      return true
    } catch {
      return false
    }
  },
}
