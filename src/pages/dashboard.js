import { ApiService } from "@/services/api-service.js"
import { createExperimentPanel } from "@/components/experiment-panel.js"
import { drawLineChart, drawBarChart, observeChartResize } from "@/components/charts.js"

function skeletonHTML() {
  return `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Dashboard</h2>
        <p>Resumen de inteligencia territorial</p>
      </div>
      <div class="stats-grid">
        ${'<div class="stat-card"><div class="skeleton skeleton-card"></div></div>'.repeat(8)}
      </div>
      <div class="charts-grid">
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
        <div class="chart-card wide"><div class="skeleton skeleton-chart"></div></div>
      </div>
    </div>`
}

export async function renderDashboard(container, layout) {
  layout.innerHTML = skeletonHTML()

  const [resumen, poblacion, empleo, inversion] = await Promise.all([
    ApiService.getResumenTerritorial(),
    ApiService.getPoblacionHistorica(),
    ApiService.getEmpleoHistorico(),
    ApiService.getInversionHistorica(),
  ])

  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Dashboard</h2>
        <p>Resumen de inteligencia territorial</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Población</div>
          <div class="stat-value purple">${resumen.poblacionTotal.toLocaleString("es")}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Empleos</div>
          <div class="stat-value green">${resumen.empleosTotales.toLocaleString("es")}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">IDH</div>
          <div class="stat-value blue">${resumen.idh.toFixed(2)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Crecimiento</div>
          <div class="stat-value orange">${resumen.crecimientoAnual.toFixed(1)}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Superficie</div>
          <div class="stat-value purple">${resumen.superficie.toFixed(0)} km²</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Zonas</div>
          <div class="stat-value green">${resumen.zonas}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Densidad</div>
          <div class="stat-value blue">${resumen.densidadPromedio.toFixed(0)} hab/km²</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Inversión Pública</div>
          <div class="stat-value orange">${resumen.inversionPublica.toFixed(1)}M</div>
        </div>
      </div>
      <div class="charts-grid">
        <div class="chart-card">
          <h4>Población (12 meses)</h4>
          <canvas class="chart-canvas" id="chart-pob"></canvas>
        </div>
        <div class="chart-card">
          <h4>Empleo (12 meses)</h4>
          <canvas class="chart-canvas" id="chart-emp"></canvas>
        </div>
        <div class="chart-card wide">
          <h4>Inversión Pública (M MXN)</h4>
          <canvas class="chart-canvas" id="chart-inv"></canvas>
        </div>
      </div>
    </div>`

  const cPob = layout.querySelector("#chart-pob")
  const cEmp = layout.querySelector("#chart-emp")
  const cInv = layout.querySelector("#chart-inv")

  const draw = () => {
    drawLineChart(cPob, poblacion, { color: "#7c3aed" })
    drawLineChart(cEmp, empleo, { color: "#10b981" })
    drawBarChart(cInv, inversion, { color: "#3b82f6" })
  }
  draw()
  observeChartResize(cPob, draw)

  const panel = createExperimentPanel()
  if (panel) container.appendChild(panel)
}
