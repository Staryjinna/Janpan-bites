# Janpan Bites

Editorial 2-page site (Home + Workshops) for Janpan Bites, an eggless café & bakery in Adyar, Chennai.
Vite · Tailwind v4 · GSAP + ScrollTrigger · Lenis. Static output, deploys to Vercel/Netlify as-is.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

**Vercel:** framework preset *Vite*, build `npm run build`, output `dist`. Netlify reads `netlify.toml`.

## Photos (the one thing that makes it feel real)
Every photo slot currently holds a soft placeholder. Overwrite these files in `public/images/` with real photos, same names:

| File | Used for |
| --- | --- |
| `hero.jpg` | Home hero arch — portrait, about 4:5 |
| `bento.jpg` · `brownie.jpg` · `cheesecake.jpg` · `bun.jpg` | "What we bake" cards (portrait, 4:5) · bento/brownie also in hero + workshops |
| `plum-cake.jpg` | Plum Cake workshop |
| `cafe-1.jpg` | The Café image — landscape |
| `janani.jpg` | Meet Janani — portrait |

Any extra photo dropped into `public/images/` or `public/images/gallery/` appears in the scrolling gallery automatically.
`npm run dev` / `npm run build` convert everything to responsive WebP.

## Still to fill in
- **Reviews:** `index.html`, section `#reviews` — replace name + text, delete the `rev-sample` chip.
- **YouTube link:** `src/partials/footer.html` (currently `youtube.com/@janpanbites`, unverified).
