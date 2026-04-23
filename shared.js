/* ═══════════════════════════════════════════════════
   GIANT TRADERS ACADEMY — shared.js  v5 CLEAN
═══════════════════════════════════════════════════ */

const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelector(sel);
const $a = sel => document.querySelectorAll(sel);


/* ── SCROLL PROGRESS ── */
(function(){
  const bar = $('scrollProg');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, {passive: true});
})();

/* ── MAGNETIC BUTTONS ── */
$a('.btn-gold,.btn-ghost,.enroll-btn,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.18;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.18;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
});

/* ── NAV SCROLL SHRINK ── */
(function(){
  const nav = $('mainNav');
  if(!nav) return;
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, {passive: true});
})();

/* ── MOBILE NAV ── */
(function(){
  const tog = $('navToggle'), mob = $('mobileNav');
  if(!tog || !mob) return;
  tog.addEventListener('click', ()=>{
    const open = mob.classList.toggle('open');
    const sp   = tog.querySelectorAll('span');
    if(sp[0] && sp[1] && sp[2]){
      if(open){
        sp[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        sp[1].style.opacity   = '0';
        sp[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        sp[0].style.transform = sp[2].style.transform = '';
        sp[1].style.opacity   = '';
      }
    }
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
    mob.classList.remove('open');
    tog.querySelectorAll('span').forEach(s=>{ s.style.transform = ''; s.style.opacity = ''; });
  }));
})();

/* ── SCROLL REVEALS ── */
(function(){
  const els = $a('.reveal,.reveal-left,.reveal-right,.reveal-scale,.section-enter-blur');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const d = +e.target.dataset.delay || 0;
      setTimeout(()=>{
        e.target.classList.add('vis');
      }, d);
      obs.unobserve(e.target);
    });
  }, {threshold: 0.08});
  els.forEach(el => obs.observe(el));
})();

