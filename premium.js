/* GIANT TRADERS ACADEMY — premium.js
   Vanilla, dependency-free. Adds: cursor spotlight, hero word reveal,
   and a consistent risk disclosure above every footer. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Cursor spotlight — sets --mx/--my on cards (premium.css paints it) */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    var sel = '.course-card,.change-card,.pnl-card,.how-step,.stat-cell,.faq-item,.testi-card';
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest(sel);
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* 2. Hero headline: split into words for the one-time load reveal.
        Keeps existing <br> and <span> accents intact. */
  var h1 = document.querySelector('.hero-inner h1');
  if (h1 && !reduce) {
    var i = 0;
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span');
            s.className = 'pw'; s.style.setProperty('--i', i++); s.textContent = w;
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { wrap(n); }
      });
    })(h1);
  }

  /* 3. Risk disclosure — one source of truth, injected before any footer.
        Wording reflects the site's own Terms (educational, not SEBI-registered). */
  var footer = document.querySelector('footer');
  if (footer && !document.querySelector('.gta-risk')) {
    var s = document.createElement('section');
    s.className = 'gta-risk';
    s.setAttribute('aria-label', 'Risk disclosure');
    s.innerHTML =
      '<div class="container"><strong>Risk disclosure</strong>' +
      '<p>Giant Traders Academy provides trading education only. We are not a SEBI-registered investment adviser or research analyst, ' +
      'and nothing on this site is investment advice, a recommendation or a trading signal. Trading in options, futures and forex ' +
      'involves substantial risk, and most retail traders lose money. Past results of any individual do not indicate future performance, ' +
      'and no outcome is guaranteed. Any figures shown are illustrative or self-reported. Trade only with money you can afford to lose.</p></div>';
    footer.parentNode.insertBefore(s, footer);
  }
})();


/* ═══════════════════════════════════════════════════════════════
   TEXT MOTION PACK (v2)
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* Hero rotator is content, so it exists even with reduced motion (static first word). */
  var cta = document.querySelector('.hero-cta-group');
  if (cta && !document.querySelector('.hero-rotator')) {
    var words = ['Nifty', 'Bank Nifty', 'Nasdaq', 'Gold', 'Sensex'];
    var p = document.createElement('p');
    p.className = 'hero-rotator';
    p.innerHTML = 'Learn to trade <span class="rot">' +
      words.map(function (w, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '>' + w + '</span>'; }).join('') +
      '</span> with pure number logic.';
    cta.parentNode.insertBefore(p, cta);
    if (!reduce) {
      var items = p.querySelectorAll('.rot > span'), cur = 0;
      setInterval(function () {
        if (document.hidden) return;
        var prev = items[cur]; cur = (cur + 1) % items.length;
        prev.classList.remove('on'); prev.classList.add('off');
        items[cur].classList.remove('off'); items[cur].classList.add('on');
        setTimeout(function () { prev.classList.remove('off'); }, 650);
      }, 2200);
    }
  }

  if (reduce) return;
  root.classList.add('js-motion');

  /* helper: wrap every word (keeps <br> and nested tags) */
  function wrapWords(el, make) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            frag.appendChild(make(w, i++));
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    })(el);
    return i;
  }

  /* 3 · Section titles: masked word rise when scrolled into view */
  var titles = document.querySelectorAll('section h2, .section-title, .page-hero h1');
  var tio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('tm-in'); tio.unobserve(e.target); } });
  }, { threshold: 0.25 });
  Array.prototype.forEach.call(titles, function (h) {
    if (h.closest('.hero-inner') || h.closest('footer') || h.querySelector('.sw')) return;
    wrapWords(h, function (w, i) {
      var o = document.createElement('span'); o.className = 'sw';
      var n = document.createElement('span'); n.className = 'swi'; n.style.setProperty('--i', i); n.textContent = w;
      o.appendChild(n); return o;
    });
    tio.observe(h);
  });

  /* 4 · Scroll-linked word fill on lead paragraphs + founder quote */
  var leads = [];
  Array.prototype.forEach.call(document.querySelectorAll('.section-sub, .founder-quote, .page-hero p'), function (el) {
    if (el.textContent.trim().length < 40 || el.closest('.hero-inner')) return;
    var spans = [];
    wrapWords(el, function (w) { var s = document.createElement('span'); s.className = 'sf'; s.textContent = w; spans.push(s); return s; });
    spans.forEach(function (s) { s.style.opacity = 0.22; });
    leads.push({ el: el, spans: spans });
  });
  var ticking = false;
  function fill() {
    ticking = false;
    var vh = window.innerHeight;
    leads.forEach(function (L) {
      var r = L.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh) return;
      var p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.42 + r.height * 0.5)));
      var n = L.spans.length;
      L.spans.forEach(function (s, i) {
        var o = 0.22 + 0.78 * Math.min(1, Math.max(0, p * (n + 4) - i));
        if (s._o !== o) { s._o = o; s.style.opacity = o.toFixed(2); }
      });
    });
  }
  if (leads.length) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(fill); } }, { passive: true });
    window.addEventListener('resize', fill);
    fill();
  }

  /* 5 · Decode scramble: hero tagline on load, eyebrows on scroll */
  var GLYPHS = '01▲▼+−%₹#/';
  function decode(el) {
    var final = el.textContent, len = final.length, t0 = performance.now(), dur = 900 + len * 12;
    el.classList.add('decode');
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur), out = '';
      for (var i = 0; i < len; i++) {
        var c = final[i];
        out += (/\s/.test(c) || i < p * len) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
    })(t0);
  }
  var tag = document.querySelector('.hero-tagline');
  if (tag && tag.children.length === 0) setTimeout(function () { decode(tag); }, 900);
  var eyes = document.querySelectorAll('.eyebrow');
  var eio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && e.target.children.length === 0) { decode(e.target); }
      if (e.isIntersecting) eio.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  Array.prototype.forEach.call(eyes, function (el) { eio.observe(el); });
})();
