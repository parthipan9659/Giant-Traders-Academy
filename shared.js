/* ═══════════════════════════════════════════════════════
   GIANT TRADERS ACADEMY — shared.js  CLEAN v6
   Only contains: scroll progress, magnetic buttons,
   stat counters, chip select, lead form submit,
   popup handlers, page hero video lazy, chip select.
   Nav/Footer/FAQ/Reveals/Countdown → components.js
═══════════════════════════════════════════════════════ */

const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelector(sel);
const $a = sel => document.querySelectorAll(sel);

/* ── SCROLL PROGRESS ── */
(function(){
  const bar = $('scrollProg') || $('scrollProgress');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    bar.style.width = Math.min(
      window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 100
    ) + '%';
  }, {passive:true});
})();

/* ── MAGNETIC BUTTONS ── */
$a('.btn-gold,.btn-ghost,.enroll-btn,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r  = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.15}px,${(e.clientY-r.top-r.height/2)*0.15}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
});

/* ── STAT COUNTERS ── */
$a('[data-count]').forEach(el=>{
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const target=+e.target.dataset.count, sfx=e.target.dataset.suffix||'';
      const dur=1800, t0=Date.now();
      (function tick(){
        const p=Math.min((Date.now()-t0)/dur,1), ease=1-Math.pow(1-p,4);
        e.target.textContent=Math.round(target*ease)+sfx;
        if(p<1) requestAnimationFrame(tick);
      })();
      obs.unobserve(e.target);
    });
  },{threshold:0.5});
  obs.observe(el);
});

/* ── CHIP SELECT ── */
$a('.chip').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('active')));

/* ── LEAD FORM SUBMIT ── */
window.submitLead = function(){
  const name  = $('lfName')?.value?.trim();
  const phone = $('lfPhone')?.value?.trim();
  if(!name)                      { alert('Please enter your name'); return; }
  if(!phone||phone.length<8)     { alert('Please enter a valid phone number'); return; }
  const city  = $('lfCity')?.value?.trim()||'';
  const exp   = $('lfExp')?.value||'';
  const chips = [...$a('.chip.active')].map(c=>c.dataset.val).join(', ');
  const msg   = $('lfMsg')?.value?.trim()||'';
  let waMsg   = `Giant Traders Academy Enquiry\nName: ${name}\nPhone: ${phone}`;
  if(city)  waMsg += `\nCity: ${city}`;
  if(exp)   waMsg += `\nExperience: ${exp}`;
  if(chips) waMsg += `\nInterested in: ${chips}`;
  if(msg)   waMsg += `\nQuestion: ${msg}`;
  const btn = $('lfSubmit'), txt = $('lfBtnText');
  if(btn) btn.disabled=true;
  if(txt) txt.textContent='Sending...';
  setTimeout(()=>{
    $$('.lf-body')   && ($$('.lf-body').style.display='none');
    $$('.lf-header') && ($$('.lf-header').style.display='none');
    const suc=$('lfSuccess'); if(suc) suc.style.display='block';
    window.open('https://wa.me/916381384612?text='+encodeURIComponent(waMsg),'_blank');
  }, 600);
};

/* ── TIMED POPUP ── */
(function(){
  const popup=$('popup');
  if(!popup||sessionStorage.getItem('popupShown')) return;
  setTimeout(()=>{ popup.classList.add('show'); sessionStorage.setItem('popupShown','1'); },25000);
  $('popupClose')?.addEventListener('click',()=>popup.classList.remove('show'));
  $('popupSkip')?.addEventListener('click', ()=>popup.classList.remove('show'));
  popup.addEventListener('click',e=>{ if(e.target===popup) popup.classList.remove('show'); });
})();

/* ── POPUP SUBMIT ── */
window.submitPopup = function(){
  const name=$('ppName')?.value?.trim(), phone=$('ppPhone')?.value?.trim();
  if(!name||!phone){ alert('Please fill in your name and phone'); return; }
  window.open('https://wa.me/916381384612?text='+encodeURIComponent(`Callback Request\nName: ${name}\nPhone: ${phone}`),'_blank');
  $('popup')?.classList.remove('show');
};

/* ── PAGE HERO BG VIDEO LAZY ── */
(function(){
  const vids=$a('.page-hero-bgvid,.bgvid-video,#heroBgVid');
  if(!vids.length) return;
  vids.forEach(vid=>{
    vid.muted=true;
    const obs=new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting) return;
      if(vid.readyState===0) vid.load();
      vid.play().catch(()=>{
        ['click','scroll','touchstart'].forEach(ev=>
          document.addEventListener(ev,()=>vid.play().catch(()=>{}),{once:true})
        );
      });
      obs.unobserve(vid);
    },{threshold:0.05,rootMargin:'300px'});
    obs.observe(vid);
  });
  document.addEventListener('visibilitychange',()=>{
    vids.forEach(v=>document.hidden?v.pause():v.play().catch(()=>{}));
  });
})();

/* ── SOCIAL PROOF TOASTS (index only — requires #sp-toasts div) ── */
(function(){
  const container=$('sp-toasts');
  if(!container) return;
  const proofs=[
    {name:'Rajesh K',city:'Chennai',action:'enrolled in Index Options Pro',color:'#F5A623'},
    {name:'Karthik B',city:'Coimbatore',action:'joined Nifty Masterclass',color:'#00D4AA'},
    {name:'Sunitha D',city:'Madurai',action:'enrolled in Stock Options Course',color:'#00D4AA'},
    {name:'Murugan S',city:'Salem',action:'enrolled in Index Options Pro',color:'#F5A623'},
    {name:'Priya R',city:'Trichy',action:'joined Nifty Masterclass',color:'#00D4AA'},
    {name:'Arjun M',city:'Tiruppur',action:'enrolled in Stock Options Course',color:'#F5A623'},
    {name:'Deepa V',city:'Vellore',action:'enrolled in Index Options Pro',color:'#F5A623'},
    {name:'Senthil P',city:'Erode',action:'joined Nifty Masterclass',color:'#00D4AA'},
  ];
  let idx=0;
  function showToast(){
    const p=proofs[idx++%proofs.length];
    const d=document.createElement('div');
    d.className='sp-toast';
    d.innerHTML=`<div class="sp-av" style="background:${p.color}">${p.name[0]}</div>
      <div class="sp-info">
        <span class="sp-name">${p.name} <span style="font-size:10px;color:var(--muted)">· ${p.city}</span></span>
        <span class="sp-action">${p.action}</span>
      </div>`;
    container.appendChild(d);
    setTimeout(()=>d.classList.add('show'),50);
    setTimeout(()=>{ d.classList.remove('show'); d.classList.add('hide'); setTimeout(()=>d.remove(),500); },4500);
  }
  setTimeout(()=>{ showToast(); setInterval(showToast,8000); },5000);
})();
