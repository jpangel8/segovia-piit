import fs from 'fs'

const raw = JSON.parse(fs.readFileSync('segovia_overpass.json', 'utf8'))
const rel = raw.elements[0]

console.log('Relacion:', rel.id)
console.log('Tags:', JSON.stringify(rel.tags))
console.log('Members:', rel.members.length)

// Recopilar todos los ways con sus geometrías
const ways = rel.members.filter(m => m.type === 'way' && m.geometry)
console.log('Ways con geometría:', ways.length)

// Construir anillo exterior: encadenar los segmentos de ways
// Cada way tiene geometry: [{lat, lon}, ...]
function coordsFromWay(w) {
  return w.geometry.map(p => [p.lon, p.lat])
}

// Algoritmo de encadenado de segmentos
function chainWays(ways) {
  const segments = ways.map(w => coordsFromWay(w))
  const ring = [...segments[0]]
  const used = new Set([0])

  while (used.size < segments.length) {
    const last = ring[ring.length - 1]
    let found = false
    for (let i = 0; i < segments.length; i++) {
      if (used.has(i)) continue
      const s = segments[i]
      const first = s[0]
      const lastSeg = s[s.length - 1]
      const EPS = 0.00001
      if (Math.abs(last[0] - first[0]) < EPS && Math.abs(last[1] - first[1]) < EPS) {
        ring.push(...s.slice(1))
        used.add(i)
        found = true
        break
      } else if (Math.abs(last[0] - lastSeg[0]) < EPS && Math.abs(last[1] - lastSeg[1]) < EPS) {
        ring.push(...s.slice(0, -1).reverse())
        used.add(i)
        found = true
        break
      }
    }
    if (!found) {
      console.warn('No se pudo encadenar segmento, ways disponibles:', segments.length - used.size)
      break
    }
  }

  // Cerrar el anillo
  if (ring[0][0] !== ring[ring.length-1][0] || ring[0][1] !== ring[ring.length-1][1]) {
    ring.push(ring[0])
  }
  return ring
}

const outerWays = ways.filter(w => w.role === 'outer' || w.role === '')
const innerWays = ways.filter(w => w.role === 'inner')

console.log('Outer ways:', outerWays.length, '| Inner ways:', innerWays.length)

const outerRing = chainWays(outerWays)
console.log('Outer ring puntos:', outerRing.length)

// Calcular bounds
const lngs = outerRing.map(c => c[0])
const lats = outerRing.map(c => c[1])
console.log(`Bounds: lng[${Math.min(...lngs).toFixed(4)}, ${Math.max(...lngs).toFixed(4)}] lat[${Math.min(...lats).toFixed(4)}, ${Math.max(...lats).toFixed(4)}]`)

const coords = [outerRing]
if (innerWays.length > 0) {
  const innerRing = chainWays(innerWays)
  coords.push(innerRing)
}

const geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {
      NOM_MPIO: 'SEGOVIA',
      COD_MPIO: '05736',
      DEPARTAMENTO: 'ANTIOQUIA',
      DIVIPOLA: '05736',
      OSM_ID: rel.id,
      AREA_KM2: rel.tags['DANE:area'] || null
    },
    geometry: {
      type: 'Polygon',
      coordinates: coords
    }
  }]
}

fs.writeFileSync('segovia_oficial.geojson', JSON.stringify(geojson, null, 2))
console.log('✓ GeoJSON oficial guardado en segovia_oficial.geojson')

// Generar el array de coordenadas simplificado para inject-auth.mjs
// Simplificar: tomar cada N puntos para reducir tamaño
const N = Math.max(1, Math.floor(outerRing.length / 80))
const simplified = outerRing.filter((_, i) => i % N === 0 || i === outerRing.length - 1)
// Asegurar cierre
if (simplified[0][0] !== simplified[simplified.length-1][0]) simplified.push(simplified[0])

console.log(`Simplificado: ${simplified.length} puntos (de ${outerRing.length}, cada ${N})`)

const coordStr = simplified.map(c => `[${c[0].toFixed(4)},${c[1].toFixed(4)}]`).join(',\n    ')
fs.writeFileSync('segovia_coords.txt', coordStr)
console.log('✓ Coordenadas simplificadas en segovia_coords.txt')
