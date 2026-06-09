import { ApiService } from "@/services/api-service.js"
import { AuthService } from "@/services/auth-service.js"
import { ExperimentEngine } from "@/config/experiment-engine.js"
import { createExperimentPanel } from "@/components/experiment-panel.js"
import { drawLineChart, drawBarChart } from "@/components/charts.js"
import { Router } from "@/config/router.js"

export async function renderDashboard(container, layout) {
  layout.innerHTML = `
    <div class="dashboard-content">
      <div class="page-header">
        <h2>Dashboard</h2>
        <p>Resumen de inteligencia territorial</p>
      </div>
      <div class="loading-spinner">Cargando datos...</div>
    </div>`

  const [resumen, poblacion, empleo, inversion] = await Promise.all([
    ApiService.getResumenTerritorial(),
    ApiService.getPoblacionHistorica(),
    ApiService.getEmpleoHistorico(),
    ApiService.getInversionHistorica(),
  ])

  layout.innerHTML = `
    <div class="dashboard-content">
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

  drawLineChart(layout.querySelector("#chart-pob"), poblacion, { color: "#7c3aed" })
  drawLineChart(layout.querySelector("#chart-emp"), empleo, { color: "#10b981" })
  drawBarChart(layout.querySelector("#chart-inv"), inversion, { color: "#3b82f6" })

  const panel = createExperimentPanel()
  if (panel) container.appendChild(panel)
}
