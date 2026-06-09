import { animate } from "motion/mini"
import "./styles/style.css"

animate(
  "#box",
  { x: 200, rotate: 360, scale: 1.5 },
  { duration: 1.2, easing: "spring" }
)
