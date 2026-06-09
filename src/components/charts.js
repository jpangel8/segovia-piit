function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d")
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  return { ctx, w: rect.width, h: rect.height }
}

function drawGrid(ctx, pad, w, h, chartH, maxVal, minVal, steps) {
  const range = maxVal - minVal
  ctx.strokeStyle = "#2a2a4a"
  ctx.lineWidth = 0.5
  for (let i = 0; i <= steps; i++) {
    const y = pad.top + chartH - (chartH / steps) * i
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(w - pad.right, y)
    ctx.stroke()

    const val = minVal + (range / steps) * i
    ctx.fillStyle = "#555"
    ctx.font = "10px Inter, system-ui"
    ctx.textAlign = "right"
    ctx.fillText(val >= 1000 ? Math.round(val).toLocaleString("es") : val.toFixed(1), pad.left - 6, y + 3)
  }
}

export function drawBarChart(canvas, data, options = {}) {
  const { ctx, w, h } = setupCanvas(canvas)
  const pad = { top: 20, right: 15, bottom: 36, left: 50 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1
  const barW = (chartW / data.length) * 0.6
  const gap = (chartW / data.length) * 0.4
  const color = options.color || "#7c3aed"

  ctx.clearRect(0, 0, w, h)
  drawGrid(ctx, pad, w, h, chartH, maxVal, 0, 4)

  data.forEach((d, i) => {
    const x = pad.left + i * (barW + gap) + gap / 2
    const barH = (d.value / maxVal) * chartH
    const y = pad.top + chartH - barH

    ctx.fillStyle = color
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0])
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.fillStyle = "#666"
    ctx.font = "9px Inter, system-ui"
    ctx.textAlign = "center"
    const showLabel = data.length <= 12 || i % 2 === 0
    if (showLabel) ctx.fillText(d.label, x + barW / 2, h - pad.bottom + 13)
  })
}

export function drawLineChart(canvas, data, options = {}) {
  const { ctx, w, h } = setupCanvas(canvas)
  const pad = { top: 20, right: 15, bottom: 36, left: 50 }
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom
  const values = data.map((d) => d.value)
  const minVal = Math.min(...values) * 0.95
  const maxVal = Math.max(...values) * 1.05
  const range = maxVal - minVal
  const color = options.color || "#7c3aed"

  ctx.clearRect(0, 0, w, h)
  drawGrid(ctx, pad, w, h, chartH, maxVal, minVal, 4)

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((d.value - minVal) / range) * chartH,
  }))

  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH)
  gradient.addColorStop(0, color + "30")
  gradient.addColorStop(1, color + "03")

  ctx.beginPath()
  ctx.moveTo(points[0].x, pad.top + chartH)
  points.forEach((p) => ctx.lineTo(p.x, p.y))
  ctx.lineTo(points[points.length - 1].x, pad.top + chartH)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.stroke()

  points.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = "#0f0f0f"
    ctx.fill()
  })

  data.forEach((d, i) => {
    if (i % 2 === 0 || data.length <= 8) {
      ctx.fillStyle = "#666"
      ctx.font = "9px Inter, system-ui"
      ctx.textAlign = "center"
      ctx.fillText(d.label, points[i].x, h - pad.bottom + 13)
    }
  })
}

export function drawDonutChart(canvas, data, options = {}) {
  const { ctx, w, h } = setupCanvas(canvas)
  const cx = w * 0.35
  const cy = h / 2
  const radius = Math.min(cx - 10, cy - 20)
  const inner = radius * 0.58
  const total = data.reduce((s, d) => s + d.value, 0)
  let startAngle = -Math.PI / 2

  ctx.clearRect(0, 0, w, h)

  data.forEach((d) => {
    const sweep = (d.value / total) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx, cy, radius, startAngle, startAngle + sweep)
    ctx.arc(cx, cy, inner, startAngle + sweep, startAngle, true)
    ctx.closePath()
    ctx.fillStyle = d.color || "#7c3aed"
    ctx.fill()
    startAngle += sweep
  })

  ctx.fillStyle = "#fff"
  ctx.font = "bold 14px Inter, system-ui"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(total.toLocaleString("es"), cx, cy)

  const legendX = w * 0.62
  let legendY = Math.max(10, (h - data.length * 30) / 2)
  data.forEach((d) => {
    ctx.fillStyle = d.color || "#7c3aed"
    ctx.beginPath()
    ctx.arc(legendX + 4, legendY + 4, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#ccc"
    ctx.font = "11px Inter, system-ui"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText(d.name, legendX + 14, legendY - 1)
    ctx.fillStyle = "#777"
    ctx.font = "10px Inter, system-ui"
    ctx.fillText(d.value.toLocaleString("es"), legendX + 14, legendY + 12)
    legendY += 30
  })
}

export function observeChartResize(canvas, drawFn) {
  const ro = new ResizeObserver(() => {
    requestAnimationFrame(drawFn)
  })
  ro.observe(canvas.parentElement)
  return () => ro.disconnect()
}
