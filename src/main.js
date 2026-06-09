import { animate } from "motion/mini"
import { ExperimentEngine } from "@/config/experiment-engine.js"
import { createExperimentPanel } from "@/components/experiment-panel.js"
import "./styles/style.css"
import "./styles/experiment-panel.css"

const box = document.querySelector("#box")
let currentAnimation = null

function runAnimation() {
  if (currentAnimation) currentAnimation.stop()

  const params = ExperimentEngine.getAll()

  box.style.width = `${params.boxSize}px`
  box.style.height = `${params.boxSize}px`
  box.style.borderRadius = `${params.themeBorderRadius}px`
  box.style.background = `hsl(${params.themeHue}, 58%, 52%)`

  box.style.transform = ""

  currentAnimation = animate(
    box,
    { x: params.animationDistance, rotate: params.animationRotation, scale: params.animationScale },
    {
      duration: params.animationDuration,
      easing: params.animationEasing,
      onComplete: () => {
        if (params.autoReplay) {
          setTimeout(() => {
            box.style.transform = ""
            runAnimation()
          }, 400)
        }
      },
    }
  )
}

function init() {
  const panel = createExperimentPanel()
  if (panel) document.body.appendChild(panel)

  ExperimentEngine.subscribe(() => runAnimation())

  runAnimation()

  if (ExperimentEngine.get("debugMode")) {
    const debug = document.createElement("pre")
    debug.id = "debug-info"
    debug.style.cssText = "position:fixed;bottom:1rem;left:1rem;color:#555;font-size:0.65rem;z-index:9999"
    document.body.appendChild(debug)
    ExperimentEngine.subscribe((state) => {
      debug.textContent = `v${__APP_VERSION__} | ${__MODE__} | ${__BUILD_TIME__}\n${JSON.stringify(state, null, 1)}`
    })
  }
}

init()
