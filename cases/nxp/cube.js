/* NXP live cube (DESIGN.md §5.9). Drives the fixed .nx-cube layer at ≥1024:
   - opacity from the scroll position: 1 at the top, --nx-cube-dim once body text can reach the viewport (with or without motion);
   - a canvas over the cover image: pulsing teal points on the cube edges, drifting particles, pointer parallax, slow breathing.
   Reduced motion: static image, no canvas loop. The loop pauses while the tab is hidden or the layer is off (<1024). */
(() => {
  const layer = document.querySelector('.nx-cube');
  if (!layer) return;
  const art = layer.querySelector('.nx-cube-art');
  const canvas = layer.querySelector('canvas');
  // first body text on the page: the layer must be dim by the time it can enter the viewport
  const summary = document.querySelector('main .cb-summary dl') || document.querySelector('main');

  // effect constants (§5.9). Points: glow centres measured from nxp-cover.webp, as fractions of the image.
  const FX = {
    points: [[.5044,.056],[.5057,.1925],[.5958,.189],[.6791,.2232],[.3202,.2399],[.3187,.2788],[.6519,.2965],[.4705,.4453],
             [.5721,.4528],[.6612,.522],[.313,.5259],[.3573,.5693],[.4955,.5805],[.3676,.6038],[.3109,.6112],[.6919,.6617],
             [.3117,.7082],[.4,.7847],[.6218,.8127]],
    pulse: { period: 4200, radius: .011, grow: .6, min: .15, max: .7 },
    particles: { count: 40, size: [.6, 1.8], alpha: [.2, .55], speed: .006 },   // speed: fraction of the box height per second
    parallax: 12, ease: .06,
    breathe: { min: 1, max: 1.03, period: 16000 },
    dpr: 1.5,
  };
  const TEAL = '44,207,191';
  const desk = matchMedia('(min-width:1024px)');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const dim = parseFloat(getComputedStyle(layer).getPropertyValue('--nx-cube-dim')) || .18;

  // scroll fade: full at scrollY 0, dim by the time the summary's top reaches the viewport bottom
  let fadeQueued = false;
  const fade = () => {
    fadeQueued = false;
    const end = Math.max(1, summary.getBoundingClientRect().top + scrollY - innerHeight);
    const t = Math.min(1, Math.max(0, scrollY / end));
    layer.style.opacity = (1 - (1 - dim) * t).toFixed(3);
  };
  const queueFade = () => { if (!fadeQueued) { fadeQueued = true; requestAnimationFrame(fade); } };
  addEventListener('scroll', queueFade, { passive: true });
  addEventListener('resize', queueFade);
  fade();

  if (still.matches || !canvas) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, scale = 1;
  const resize = () => {
    // layout size, untouched by the breathing transform
    scale = Math.min(devicePixelRatio || 1, FX.dpr);
    w = Math.round(art.offsetWidth * scale);
    h = Math.round(art.offsetHeight * scale);
    canvas.width = w; canvas.height = h;
  };
  new ResizeObserver(resize).observe(art);

  const rnd = (a, b) => a + Math.random() * (b - a);
  const parts = Array.from({ length: FX.particles.count }, () => ({
    x: Math.random(), y: Math.random(), vx: rnd(-.3, .3), vy: rnd(-1, -.3),
    s: rnd(...FX.particles.size), a: rnd(...FX.particles.alpha), ph: Math.random() * Math.PI * 2,
  }));
  const phase = FX.points.map(() => Math.random() * Math.PI * 2);

  let tx = 0, ty = 0, px = 0, py = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tx = (e.clientX / innerWidth - .5) * 2 * FX.parallax;
    ty = (e.clientY / innerHeight - .5) * 2 * FX.parallax;
  }, { passive: true });

  let raf = 0, last = 0;
  const frame = now => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;

    px += (tx - px) * FX.ease; py += (ty - py) * FX.ease;
    const b = FX.breathe, s = b.min + (b.max - b.min) * (.5 - .5 * Math.cos(now / b.period * Math.PI * 2));
    art.style.transform = `translateX(-50%) translate(${px.toFixed(2)}px,${py.toFixed(2)}px) scale(${s.toFixed(4)})`;

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const p = FX.pulse;
    FX.points.forEach(([fx, fy], i) => {
      const k = .5 - .5 * Math.cos(now / p.period * Math.PI * 2 + phase[i]);
      const r = p.radius * w * (1 + p.grow * k), a = p.min + (p.max - p.min) * k;
      const g = ctx.createRadialGradient(fx * w, fy * h, 0, fx * w, fy * h, r);
      g.addColorStop(0, `rgba(${TEAL},${a})`); g.addColorStop(1, `rgba(${TEAL},0)`);
      ctx.fillStyle = g; ctx.fillRect(fx * w - r, fy * h - r, r * 2, r * 2);
    });
    for (const q of parts) {
      q.x += q.vx * FX.particles.speed * dt; q.y += q.vy * FX.particles.speed * dt;
      if (q.y < -.02) { q.y = 1.02; q.x = Math.random(); }
      if (q.x < -.02) q.x = 1.02; else if (q.x > 1.02) q.x = -.02;
      const tw = .6 + .4 * Math.sin(now / 1400 + q.ph);
      ctx.fillStyle = `rgba(${TEAL},${(q.a * tw).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(q.x * w, q.y * h, q.s * scale, 0, Math.PI * 2); ctx.fill();
    }
  };
  const run = () => {
    const on = desk.matches && !document.hidden;
    if (on && !raf) { last = 0; resize(); raf = requestAnimationFrame(frame); }
    else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  document.addEventListener('visibilitychange', run);
  desk.addEventListener('change', run);
  run();
})();
