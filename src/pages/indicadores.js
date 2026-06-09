import { ApiService } from "@/services/api-service.js"
import { drawLineChart, drawBarChart, observeChartResize } from "@/components/charts.js"

const TENDENCIA_ICON = { up: "&#9650;", down: "&#9660;", stable: "&#9654;" }
const TENDENCIA_LABEL = { up: "En alza", down: "En baja", stable: "Estable" }

export async function renderIndicadores(container, layout) {
  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Indicadores</h2>
        <p>Métricas clave de inteligencia territorial</p>
      </div>
      <div class="indicadores-grid">
        ${'<div class="indicador-card"><div class="skeleton" style="height:70px"></div></div>'.repeat(6)}
      </div>
      <div class="charts-grid" style="margin-top:1rem">
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
        <div class="chart-card wide"><div class="skeleton skeleton-chart"></div></div>
      </div>
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
      <span class="indicador-tendencia tendencia-${ind.tendencia}">${TENDENCIA_ICON[ind.tendencia]} ${TENDENCIA_LABEL[ind.tendencia]}</span>
    </div>`
    )
    .join("")

  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Indicadores</h2>
        <p>Métricas clave de inteligencia territorial</p>
      </div>
      <div class="indicadores-grid">${cards}</div>
      <div class="charts-grid" style="margin-top:1rem">
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

  const cPob = layout.querySelector("#chart-poblacion")
  const cEmp = layout.querySelector("#chart-empleo")
  const cInv = layout.querySelector("#chart-inversion")

  const draw = () => {
    drawLineChart(cPob, poblacion, { color: "#7c3aed" })
    drawLineChart(cEmp, empleo, { color: "#10b981" })
    drawBarChart(cInv, inversion, { color: "#3b82f6" })
  }
  draw()
  observeChartResize(cPob, draw)
}
