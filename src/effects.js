/* 7amoo — VOLT effects: plasma aurora bg, pointer light, reveals, 3D tilt, SFX */

/* ---------- Plasma aurora background ---------- */
(function () {
  const c = document.getElementById('fx');
  if (!c) return;
  const ctx = c.getContext('2d');
  const DPR = Math.min(1.5, window.devicePixelRatio || 1);
  let W, H, blobs = [], raf = 0, paused = false;

  let accent = '#2bff88';
  const readAccent = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--ac').trim();
    if (v) accent = v;
  };
  readAccent();

  function rgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function size() {
    W = c.width = innerWidth * DPR;
    H = c.height = innerHeight * DPR;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
  }
  function make() {
    const n = innerWidth < 768 ? 4 : 6;
    blobs = [];
    for (let i = 0; i < n; i++) {
      blobs.push({
        x: Math.random() * W, y: Math.random() * H,
        r: (Math.random() * 260 + 220) * DPR,
        a: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.0006 + 0.0002,
        ox: Math.random() * W, oy: Math.random() * H,
        rad: (Math.random() * 220 + 140) * DPR,
        tint: i % 3, // 0 accent, 1 teal, 2 white-ish
      });
    }
  }
  size(); make();
  addEventListener('resize', () => { size(); make(); });
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) raf = requestAnimationFrame(tick);
  });

  let fc = 0;
  function tick(t) {
    if (paused) return;
    if ((++fc & 127) === 0) readAccent();
    const [r, g, b] = rgb(accent);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const o of blobs) {
      o.a += o.sp;
      const x = o.ox + Math.cos(o.a) * o.rad;
      const y = o.oy + Math.sin(o.a * 1.3) * o.rad;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, o.r);
      let col;
      if (o.tint === 0) col = `${r},${g},${b}`;
      else if (o.tint === 1) col = `${Math.round(r*.2)},${Math.round(g*.9)},${Math.round(b*.7)}`;
      else col = `${Math.round(r*.6)},255,${Math.round(b*.8)}`;
      grd.addColorStop(0, `rgba(${col},0.16)`);
      grd.addColorStop(0.5, `rgba(${col},0.05)`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, o.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(tick);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    raf = requestAnimationFrame(tick);
  } else {
    // static single paint
    requestAnimationFrame(tick); cancelAnimationFrame(raf);
    tick(0);
  }
})();

/* ---------- Pointer volt light ---------- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 900) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
  const el = document.createElement('div');
  el.id = 'voltlight';
  document.body.appendChild(el);
  const move = () => {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    el.style.transform = `translate(${x}px,${y}px)`;
    if (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) raf = requestAnimationFrame(move);
    else raf = 0;
  };
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(move);
  }, { passive: true });
})();

/* ---------- Scroll reveal ---------- */
(function () {
  const show = (el) => requestAnimationFrame(() =>
    requestAnimationFrame(() => el.classList.add('in')));
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const bind = () => {
    document.documentElement.classList.add('ready');
    document.querySelectorAll('.rv:not(.in):not([data-b])').forEach(el => {
      el.dataset.b = 1;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.95 && r.bottom > -40) show(el);
      else io.observe(el);
    });
  };
  window.__reveal = bind;
  if (document.readyState !== 'loading') bind(); else addEventListener('DOMContentLoaded', bind);
  addEventListener('load', bind);
  setTimeout(bind, 700); setTimeout(bind, 1700);
  setTimeout(() => document.querySelectorAll('.rv:not(.in)').forEach(e => e.classList.add('in')), 3800);
})();

/* ---------- 3D tilt ---------- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;
  const SEL = '[data-tilt]';
  const reg = () => {
    document.querySelectorAll(SEL + ':not([data-tb])').forEach(el => {
      el.dataset.tb = 1;
      const MAX = +(el.dataset.tilt || 8);
      let rid = 0, trx = 0, try_ = 0, crx = 0, cry = 0, on = false, rect = null;
      const paint = () => {
        crx += (trx - crx) * .16; cry += (try_ - cry) * .16;
        if (!on && Math.abs(crx) < .04 && Math.abs(cry) < .04) { el.style.transform = ''; rid = 0; return; }
        el.style.transform = `perspective(1000px) rotateX(${crx.toFixed(2)}deg) rotateY(${cry.toFixed(2)}deg) translateZ(0)`;
        rid = requestAnimationFrame(paint);
      };
      el.addEventListener('pointerenter', () => { on = true; rect = el.getBoundingClientRect(); if (!rid) rid = requestAnimationFrame(paint); });
      el.addEventListener('pointermove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - .5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - .5) * 2;
        cry_target(nx, ny);
      });
      function cry_target(nx, ny){ try_ = nx * MAX; trx = -ny * MAX; if (!rid) rid = requestAnimationFrame(paint); }
      el.addEventListener('pointerleave', () => { on = false; trx = 0; try_ = 0; rect = null; if (!rid) rid = requestAnimationFrame(paint); });
    });
  };
  window.__tilt = reg;
  setTimeout(reg, 400); setTimeout(reg, 1400);
  setTimeout(() => {
    const root = document.getElementById('app'); if (!root) return;
    let p = 0;
    new MutationObserver(() => { if (p) return; p = setTimeout(() => { p = 0; reg(); }, 220); })
      .observe(root, { childList: true, subtree: true });
  }, 1600);
})();

/* ---------- Synth hover / click SFX ---------- */
(function () {
  let ac = null, on = true;
  window.__sfx = v => on = !!v;
  const ctx = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (ac.state === 'suspended') ac.resume().catch(()=>{}); return ac; };
  let last = 0;
  window.__hover = () => {
    if (!on) return; const n = performance.now(); if (n - last < 55) return; last = n;
    const a = ctx(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(1300, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(680, a.currentTime + .06);
    g.gain.setValueAtTime(.025, a.currentTime); g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .08);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .1);
  };
  window.__click = () => {
    if (!on) return; const a = ctx(); if (!a) return; const t = a.currentTime;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(70, t + .09);
    g.gain.setValueAtTime(.07, t); g.gain.exponentialRampToValueAtTime(.0001, t + .11);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + .12);
  };
})();
