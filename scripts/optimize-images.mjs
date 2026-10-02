// Turns every photo in public/images (+ public/images/gallery) into responsive
// WebP files in public/images/optimized and writes src/images.manifest.json.
// Re-runs only touch files whose source changed.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('public/images')
const out = path.join(root, 'optimized')
const WIDTHS = [480, 800, 1280, 1920]
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp'])
fs.mkdirSync(out, { recursive: true })

const sources = []
const scan = (dir, prefix = '') => {
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isFile() && exts.has(path.extname(f).toLowerCase()))
      sources.push({ file: p, key: prefix + path.parse(f).name })
  }
}
scan(root)
if (fs.existsSync(path.join(root, 'gallery'))) scan(path.join(root, 'gallery'), 'gallery-')

const manifest = {}
for (const { file, key } of sources) {
  const mtime = fs.statSync(file).mtimeMs
  const img = sharp(file).rotate()
  const { width, height } = await img.metadata()
  const ws = [...new Set(WIDTHS.map((w) => Math.min(w, width)))]
  const [rw, rh] = [width, height]
  for (const w of ws) {
    const dest = path.join(out, `${key}-${w}.webp`)
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= mtime) continue
    await sharp(file).rotate().resize({ width: w }).webp({ quality: 78, effort: 5 }).toFile(dest)
  }
  const tiny = await sharp(file).rotate().resize(16).blur(1).jpeg({ quality: 50 }).toBuffer()
  manifest[key] = { w: rw, h: rh, widths: ws, lqip: 'data:image/jpeg;base64,' + tiny.toString('base64') }
  console.log(`optimized ${key} (${ws.join('/')})`)
}
fs.writeFileSync('src/images.manifest.json', JSON.stringify(manifest, null, 1))
