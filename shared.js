/* ═══════════════════════════════════════════════════
   GIANT TRADERS ACADEMY — shared.js  SAFE v4
   Every querySelector/getElementById is null-guarded.
═══════════════════════════════════════════════════ */

const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelector(sel);
const $a = sel => document.querySelectorAll(sel);

/* ── LOADER ── */
(function(){
  const loader=$('loader'), bar=$('loaderBar');
  if(!loader) return;
  let pct=0;
  const fill=setInterval(()=>{
    pct+=Math.random()*18; if(pct>=100){pct=100;clearInterval(fill);}
    if(bar) bar.style.width=pct+'%';
    if(pct>=100) setTimeout(()=>loader.classList.add('hidden'),200);
  },60);
})();

/* ── SCROLL PROGRESS ── */
(function(){
  const bar=$('scrollProg'); if(!bar) return;
  window.addEventListener('scroll',()=>{
    bar.style.width=Math.min(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100,100)+'%';
  },{passive:true});
})();

  $a('a,button,.chip,.sc-card,.testi-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ ring.style.width=ring.style.height='48px'; ring.style.borderColor='rgba(245,200,66,0.8)'; });
    el.addEventListener('mouseleave',()=>{ ring.style.width=ring.style.height='30px'; ring.style.borderColor='rgba(245,200,66,0.45)'; });
  });
})();

/* ── MAGNETIC BUTTONS ── */
$a('.btn-gold,.btn-ghost,.enroll-btn,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.18}px,${(e.clientY-r.top-r.height/2)*0.18}px)`;
  });
  btn.addEventListener('mouseleave',()=>{ btn.style.transform=''; });
});

/* ── NAV SHRINK ── */
(function(){
  const nav=$('mainNav'); if(!nav) return;
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60),{passive:true});
})();

/* ── MOBILE NAV ── */
(function(){
  const tog=$('navToggle'), mob=$('mobileNav'); if(!tog||!mob) return;
  tog.addEventListener('click',()=>{
    const open=mob.classList.toggle('open');
    const sp=tog.querySelectorAll('span');
    if(sp[0]&&sp[1]&&sp[2]){
      if(open){ sp[0].style.transform='rotate(45deg) translate(5px,5px)'; sp[1].style.opacity='0'; sp[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
      else { sp[0].style.transform=sp[2].style.transform=''; sp[1].style.opacity=''; }
    }
  });
  mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mob.classList.remove('open');
    tog.querySelectorAll('span').forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
  }));
})();

/* ── SCROLL REVEALS ── */
(function(){
  const els=$a('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if(!els.length) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      setTimeout(()=>e.target.classList.add('vis'),+e.target.dataset.delay||0);
      obs.unobserve(e.target);
    });
  },{threshold:0.08});
  els.forEach(el=>obs.observe(el));
})();

/* ── FAQ ACCORDION ── */
$a('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement; if(!item) return;
    $a('.faq-item').forEach(f=>{ if(f!==item) f.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

/* ── STAT COUNTERS ── */
$a('[data-count]').forEach(el=>{
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const target=+e.target.dataset.count, sfx=e.target.dataset.suffix||'', dur=1800, t0=Date.now();
      (function tick(){ const p=Math.min((Date.now()-t0)/dur,1),ease=1-Math.pow(1-p,4); e.target.textContent=Math.round(target*ease)+sfx; if(p<1) requestAnimationFrame(tick); })();
      obs.unobserve(e.target);
    });
  },{threshold:0.5});
  obs.observe(el);
});

/* ── COUNTDOWN TIMER ── */
(function(){
  const hasTimer=$('cdS')||$('cdSecs')||$('cdDays');
  if(!hasTimer) return;
  const end=new Date(); end.setDate(end.getDate()+2); end.setHours(end.getHours()+14,end.getMinutes()+37,0,0);
  const pad=n=>String(n).padStart(2,'0');
  function update(){
    const diff=end-Date.now(); if(diff<=0) return;
    const d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
    ['cdD','cdDays'].forEach(id=>{const el=$(id);if(el)el.textContent=pad(d);});
    ['cdH','cdHours'].forEach(id=>{const el=$(id);if(el)el.textContent=pad(h);});
    ['cdM','cdMins'].forEach(id=>{const el=$(id);if(el)el.textContent=pad(m);});
    ['cdS','cdSecs'].forEach(id=>{const el=$(id);if(el)el.textContent=pad(s);});
  }
  update(); setInterval(update,1000);
})();

/* ── LIVE VIEWER COUNTER ── */
(function(){
  const el=$('viewN'); if(!el) return;
  let n=18+Math.floor(Math.random()*12); el.textContent=n;
  setInterval(()=>{ n=Math.max(12,Math.min(38,n+(Math.random()<0.5?1:-1))); el.textContent=n; },4000+Math.random()*3000);
})();

