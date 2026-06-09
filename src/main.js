import { AuthService } from "@/services/auth-service.js"
import { Router } from "@/config/router.js"
import { renderLogin } from "@/pages/login.js"
import { renderRegister } from "@/pages/register.js"
import { renderDashboard } from "@/pages/dashboard.js"
import "./styles/style.css"
import "./styles/auth.css"
import "./styles/dashboard.css"
import "./styles/experiment-panel.css"

const app = document.querySelector("#app")

const PUBLIC_ROUTES = ["/login", "/register"]

Router.guard((path) => {
  if (PUBLIC_ROUTES.includes(path) && AuthService.isAuthenticated()) return "/"
  if (!PUBLIC_ROUTES.includes(path) && !AuthService.isAuthenticated()) return "/login"
  return path
})

Router.register("/login", () => renderLogin(app))
Router.register("/register", () => renderRegister(app))
Router.register("/", () => renderDashboard(app))
Router.register("*", () => Router.navigate("/"))

Router.start()
