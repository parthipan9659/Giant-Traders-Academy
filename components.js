/* ═══════════════════════════════════════════════════════════
   COMPONENTS.JS — Giant Traders Academy
   Single source of truth for nav, footer, announce bar.
   Edit here → updates every page automatically.
═══════════════════════════════════════════════════════════ */

const GTA = {
  phone1: '6381384612',
  phone2: '9659448833',
  phone3: '7200899334',
  whatsapp: 'https://wa.me/916381384612',
  waChannel: 'https://whatsapp.com/channel/0029Vb50KlADuMRbUzdKF63t',
  telegram: 'https://t.me/+8wYYePjfWYplOTQ1',
  instagram: 'https://www.instagram.com/giant_traders_/',
  youtube: 'https://www.youtube.com/@gianttradersacademy1',
  maps: 'https://maps.app.goo.gl/gianttraders',
  students: '500+',
  founded: '2015',
  experience: '8+',
  indices: '5',
  winRate: '73%',
  updateDays: '600',
};

/* ── ANNOUNCE BAR ── */
function renderAnnounceBar() {
  if (document.getElementById('announceBar')) return; // already exists in HTML
  const bar = document.createElement('div');
  bar.id = 'announceBar';
  bar.style.cssText = `
    background: linear-gradient(90deg,#1a0800,#0d0500,#1a0800);
    border-bottom: 1px solid rgba(245,200,66,0.2);
    padding: 9px 0; text-align: center; position: relative;
    font-family: 'JetBrains Mono',monospace; font-size: 11px;
    color: rgba(245,200,66,0.88); letter-spacing: 0.5px; z-index: 1001;
  `;
  bar.innerHTML = `
    🔥 <strong>SPECIAL OFFER:</strong> Index Options Pro at ₹30,000 &nbsp;·&nbsp;
    Nifty Masterclass — Only 2 seats left &nbsp;·&nbsp;
    <a href="index.html" style="color:#F5A623;text-decoration:underline;font-weight:700;">See All Programs →</a>
    <button onclick="this.parentElement.style.display='none'" style="
      position:absolute;right:14px;top:50%;transform:translateY(-50%);
      background:none;border:none;color:rgba(245,200,66,0.4);font-size:16px;cursor:pointer;
    ">×</button>
  `;
  document.body.insertBefore(bar, document.body.firstChild);
}

/* ── NAV ── */
function renderNav(activePage) {
  if (document.getElementById('mainNav')) return;
  const pages = [
    { href: 'index.html', label: 'Home' },
    { href: 'course-details.html', label: 'Courses' },
    { href: 'about.html', label: 'About' },
    { href: 'testimonials.html', label: 'Reviews' },
    { href: 'results.html', label: 'Results' },
    { href: 'faq.html', label: 'FAQ' },
    { href: 'contact.html', label: 'Contact' },
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}"${p.href === activePage ? ' class="active"' : ''}>${p.label}</a></li>`
  ).join('');
  const mobileLinks = pages.map(p =>
    `<a href="${p.href}"${p.href === activePage ? ' class="active"' : ''}>${p.label}</a>`
  ).join('');

  const nav = document.createElement('nav');
  nav.id = 'mainNav';
  nav.innerHTML = `
    <a href="index.html" class="logo">
      <img src="logo.png" alt="GTA" class="logo-img">
      <div class="logo-text"><span class="lt-main">Giant Traders</span><span class="lt-sub">ACADEMY</span></div>
    </a>
    <ul class="nav-links">${links}</ul>
    <div class="nav-right">
      <div class="nav-phone">📞 <b>${GTA.phone1}</b></div>
      <button class="nav-cta" onclick="location.href='checkout.html'">Enroll Now →</button>
    </div>
    <div class="nav-toggle" id="navToggle"><span></span><span></span><span></span></div>
  `;

  const mob = document.createElement('div');
  mob.className = 'nav-mobile';
  mob.id = 'mobileNav';
  mob.innerHTML = mobileLinks + `<a href="checkout.html" class="nav-cta">Enroll Now →</a>`;

  // Insert after announce bar
  const bar = document.getElementById('announceBar');
  if (bar && bar.nextSibling) {
    document.body.insertBefore(nav, bar.nextSibling);
    document.body.insertBefore(mob, nav.nextSibling);
  } else {
    document.body.prepend(mob);
    document.body.prepend(nav);
  }
}