/* ── FAQ ACCORDION ── */
$a('.faq-q').forEach(q=>{
  q.addEventListener('click', ()=>{
    const item = q.parentElement;
    if(!item) return;
    $a('.faq-item').forEach(f=>{ if(f !== item) f.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

/* ── STAT COUNTERS ── */
$a('[data-count]').forEach(el=>{
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const target = +e.target.dataset.count;
      const sfx    = e.target.dataset.suffix || '';
      const dur    = 1800;
      const t0     = Date.now();
      (function tick(){
        const p    = Math.min((Date.now() - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        e.target.textContent = Math.round(target * ease) + sfx;
        if(p < 1) requestAnimationFrame(tick);
      })();
      obs.unobserve(e.target);
    });
  }, {threshold: 0.5});
  obs.observe(el);
});

/* ── COUNTDOWN TIMER ── */
(function(){
  const hasTimer = $('cdS') || $('cdSecs') || $('cdDays');
  if(!hasTimer) return;
  const end = new Date();
  end.setDate(end.getDate() + 2);
  end.setHours(end.getHours() + 14, end.getMinutes() + 37, 0, 0);
  const pad = n => String(n).padStart(2, '0');
  function update(){
    const diff = end - Date.now();
    if(diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    ['cdD','cdDays'].forEach(id=>{ const el=$(id); if(el) el.textContent=pad(d); });
    ['cdH','cdHours'].forEach(id=>{ const el=$(id); if(el) el.textContent=pad(h); });
    ['cdM','cdMins'].forEach(id=>{ const el=$(id); if(el) el.textContent=pad(m); });
    ['cdS','cdSecs'].forEach(id=>{ const el=$(id); if(el) el.textContent=pad(s); });
  }
  update();
  setInterval(update, 1000);
})();

/* ── LIVE VIEWER COUNTER ── */
(function(){
  const el = $('viewN');
  if(!el) return;
  let n = 18 + Math.floor(Math.random() * 12);
  el.textContent = n;
  setInterval(()=>{
    n = Math.max(12, Math.min(38, n + (Math.random() < 0.5 ? 1 : -1)));
    el.textContent = n;
  }, 4000 + Math.random() * 3000);
})();

/* ── LIVE PRICE TICKER ── */
(function(){
  if(!$('lw-nifty')) return;
  let p    = {nifty: 22541, bn: 48210, fn: 21380};
  const base = {...p};
  function fmt(n){
    const s = n.toFixed(2).split('.');
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return s.join('.');
  }
  function chg(n, b){
    const pct = ((n - b) / b * 100).toFixed(2);
    return (pct >= 0 ? '▲ ' : '▼ ') + Math.abs(pct) + '%';
  }
  function tick(){
    p.nifty += (Math.random() - 0.48) * 8;
    p.bn    += (Math.random() - 0.48) * 15;
    p.fn    += (Math.random() - 0.48) * 7;
    [['lw-nifty','lw-nifty-chg','nifty'],
     ['lw-bn',   'lw-bn-chg',   'bn'   ],
     ['lw-fn',   'lw-fn-chg',   'fn'   ]].forEach(([pid,cid,k])=>{
      const pe = $(pid); if(pe) pe.textContent = fmt(p[k]);
      const ce = $(cid);
      if(ce){
        ce.textContent = chg(p[k], base[k]);
        ce.className   = 'lw-chg ' + (p[k] >= base[k] ? 'up' : 'dn');
      }
    });
  }
  tick();
  setInterval(tick, 2500);
})();

/* ── PAGE TRANSITION — smooth slide ── */
(function(){
  const overlay = $$('.page-transition') || document.getElementById('pageTransition');
  if(!overlay) return;

  // Remove active on load
  overlay.classList.remove('active','in');

  $a('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') ||
       href.startsWith('tel:') || href.startsWith('mailto:') ||
       href.startsWith('upi:') || href.startsWith('phonepe:') ||
       a.target === '_blank') return;
    a.addEventListener('click', e=>{
      e.preventDefault();
      document.body.style.pointerEvents = 'none';
      overlay.classList.add('in');
      setTimeout(()=>{
        window.location.href = href;
      }, 320);
    });
  });

  // Instant remove on arrival
  window.addEventListener('pageshow', ()=>{
    overlay.classList.remove('in','active');
    document.body.style.pointerEvents = '';
  });
})();

/* ── EXIT INTENT POPUP ── */
(function(){
  const popup = $('exitPopup');
  if(!popup || sessionStorage.getItem('exitShown')) return;
  let triggered = false;
  document.addEventListener('mouseleave', e=>{
    if(e.clientY <= 0 && !triggered){
      triggered = true;
      sessionStorage.setItem('exitShown', '1');
      setTimeout(()=> popup.classList.add('show'), 200);
    }
  });
  popup.addEventListener('click', e=>{ if(e.target === popup) popup.classList.remove('show'); });
})();

/* ── TIMED POPUP ── */
(function(){
  const popup = $('popup');
  if(!popup || sessionStorage.getItem('popupShown')) return;
  setTimeout(()=>{
    popup.classList.add('show');
    sessionStorage.setItem('popupShown', '1');
  }, 25000);
  $('popupClose')?.addEventListener('click', ()=> popup.classList.remove('show'));
  $('popupSkip')?.addEventListener('click',  ()=> popup.classList.remove('show'));
  popup.addEventListener('click', e=>{ if(e.target === popup) popup.classList.remove('show'); });
})();

/* ── POPUP SUBMIT ── */
window.submitPopup = function(){
  const name  = $('ppName')?.value?.trim();
  const phone = $('ppPhone')?.value?.trim();
  if(!name || !phone){ alert('Please fill in your name and phone'); return; }
  const msg = encodeURIComponent('*Callback Request — Giant Traders Academy*\nName: ' + name + '\nPhone: ' + phone);
  window.open('https://wa.me/916381384612?text=' + msg, '_blank');
  $('popup')?.classList.remove('show');
};

/* ── CHIP SELECT ── */
$a('.chip').forEach(c => c.addEventListener('click', ()=> c.classList.toggle('active')));

/* ── LEAD FORM SUBMIT ── */
window.submitLead = function(){
  const name  = $('lfName')?.value?.trim();
  const phone = $('lfPhone')?.value?.trim();
  const city  = $('lfCity')?.value?.trim();
  const exp   = $('lfExp')?.value;
  const msg   = $('lfMsg')?.value?.trim();
  const chips = [...$a('.chip.active')].map(c => c.dataset.val).join(', ');
  if(!name)                      { alert('Please enter your name'); return; }
  if(!phone || phone.length < 8) { alert('Please enter a valid phone number'); return; }
  const btn    = $('lfSubmit');
  const btnTxt = $('lfBtnText');
  if(btn)    btn.disabled    = true;
  if(btnTxt) btnTxt.textContent = 'Sending...';
  let waMsg = '*Giant Traders Academy — Enquiry*\nName: ' + name + '\nPhone: ' + phone + '\n';
  if(city)  waMsg += 'City: '        + city  + '\n';
  if(exp)   waMsg += 'Experience: '  + exp   + '\n';
  if(chips) waMsg += 'Interested in: '+ chips + '\n';
  if(msg)   waMsg += 'Question: '    + msg   + '\n';
  setTimeout(()=>{
    $$('.lf-body')   && ($$('.lf-body').style.display   = 'none');
    $$('.lf-header') && ($$('.lf-header').style.display = 'none');
    const suc = $('lfSuccess');
    if(suc) suc.style.display = 'block';
    window.open('https://wa.me/916381384612?text=' + encodeURIComponent(waMsg), '_blank');
  }, 800);
};

/* ── PAGE HERO BACKGROUND VIDEOS — lazy autoplay ── */
(function(){
  const vids = $a('.page-hero-bgvid, .bgvid-video, #heroBgVid');
  if(!vids.length) return;
  vids.forEach(vid=>{
    vid.muted = true;
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        if(vid.readyState === 0) vid.load();
        vid.play().catch(()=>{
          ['click','scroll','touchstart'].forEach(ev=>
            document.addEventListener(ev, ()=> vid.play().catch(()=>{}), {once: true})
          );
        });
        obs.unobserve(vid);
      });
    }, {threshold: 0.05, rootMargin: '300px'});
    obs.observe(vid);
  });
  document.addEventListener('visibilitychange', ()=>{
    vids.forEach(v => document.hidden ? v.pause() : v.play().catch(()=>{}));
  });
})();
