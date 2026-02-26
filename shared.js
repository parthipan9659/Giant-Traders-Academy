/* ═══════════════════════════════════════════════
   GIANT TRADERS ACADEMY — shared.js  ULTRA v3
═══════════════════════════════════════════════ */

/* ── LOADER ── */
(function(){
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  if(!loader) return;
  let pct = 0;
  const fill = setInterval(()=>{
    pct += Math.random()*18;
    if(pct>=100){ pct=100; clearInterval(fill); }
    if(bar) bar.style.width = pct+'%';
    if(pct>=100){
      setTimeout(()=>loader.classList.add('hidden'),200);
    }
  },60);
})();

/* ── SCROLL PROGRESS BAR ── */
(function(){
  const bar = document.getElementById('scrollProg');
  if(!bar) return;
  window.addEventListener('scroll',()=>{
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct,100)+'%';
  },{passive:true});
})();

/* ── CUSTOM CURSOR ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
if(cur && ring){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.transform=`translate(${mx-4}px,${my-4}px)`;
  });
  (function anim(){
    rx+=(mx-rx)*0.1; ry+=(my-ry)*0.1;
    ring.style.transform=`translate(${rx-15}px,${ry-15}px)`;
    requestAnimationFrame(anim);
  })();
  document.querySelectorAll('a,button,.chip,.sc-card,.testi-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ ring.style.width=ring.style.height='48px'; ring.style.borderColor='rgba(245,200,66,0.8)'; });
    el.addEventListener('mouseleave',()=>{ ring.style.width=ring.style.height='30px'; ring.style.borderColor='rgba(245,200,66,0.45)'; });
  });
}

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-gold,.btn-ghost,.enroll-btn,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  * 0.18;
    const dy = (e.clientY - r.top  - r.height/2) * 0.18;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transform = '';
  });
});

/* ── NAV SCROLL SHRINK ── */
const nav = document.getElementById('mainNav');
if(nav) window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled', window.scrollY > 60);
},{passive:true});

/* ── MOBILE NAV TOGGLE ── */
const toggle    = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
if(toggle&&mobileNav){
  toggle.addEventListener('click',()=>{
    const open = mobileNav.classList.toggle('open');
    const [s0,s1,s2] = toggle.querySelectorAll('span');
    if(open){ s0.style.transform='rotate(45deg) translate(5px,5px)'; s1.style.opacity='0'; s2.style.transform='rotate(-45deg) translate(5px,-5px)'; }
    else { s0.style.transform=s2.style.transform=''; s1.style.opacity=''; }
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileNav.classList.remove('open');
    toggle.querySelectorAll('span').forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
  }));
}

/* ── SCROLL REVEALS ── */
(function(){
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const d = +e.target.dataset.delay || 0;
        setTimeout(()=>e.target.classList.add('vis'), d);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.08});
  els.forEach(el=>obs.observe(el));
})();

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item = q.parentElement;
    document.querySelectorAll('.faq-item').forEach(f=>{ if(f!==item) f.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

/* ── ANIMATED STAT COUNTERS ── */
document.querySelectorAll('[data-count]').forEach(el=>{
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const target=+e.target.dataset.count, sfx=e.target.dataset.suffix||'', dur=1800;
        const t0=Date.now();
        (function tick(){
          const p=Math.min((Date.now()-t0)/dur,1), ease=1-Math.pow(1-p,4);
          e.target.textContent=Math.round(target*ease)+sfx;
          if(p<1) requestAnimationFrame(tick);
        })();
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.5});
  obs.observe(el);
});

/* ── COUNTDOWN TIMER ── */
(function(){
  const end = new Date();
  end.setDate(end.getDate()+2);
  end.setHours(end.getHours()+14, end.getMinutes()+37, 0, 0);
  function update(){
    const diff = end - Date.now();
    if(diff<=0) return;
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000),
          m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
    const pad=n=>String(n).padStart(2,'0');
    document.getElementById('cdD') && (document.getElementById('cdD').textContent=pad(d));
    document.getElementById('cdH') && (document.getElementById('cdH').textContent=pad(h));
    document.getElementById('cdM') && (document.getElementById('cdM').textContent=pad(m));
    document.getElementById('cdS') && (document.getElementById('cdS').textContent=pad(s));
  }
  if(document.getElementById('cdS')){ update(); setInterval(update,1000); }
})();

/* ── LIVE VIEWER COUNTER (simulated) ── */
(function(){
  const el = document.getElementById('viewN');
  if(!el) return;
  let n = 18 + Math.floor(Math.random()*12);
  el.textContent = n;
  setInterval(()=>{
    const delta = Math.random()<0.5 ? 1 : -1;
    n = Math.max(12, Math.min(38, n+delta));
    el.textContent = n;
  }, 4000+Math.random()*3000);
})();