/* ── LIVE PRICE TICKER ── */
(function(){
  if(!$('lw-nifty')) return;
  let p={nifty:22541,bn:48210,fn:21380}; const base={...p};
  function fmt(n){ let s=n.toFixed(2).split('.'); s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,','); return s.join('.'); }
  function chg(n,b){ const pct=((n-b)/b*100).toFixed(2); return (pct>=0?'▲ ':'▼ ')+Math.abs(pct)+'%'; }
  function tick(){
    p.nifty+=(Math.random()-0.48)*8; p.bn+=(Math.random()-0.48)*15; p.fn+=(Math.random()-0.48)*7;
    [['lw-nifty','lw-nifty-chg','nifty'],['lw-bn','lw-bn-chg','bn'],['lw-fn','lw-fn-chg','fn']].forEach(([pid,cid,k])=>{
      const pe=$(pid); if(pe) pe.textContent=fmt(p[k]);
      const ce=$(cid); if(ce){ ce.textContent=chg(p[k],base[k]); ce.className='lw-chg '+(p[k]>=base[k]?'up':'dn'); }
    });
  }
  tick(); setInterval(tick,2500);
})();

/* ── PAGE TRANSITION ── */
(function(){
  const overlay=$$('.page-transition'); if(!overlay) return;
  $a('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('tel:')||href.startsWith('mailto:')) return;
    a.addEventListener('click',e=>{
      e.preventDefault(); overlay.classList.add('active');
      setTimeout(()=>window.location.href=href,280);
    });
  });
  window.addEventListener('pageshow',()=>overlay.classList.remove('active'));
})();

/* ── EXIT INTENT POPUP ── */
(function(){
  const popup=$('exitPopup'); if(!popup||sessionStorage.getItem('exitShown')) return;
  let triggered=false;
  document.addEventListener('mouseleave',e=>{
    if(e.clientY<=0&&!triggered){ triggered=true; sessionStorage.setItem('exitShown','1'); setTimeout(()=>popup.classList.add('show'),200); }
  });
  popup.addEventListener('click',e=>{ if(e.target===popup) popup.classList.remove('show'); });
})();

/* ── TIMED POPUP ── */
(function(){
  const popup=$('popup'); if(!popup||sessionStorage.getItem('popupShown')) return;
  setTimeout(()=>{ popup.classList.add('show'); sessionStorage.setItem('popupShown','1'); },25000);
  $('popupClose')?.addEventListener('click',()=>popup.classList.remove('show'));
  $('popupSkip')?.addEventListener('click',()=>popup.classList.remove('show'));
  popup.addEventListener('click',e=>{ if(e.target===popup) popup.classList.remove('show'); });
})();

window.submitPopup=function(){
  const name=$('ppName')?.value?.trim(), phone=$('ppPhone')?.value?.trim();
  if(!name||!phone){ alert('Please fill in your name and phone'); return; }
  window.open(`https://wa.me/916381384612?text=${encodeURIComponent('*Callback Request*\nName: '+name+'\nPhone: '+phone)}`, '_blank');
  $('popup')?.classList.remove('show');
};

/* ── CHIP SELECT ── */
$a('.chip').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('active')));

/* ── LEAD FORM SUBMIT ── */
window.submitLead=function(){
  const name=$('lfName')?.value?.trim(), phone=$('lfPhone')?.value?.trim();
  const city=$('lfCity')?.value?.trim(), exp=$('lfExp')?.value, msg=$('lfMsg')?.value?.trim();
  const chips=[...$a('.chip.active')].map(c=>c.dataset.val).join(', ');
  if(!name){ alert('Please enter your name'); return; }
  if(!phone||phone.length<8){ alert('Please enter a valid phone number'); return; }
  const btn=$('lfSubmit'), btnTxt=$('lfBtnText');
  if(btn) btn.disabled=true; if(btnTxt) btnTxt.textContent='Sending...';
  let waMsg=`*Giant Traders Academy — Enquiry*\nName: ${name}\nPhone: ${phone}\n`;
  if(city)  waMsg+=`City: ${city}\n`;
  if(exp)   waMsg+=`Experience: ${exp}\n`;
  if(chips) waMsg+=`Interested in: ${chips}\n`;
  if(msg)   waMsg+=`Question: ${msg}\n`;
  setTimeout(()=>{
    $$('.lf-body')&&($$('.lf-body').style.display='none');
    $$('.lf-header')&&($$('.lf-header').style.display='none');
    const suc=$('lfSuccess'); if(suc) suc.style.display='block';
    window.open(`https://wa.me/916381384612?text=${encodeURIComponent(waMsg)}`,'_blank');
  },800);
};

/* ── PAGE HERO BACKGROUND VIDEO — lazy autoplay ── */
(function(){
  const vids = document.querySelectorAll('.page-hero-bgvid');
  if(!vids.length) return;

  vids.forEach(vid=>{
    vid.muted = true;
    // Only load + play when visible
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          if(vid.readyState === 0) vid.load();
          vid.play().catch(()=>{
            // blocked by browser — retry on user interaction
            ['click','scroll','touchstart'].forEach(ev=>
              document.addEventListener(ev, ()=>vid.play().catch(()=>{}), {once:true})
            );
          });
          obs.unobserve(vid);
        }
      });
    }, {threshold: 0.05, rootMargin: '300px'});
    obs.observe(vid);
  });

  // Pause on tab hide, resume on show
  document.addEventListener('visibilitychange', ()=>{
    vids.forEach(v => document.hidden ? v.pause() : v.play().catch(()=>{}));
  });
})();
