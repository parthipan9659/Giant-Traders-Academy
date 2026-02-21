// ── Cursor
const cur = document.getElementById('cur');
const ring = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.transform=`translate(${mx-4}px,${my-4}px)`;
});
(function animR(){
  rx+=(mx-rx)*0.1; ry+=(my-ry)*0.1;
  ring.style.transform=`translate(${rx-15}px,${ry-15}px)`;
  requestAnimationFrame(animR);
})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width=ring.style.height='50px';});
  el.addEventListener('mouseleave',()=>{ring.style.width=ring.style.height='30px';});
});

// ── Nav scroll shrink
const nav = document.getElementById('mainNav');
if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60));

// ── Mobile nav toggle
const toggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
if(toggle && mobileNav){
  toggle.addEventListener('click',()=>{
    mobileNav.classList.toggle('open');
  });
}

// ── Scroll reveal
const revEls = document.querySelectorAll('.reveal');
if(revEls.length){
  const revObs = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('vis'),i*80);
        revObs.unobserve(e.target);
      }
    });
  },{threshold:0.08});
  revEls.forEach(el=>revObs.observe(el));
}

// ── FAQ accordion
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    document.querySelectorAll('.faq-item').forEach(f=>{if(f!==item)f.classList.remove('open');});
    item.classList.toggle('open');
  });
});

// ── Stat counters
document.querySelectorAll('[data-count]').forEach(el=>{
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const target=+e.target.dataset.count, suffix=e.target.dataset.suffix||'', start=Date.now(), dur=1600;
        (function t(){
          const p=Math.min((Date.now()-start)/dur,1), ease=1-Math.pow(1-p,3);
          e.target.textContent=Math.round(target*ease)+suffix;
          if(p<1)requestAnimationFrame(t);
        })();
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.5});
  obs.observe(el);
});
