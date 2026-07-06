import https from 'https'
import fs from 'fs'

// Buscar por DIVIPOLA colombiano o por región geográfica de Segovia Antioquia
const query = '[out:json][timeout:45];(relation["name"="Segovia"]["boundary"="administrative"](5.0,-76.5,8.5,-73.0););out geom;'
const body = 'data=' + encodeURIComponent(query)

const opts = {
  hostname: 'overpass-api.de',
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(body),
    'User-Agent': 'PIIT-Segovia/1.0'
  }
}

console.log('Consultando Overpass API (OSM)...')

const req = https.request(opts, res => {
  let data = ''
  res.on('data', c => data += c)
  res.on('end', () => {
    try {
      const j = JSON.parse(data)
      if (!j.elements || j.elements.length === 0) {
        console.log('Sin resultados')
        return
      }
      j.elements.forEach((el, idx) => {
        console.log(`Relacion ${idx}: id=${el.id}`)
        console.log(`  tags: ${JSON.stringify(el.tags).substring(0, 200)}`)
        if (el.members) console.log(`  members: ${el.members.length}`)
      })
      fs.writeFileSync('segovia_overpass.json', JSON.stringify(j, null, 2))
      console.log('✓ Guardado en segovia_overpass.json')
    } catch (e) {
      console.log('Error parse:', e.message)
      console.log(data.substring(0, 300))
    }
  })
})

req.on('error', e => console.log('Error:', e.message))
req.write(body)
req.end()
