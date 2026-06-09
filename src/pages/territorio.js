import { ApiService } from "@/services/api-service.js"
import { drawDonutChart, observeChartResize } from "@/components/charts.js"

export async function renderTerritorio(container, layout) {
  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Territorio</h2>
        <p>Zonas y distribución territorial</p>
      </div>
      <div class="charts-grid">
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
        <div class="chart-card"><div class="skeleton skeleton-chart"></div></div>
      </div>
      <div class="skeleton" style="height:200px;width:100%;max-width:var(--max-content);margin-top:0.8rem"></div>
    </div>`

  const zonas = await ApiService.getZonas()

  const rows = zonas
    .map(
      (z) => `<tr>
      <td><span class="zona-color" style="background:${z.color}"></span>${z.name}</td>
      <td>${z.poblacion.toLocaleString("es")}</td>
      <td>${z.densidad.toFixed(0)} hab/km²</td>
      <td>${z.indiceDesarrollo.toFixed(2)}</td>
      <td>${z.empleos.toLocaleString("es")}</td>
    </tr>`
    )
    .join("")

  layout.innerHTML = `
    <div class="dashboard-content page-enter">
      <div class="page-header">
        <h2>Territorio</h2>
        <p>Zonas y distribución territorial</p>
      </div>
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
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`

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
