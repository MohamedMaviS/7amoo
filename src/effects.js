// Hover + click sound triggers
(function () {
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [data-hover]')) {
      window.__playHover?.();
    }
  });
  document.addEventListener('mousedown', () => {
    window.__playClick?.();
  });
  document.addEventListener('touchstart', () => {
    window.__playClick?.();
  }, { passive: true });
})();

// Particles background
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // Cap DPR at 1.5 — retina 2x/3x triples fragment cost for zero visual gain on dots.
  const DPR = Math.min(1.5, window.devicePixelRatio || 1);
  const isMobile = window.innerWidth < 768;
  // Lower mobile cost: fewer particles + tighter shadow (biggest canvas cost).
  const PARTICLE_COUNT = isMobile ? 16 : 38;
  const SHADOW_BLUR = (isMobile ? 2 : 4) * DPR;

  let W, H, particles = [];
  let paused = false;

  function resize() {
    W = canvas.width = window.innerWidth * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn() {
    return {
      x: Math.random() * W,
      y: H + Math.random() * 40,
      r: (Math.random() * 1.6 + 0.4) * DPR,
      vy: -(Math.random() * 0.6 + 0.2) * DPR,
      vx: (Math.random() - 0.5) * 0.3 * DPR,
      a: Math.random() * 0.6 + 0.2,
      life: Math.random() * 400 + 300,
      age: 0
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = spawn();
    p.y = Math.random() * H;
    p.age = Math.random() * 200;
    particles.push(p);
  }

  // Cache accent — getComputedStyle was being called once per particle per frame.
  let accentHex = '#00e676';
  let accentRgb = '0,230,118';
  const refreshAccent = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--red-0').trim();
    if (!v || v === accentHex) return;
    accentHex = v;
    const h = v.replace('#','');
    const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
    accentRgb = `${(bigint>>16)&255},${(bigint>>8)&255},${bigint&255}`;
  };
  refreshAccent();

  let frameCount = 0;
  // Pause loop when tab is hidden — saves battery + CPU completely.
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) requestAnimationFrame(tick);
  });

  function tick() {
    if (paused) return;
    ctx.clearRect(0, 0, W, H);
    if ((++frameCount & 127) === 0) refreshAccent();
    ctx.shadowColor = accentHex;
    ctx.shadowBlur = SHADOW_BLUR;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.age++;
      if (p.age >= p.life || p.y < -20) {
        particles[i] = spawn();
        continue;
      }
      const alpha = p.a * (1 - p.age / p.life);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${accentRgb},${alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// Scroll reveal — lightweight version.
// No MutationObserver (that was the perf killer — it ran on every React re-render).
// Just a single IntersectionObserver + a hard failsafe at 3.5s that force-reveals
// anything still stuck, so sections can NEVER stay permanently invisible.
(function () {
  const reveal = (el) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('in'));
    });
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        reveal(e.target);
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  const bind = () => {
    document.documentElement.classList.add('js-ready');
    const nodes = document.querySelectorAll('.reveal:not(.in):not([data-reveal-bound])');
    if (!nodes.length) return;
    const vh = window.innerHeight;
    for (const el of nodes) {
      el.dataset.revealBound = '1';
      const r = el.getBoundingClientRect();
      // Already visible on first paint — reveal immediately.
      if (r.top < vh * 0.95 && r.bottom > -40) {
        reveal(el);
      } else {
        io.observe(el);
      }
    }
  };
  window.__observeReveals = bind;

  // A handful of binding passes to catch React's Babel-in-browser late mount.
  if (document.readyState !== 'loading') bind();
  else document.addEventListener('DOMContentLoaded', bind);
  window.addEventListener('load', bind);
  setTimeout(bind, 600);
  setTimeout(bind, 1500);

  // HARD FAILSAFE — after 3.5s, force-reveal anything still unrevealed.
  // Nothing can ever stay permanently hidden even if the observer misses it.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 3500);
})();

