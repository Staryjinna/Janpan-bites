// Generates clearly-marked ILLUSTRATED placeholders for any expected photo that
// is missing from public/images. Real photos always win: drop hero.jpg, cafe-1.jpg,
// bento.jpg, brownie.jpg, cheesecake.jpg, bun.jpg, janani.jpg in public/images and
// these placeholders are simply never (re)generated.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve('public/images')
fs.mkdirSync(dir, { recursive: true })

const exts = ['.jpg', '.jpeg', '.png', '.webp']
const has = (name) => exts.some((e) => fs.existsSync(path.join(dir, name + e)))

const sprinkles = (w, h, n, seed = 1) => {
  let s = seed
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const cols = ['#E0457B', '#F2B33D', '#FFF6E9', '#7BC8A4', '#8E6BE0']
  let out = ''
  for (let i = 0; i < n; i++)
    out += `<rect x="${r() * w}" y="${r() * h}" width="${10 + r() * 10}" height="${
      5 + r() * 3
    }" rx="3" fill="${cols[i % cols.length]}" opacity=".8" transform="rotate(${r() * 360} ${r() * w} ${r() * h})"/>`
  return out
}

const art = {
  hero: (w, h) => `
    <ellipse cx="${w / 2}" cy="${h * 0.78}" rx="${w * 0.42}" ry="${w * 0.1}" fill="#fff" opacity=".7"/>
    <rect x="${w * 0.24}" y="${h * 0.5}" width="${w * 0.52}" height="${h * 0.28}" rx="36" fill="#7A3E2A"/>
    <rect x="${w * 0.24}" y="${h * 0.5 + h * 0.09}" width="${w * 0.52}" height="${h * 0.03}" fill="#FFD9D5"/>
    <path d="M${w * 0.22} ${h * 0.52} q${w * 0.28} -${h * 0.2} ${w * 0.56} 0 v${h * 0.05} q-${w * 0.06} ${h * 0.05} -${w * 0.1} 0 q-${w * 0.06} ${h * 0.06} -${w * 0.1} 0 q-${w * 0.06} ${h * 0.06} -${w * 0.1} 0 q-${w * 0.06} ${h * 0.06} -${w * 0.1} 0 q-${w * 0.06} ${h * 0.05} -${w * 0.16} 0z" fill="#E0457B"/>
    <circle cx="${w / 2}" cy="${h * 0.36}" r="${w * 0.05}" fill="#C21E4F"/>
    <path d="M${w / 2} ${h * 0.36} q${w * 0.04} -${h * 0.07} ${w * 0.1} -${h * 0.06}" stroke="#3B2218" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  bento: (w, h) => `
    <ellipse cx="${w / 2}" cy="${h * 0.76}" rx="${w * 0.34}" ry="${w * 0.07}" fill="#fff" opacity=".7"/>
    <rect x="${w * 0.27}" y="${h * 0.46}" width="${w * 0.46}" height="${h * 0.3}" rx="28" fill="#FFD9D5"/>
    <rect x="${w * 0.27}" y="${h * 0.56}" width="${w * 0.46}" height="${h * 0.04}" fill="#E0457B" opacity=".5"/>
    <ellipse cx="${w / 2}" cy="${h * 0.46}" rx="${w * 0.23}" ry="${h * 0.06}" fill="#fff"/>
    <path d="M${w * 0.5} ${h * 0.48} c-${w * 0.1} -${h * 0.1} -${w * 0.17} -${h * 0.02} -${w * 0.07} ${h * 0.05} q${w * 0.07} ${h * 0.04} ${w * 0.07} ${h * 0.04} q${w * 0.07} -${h * 0.0} ${w * 0.07} -${h * 0.04} c${w * 0.1} -${h * 0.07} ${w * 0.03} -${h * 0.15} -${w * 0.07} -${h * 0.05}z" fill="#E0457B"/>`,
  brownie: (w, h) => `
    <ellipse cx="${w / 2}" cy="${h * 0.78}" rx="${w * 0.36}" ry="${w * 0.07}" fill="#fff" opacity=".6"/>
    <rect x="${w * 0.2}" y="${h * 0.52}" width="${w * 0.34}" height="${h * 0.24}" rx="14" fill="#3B2218"/>
    <rect x="${w * 0.44}" y="${h * 0.42}" width="${w * 0.34}" height="${h * 0.24}" rx="14" fill="#4D2D1F"/>
    <rect x="${w * 0.3}" y="${h * 0.3}" width="${w * 0.34}" height="${h * 0.24}" rx="14" fill="#5C3524"/>
    <path d="M${w * 0.3} ${h * 0.36} q${w * 0.06} ${h * 0.05} ${w * 0.12} 0 t${w * 0.12} 0 t${w * 0.1} 0" stroke="#F2B33D" stroke-width="10" fill="none" stroke-linecap="round"/>`,
  cheesecake: (w, h) => `
    <ellipse cx="${w / 2}" cy="${h * 0.78}" rx="${w * 0.36}" ry="${w * 0.07}" fill="#fff" opacity=".7"/>
    <path d="M${w * 0.2} ${h * 0.74} L${w * 0.8} ${h * 0.6} L${w * 0.8} ${h * 0.5} L${w * 0.2} ${h * 0.64}z" fill="#FFE9B8"/>
    <path d="M${w * 0.2} ${h * 0.64} L${w * 0.8} ${h * 0.5} L${w * 0.5} ${h * 0.34}z" fill="#FFF1D0"/>
    <path d="M${w * 0.2} ${h * 0.74} v${h * 0.03} h${w * 0.6} v-${h * 0.17} l-${w * 0.6} ${h * 0.14}z" fill="#C98A4B" opacity=".55"/>
    <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.035}" fill="#C21E4F"/><circle cx="${w * 0.56}" cy="${h * 0.45}" r="${w * 0.028}" fill="#E0457B"/><circle cx="${w * 0.44}" cy="${h * 0.46}" r="${w * 0.028}" fill="#8E2A5C"/>`,
  bun: (w, h) => `
    <ellipse cx="${w / 2}" cy="${h * 0.76}" rx="${w * 0.34}" ry="${w * 0.07}" fill="#fff" opacity=".7"/>
    <ellipse cx="${w / 2}" cy="${h * 0.6}" rx="${w * 0.27}" ry="${h * 0.17}" fill="#D9984F"/>
    <ellipse cx="${w / 2}" cy="${h * 0.56}" rx="${w * 0.24}" ry="${h * 0.14}" fill="#EDB36A"/>
    <path d="M${w * 0.34} ${h * 0.55} q${w * 0.16} ${h * 0.08} ${w * 0.32} 0" stroke="#FFF6E9" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M${w * 0.5} ${h * 0.45} v${h * 0.2}" stroke="#FFF6E9" stroke-width="16" stroke-linecap="round"/>`,
  'cafe-1': (w, h) => `
    <rect x="${w * 0.08}" y="${h * 0.12}" width="${w * 0.84}" height="${h * 0.7}" rx="40" fill="#FFF6E9" opacity=".55"/>
    <path d="M${w * 0.14} ${h * 0.18} q${w * 0.18} ${h * 0.12} ${w * 0.36} 0 t${w * 0.36} 0" stroke="#3B2218" stroke-width="5" fill="none"/>
    ${[0.22, 0.34, 0.46, 0.58, 0.7, 0.82].map((x, i) => `<circle cx="${w * x}" cy="${h * (0.24 + (i % 2) * 0.02)}" r="14" fill="#F2B33D"/>`).join('')}
    <rect x="${w * 0.22}" y="${h * 0.5}" width="${w * 0.56}" height="${h * 0.05}" rx="14" fill="#7A3E2A"/>
    <rect x="${w * 0.28}" y="${h * 0.55}" width="${w * 0.04}" height="${h * 0.27}" fill="#7A3E2A"/><rect x="${w * 0.68}" y="${h * 0.55}" width="${w * 0.04}" height="${h * 0.27}" fill="#7A3E2A"/>
    <rect x="${w * 0.4}" y="${h * 0.42}" width="${w * 0.12}" height="${h * 0.08}" rx="10" fill="#E0457B"/>
    <circle cx="${w * 0.62}" cy="${h * 0.46}" r="${w * 0.04}" fill="#fff"/>`,
  janani: (w, h) => `
    <circle cx="${w / 2}" cy="${h * 0.38}" r="${w * 0.17}" fill="#E8B48F"/>
    <path d="M${w * 0.32} ${h * 0.36} q${w * 0.18} -${h * 0.2} ${w * 0.36} 0 q-${w * 0.02} -${h * 0.02} -${w * 0.05} -${h * 0.04} q-${w * 0.13} -${h * 0.03} -${w * 0.26} 0z" fill="#3B2218"/>
    <path d="M${w * 0.2} ${h * 0.9} q0 -${h * 0.34} ${w * 0.3} -${h * 0.34} q${w * 0.3} 0 ${w * 0.3} ${h * 0.34}z" fill="#E0457B"/>
    <path d="M${w * 0.36} ${h * 0.6} h${w * 0.28} v${h * 0.3} h-${w * 0.28}z" fill="#FFF6E9" opacity=".85"/>`,
}

