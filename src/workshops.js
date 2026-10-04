import { boot, initReveals, gsap, ScrollTrigger, reduced } from './common.js'

boot()
initReveals()

if (!reduced) {
  // "How it works": the gold line draws as you scroll, steps rise in one by one
  gsap.utils.toArray('[data-step]').forEach((s) => {
    gsap.fromTo(s, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } })
  })
  const mobile = matchMedia('(max-width: 899px)').matches
  gsap.to('.steps-line i', { [mobile ? 'scaleY' : 'scaleX']: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 70%', scrub: true } })
  gsap.from('.closing-title', { scale: 0.94, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'center center', scrub: true } })
} else {
  document.documentElement.classList.remove('motion')
}
