/* NXP section 03 diagrams (DESIGN.md §5.9): reveal on scroll. Adds .nx-anim (the hidden start state) and then .is-in once a
   diagram is 30% in view: the timeline line draws left to right with the weeks and markers following it, the use-case tiles
   slide into their frames. Nothing runs under reduced motion or without IntersectionObserver, so the diagrams stay static. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { threshold: .3 });
  document.querySelectorAll('.nx-dg').forEach(el => { el.classList.add('nx-anim'); io.observe(el); });
})();
