import { ApiService } from "@/services/api-service.js"
import { drawDonutChart, observeChartResize } from "@/components/charts.js"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import * as turf from "@turf/turf"

let mapInstance = null

function destroyMap() {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
}

function buildStatCards(zonas) {
  const totalPob = zonas.reduce((s, z) => s + z.properties.poblacion, 0)
  const totalEmp = zonas.reduce((s, z) => s + z.properties.empleos, 0)
  const avgIDH = zonas.reduce((s, z) => s + z.properties.indiceDesarrollo, 0) / zonas.length
  const avgDen = zonas.reduce((s, z) => s + z.properties.densidad, 0) / zonas.length

  return `
    <div class="stat-cards-row">
      <div class="stat-card">
        <span class="stat-label">Población total</span>
        <span class="stat-value">${totalPob.toLocaleString("es")}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Empleos totales</span>
        <span class="stat-value">${totalEmp.toLocaleString("es")}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">IDH promedio</span>
        <span class="stat-value">${avgIDH.toFixed(3)}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Densidad media</span>
        <span class="stat-value">${avgDen.toFixed(0)} hab/km²</span>
      </div>
    </div>`
}

function initMap(geojson) {
  destroyMap()
  const el = document.getElementById("territorio-map")
  if (!el) return

  mapInstance = L.map(el, { zoomControl: true, scrollWheelZoom: true })

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(mapInstance)

  const layers = []

  geojson.features.forEach((feature) => {
    const { name, color, poblacion, densidad, indiceDesarrollo, empleos } = feature.properties

    // Turf: calculate area and centroid
    const areKm2 = turf.area(feature) / 1e6
    const centroid = turf.centroid(feature)
    const [lng, lat] = centroid.geometry.coordinates

    const layer = L.geoJSON(feature, {
      style: {
        color: color,
        fillColor: color,
        fillOpacity: 0.35,
        weight: 2,
        opacity: 0.9,
      },
    })
      .bindPopup(`
        <div class="map-popup">
          <h4 style="color:${color};margin:0 0 8px">${name}</h4>
          <table class="popup-table">
            <tr><td>Población</td><td><b>${poblacion.toLocaleString("es")}</b></td></tr>
            <tr><td>Empleos</td><td><b>${empleos.toLocaleString("es")}</b></td></tr>
            <tr><td>Densidad</td><td><b>${densidad.toFixed(0)} hab/km²</b></td></tr>
            <tr><td>IDH</td><td><b>${indiceDesarrollo.toFixed(3)}</b></td></tr>
            <tr><td>Área (Turf)</td><td><b>${areKm2.toFixed(2)} km²</b></td></tr>
          </table>
        </div>
      `)
      .on("mouseover", function () { this.setStyle({ fillOpacity: 0.6 }) })
      .on("mouseout", function () { this.setStyle({ fillOpacity: 0.35 }) })
      .addTo(mapInstance)

    // Label at centroid
    L.marker([lat, lng], {
      icon: L.divIcon({
        className: "zone-label",
        html: `<span style="color:${color}">${name.split(" ").slice(-1)[0]}</span>`,
        iconSize: [80, 20],
        iconAnchor: [40, 10],
      }),
    }).addTo(mapInstance)

    layers.push(layer)
  })

  const group = L.featureGroup(layers)
  mapInstance.fitBounds(group.getBounds(), { padding: [20, 20] })
}

export async function renderTerritorio(container, layout) {
  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Territorio</h2>
        <p>Análisis geoespacial de zonas — Segovia PIIT</p>
      </div>
      <div class="skeleton" style="height:420px;border-radius:var(--radius-lg);margin-bottom:1rem"></div>
      <div class="skeleton" style="height:80px;border-radius:var(--radius-lg);margin-bottom:1rem"></div>
      <div class="charts-grid">
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
      </div>
    </div>`

  const [geojson, zonas] = await Promise.all([
    ApiService.getZonasGeoJSON(),
    ApiService.getZonas(),
  ])

  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Territorio</h2>
        <p>Análisis geoespacial de zonas — Segovia PIIT</p>
      </div>

      <div class="map-card" id="territorio-map-card">
        <div class="map-toolbar">
          <span class="map-title">&#9679; Mapa interactivo de zonas</span>
          <span class="map-badge">Leaflet · Turf.js · CARTO Dark</span>
        </div>
        <div id="territorio-map" class="territorio-map"></div>
      </div>

      ${buildStatCards(geojson.features)}

      <div class="charts-grid">
        <div class="chart-card">
          <h4>Distribución Poblacional</h4>
          <canvas class="chart-canvas" id="chart-poblacion-zona"></canvas>
        </div>
        <div class="chart-card">
          <h4>Distribución de Empleo</h4>
          <canvas class="chart-canvas" id="chart-empleo-zona"></canvas>
        </div>
      </div>

      <div class="zonas-table" style="margin-top:0.8rem">
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Población</th>
              <th>Densidad</th>
              <th>IDH</th>
              <th>Empleos</th>
              <th>Área (km²)</th>
            </tr>
          </thead>
          <tbody>
            ${geojson.features.map((f) => {
              const p = f.properties
              const area = (turf.area(f) / 1e6).toFixed(2)
              return `<tr>
                <td><span class="zona-color" style="background:${p.color}"></span>${p.name}</td>
                <td>${p.poblacion.toLocaleString("es")}</td>
                <td>${p.densidad.toFixed(0)} hab/km²</td>
                <td>${p.indiceDesarrollo.toFixed(3)}</td>
                <td>${p.empleos.toLocaleString("es")}</td>
                <td>${area}</td>
              </tr>`
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>`

  // Init map after DOM is ready
  requestAnimationFrame(() => initMap(geojson))

  const cPob = layout.querySelector("#chart-poblacion-zona")
  const cEmp = layout.querySelector("#chart-empleo-zona")
  const pobData = zonas.map((z) => ({ name: z.name, value: z.poblacion, color: z.color }))
  const empData = zonas.map((z) => ({ name: z.name, value: z.empleos, color: z.color }))

  const draw = () => {
    drawDonutChart(cPob, pobData)
    drawDonutChart(cEmp, empData)
  }
  draw()
  observeChartResize(cPob, draw)
}
