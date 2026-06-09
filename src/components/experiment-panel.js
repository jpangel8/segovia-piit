import { ExperimentEngine } from "@/config/experiment-engine.js"

const GROUP_LABELS = {
  motion: "Animación",
  theme: "Tema Visual",
  system: "Sistema",
}

function createControl(key, config) {
  const wrapper = document.createElement("div")
  wrapper.className = "exp-control"

  const label = document.createElement("label")
  label.className = "exp-label"
  label.htmlFor = config.id
  label.textContent = config.label

  const valueDisplay = document.createElement("span")
  valueDisplay.className = "exp-value"

  let input

  if (config.type === "range") {
    input = document.createElement("input")
    input.type = "range"
    input.id = config.id
    input.min = config.min
    input.max = config.max
    input.step = config.step
    input.value = ExperimentEngine.get(key)
    valueDisplay.textContent = input.value
    input.addEventListener("input", () => {
      const val = parseFloat(input.value)
      valueDisplay.textContent = val
      ExperimentEngine.set(key, val)
    })
  } else if (config.type === "select") {
    input = document.createElement("select")
    input.id = config.id
    for (const opt of config.options) {
      const option = document.createElement("option")
      option.value = opt
      option.textContent = opt
      if (opt === ExperimentEngine.get(key)) option.selected = true
      input.appendChild(option)
    }
    valueDisplay.textContent = input.value
    input.addEventListener("change", () => {
      valueDisplay.textContent = input.value
      ExperimentEngine.set(key, input.value)
    })
  } else if (config.type === "toggle") {
    input = document.createElement("input")
    input.type = "checkbox"
    input.id = config.id
    input.checked = ExperimentEngine.get(key)
    valueDisplay.textContent = input.checked ? "ON" : "OFF"
    input.addEventListener("change", () => {
      valueDisplay.textContent = input.checked ? "ON" : "OFF"
      ExperimentEngine.set(key, input.checked)
    })
  }

  input.className = "exp-input"
  input.title = config.description

  const resetBtn = document.createElement("button")
  resetBtn.className = "exp-reset"
  resetBtn.textContent = "↺"
  resetBtn.title = "Restaurar valor por defecto"
  resetBtn.addEventListener("click", () => {
    ExperimentEngine.resetKey(key)
    const val = ExperimentEngine.get(key)
    if (config.type === "toggle") {
      input.checked = val
      valueDisplay.textContent = val ? "ON" : "OFF"
    } else {
      input.value = val
      valueDisplay.textContent = val
    }
  })

  const header = document.createElement("div")
  header.className = "exp-control-header"
  header.appendChild(label)
  header.appendChild(valueDisplay)

  const row = document.createElement("div")
  row.className = "exp-control-row"
  row.appendChild(input)
  row.appendChild(resetBtn)

  wrapper.appendChild(header)
  wrapper.appendChild(row)
  return wrapper
}

export function createExperimentPanel() {
  if (!ExperimentEngine.isPanelVisible()) return null

  const panel = document.createElement("aside")
  panel.id = "experiment-panel"
  panel.innerHTML = `<div class="exp-header">
    <h2>Parámetros</h2>
    <button id="exp-toggle" title="Minimizar">−</button>
  </div>
  <div id="exp-body"></div>
  <div class="exp-footer">
    <button id="exp-reset-all">Restaurar todo</button>
    <button id="exp-export">Exportar</button>
    <button id="exp-import">Importar</button>
  </div>`

  const body = panel.querySelector("#exp-body")

  for (const group of ExperimentEngine.getGroups()) {
    const section = document.createElement("div")
    section.className = "exp-group"

    const groupTitle = document.createElement("h3")
    groupTitle.className = "exp-group-title"
    groupTitle.textContent = GROUP_LABELS[group] || group
    section.appendChild(groupTitle)

    for (const param of ExperimentEngine.getByGroup(group)) {
      section.appendChild(createControl(param.key, param))
    }

    body.appendChild(section)
  }

  panel.querySelector("#exp-toggle").addEventListener("click", (e) => {
    const isCollapsed = panel.classList.toggle("collapsed")
    e.target.textContent = isCollapsed ? "+" : "−"
  })

  panel.querySelector("#exp-reset-all").addEventListener("click", () => {
    ExperimentEngine.reset()
    body.innerHTML = ""
    for (const group of ExperimentEngine.getGroups()) {
      const section = document.createElement("div")
      section.className = "exp-group"
      const groupTitle = document.createElement("h3")
      groupTitle.className = "exp-group-title"
      groupTitle.textContent = GROUP_LABELS[group] || group
      section.appendChild(groupTitle)
      for (const param of ExperimentEngine.getByGroup(group)) {
        section.appendChild(createControl(param.key, param))
      }
      body.appendChild(section)
    }
  })

  panel.querySelector("#exp-export").addEventListener("click", () => {
    const data = ExperimentEngine.exportState()
    navigator.clipboard.writeText(data)
    alert("Configuración copiada al portapapeles")
  })

  panel.querySelector("#exp-import").addEventListener("click", () => {
    const json = prompt("Pega la configuración JSON:")
    if (json && ExperimentEngine.importState(json)) {
      location.reload()
    }
  })

  return panel
}
