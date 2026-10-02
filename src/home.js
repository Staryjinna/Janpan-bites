import { boot, initReveals, gsap, ScrollTrigger, reduced } from './common.js'

boot()
initReveals()
initGallery()
initReviews()

/* horizontal drag gallery with inner-image parallax and a progress bar */
function initGallery() {
  const sc = document.querySelector('.gal-scroller')
  if (!sc) return
  const bar = document.querySelector('.gal-progress span')
  const imgs = [...sc.querySelectorAll('[data-gal-img]')]
  let touched = false
  const update = () => {
    const max = sc.scrollWidth - sc.clientWidth
    if (bar) gsap.set(bar, { scaleX: 0.08 + 0.92 * (max > 0 ? sc.scrollLeft / max : 0) })
    if (reduced) return
    const mid = sc.getBoundingClientRect().left + sc.clientWidth / 2
    imgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect()
      const off = (r.left + r.width / 2 - mid) / sc.clientWidth
      img.style.transform = `translateX(${(-off * 7).toFixed(2)}%)`
    })
  }
  sc.addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()

  // mouse drag (touch is native)
  let down = false, sx = 0, sl = 0, moved = 0
  sc.addEventListener('pointerdown', (e) => {
    touched = true
    if (e.pointerType !== 'mouse') return
    down = true; sx = e.clientX; sl = sc.scrollLeft; moved = 0
  })
  addEventListener('pointermove', (e) => {
    if (!down) return
    const d = e.clientX - sx; moved = Math.abs(d)
    if (moved > 4) sc.classList.add('is-dragging')
    sc.scrollLeft = sl - d
  })
  addEventListener('pointerup', () => { down = false; sc.classList.remove('is-dragging') })
  sc.addEventListener('wheel', () => (touched = true), { passive: true })

  // scrolling the page nudges the gallery sideways until the visitor takes over
  if (!reduced) {
    ScrollTrigger.create({
      trigger: sc, start: 'top bottom', end: 'bottom top', scrub: true,
      onUpdate: (self) => { if (!touched) sc.scrollLeft = self.progress * (sc.scrollWidth - sc.clientWidth) * 0.5 },
    })
    gsap.from(sc.querySelectorAll('.gal-item'), {
      y: 80, opacity: 0, rotation: 6, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: sc, start: 'top 85%', once: true },
    })
  }
}

/* auto-sliding reviews; swipe works natively, autoplay pauses on interaction */
function initReviews() {
  const sc = document.querySelector('.rev-scroller')
  const dotsEl = document.querySelector('.rev-dots')
  if (!sc || !dotsEl) return
  const cards = [...sc.children]
  let idx = 0, paused = false, resume
  const stepW = () => cards[1].offsetLeft - cards[0].offsetLeft
  const maxIdx = () => Math.max(0, Math.round((sc.scrollWidth - sc.clientWidth) / stepW()))
  const go = (i) => sc.scrollTo({ left: i * stepW(), behavior: 'smooth' })
  const buildDots = () => {
    dotsEl.innerHTML = ''
    for (let i = 0; i <= maxIdx(); i++) {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Review ${i + 1}`)
      b.addEventListener('click', () => { pause(); go(i) })
      dotsEl.append(b)
    }
    mark()
  }
  const mark = () => {
    idx = Math.min(maxIdx(), Math.round(sc.scrollLeft / stepW()))
    ;[...dotsEl.children].forEach((d, i) => d.classList.toggle('on', i === idx))
  }
  const pause = () => { paused = true; clearTimeout(resume); resume = setTimeout(() => (paused = false), 7000) }
  sc.addEventListener('scroll', mark, { passive: true })
  ;['pointerdown', 'wheel', 'touchstart', 'focusin'].forEach((ev) => sc.addEventListener(ev, pause, { passive: true }))
  sc.addEventListener('pointerenter', () => (paused = true))
  sc.addEventListener('pointerleave', () => { clearTimeout(resume); resume = setTimeout(() => (paused = false), 1500) })
  addEventListener('resize', buildDots)
  buildDots()
  if (reduced) return
  let inView = false
  new IntersectionObserver(([e]) => (inView = e.isIntersecting), { threshold: 0.3 }).observe(sc)
  setInterval(() => { if (paused || !inView) return; go(idx >= maxIdx() ? 0 : idx + 1) }, 4200)
}
