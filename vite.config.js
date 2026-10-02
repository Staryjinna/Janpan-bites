import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const read = (p) => fs.readFileSync(path.resolve(p), 'utf8')
const esc = (s) => s.replace(/"/g, '&quot;')

// {{img:key|alt|class|sizes|eager|extra attrs}} → responsive WebP <img>
// {{partial:name}}                               → src/partials/name.html
// {{gallery}}                                    → every photo in public/images (+ /gallery)
function janpanHtml() {
  const manifest = () => JSON.parse(read('src/images.manifest.json'))
  const img = (m, key, alt = '', cls = '', sizes = '100vw', eager = '', extra = '') => {
    const e = m[key]
    if (!e) throw new Error(`[janpan] no optimised image for "${key}" – run npm run images`)
    const srcset = e.widths.map((w) => `/images/optimized/${key}-${w}.webp ${w}w`).join(', ')
    const mid = e.widths.includes(800) ? 800 : e.widths[e.widths.length - 1]
    return `<img src="/images/optimized/${key}-${mid}.webp" srcset="${srcset}" sizes="${sizes}" width="${e.w}" height="${e.h}" alt="${esc(alt)}" class="${cls}" style="background:url(${e.lqip}) center/cover" ${
      eager === 'eager' ? 'fetchpriority="high"' : 'loading="lazy"'
    } decoding="async" draggable="false" ${extra}>`
  }
  return {
    name: 'janpan-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const m = manifest()
        return html
          .replace(/\{\{partial:(\w+)\}\}/g, (_, n) => read(`src/partials/${n}.html`))
          .replace(/\{\{gallery\}\}/g, () => {
            const keys = Object.keys(m).filter((k) => !k.startsWith('gallery-') || true)
            // gallery folder first, then the headline photos
            const ordered = [...keys.filter((k) => k.startsWith('gallery-')), ...keys.filter((k) => !k.startsWith('gallery-'))]
            const tilt = [-2.5, 1.8, -1, 2.6, -1.8, 1.2, -2.2, 2]
            return ordered
              .map((k, i) => {
                const tall = m[k].h / m[k].w > 0.95
                return `<figure class="gal-item ${tall ? 'is-tall' : 'is-wide'}" style="--r:${tilt[i % tilt.length]}deg"><div class="gal-frame">${img(m, k, 'Janpan Bites — fresh from the kitchen', 'gal-img', '(min-width:768px) 40vw, 78vw', '', 'data-gal-img')}</div></figure>`
              })
              .join('\n')
          })
          .replace(/\{\{img:([^}]+)\}\}/g, (_, a) => img(m, ...a.split('|').map((s) => s.trim())))
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html') || file.endsWith('images.manifest.json')) server.ws.send({ type: 'full-reload' })
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), janpanHtml()],
  build: {
    rollupOptions: {
      input: { main: path.resolve('index.html'), workshops: path.resolve('workshops.html') },
    },
  },
  server: { host: true },
})
