// Genera public/sitemap.xml y public/robots.txt con la URL pública real.
// Uso:  SITE_URL=https://tu-dominio.gov.co node scripts/gen-sitemap.mjs
// (se ejecuta solo antes de `npm run build`).
import fs from 'node:fs'
const site = (process.env.SITE_URL || 'https://jpangel8.github.io/segovia-piit').replace(/\/+$/, '')
const today = new Date().toISOString().slice(0, 10)
const pages = [
  ['/piit-v6.html', '1.0', 'weekly'],
  ['/politica-privacidad.html', '0.3', 'yearly'],
  ['/terminos-condiciones.html', '0.3', 'yearly'],
]
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(([p, pr, cf]) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join('\n') + '\n</urlset>\n'
fs.writeFileSync('public/sitemap.xml', xml)
fs.writeFileSync('public/robots.txt', `User-agent: *
Allow: /
Disallow: /piit-v5.html
Disallow: /404.html

Sitemap: ${site}/sitemap.xml
`)
console.log('sitemap.xml y robots.txt generados para', site)
