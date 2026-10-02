import { boot, initReveals, gsap, ScrollTrigger, reduced } from './common.js'

boot()
initReveals()

if (!reduced) {
  // "How it works": the dashed line draws itself, steps pop in one by one
  const steps = gsap.utils.toArray('[data-step]')
  steps.forEach((s, i) => {
    gsap.fromTo(s, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 85%', once: true } })
    gsap.from(s.querySelector('.step-num'), { scale: 0, rotation: -90, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: s, start: 'top 85%', once: true } })
    gsap.from(s.querySelector('.step-ico'), { scale: 0, duration: 0.7, delay: 0.2, ease: 'back.out(2)', scrollTrigger: { trigger: s, start: 'top 85%', once: true } })
  })
  const path = document.querySelector('.steps-path')
  if (path) {
    gsap.fromTo(path, { strokeDasharray: '4 5', opacity: 0.15 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } })
    gsap.from('.steps-line', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } })
  }
  // closing: heading drifts, sprinkles keep falling
  gsap.from('.closing-title', { scale: 0.92, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'center center', scrub: true } })
} else {
  document.documentElement.classList.remove('motion')
}
