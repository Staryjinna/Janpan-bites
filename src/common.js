import './style.css'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
export { gsap, ScrollTrigger }

let lenis
export function boot() {
  window.__janpan = true
  const page = document.body.dataset.page
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute('aria-current', 'page')
  })

  initNav()
  initTransitions()
  if (reduced) return

  // smooth scrolling (native on touch – feels better on phones)
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a || a.getAttribute('href') === '#') return
    const t = document.querySelector(a.getAttribute('href'))
    if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70, duration: 1.4 }) }
  })

  if (finePointer) initCursor()
  initMagnetic()
  initTilt()
  initParallax()
}

function initNav() {
  const nav = document.getElementById('nav')
  const set = () => nav.classList.toggle('is-small', scrollY > 40)
  addEventListener('scroll', set, { passive: true })
  set()
}

/* page transition: cocoa curtain wipes up, then we navigate */
function initTransitions() {
  const curtain = document.querySelector('.curtain')
  addEventListener('pageshow', (e) => {
    if (e.persisted && curtain) { curtain.style.animation = 'none'; gsap.set(curtain, { yPercent: -105, visibility: 'hidden' }) }
  })
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return
    const url = new URL(a.href, location.href)
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return
    if (url.pathname === location.pathname && !url.hash) { e.preventDefault(); lenis ? lenis.scrollTo(0) : scrollTo(0, 0); return }
    e.preventDefault()
    if (reduced || !curtain) return (location.href = url.href)
    curtain.style.animation = 'none'
    gsap.set(curtain, { visibility: 'visible', yPercent: 105 })
    gsap.to(curtain, { yPercent: 0, duration: 0.75, ease: 'power3.inOut', onComplete: () => (location.href = url.href) })
  })
}

function initCursor() {
  document.documentElement.classList.add('has-cursor')
  const dot = document.querySelector('.cursor-dot')
  const ring = document.querySelector('.cursor-ring')
  const label = ring.querySelector('span')
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })
  addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY) }, { passive: true })
  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor]')
    const link = e.target.closest('a, button, [data-tilt]')
    ring.classList.toggle('is-label', !!lab)
    ring.classList.toggle('is-link', !lab && !!link)
    if (lab) label.textContent = lab.dataset.cursor
  })
}

function initMagnetic() {
  if (!finePointer) return
  document.querySelectorAll('.magnetic').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.28)
      y((e.clientY - (r.top + r.height / 2)) * 0.4)
    })
    el.addEventListener('pointerleave', () => { x(0); y(0) })
  })
}

/* cards tilt toward the pointer / finger and lift with a bigger shadow */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
    const ly = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    gsap.set(el, { transformPerspective: 900 })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * 14); rx(-py * 14); ly(-10)
      el.classList.add('is-lifted')
    }
    const reset = () => { rx(0); ry(0); ly(0); el.classList.remove('is-lifted') }
    el.addEventListener('pointerdown', move)
    el.addEventListener('pointermove', move)
    ;['pointerleave', 'pointerup', 'pointercancel'].forEach((ev) => el.addEventListener(ev, reset))
  })
}

function initParallax() {
  // floating objects drift at their own speed
  gsap.utils.toArray('[data-speed]').forEach((el) => {
    gsap.to(el, { y: Number(el.dataset.speed), ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
  })
  // images drift inside their frames
  gsap.utils.toArray('[data-parallax-img]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
  })
}

/* word-by-word reveal – keeps nested <em> intact */
export function splitWords(root) {
  const walk = (node) => {
    ;[...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) return frag.append(' ')
          const w = document.createElement('span'); w.className = 'w'
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = part
          w.append(i); frag.append(w)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1) walk(n)
    })
  }
  walk(root)
  root.setAttribute('aria-label', root.textContent.replace(/\s+/g, ' ').trim())
  // em words need to be wrapped in a mask too, so make <em> inline-block-safe
  return root.querySelectorAll('.wi')
}

/* shared on-scroll reveals, plus the hero intro */
export function initReveals() {
  const hero = document.querySelector('[data-split]')
  const words = hero ? splitWords(hero) : []
  if (reduced) { document.documentElement.classList.remove('motion'); return }

  // intro timeline (starts as the curtain lifts)
  const tl = gsap.timeline({ delay: 0.75, defaults: { ease: 'power4.out' } })
  const arch = document.querySelector('[data-hero-arch]')
  if (arch) {
    tl.from(arch, { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 40px 40px)', duration: 1.3, ease: 'power4.inOut' }, 0)
    const img = arch.querySelector('[data-hero-img]')
    if (img) {
      tl.fromTo(img, { scale: 1.45 }, { scale: 1.05, duration: 2.6, ease: 'power3.out' }, 0)
      gsap.to(img, { scale: 1.22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    }
  }
  tl.to(words, { y: 0, duration: 1.1, stagger: 0.07 }, 0.15)
  tl.to('[data-hero-fade]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.55)
  gsap.set('[data-hero-fade]', { y: 24 })
  tl.from('.float, .whisk', { scale: 0, rotation: -25, duration: 1, stagger: 0.12, ease: 'back.out(1.6)' }, 0.9)

  // staggered scroll reveals
  const items = gsap.utils.toArray('[data-reveal]')
  gsap.set(items, { y: 46 })
  ScrollTrigger.batch(items, {
    start: 'top 90%', once: true,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out', overwrite: 'auto' }),
  })

  // any later split headings (closing CTA)
  gsap.utils.toArray('[data-split]').slice(1).forEach((h) => {
    const ws = splitWords(h)
    gsap.to(ws, { y: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } })
  })
}
