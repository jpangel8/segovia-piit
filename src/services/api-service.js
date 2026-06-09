function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function generateTimeSeries(months, min, max) {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    return {
      label: date.toLocaleDateString("es", { month: "short", year: "2-digit" }),
      value: randomBetween(min, max),
    }
  })
}

function generateZones() {
  const zones = [
    { name: "Centro Histórico", color: "#7c3aed" },
    { name: "Zona Industrial", color: "#3b82f6" },
    { name: "Corredor Norte", color: "#10b981" },
    { name: "Periferia Sur", color: "#f59e0b" },
    { name: "Zona Residencial", color: "#ef4444" },
    { name: "Distrito Comercial", color: "#ec4899" },
  ]
  return zones.map((z) => ({
    ...z,
    poblacion: Math.round(randomBetween(8000, 45000)),
    densidad: randomBetween(50, 300),
    indiceDesarrollo: randomBetween(0.4, 0.95),
    empleos: Math.round(randomBetween(2000, 15000)),
  }))
}

const cache = new Map()
const CACHE_TTL = 30_000

function cached(key, fn) {
  return async function (...args) {
    const entry = cache.get(key)
    if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data
    const data = await fn(...args)
    cache.set(key, { data, ts: Date.now() })
    return data
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchResumenTerritorial() {
  await delay(randomBetween(80, 200))
  return {
    poblacionTotal: Math.round(randomBetween(120000, 180000)),
    superficie: randomBetween(80, 150),
    densidadPromedio: randomBetween(800, 1500),
    zonas: 6,
    empleosTotales: Math.round(randomBetween(45000, 75000)),
    idh: randomBetween(0.72, 0.88),
    crecimientoAnual: randomBetween(1.2, 4.5),
    inversionPublica: randomBetween(15, 45),
  }
}

async function fetchZonas() {
  await delay(randomBetween(80, 180))
  return generateZones()
}

async function fetchPoblacionHistorica() {
  await delay(randomBetween(60, 150))
  return generateTimeSeries(12, 120000, 180000)
}

async function fetchEmpleoHistorico() {
  await delay(randomBetween(60, 150))
  return generateTimeSeries(12, 45000, 75000)
}

async function fetchInversionHistorica() {
  await delay(randomBetween(60, 150))
  return generateTimeSeries(12, 10, 50)
}

async function fetchIndicadoresClave() {
  await delay(randomBetween(80, 150))
  return [
    { nombre: "Índice de Desarrollo Humano", valor: randomBetween(0.72, 0.88), unidad: "", tendencia: "up" },
    { nombre: "Tasa de Empleo", valor: randomBetween(55, 72), unidad: "%", tendencia: "up" },
    { nombre: "Cobertura de Servicios", valor: randomBetween(78, 96), unidad: "%", tendencia: "stable" },
    { nombre: "Inversión per cápita", valor: randomBetween(1200, 3500), unidad: "MXN", tendencia: "up" },
    { nombre: "Densidad Vial", valor: randomBetween(2.5, 6.8), unidad: "km/km²", tendencia: "stable" },
    { nombre: "Áreas Verdes", valor: randomBetween(4, 12), unidad: "m²/hab", tendencia: "down" },
  ]
}

export const ApiService = {
  getResumenTerritorial: cached("resumen", fetchResumenTerritorial),
  getZonas: cached("zonas", fetchZonas),
  getPoblacionHistorica: cached("poblacion", fetchPoblacionHistorica),
  getEmpleoHistorico: cached("empleo", fetchEmpleoHistorico),
  getInversionHistorica: cached("inversion", fetchInversionHistorica),
  getIndicadoresClave: cached("indicadores", fetchIndicadoresClave),
  clearCache() {
    cache.clear()
  },
}