// Scroll parallax for hero photo
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let heroPhoto = null;
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      heroPhoto = heroPhoto || document.querySelector('.hero-photo');
      if (heroPhoto) {
        const y = window.scrollY;
        // Stop updating once past the hero region.
        if (y > 900) { ticking = false; return; }
        const translateY = Math.max(-40, y * 0.08);
        heroPhoto.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 3D pointer-follow tilt for cards
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  if (window.innerWidth < 768) return;

  const STRONG_SELECTOR = '.stat, .plat-card, .fact-reel, .bio__card, .rank-proof__card, .email-card, [data-tilt-strong]';
  const SELECTOR = [
    '.stat', '.plat-card', '.fact-reel', '.bio__card', '.bio__id-row',
    '.email-card', '.rank-proof__card', '.btn', '.meta-chip', '.marq-item',
    '.chip', '.dev-credit', '.footer__back', '.tw-theme', '.nav__logo',
    '.bio__counter', '.bio__spec', '.bio__quote', '.bio__timeline-item',
    '[data-tilt]'
  ].join(',');

  const register = () => {
    // [data-tilt-bound] filter keeps the scan cheap after first pass.
    const nodes = document.querySelectorAll(SELECTOR + ':not([data-tilt-bound])');
    for (const el of nodes) {
      el.dataset.tiltBound = '1';

      const strong = el.matches(STRONG_SELECTOR);
      const MAX_ROT = strong ? 9 : 4;
      const LIFT    = strong ? 6 : 2;

      let rafId = 0;
      let targetRX = 0, targetRY = 0;
      let curRX = 0, curRY = 0;
      let active = false;
      // Cache rect on enter — reused across every mousemove so we don't
      // force layout reads during high-frequency pointer events.
      let rect = null;

      const paint = () => {
        curRX += (targetRX - curRX) * 0.18;
        curRY += (targetRY - curRY) * 0.18;

        if (!active && Math.abs(curRX) < 0.05 && Math.abs(curRY) < 0.05) {
          el.style.transform = '';
          rafId = 0;
          return;
        }

        const lift = active ? LIFT : 0;
        el.style.transform =
          `perspective(900px) rotateX(${curRX.toFixed(2)}deg) ` +
          `rotateY(${curRY.toFixed(2)}deg) translate3d(0,${-lift}px,0)`;

        rafId = requestAnimationFrame(paint);
      };

      const onEnter = () => {
        active = true;
        rect = el.getBoundingClientRect();
        el.style.willChange = 'transform';
        if (!rafId) rafId = requestAnimationFrame(paint);
      };

      const onMove = (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        targetRY =  nx * MAX_ROT;
        targetRX = -ny * MAX_ROT;
        if (!rafId) rafId = requestAnimationFrame(paint);
      };

      const onLeave = () => {
        active = false;
        targetRX = 0;
        targetRY = 0;
        rect = null;
        setTimeout(() => { el.style.willChange = ''; }, 400);
        if (!rafId) rafId = requestAnimationFrame(paint);
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove', onMove, { passive: true });
      el.addEventListener('mouseleave', onLeave);
    }
  };
  window.__registerTilt = register;
  setTimeout(register, 300);
  setTimeout(register, 1200);

  // Debounced MutationObserver — don't re-scan on every React tick.
  let pendingTilt = 0;
  const scheduleRegister = () => {
    if (pendingTilt) return;
    pendingTilt = setTimeout(() => { pendingTilt = 0; register(); }, 200);
  };
  setTimeout(() => {
    const root = document.getElementById('root');
    if (!root) return;
    const reobs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes.length) { scheduleRegister(); return; }
      }
    });
    reobs.observe(root, { childList: true, subtree: true });
  }, 1500);
})();

// Synthesized hover + click SFX
(function () {
  let audioCtx = null;
  let enabled = true;
  window.__soundEnabled = (v) => { enabled = !!v; };
  const ensureCtx = () => {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  };
  let lastHover = 0;
  window.__playHover = () => {
    if (!enabled) return;
    const now = performance.now();
    if (now - lastHover < 60) return;
    lastHover = now;
    try {
      const ctx = ensureCtx();
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(1200, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06);
      g.gain.setValueAtTime(0.03, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.1);
    } catch(e){}
  };
  window.__playClick = () => {
    if (!enabled) return;
    try {
      const audioCtx = ensureCtx();
      if (!audioCtx) return;
      const t0 = audioCtx.currentTime;
      const o1 = audioCtx.createOscillator();
      const g1 = audioCtx.createGain();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(180, t0);
      o1.frequency.exponentialRampToValueAtTime(60, t0 + 0.08);
      g1.gain.setValueAtTime(0.08, t0);
      g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
      o1.connect(g1).connect(audioCtx.destination);
      o1.start(t0); o1.stop(t0 + 0.12);
      const o2 = audioCtx.createOscillator();
      const g2 = audioCtx.createGain();
      o2.type = 'square';
      o2.frequency.setValueAtTime(1800, t0);
      o2.frequency.exponentialRampToValueAtTime(900, t0 + 0.04);
      g2.gain.setValueAtTime(0.04, t0);
      g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
      o2.connect(g2).connect(audioCtx.destination);
      o2.start(t0); o2.stop(t0 + 0.06);
    } catch(e){}
  };
})();