/* ── FOOTER ── */
function renderFooter() {
  if (document.querySelector('.site-footer')) return;
  const f = document.createElement('footer');
  f.className = 'site-footer';
  f.innerHTML = `
    <div class="footer-social-bar">
      <div class="fsb-inner">
        <span class="fsb-label">Follow &amp; Join</span>
        <div class="fsb-icons">
          <a href="${GTA.whatsapp}" target="_blank" class="fsb-icon fsb-wa">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2C8.27 2 2 8.27 2 16c0 2.45.65 4.75 1.78 6.74L2 30l7.45-1.76A13.92 13.92 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="${GTA.waChannel}" target="_blank" class="fsb-icon fsb-wa">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2C8.27 2 2 8.27 2 16c0 2.45.65 4.75 1.78 6.74L2 30l7.45-1.76A13.92 13.92 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2z"/></svg>
            <span>WA Channel</span>
          </a>
          <a href="${GTA.telegram}" target="_blank" class="fsb-icon fsb-tg">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm6.84 9.56l-2.37 11.16c-.18.79-.64.98-1.3.61l-3.6-2.65-1.73 1.67c-.19.19-.35.35-.72.35l.26-3.64 6.65-6.01c.29-.26-.06-.4-.45-.14l-8.22 5.18-3.54-1.11c-.77-.24-.78-.77.16-1.14l13.84-5.34c.64-.23 1.2.16.99 1.06z"/></svg>
            <span>Telegram</span>
          </a>
          <a href="${GTA.instagram}" target="_blank" class="fsb-icon fsb-ig">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 7.78a8.22 8.22 0 100 16.44A8.22 8.22 0 0016 7.78zm8.54-5.62a1.92 1.92 0 100 3.84 1.92 1.92 0 000-3.84zM16 0C7.16 0 0 7.16 0 16s7.16 16 16 16 16-7.16 16-16S24.84 0 16 0z"/></svg>
            <span>Instagram</span>
          </a>
          <a href="${GTA.youtube}" target="_blank" class="fsb-icon fsb-yt">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M29.41 9.26a3.5 3.5 0 00-2.46-2.47C24.76 6.2 16 6.2 16 6.2s-8.76 0-10.95.59A3.5 3.5 0 002.59 9.26C2 11.45 2 16 2 16s0 4.55.59 6.74a3.5 3.5 0 002.46 2.47C7.24 25.8 16 25.8 16 25.8s8.76 0 10.95-.59a3.5 3.5 0 002.46-2.47C30 20.55 30 16 30 16s0-4.55-.59-6.74zm-17.91 9.63V13.1L21.5 16l-10 2.89z"/></svg>
            <span>YouTube</span>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-main">
      <div class="footer-brand">
        <div class="footer-logo-wrap">
          <img src="logo.png" alt="GTA" class="footer-logo-img">
          <div><span class="flt-main">Giant Traders</span><span class="flt-sub">ACADEMY</span></div>
        </div>
        <p class="footer-desc">India's most structured Index Options program. Pure number logic — no charts, no indicators. Founded by Parthipan M, Tamil Nadu.</p>
        <a href="${GTA.maps}" target="_blank" class="footer-maps-card">
          <div class="fmc-icon"><svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10zm0 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg></div>
          <div><div class="fmc-title">Visit Us</div><div class="fmc-addr">Tamil Nadu, India</div></div>
          <div class="fmc-arr">→</div>
        </a>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Programs</span>
        <ul class="footer-links">
          <li><a href="course-details.html">Index Options Pro</a></li>
          <li><a href="course-details.html">Stock Options Course</a></li>
          <li><a href="nifty-masterclass.html">Nifty Masterclass</a></li>
          <li><a href="results.html">P&amp;L Results</a></li>
          <li><a href="checkout.html">Enroll Now</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Support</span>
        <ul class="footer-links">
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="about.html">About Parthipan</a></li>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms of Service</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Contact</span>
        <ul class="footer-links">
          <li><a href="tel:+91${GTA.phone1}">📞 ${GTA.phone1}</a></li>
          <li><a href="tel:+91${GTA.phone2}">📞 ${GTA.phone2}</a></li>
          <li><a href="tel:+91${GTA.phone3}">📞 ${GTA.phone3}</a></li>
          <li><a href="${GTA.whatsapp}" target="_blank">💬 WhatsApp Now</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="fb-left">
        <span>© 2026 Giant Traders Academy</span>
        <span class="fb-sep">·</span>
        <span>Tamil Nadu, India</span>
        <span class="fb-sep">·</span>
        <a href="privacy-policy.html">Privacy</a>
        <span class="fb-sep">·</span>
        <a href="terms.html">Terms</a>
      </div>
      <div class="fb-right">Taught by traders · Built for discipline.</div>
    </div>
  `;
  document.body.appendChild(f);
}

