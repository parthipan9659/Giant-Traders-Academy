/* ═══════════════════════════════════════════════════
   GIANT TRADERS ACADEMY — shared.js  v5 CLEAN
═══════════════════════════════════════════════════ */

const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelector(sel);
const $a = sel => document.querySelectorAll(sel);


/* ── SCROLL PROGRESS ── */
(function(){
  const bar = $('scrollProg') || $('scrollProgress');
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
/* Intentionally disabled: promotional deadlines should be tied to a real published date. */

/* ── LIVE VIEWER COUNTER ── */
/* Intentionally disabled: viewer counts should come from real analytics. */

/* ── LIVE PRICE TICKER ── */
/* Intentionally disabled: market prices should come from a genuine market-data feed. */

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

