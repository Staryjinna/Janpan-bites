// Creates soft, photographic-feeling PLACEHOLDERS (warm out-of-focus café light)
// for any expected photo that is missing from public/images. Real photos always
// win: drop hero.jpg, cafe-1.jpg, bento.jpg, brownie.jpg, cheesecake.jpg, bun.jpg,
// janani.jpg into public/images and these are never (re)generated.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve('public/images')
fs.mkdirSync(dir, { recursive: true })
const has = (n) => ['.jpg', '.jpeg', '.png', '.webp'].some((e) => fs.existsSync(path.join(dir, n + e)))

const rng = (seed) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647) }

function bokeh(w, h, { bg, spots, seed, n = 26, glow }) {
  const r = rng(seed)
  const u = Math.max(w, h)
  let discs = ''
  for (let i = 0; i < n; i++) {
    const c = spots[Math.floor(r() * spots.length)]
    const rad = (0.03 + r() * 0.1) * u
    const x = r() * w, y = r() * h
    const a = 0.1 + r() * 0.35
    discs += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(0)}" fill="${c}" fill-opacity="${a.toFixed(2)}" stroke="${c}" stroke-opacity="${(a * 0.9).toFixed(2)}" stroke-width="${(rad * 0.02).toFixed(1)}"/>`
  }
  let soft = ''
  for (let i = 0; i < 5; i++) {
    const c = spots[Math.floor(r() * spots.length)]
    soft += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${((0.14 + r() * 0.18) * u).toFixed(0)}" fill="${c}" fill-opacity="${(0.18 + r() * 0.2).toFixed(2)}"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="bg" cx="${glow[0]}" cy="${glow[1]}" r="1.05"><stop offset="0" stop-color="${bg[0]}"/><stop offset=".55" stop-color="${bg[1]}"/><stop offset="1" stop-color="${bg[2]}"/></radialGradient>
    <radialGradient id="vg" cx=".5" cy=".5" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#150b07" stop-opacity=".55"/></radialGradient>
    <filter id="b1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${(u * 0.05).toFixed(0)}"/></filter>
    <filter id="b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${(u * 0.006).toFixed(1)}"/></filter>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .05  0 0 0 0 .03  0 0 0 .55 0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g filter="url(#b1)">${soft}</g>
  <g filter="url(#b2)">${discs}</g>
  <rect width="${w}" height="${h}" fill="url(#vg)"/>
  <rect width="${w}" height="${h}" filter="url(#n)" opacity=".22"/>
</svg>`
}

const specs = {
  hero:       [1400, 1750, { bg: ['#6b3a22', '#3a1f14', '#150b07'], spots: ['#f4b860', '#e58a4a', '#ffd9a0', '#c0587a'], seed: 11, glow: [0.35, 0.3] }],
  'cafe-1':   [1800, 1200, { bg: ['#7a4a2a', '#3c2216', '#140a06'], spots: ['#ffcf7a', '#f2a24a', '#ffe9c2', '#e3b36b'], seed: 23, n: 34, glow: [0.5, 0.25] }],
  bento:      [1200, 1500, { bg: ['#f3c9cf', '#c9788c', '#6e2c42'], spots: ['#fff0ee', '#ffc9d3', '#e68ba0', '#f7a8b8'], seed: 37, glow: [0.3, 0.2] }],
  brownie:    [1200, 1500, { bg: ['#6a3b25', '#3a1e12', '#150a05'], spots: ['#d49a5a', '#8a4a28', '#f0c28a', '#5a2f1c'], seed: 41, glow: [0.7, 0.25] }],
  cheesecake: [1200, 1500, { bg: ['#f7e3b8', '#d9a86a', '#7a4a2a'], spots: ['#fff6df', '#e9b47e', '#c0587a', '#f4d28f'], seed: 53, glow: [0.35, 0.25] }],
  bun:        [1200, 1500, { bg: ['#e7b76c', '#a8672c', '#4b2412'], spots: ['#ffe2a0', '#e59a4a', '#fff0cf', '#c47a3a'], seed: 67, glow: [0.6, 0.2] }],
  'plum-cake': [1200, 1500, { bg: ['#6e2a3a', '#3c1420', '#14060a'], spots: ['#d9a35a', '#a63a56', '#f0c28a', '#7a3a2a'], seed: 91, glow: [0.55, 0.3] }],
  janani:     [1200, 1500, { bg: ['#e9c8b4', '#b5806a', '#4d2a24'], spots: ['#fff0e2', '#e0a98e', '#c0587a', '#f4d2b8'], seed: 79, glow: [0.4, 0.2] }],
}

for (const [name, [w, h, o]] of Object.entries(specs)) {
  if (has(name)) continue
  await sharp(Buffer.from(bokeh(w, h, o))).jpeg({ quality: 84 }).toFile(path.join(dir, name + '.jpg'))
  console.log('placeholder →', `public/images/${name}.jpg`)
}