const specs = [
  // name, w, h, [bg1, bg2]
  ['hero', 1400, 1750, ['#FFD9D5', '#F7B6A8']],
  ['cafe-1', 1800, 1200, ['#F8D6A4', '#EFA97A']],
  ['bento', 1200, 1200, ['#FFE3E3', '#FFC4D0']],
  ['brownie', 1200, 1200, ['#E9C9A0', '#C99869']],
  ['cheesecake', 1200, 1200, ['#FBE7C2', '#F4C98E']],
  ['bun', 1200, 1200, ['#FDE9C8', '#F6C98B']],
  ['janani', 1200, 1500, ['#FCD3C8', '#F6A9B8']],
]

for (const [name, w, h, [c1, c2]] of specs) {
  if (has(name)) continue
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <circle cx="${w * 0.82}" cy="${h * 0.18}" r="${w * 0.14}" fill="#fff" opacity=".25"/>
    <circle cx="${w * 0.12}" cy="${h * 0.86}" r="${w * 0.2}" fill="#fff" opacity=".18"/>
    ${sprinkles(w, h, 26, name.length + 3)}
    ${art[name](w, h)}
    <text x="${w / 2}" y="${h - 36}" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(w * 0.017)}" letter-spacing="3" fill="#3B2218" opacity=".45">PLACEHOLDER · REPLACE WITH ${name.toUpperCase()}.JPG</text>
  </svg>`
  await sharp(Buffer.from(svg)).jpeg({ quality: 86 }).toFile(path.join(dir, name + '.jpg'))
  console.log('placeholder →', `public/images/${name}.jpg`)
}
