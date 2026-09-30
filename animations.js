/* ╔══════════════════════════════════════════════════════════════════
   ║  GIANT TRADERS ACADEMY — animations.js
   ║  Drop-in animation engine. Pure vanilla JS. Zero dependencies.
   ║  All animations GPU-accelerated via transform + opacity only.
   ╚══════════════════════════════════════════════════════════════════

   USAGE:
     <link rel="stylesheet" href="animations.css">
     <script defer src="animations.js"></script>

   The script self-initialises on DOMContentLoaded.
   ══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── REDUCED MOTION CHECK ── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ── HELPER: throttle ── */
  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) { last = now; fn.apply(this, args); }
    };
  }

  /* ── HELPER: RAF queue ── */
  function rafBatch(fn) {
    let queued = false;
    return function () {
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => { queued = false; fn(); });
      }
    };
  }

  /* ═══════════════════════════════════════════════════════════════
     1. SCROLL PROGRESS BAR
  ═══════════════════════════════════════════════════════════════ */
  function initScrollBar() {
    const bar = document.createElement('div');
    bar.id = 'gta-scroll-bar';
    document.body.prepend(bar);

    const update = rafBatch(() => {
      const pct = window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100).toFixed(1) + '%';
    });
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     2. SCROLL REVEAL — IntersectionObserver
     Triggers .gta-reveal, .gta-reveal-l, .gta-reveal-r, .gta-reveal-scale
  ═══════════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const selector = '.gta-reveal,.gta-reveal-l,.gta-reveal-r,.gta-reveal-scale';
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('gta-vis'), delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el) => obs.observe(el));

    /* Handle data-stagger parents */
    document.querySelectorAll('[data-stagger="true"]').forEach((parent) => {
      parent.querySelectorAll(selector).forEach((child, i) => {
        child.dataset.delay = (child.dataset.delay
          ? parseInt(child.dataset.delay) : 0) + i * 80;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     3. STAT COUNTER ANIMATION
     Targets [data-count] elements
  ═══════════════════════════════════════════════════════════════ */
  function initStatCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur    = prefersReducedMotion ? 0 : 1800;
        const decimals = (el.dataset.count.includes('.')) ? 1 : 0;
        const t0     = performance.now();

        function tick(now) {
          const p    = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 4); /* ease-out-quart */
          const val  = (target * ease).toFixed(decimals);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach((el) => obs.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════════
     4. 3D CARD TILT
     Targets .gta-card-tilt elements
  ═══════════════════════════════════════════════════════════════ */
  function initCardTilt() {
    if (prefersReducedMotion) return;
    const cards = document.querySelectorAll('.gta-card-tilt');
    if (!cards.length) return;

    cards.forEach((card) => {
      function onMove(e) {
        const r    = card.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const mx   = (e.clientX ?? e.touches?.[0]?.clientX ?? cx) - cx;
        const my   = (e.clientY ?? e.touches?.[0]?.clientY ?? cy) - cy;
        const rotX = -(my / (r.height / 2)) * 7;
        const rotY =  (mx / (r.width  / 2)) * 7;
        card.style.transform =
          `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      }
      function onLeave() {
        card.style.transform = '';
      }

      card.addEventListener('mousemove', throttle(onMove, 16));
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('touchend', onLeave);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     5. ANIMATED CANDLESTICK CHART (Canvas)

     HTML usage:
       <div class="gta-candle-wrap" style="height:220px">
         <canvas class="gta-candle-canvas" data-speed="1.2"></canvas>
       </div>
  ═══════════════════════════════════════════════════════════════ */
  function initCandleCharts() {
    if (prefersReducedMotion) return;
    const canvases = document.querySelectorAll('.gta-candle-canvas');
    if (!canvases.length) return;

    canvases.forEach((canvas) => {
      const speed  = parseFloat(canvas.dataset.speed || 1);
      let   animId = null;
      let   active = false;

      /* ── Colour palette ── */
      const COL = {
        bull: '#00d68f',
        bear: '#ff4757',
        bullFill: 'rgba(0,214,143,0.75)',
        bearFill: 'rgba(255,71,87,0.75)',
        wick:  'rgba(255,255,255,0.3)',
        grid:  'rgba(255,255,255,0.04)',
        vol:   'rgba(245,200,66,0.12)',
        ma:    'rgba(0,229,176,0.55)',
        text:  'rgba(180,192,215,0.55)',
      };

      /* ── Generate realistic-looking candle data ── */
      function makeCandles(n) {
        const out = [];
        let   p   = 22400 + Math.random() * 400;
        for (let i = 0; i < n; i++) {
          const dir    = Math.random() > 0.46 ? 1 : -1;
          const body   = Math.random() * 80 + 10;
          const open   = p;
          const close  = p + dir * body;
          const high   = Math.max(open, close) + Math.random() * 40;
          const low    = Math.min(open, close) - Math.random() * 40;
          const vol    = 0.3 + Math.random() * 0.7;
          out.push({ open, close, high, low, vol, bull: close >= open });
          p = close;
        }
        return out;
      }

      let data    = makeCandles(42);
      let offset  = 0;

      /* ── Draw one frame ── */
      function draw() {
        const dpr  = window.devicePixelRatio || 1;
        const W    = canvas.offsetWidth;
        const H    = canvas.offsetHeight;

        /* Resize if needed */
        if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
          canvas.width  = W * dpr;
          canvas.height = H * dpr;
        }

        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        const visN   = Math.min(32, Math.floor(W / 18));
        const start  = Math.floor(offset) % data.length;
        const slice  = [];
        for (let i = 0; i < visN; i++) {
          slice.push(data[(start + i) % data.length]);
        }

        /* Price range for this slice */
        const highs = slice.map(c => c.high);
        const lows  = slice.map(c => c.low);
        const pMin  = Math.min(...lows)  - 20;
        const pMax  = Math.max(...highs) + 20;
        const pRange = pMax - pMin;

        const padT  = 18;
        const padB  = 32;
        const padL  = 4;
        const plotH = H - padT - padB;

        function py(price) {
          return padT + (1 - (price - pMin) / pRange) * plotH;
        }

        const cW    = (W - padL) / visN;
        const cPad  = cW * 0.18;
        const bW    = cW - cPad * 2;

        /* Volume bars (bottom) */
        const maxVol = Math.max(...slice.map(c => c.vol));
        slice.forEach((c, i) => {
          const x   = padL + i * cW + cPad;
          const vH  = (c.vol / maxVol) * 28;
          ctx.fillStyle = c.bull ? 'rgba(0,214,143,0.1)' : 'rgba(255,71,87,0.08)';
          ctx.fillRect(x, H - padB - vH, bW, vH);
        });

        /* Grid lines (price) */
        const steps = 4;
        ctx.strokeStyle = COL.grid;
        ctx.lineWidth   = 1;
        for (let i = 1; i < steps; i++) {
          const y = padT + (plotH / steps) * i;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();

          /* Price label */
          const price = pMax - (pRange / steps) * i;
          ctx.fillStyle = COL.text;
          ctx.font      = `700 8px JetBrains Mono, monospace`;
          ctx.textAlign = 'right';
          ctx.fillText(price.toFixed(0), W - 4, y - 3);
        }

        /* Moving average line */
        const maPeriod = 8;
        const maData   = [];
        for (let i = maPeriod - 1; i < slice.length; i++) {
          const avg = slice.slice(i - maPeriod + 1, i + 1)
            .reduce((s, c) => s + (c.open + c.close) / 2, 0) / maPeriod;
          maData.push({ i, avg });
        }
        if (maData.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = COL.ma;
          ctx.lineWidth   = 1.5;
          ctx.lineJoin    = 'round';
          maData.forEach((pt, idx) => {
            const x = padL + pt.i * cW + cW / 2;
            const y = py(pt.avg);
            idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.stroke();
        }

        /* Candles */
        slice.forEach((c, i) => {
          const x  = padL + i * cW;
          const mx = x + cW / 2;

          /* Wick */
          ctx.strokeStyle = COL.wick;
          ctx.lineWidth   = 1.2;
          ctx.beginPath();
          ctx.moveTo(mx, py(c.high));
          ctx.lineTo(mx, py(c.low));
          ctx.stroke();

          /* Body */
          const oY = py(c.open);
          const cY = py(c.close);
          const bY = Math.min(oY, cY);
          const bH = Math.max(Math.abs(oY - cY), 1.5);

          ctx.fillStyle = c.bull ? COL.bullFill : COL.bearFill;
          ctx.strokeStyle = c.bull ? COL.bull : COL.bear;
          ctx.lineWidth = 1;

          /* Rounded rectangle for body */
          const r = Math.min(2, bW / 4);
          ctx.beginPath();
          ctx.roundRect
            ? ctx.roundRect(x + cPad, bY, bW, bH, r)
            : ctx.rect(x + cPad, bY, bW, bH);
          ctx.fill();
          ctx.stroke();
        });

        /* "NIFTY" label */
        ctx.fillStyle   = 'rgba(245,200,66,0.4)';
        ctx.font        = '700 9px JetBrains Mono, monospace';
        ctx.textAlign   = 'left';
        ctx.fillText('NIFTY  ·  LIVE', 8, H - 8);

        /* Latest price tag */
        const last  = slice[slice.length - 1];
        const lastY = py(last.close);
        const pTag  = last.close.toFixed(0);
        ctx.fillStyle = last.bull ? COL.bull : COL.bear;
        ctx.fillRect(W - 52, lastY - 9, 50, 16);
        ctx.fillStyle = '#000';
        ctx.font      = '700 8px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(pTag, W - 27, lastY + 3);

        /* Advance offset for scroll effect */
        offset += speed * 0.012;
      }

      /* ── Lazy: only animate when visible ── */
      const visObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!active) {
              active = true;
              (function loop() {
                draw();
                animId = requestAnimationFrame(loop);
              })();
            }
          } else {
            active = false;
            cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.1 });

      visObs.observe(canvas);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     6. FLOATING NUMBER PARTICLES
     Inject into any container with class="gta-particle-field"
     data-count="12"  (number of particles, default 10)
     data-color="#f5c842" (optional)
  ═══════════════════════════════════════════════════════════════ */
  function initNumberParticles() {
    if (prefersReducedMotion) return;
    const fields = document.querySelectorAll('.gta-particle-field');
    if (!fields.length) return;

    const NUMS   = ['22541','48210','73%','₹30k','21380','0.618','100','83.9%',
                    '5','9','22','1:3','500+','ATM','PUT','CALL','ENTRY','SL'];
    const COLORS = ['rgba(245,200,66,VAR)','rgba(0,229,176,VAR)','rgba(0,214,143,VAR)'];

    fields.forEach((field) => {
      const count = parseInt(field.dataset.count || 10, 10);
      field.style.position = 'relative';
      field.style.overflow = 'hidden';

      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className  = 'gta-num-particle';
        el.textContent = NUMS[Math.floor(Math.random() * NUMS.length)];

        const left    = Math.random() * 92 + 4;
        const top     = Math.random() * 80 + 10;
        const size    = Math.random() * 7 + 8;
        const dur     = Math.random() * 8 + 6;
        const delay   = Math.random() * -14;
        const opacity = (Math.random() * 0.3 + 0.15).toFixed(2);
        const colTpl  = COLORS[Math.floor(Math.random() * COLORS.length)];
        const color   = colTpl.replace('VAR', opacity);

        Object.assign(el.style, {
          left:     left + '%',
          top:      top  + '%',
          fontSize: size + 'px',
          color:    color,
          '--dur':  dur + 's',
          '--delay': delay + 's',
          animationDuration:  dur + 's',
          animationDelay:     delay + 's',
        });
        field.appendChild(el);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     7. LAZY VIDEO EMBEDS
     Targets .gta-video-embed[data-src="..."]
     Replaces div with iframe on click.
  ═══════════════════════════════════════════════════════════════ */
  function initVideoEmbeds() {
    const embeds = document.querySelectorAll('.gta-video-embed[data-src]');
    if (!embeds.length) return;

    /* Lazy-load thumbnails via IntersectionObserver */
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const thumb = el.dataset.thumb;
        if (thumb) {
          const img       = document.createElement('img');
          img.className   = 'gta-video-embed-thumb';
          img.src         = thumb;
          img.alt         = el.dataset.title || 'Student testimonial video';
          img.loading     = 'lazy';
          img.decoding    = 'async';
          el.prepend(img);
        }
        imgObs.unobserve(el);
      });
    }, { rootMargin: '400px' });

    embeds.forEach((embed) => {
      imgObs.observe(embed);

      /* Add play button if not already present */
      if (!embed.querySelector('.gta-video-play')) {
        const btn = document.createElement('div');
        btn.className = 'gta-video-play';
        btn.setAttribute('aria-label', 'Play video');
        btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5v14l11-7z"/>
        </svg>`;
        embed.appendChild(btn);
      }

      /* Title overlay */
      const title = embed.dataset.title;
      if (title && !embed.querySelector('.gta-video-title')) {
        const tEl = document.createElement('div');
        tEl.className = 'gta-video-title';
        tEl.textContent = title;
        Object.assign(tEl.style, {
          position:  'absolute', bottom: '12px', left: '12px',
          zIndex:    '2', color: '#fff', fontSize: '12px',
          fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif',
          textShadow: '0 1px 8px rgba(0,0,0,0.8)',
          padding:   '4px 8px', background: 'rgba(0,0,0,0.4)',
          borderRadius: '6px',
        });
        embed.appendChild(tEl);
      }

      /* Click → inject iframe */
      embed.addEventListener('click', function onClick() {
        embed.removeEventListener('click', onClick);
        const src      = embed.dataset.src;
        const autoSrc  = src.includes('?')
          ? src + '&autoplay=1&rel=0'
          : src + '?autoplay=1&rel=0';

        embed.classList.add('loading');
        const iframe  = document.createElement('iframe');
        iframe.src    = autoSrc;
        iframe.allow  = 'autoplay; fullscreen; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title  = embed.dataset.title || 'Video';
        iframe.onload = () => embed.classList.remove('loading');

        /* Fade out thumbnail + play btn */
        const thumb = embed.querySelector('.gta-video-embed-thumb');
        const play  = embed.querySelector('.gta-video-play');
        const titleEl = embed.querySelector('.gta-video-title');
        [thumb, play, titleEl].forEach(el => {
          if (el) { el.style.transition = 'opacity 0.3s'; el.style.opacity = '0'; }
        });
        setTimeout(() => {
          [thumb, play, titleEl].forEach(el => el?.remove());
          embed.appendChild(iframe);
          embed.classList.remove('loading');
        }, 300);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     8. TYPING EFFECT
     Targets .gta-typing[data-words='["word1","word2"]']
  ═══════════════════════════════════════════════════════════════ */
  function initTyping() {
    if (prefersReducedMotion) return;
    const els = document.querySelectorAll('.gta-typing[data-words]');
    if (!els.length) return;

    els.forEach((el) => {
      let words;
      try { words = JSON.parse(el.dataset.words); } catch { return; }
      if (!words.length) return;

      let wi = 0, ci = 0, deleting = false;
      const speed = { type: 80, del: 40, pause: 1800 };

      function tick() {
        const word = words[wi % words.length];
        if (deleting) {
          ci--;
          el.textContent = word.slice(0, ci);
          if (ci === 0) { deleting = false; wi++; setTimeout(tick, 400); return; }
          setTimeout(tick, speed.del);
        } else {
          ci++;
          el.textContent = word.slice(0, ci);
          if (ci === word.length) {
            deleting = true;
            setTimeout(tick, speed.pause);
            return;
          }
          setTimeout(tick, speed.type);
        }
      }
      tick();
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     9. GLOW NUMBER ELEMENTS
     Targets .gta-glow-num-val — mirrors data-text for CSS ::before
  ═══════════════════════════════════════════════════════════════ */
  function initGlowNumbers() {
    document.querySelectorAll('.gta-glow-num-val').forEach((el) => {
      el.dataset.text = el.textContent;
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     10. HERO VIDEO — auto play + slow zoom
     Targets video.gta-hero-vid
  ═══════════════════════════════════════════════════════════════ */
  function initHeroVideo() {
    const vids = document.querySelectorAll('video.gta-hero-vid');
    if (!vids.length) return;

    vids.forEach((vid) => {
      vid.muted    = true;
      vid.playsInline = true;

      function tryPlay() {
        vid.play().catch(() => {
          ['click','touchstart','scroll'].forEach(ev =>
            document.addEventListener(ev, () => vid.play().catch(() => {}), { once: true })
          );
        });
      }

      if (vid.readyState >= 2) { tryPlay(); }
      else { vid.addEventListener('canplay', tryPlay, { once: true }); }

      /* Pause video when tab hidden */
      document.addEventListener('visibilitychange', () => {
        document.hidden ? vid.pause() : vid.play().catch(() => {});
      });

      /* Slow cinematic zoom — increments scale via style so CSS handles GPU */
      if (!prefersReducedMotion) {
        let scale = 1.04;
        let active = true;
        (function zoom() {
          if (!active) return;
          if (scale < 1.10) scale += 0.00006;
          vid.style.transform = `scale(${scale})`;
          requestAnimationFrame(zoom);
        })();

        /* Pause zoom when out of view */
        new IntersectionObserver((entries) => {
          active = entries[0].isIntersecting;
        }).observe(vid);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     11. SPOTLIGHT CURSOR EFFECT
     Add class="gta-spotlight" to a section to enable
  ═══════════════════════════════════════════════════════════════ */
  function initSpotlight() {
    if (prefersReducedMotion) return;
    const sections = document.querySelectorAll('.gta-spotlight');
    if (!sections.length) return;

    sections.forEach((section) => {
      const spot = document.createElement('div');
      Object.assign(spot.style, {
        position:      'absolute',
        inset:         '0',
        pointerEvents: 'none',
        zIndex:        '1',
        borderRadius:  'inherit',
        transition:    'background 0.1s',
      });
      section.style.position = section.style.position || 'relative';
      section.prepend(spot);

      section.addEventListener('mousemove', throttle((e) => {
        const r = section.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
        const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
        spot.style.background =
          `radial-gradient(550px circle at ${x}% ${y}%, rgba(245,200,66,0.055), transparent 60%)`;
      }, 20));
      section.addEventListener('mouseleave', () => {
        spot.style.background = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT ALL
  ═══════════════════════════════════════════════════════════════ */
  function init() {
    initScrollBar();
    initScrollReveal();
    initStatCounters();
    initCardTilt();
    initCandleCharts();
    initNumberParticles();
    initVideoEmbeds();
    initTyping();
    initGlowNumbers();
    initHeroVideo();
    initSpotlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
