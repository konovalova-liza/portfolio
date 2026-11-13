/* Back to top (DESIGN.md §4.20). One script for the homepage, the About page and every case page. It adds the button
   (.pill.dark, or .pill.light when <body data-totop="light">), shows it once the page is scrolled past two screens, keeps it
   above the footer contacts / case end block, hides it while the menu or the contact modal is open, and on click scrolls to
   the top (instant under reduced motion) and then focuses the page title without a second jump. */
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `pill ${document.body.dataset.totop === 'light' ? 'light' : 'dark'} totop`;
  b.setAttribute('aria-label', 'Back to top');
  b.setAttribute('aria-hidden', 'true');
  b.tabIndex = -1;
  b.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-r"/></svg>';
  document.body.append(b);

  const stop = document.querySelector('.fcols, .case-end');   // homepage footer contacts, or the case/About end block
  const overlays = ['#nav', '#modal'].map(s => document.querySelector(s)).filter(Boolean);
  let on = false, queued = false;

  const update = () => {
    queued = false;
    const gap = parseFloat(getComputedStyle(b).bottom) || 0, size = b.offsetHeight;
    // the button's bottom edge may not go below `limit`: one page gutter above the stop element
    const limit = stop ? Math.min(innerHeight, stop.getBoundingClientRect().top) - gap : innerHeight - gap;
    const lift = Math.max(0, innerHeight - gap - limit);
    const fits = limit - size >= gap;
    const show = fits && scrollY > innerHeight * 2 && !overlays.some(o => o.classList.contains('open'));
    b.style.setProperty('--totop-lift', `${lift}px`);
    if (show === on) return;
    on = show;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-hidden', String(!on));
    b.tabIndex = on ? 0 : -1;
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  overlays.forEach(o => new MutationObserver(queue).observe(o, { attributes: true, attributeFilter: ['class'] }));
  update();

  b.addEventListener('click', () => {
    const title = document.querySelector('#intro-title') || document.querySelector('main h1');
    const focusTitle = () => {
      if (!title) return;
      if (!title.hasAttribute('tabindex')) title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    };
    const lenis = window.siteLenis;   // the homepage's smooth scroller, when it runs
    if (still.matches) {
      lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo({ top: 0, behavior: 'instant' });
      focusTitle();
      return;
    }
    if (lenis) { lenis.scrollTo(0, { onComplete: focusTitle }); return; }
    let t;
    const done = () => { clearTimeout(t); removeEventListener('scrollend', done); focusTitle(); };
    addEventListener('scrollend', done, { once: true });
    t = setTimeout(done, 1500);   // browsers without scrollend
    scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
