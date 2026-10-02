# Janpan Bites — preview site

2-page static site (Home + Workshops). Vite · Tailwind v4 · GSAP + ScrollTrigger · Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/  (deploy to Vercel / Netlify as a static site)
```

## Swapping in real photos
Drop JPG/PNG/WebP files into `public/images/` **using the same names** (overwrite the placeholders):

| File | Used for |
| --- | --- |
| `hero.jpg` | Home hero arch (portrait works best, ~4:5) |
| `bento.jpg` | Bento Cakes card · hero float · Bento workshop |
| `brownie.jpg` | Brownies card · hero float · Brownie & Blondie + Plum Cake workshops |
| `cheesecake.jpg` | Cheesecake card · Cheesecake workshop |
| `bun.jpg` | Korean Cheese Buns card |
| `cafe-1.jpg` | The Café big image (landscape) |
| `janani.jpg` | Meet Janani + workshops hero bubble (portrait) |

Any extra photo in `public/images/` or `public/images/gallery/` automatically appears in the scrolling gallery.
`npm run dev` / `npm run build` auto-generate responsive WebP (480–1920w) into `public/images/optimized/`.
(Delete a placeholder's `.jpg` only if you're replacing it with a different extension.)

## Content to finish
- **Reviews**: `index.html`, section `#reviews` — replace name + text in the 4 cards, remove the `rev-sample` chip.
- **YouTube link**: `src/partials/footer.html` (currently `youtube.com/@janpanbites`, unverified).