/* ── LIVE PRICE TICKER (simulated) ── */
(function(){
  let prices = { nifty:22541, bn:48210, fn:21380 };
  function tick(){
    prices.nifty += (Math.random()-0.48)*8;
    prices.bn    += (Math.random()-0.48)*15;
    prices.fn    += (Math.random()-0.48)*7;
    const fmt = (n,d=2)=>n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g,',');
    const chg  = (n,base)=>{ const p=((n-base)/base*100).toFixed(2); return (p>=0?'▲ ':'▼ ')+Math.abs(p)+'%'; };
    const col  = (n,base)=>n>=base?'up':'dn';
    const set  = (id,val,chgId,chgVal,cls)=>{
      const el=document.getElementById(id); if(el) el.textContent=val;
      const ce=document.getElementById(chgId); if(ce){ ce.textContent=chgVal; ce.className='lw-chg '+cls; }
    };
    set('lw-nifty',fmt(prices.nifty),'lw-nifty-chg',chg(prices.nifty,22541),col(prices.nifty,22541));
    set('lw-bn',   fmt(prices.bn),   'lw-bn-chg',   chg(prices.bn,48210),   col(prices.bn,48210));
    set('lw-fn',   fmt(prices.fn),   'lw-fn-chg',   chg(prices.fn,21380),   col(prices.fn,21380));
  }
  if(document.getElementById('lw-nifty')){ tick(); setInterval(tick,2500); }
})();

/* ── PAGE TRANSITION ── */
(function(){
  const overlay = document.querySelector('.page-transition');
  if(!overlay) return;
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('tel:')||href.startsWith('mailto:')) return;
    a.addEventListener('click',e=>{
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(()=>window.location.href=href, 380);
    });
  });
  window.addEventListener('pageshow',()=>overlay.classList.remove('active'));
})();

/* ── EXIT INTENT POPUP ── */
(function(){
  const popup = document.getElementById('exitPopup');
  if(!popup) return;
  if(sessionStorage.getItem('exitShown')) return;
  let triggered=false;
  document.addEventListener('mouseleave',e=>{
    if(e.clientY<=0 && !triggered){
      triggered=true;
      sessionStorage.setItem('exitShown','1');
      setTimeout(()=>popup.classList.add('show'),200);
    }
  });
  popup.addEventListener('click',e=>{ if(e.target===popup) popup.classList.remove('show'); });
})();

/* ── TIMED POPUP (25s) ── */
(function(){
  const popup = document.getElementById('popup');
  if(!popup||sessionStorage.getItem('popupShown')) return;
  setTimeout(()=>{
    popup.classList.add('show');
    sessionStorage.setItem('popupShown','1');
  },25000);
  document.getElementById('popupClose')?.addEventListener('click',()=>popup.classList.remove('show'));
  document.getElementById('popupSkip')?.addEventListener('click',()=>popup.classList.remove('show'));
  popup.addEventListener('click',e=>{ if(e.target===popup) popup.classList.remove('show'); });
})();

window.submitPopup = function(){
  const name  = document.getElementById('ppName')?.value.trim();
  const phone = document.getElementById('ppPhone')?.value.trim();
  if(!name||!phone){ alert('Please fill in your name and phone'); return; }
  const msg = encodeURIComponent(`🎓 *Callback Request — Giant Traders Academy*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n\n_Via website popup_`);
  window.open(`https://wa.me/916381384612?text=${msg}`,'_blank');
  document.getElementById('popup')?.classList.remove('show');
};

/* ── CHIP SELECT (lead form) ── */
document.querySelectorAll('.chip').forEach(c=>{
  c.addEventListener('click',()=>c.classList.toggle('active'));
});

/* ── LEAD FORM SUBMIT ── */
window.submitLead = function(){
  const name  = document.getElementById('lfName')?.value.trim();
  const phone = document.getElementById('lfPhone')?.value.trim();
  const city  = document.getElementById('lfCity')?.value.trim();
  const exp   = document.getElementById('lfExp')?.value;
  const msg   = document.getElementById('lfMsg')?.value.trim();
  const chips = [...document.querySelectorAll('.chip.active')].map(c=>c.dataset.val).join(', ');
  if(!name){ alert('Please enter your name'); return; }
  if(!phone||phone.length<8){ alert('Please enter a valid phone number'); return; }
  const btn = document.getElementById('lfSubmit');
  if(btn){ btn.disabled=true; document.getElementById('lfBtnText').textContent='Sending...'; }
  let waMsg = `🎓 *Callback Request — Giant Traders Academy*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n`;
  if(city)  waMsg+=`📍 *City:* ${city}\n`;
  if(exp)   waMsg+=`📊 *Experience:* ${exp}\n`;
  if(chips) waMsg+=`📈 *Interested in:* ${chips}\n`;
  if(msg)   waMsg+=`💬 *Question:* ${msg}\n`;
  waMsg+=`\n_Via gianttraders website_`;
  setTimeout(()=>{
    document.querySelector('.lf-body')&&(document.querySelector('.lf-body').style.display='none');
    document.querySelector('.lf-header')&&(document.querySelector('.lf-header').style.display='none');
    const suc=document.getElementById('lfSuccess'); if(suc) suc.style.display='block';
    window.open(`https://wa.me/916381384612?text=${encodeURIComponent(waMsg)}`,'_blank');
  },800);
};
