const routes = {}
let currentRoute = null
let guardFn = null

function getHash() {
  return window.location.hash.slice(1) || "/"
}

export const Router = {
  register(path, handler) {
    routes[path] = handler
  },

  guard(fn) {
    guardFn = fn
  },

  navigate(path) {
    window.location.hash = `#${path}`
  },

  current() {
    return currentRoute
  },

  start() {
    const resolve = () => {
      const path = getHash()
      if (guardFn) {
        const redirect = guardFn(path)
        if (redirect && redirect !== path) {
          this.navigate(redirect)
          return
        }
      }
      currentRoute = path
      const handler = routes[path] || routes["*"]
      if (handler) handler(path)
    }

    window.addEventListener("hashchange", resolve)
    resolve()
  },
}
