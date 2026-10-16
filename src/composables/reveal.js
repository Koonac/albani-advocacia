// v-reveal: entrada discreta ao rolar. Só age no cliente e só em elementos abaixo da dobra,
// por isso o HTML pré-renderizado é sempre visível (sem flash, sem prejuízo ao LCP).
export const reveal = {
  mounted(el, binding) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    el.classList.add('reveal-init')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('reveal-in')
            el.classList.remove('reveal-init')
            io.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
  },
}
