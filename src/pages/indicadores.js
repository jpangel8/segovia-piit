import { ApiService } from "@/services/api-service.js"
import { drawLineChart, drawBarChart } from "@/components/charts.js"

const TENDENCIA_ICON = {
  up: "&#9650;",
  down: "&#9660;",
  stable: "&#9654;",
}

export async function renderIndicadores(container, layout) {
  layout.innerHTML = `
    <div class="dashboard-content">
      <div class="page-header">
        <h2>Indicadores</h2>
        <p>Métricas clave de inteligencia territorial</p>
      </div>
      <div class="loading-spinner">Cargando indicadores...</div>
    </div>`

  const [indicadores, poblacion, empleo, inversion] = await Promise.all([
    ApiService.getIndicadoresClave(),
    ApiService.getPoblacionHistorica(),
    ApiService.getEmpleoHistorico(),
    ApiService.getInversionHistorica(),
  ])

  const cards = indicadores
    .map(
      (ind) => `
    <div class="indicador-card">
      <span class="indicador-nombre">${ind.nombre}</span>
      <span class="indicador-valor">${ind.valor >= 100 ? Math.round(ind.valor).toLocaleString("es") : ind.valor.toFixed(2)}<span class="indicador-unidad"> ${ind.unidad}</span></span>
      <span class="indicador-tendencia tendencia-${ind.tendencia}">${TENDENCIA_ICON[ind.tendencia]} ${ind.tendencia === "up" ? "En alza" : ind.tendencia === "down" ? "En baja" : "Estable"}</span>
    </div>`
    )
    .join("")

  layout.innerHTML = `
    <div class="dashboard-content">
      <div class="page-header">
        <h2>Indicadores</h2>
        <p>Métricas clave de inteligencia territorial</p>
      </div>
      <div class="indicadores-grid">${cards}</div>
      <div class="charts-grid" style="margin-top:1.5rem">
        <div class="chart-card">
          <h4>Población (12 meses)</h4>
          <canvas class="chart-canvas" id="chart-poblacion"></canvas>
        </div>
        <div class="chart-card">
          <h4>Empleo (12 meses)</h4>
          <canvas class="chart-canvas" id="chart-empleo"></canvas>
        </div>
        <div class="chart-card wide">
          <h4>Inversión Pública (M MXN, 12 meses)</h4>
          <canvas class="chart-canvas" id="chart-inversion"></canvas>
        </div>
      </div>
    </div>`

  drawLineChart(layout.querySelector("#chart-poblacion"), poblacion, { color: "#7c3aed" })
  drawLineChart(layout.querySelector("#chart-empleo"), empleo, { color: "#10b981" })
  drawBarChart(layout.querySelector("#chart-inversion"), inversion, { color: "#3b82f6" })
}