/* ── SHARED BEHAVIOURS (all pages) ── */
function initShared() {
  // Nav scroll shrink
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () =>
      nav.classList.toggle('scrolled', window.scrollY > 60), {passive:true});
  }

  // Mobile nav toggle
  const tog = document.getElementById('navToggle');
  const mob = document.getElementById('mobileNav');
  if (tog && mob) {
    tog.addEventListener('click', () => {
      const isOpen = mob.classList.toggle('open');
      tog.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mob.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mob.classList.remove('open');
        tog.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Scroll reveals
  const reveals = document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.section-enter-blur');
  if (reveals.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const d = +e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('vis'), d);
        obs.unobserve(e.target);
      });
    }, {threshold: 0.08});
    reveals.forEach(el => obs.observe(el));
  }

  // Stat counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const target = +el.dataset.count, sfx = el.dataset.suffix || '';
      const dur = 1800, t0 = Date.now();
      (function tick() {
        const p = Math.min((Date.now()-t0)/dur, 1);
        const ease = 1 - Math.pow(1-p, 4);
        el.textContent = Math.round(target * ease) + sfx;
        if (p < 1) requestAnimationFrame(tick);
      })();
      obs.unobserve(el);
    }, {threshold: 0.5});
    obs.observe(el);
  });

  // FAQ accordion — works with semantic <button class="faq-q" aria-expanded="...">
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      const group = item.closest('.faq-list, .faq-group') || item.parentElement;
      // Close all FAQ items within the same group (accordion behaviour)
      group.querySelectorAll(':scope > .faq-item').forEach(i => {
        i.classList.remove('open');
        const btn = i.querySelector('.faq-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Countdown timer
  const hasTimer = document.getElementById('cdS') || document.getElementById('cdSecs');
  if (hasTimer) {
    const end = new Date();
    end.setDate(end.getDate() + 2);
    end.setHours(end.getHours() + 14, 37, 0, 0);
    const pad = n => String(Math.max(0,n)).padStart(2,'0');
    function tick() {
      const d = end - Date.now();
      if (d <= 0) return;
      const IDs = {
        D: Math.floor(d/86400000),
        H: Math.floor((d%86400000)/3600000),
        M: Math.floor((d%3600000)/60000),
        S: Math.floor((d%60000)/1000),
      };
      [['cdD','cdDays'],['cdH','cdHours'],['cdM','cdMins'],['cdS','cdSecs']].forEach(([a,b],i) => {
        const val = pad(Object.values(IDs)[i]);
        [a,b].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = val; });
      });
    }
    tick(); setInterval(tick, 1000);
  }

  // Scroll progress bar
  const prog = document.getElementById('scrollProg') || document.getElementById('scrollProgress');
  if (prog) {
    window.addEventListener('scroll', () => {
      prog.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    }, {passive:true});
  }

  // Page hero bg video lazy play
  document.querySelectorAll('.page-hero-bgvid, .bgvid-video, #heroBgVid').forEach(vid => {
    vid.muted = true;
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      if (vid.readyState === 0) vid.load();
      vid.play().catch(() => {
        ['click','scroll','touchstart'].forEach(ev =>
          document.addEventListener(ev, () => vid.play().catch(()=>{}), {once:true})
        );
      });
      obs.unobserve(vid);
    }, {threshold: 0.05, rootMargin: '300px'});
    obs.observe(vid);
  });

  // Scroll-to-top button
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.style.cssText = 'position:fixed;bottom:88px;right:24px;z-index:997;width:44px;height:44px;border-radius:50%;background:rgba(13,18,35,0.92);border:1px solid rgba(255,255,255,0.12);color:#F5A623;font-size:18px;cursor:pointer;opacity:0;transition:opacity 0.3s;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);pointer-events:none;';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }, {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Page transition
  const overlay = document.querySelector('.page-transition');
  if (overlay) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('tel:') || href.startsWith('mailto:') ||
          a.target === '_blank') return;
      a.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('in');
        setTimeout(() => window.location.href = href, 300);
      });
    });
    window.addEventListener('pageshow', () => overlay.classList.remove('in','active'));
  }
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
