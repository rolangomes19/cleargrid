// nav, render, event wiring.

/* ═══ 11 · nav + render ═══ */
/* the brand files as shipped in assets/, never redrawn or re-cropped. same images in
   both directions: a logo is not mirrored or re-lettered for RTL. build.sh inlines them. */
const LOGO=`<img class="logo-full" alt="ClearGrid" src="../assets/cleargrid-icon-lockup.webp">
   <img class="logo-mark" alt="ClearGrid" src="../assets/cleargrid-icon.webp">`;
function nav(){
 const n=t().nav;
 const i=(k,ic,on,key)=>`<div class="item${on?' on':''}"${key?` data-nav="${key}" tabindex="0" role="button"`:''}>${icon(ic)}<span class="label">${esc(k)}</span></div>`;
 return `<div class="nav-scroll">
   <div class="logo">${LOGO}</div>
   <div class="gl">${esc(n.p)}</div>${i(n.dash,'dash')}${i(n.bor,'users',1,'queue')}${i(n.acc,'wallet')}
   <div class="gl">${esc(n.sup)}</div>${i(n.inbox,'mail')}${i(n.tick,'ticket')}
   <div class="gl">${esc(n.tools)}</div>${i(n.rep,'chartbar')}${i(n.ai,'robot')}${i(n.camp,'megaphone')}${i(n.wf,'flow')}
  </div>
  <div class="nav-bottom">
   <div class="nav-lang">
    <button data-v="en"${S.lang==='en'?' class="on"':''}><span class="full">English</span><span class="ic">EN</span></button>
    <button data-v="ar"${S.lang==='ar'?' class="on"':''}><span class="full">العربية</span><span class="ic">ع</span></button>
   </div>
   <div class="nav-promo">
    <div class="t-pri">${esc(n.voiceTitle)}</div>
    <div class="t-sec">${esc(n.voiceSub)}</div>
    <button class="nav-promo-btn">${icon('mic')}<span>${esc(n.voiceBtn)}</span></button>
   </div>
   <div class="nav-profile">
    <div class="avatar">R</div>
    <div class="who"><span class="t-pri">rabab.abbas</span><span class="t-sec">rabab.abbas@cleargrid.com</span></div>
    ${icon('caret')}
   </div>
  </div>
  <div class="nav-foot">
   <button id="b-navcollapse" title="${esc(S.navCollapsed?n.expand:n.collapse)}">${icon('dcaret')}</button>
  </div>`;
}

function render(){
 document.documentElement.lang=S.lang;
 document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';
 const list=accts(); if(S.sel>=list.length) S.sel=0;
 document.getElementById('nav').classList.toggle('collapsed',S.navCollapsed);
 document.getElementById('nav').innerHTML=nav();
 const stack=document.getElementById('stack');
 /* the only screen-swap mechanism the app has: a state field branched once, here.
    'queue' has no spine (no borrower is open yet); 'wrapup' reuses the exact
    two-column shape 'compare' already uses so the write pane keeps the spine and
    the account-card rail visible instead of introducing a second layout. */
 if(S.mode==='queue'){
  stack.innerHTML=queueView();
 } else if(S.mode==='wrapup'){
  stack.innerHTML=spine()+`<div class="cols compare">${borrowerCol()}${wrapupView()}</div>`;
 } else {
  stack.innerHTML=spine()+
   `<div class="cols${S.mode==='compare'?' compare':''}">${borrowerCol()}${S.mode==='compare'?compareView():accountCol()+activityCol()}</div>`;
 }
 wire();
}

/* default selection: the account the escalation line names, else the largest. */
function defaultSel(){
 const h=hot(rec()),list=accts();
 const i=list.findIndex(a=>h.has(a.ref));
 return i<0?0:i;
}
/* ═══ 13 · events ═══ */
/* product nav's own EN/AR toggle and the "Borrowers" -> queue link — #nav's innerHTML is
   replaced each render, so these listeners are delegated on the persistent container
   rather than rebound per render like wire(). */
document.getElementById('nav').addEventListener('click',e=>{
 const b=e.target.closest('.nav-lang button');
 if(b){
  /* collapsed rail only shows the active button (the inactive one is display:none),
     so clicking it must flip rather than re-set the same value or it would be a dead end.
     Expanded, both buttons are visible and clickable, so just set to whichever was
     clicked — flipping there too would make clicking the already-active language switch
     away from it, which is wrong for an ordinary two-button toggle. */
  const collapsed=document.getElementById('nav').classList.contains('collapsed');
  S.lang=collapsed?(S.lang==='en'?'ar':'en'):b.dataset.v; render(); return;
 }
 if(e.target.closest('[data-nav]')){ S.mode='queue'; render(); }
});
document.getElementById('nav').addEventListener('keydown',e=>{
 if(e.key!=='Enter'&&e.key!==' ')return;
 if(e.target.closest('[data-nav]')){ e.preventDefault(); S.mode='queue'; render(); }
});

/* keyboard: selection is a many-times-a-day action, so it gets no animation.
   digits/compare only act once a case is open, so a stray keystroke on the queue
   or mid-write on the wrap-up screen can't silently jump the agent somewhere else. */
document.addEventListener('keydown',e=>{
 if(e.target.matches('input,textarea,select'))return;
 const inCase=S.mode==='profile'||S.mode==='compare';
 const n=parseInt(e.key,10);
 if(inCase&&n>=1&&n<=9&&accts()[n-1]){S.sel=n-1;S.mode='profile';render();}
 if(inCase&&e.key==='c'){S.mode=S.mode==='compare'?'profile':'compare';render();}
 if(e.key==='q'&&S.mode!=='queue'&&S.mode!=='wrapup'){S.mode='queue';render();}
 if(e.key==='Escape'&&S.mode==='wrapup'){S.mode='profile';S.wrapDone=false;render();}
});

/* ═══ 13.1 · collapsed-nav hover flyout. one shared, fixed-position, JS-driven element.
   a per-item CSS :hover + position:absolute child was tried first and was invisible in
   practice: .nav-scroll{overflow:auto} silently clips any absolutely-positioned descendant
   that escapes its own bounds. position:fixed + JS placement sidesteps that entirely. ═══ */
function wireNavFlyout(){
 const fly=document.getElementById('nav-flyout'),navEl=document.getElementById('nav');
 if(!navEl.classList.contains('collapsed')){ fly.hidden=true; return; }
 navEl.querySelectorAll('.nav-scroll .item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
   const label=el.querySelector('.label'); if(!label)return;
   const r=el.getBoundingClientRect();
   fly.textContent=label.textContent;
   fly.style.top=r.top+r.height/2+'px';
   if(S.lang==='ar'){ fly.style.insetInlineEnd=(window.innerWidth-r.left)+'px'; fly.style.insetInlineStart='auto'; }
   else{ fly.style.insetInlineStart=r.right+'px'; fly.style.insetInlineEnd='auto'; }
   fly.hidden=false;
  });
  el.addEventListener('mouseleave',()=>{ fly.hidden=true; });
 });
}

function wire(){
 const s=document.getElementById('stack');
 s.querySelectorAll('[data-a]').forEach(el=>el.addEventListener('click',()=>{
  S.sel=+el.dataset.a;S.mode='profile';render();}));
 /* account cards carry role="button"+tabindex (regions.js) so Tab reaches them; the
    compare table's rows lean on their own real <button>, which is native-keyboard-safe
    already, so only the card-shaped targets need this explicit key handling. */
 s.querySelectorAll('[role="button"][data-a]').forEach(el=>el.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){e.preventDefault();S.sel=+el.dataset.a;S.mode='profile';render();}}));
 s.querySelectorAll('[data-q]').forEach(el=>{
  const open=()=>{S.rec=el.dataset.q;S.mode='profile';S.sel=defaultSel();render();};
  el.addEventListener('click',open);
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 });
 s.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>{S.tab=b.dataset.t;render();}));
 /* aria-disabled controls stay focusable (for their tooltip) but must never act */
 const on=(id,f)=>{const e=document.getElementById(id); if(e)e.addEventListener('click',ev=>{
  if(e.getAttribute('aria-disabled')!=='true')f(ev);});};
 on('b-compare',()=>{S.mode=S.mode==='compare'?'profile':'compare';render();});
 on('b-scope',()=>{S.scope=S.scope==='a'?'all':'a';render();});
 on('b-entry',()=>{S.mode='wrapup';S.wrapDone=false;render();});
 on('b-inbox',()=>{S.mode='profile';S.tab='m';S.scope='all';render();});
 on('w-cancel',()=>{S.mode='profile';render();});
 on('w-save',()=>{
  const a=acc(),r=rec();
  const out=document.getElementById('w-out').value;
  const note=document.getElementById('w-note').value.trim();
  const amt=parseFloat(document.getElementById('w-amt').value.replace(/[^\d.]/g,''));
  const date=document.getElementById('w-date').value;
  const entry={at:new Date().toISOString().slice(0,16),a:a.ref,src:'phone',dir:'out',out,
    by:r.owner||'Agent',note:note?{en:note,ar:note}:null};
  r.logs.unshift(entry); S.justLogged=entry;
  /* one write, three synchronised reads: spine stat, account card, this list */
  if(amt&&date){ a.ptp={amt,date,state:'open'}; }
  S.wrapDone=true; S.tab='i'; render();
 });
 on('w-return',()=>{S.wrapDone=false;S.mode='queue';render();});
 on('b-navcollapse',()=>{S.navCollapsed=!S.navCollapsed;render();});
 wireNavFlyout();
 s.querySelectorAll('.dd').forEach(wireDropdown);
}

/* ═══ 13.2 · select + date picker behaviour (markup: components.js 5.2).
   Popovers open instantly (CLAUDE.md motion), close on Escape / outside click / pick,
   and hand focus back to their trigger. ═══ */
const ISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function closeDropdowns(except){
 document.querySelectorAll('.dd-pop:not([hidden])').forEach(p=>{
  if(p.parentElement===except)return;
  p.hidden=true; p.parentElement.querySelector('.dd-trigger').setAttribute('aria-expanded','false');
 });
}
document.addEventListener('mousedown',e=>{ if(!e.target.closest('.dd')) closeDropdowns(); });

function wireDropdown(dd){
 const trig=dd.querySelector('.dd-trigger'),pop=dd.querySelector('.dd-pop'),input=dd.querySelector('input');
 const open=()=>{ closeDropdowns(dd); pop.hidden=false; trig.setAttribute('aria-expanded','true'); };
 const close=()=>{ pop.hidden=true; trig.setAttribute('aria-expanded','false'); trig.focus(); };
 /* stopPropagation: Escape here closes the popover only, not the whole wrap-up screen */
 pop.addEventListener('keydown',e=>{ if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();} if(e.key==='Tab')close(); });

 if(dd.dataset.dd==='select'){
  const opts=[...pop.querySelectorAll('.dd-opt')];
  const pick=o=>{ input.value=o.dataset.v; dd.querySelector('.dd-val').textContent=o.textContent.trim();
   opts.forEach(x=>x.setAttribute('aria-selected',x===o)); close(); };
  trig.addEventListener('click',()=>{ if(!pop.hidden){close();return;} open();
   (opts.find(o=>o.dataset.v===input.value)||opts[0]).focus(); });
  trig.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();trig.click();} });
  opts.forEach(o=>o.addEventListener('click',()=>pick(o)));
  pop.addEventListener('keydown',e=>{
   const i=opts.indexOf(document.activeElement),n=opts.length;
   const to={ArrowDown:(i+1)%n,ArrowUp:(i-1+n)%n,Home:0,End:n-1}[e.key];
   if(to!==undefined){e.preventDefault();opts[to].focus();}
   if((e.key==='Enter'||e.key===' ')&&i>=0){e.preventDefault();pick(opts[i]);}
  });
  return;
 }

 /* date: a month grid, weeks from Monday (UAE), past days not selectable —
    a promise to pay can only be made for today or later. */
 let view=new Date(TODAY.getFullYear(),TODAY.getMonth(),1);
 const T_=t(),loc=S.lang==='ar'?'ar-AE-u-ca-gregory-nu-latn':'en-AE-u-ca-gregory';
 const monthF=new Intl.DateTimeFormat(loc,{month:'long',year:'numeric'});
 const dayF=new Intl.DateTimeFormat(loc,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 const wk=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(loc,{weekday:S.lang==='ar'?'narrow':'short'})
   .format(new Date(2026,0,5+i))).map(w=>S.lang==='ar'?w:w.slice(0,2));
 const today=ISO(TODAY);
 const draw=focusIso=>{
  const y=view.getFullYear(),m=view.getMonth(),days=new Date(y,m+1,0).getDate(),lead=(new Date(y,m,1).getDay()+6)%7;
  const atStart=y===TODAY.getFullYear()&&m===TODAY.getMonth();
  const sel=input.value;
  const tgt=focusIso||(sel&&sel.slice(0,7)===ISO(view).slice(0,7)?sel:(atStart?today:ISO(view)));
  let cells='<span></span>'.repeat(lead);
  for(let d=1;d<=days;d++){
   const iso=ISO(new Date(y,m,d)),past=iso<today;
   cells+=past?`<span class="cal-day past" aria-hidden="true">${N(d)}</span>`
    :`<button type="button" class="cal-day${iso===today?' today':''}${iso===sel?' on':''}" data-d="${iso}"
       tabindex="${iso===tgt?0:-1}" aria-pressed="${iso===sel}" aria-label="${dayF.format(new Date(y,m,d))}">${N(d)}</button>`;
  }
  pop.innerHTML=`<div class="cal-head">
    <button type="button" class="cal-nav" data-m="-1"${atStart?` aria-disabled="true" data-tip="${esc(T_.noPast)}"`:''} aria-label="${esc(T_.prevMonth)}">${icon('prev')}</button>
    <span class="cal-cap" aria-live="polite">${esc(monthF.format(view))}</span>
    <button type="button" class="cal-nav" data-m="1" aria-label="${esc(T_.nextMonth)}">${icon('next')}</button></div>
   <div class="cal-grid" role="grid">${wk.map(w=>`<span class="cal-wd" aria-hidden="true">${esc(w)}</span>`).join('')}${cells}</div>`;
  const f=pop.querySelector(`[data-d="${tgt}"]`)||pop.querySelector('.cal-day[data-d]');
  if(f){f.tabIndex=0; if(focusIso!==null)f.focus();}
 };
 const shift=n=>{view=new Date(view.getFullYear(),view.getMonth()+n,1);};
 trig.addEventListener('click',()=>{ if(!pop.hidden){close();return;}
  if(input.value) view=new Date(+input.value.slice(0,4),+input.value.slice(5,7)-1,1);
  open(); draw(); });
 pop.addEventListener('click',e=>{
  const nav=e.target.closest('.cal-nav');
  if(nav){ if(nav.getAttribute('aria-disabled')!=='true'){shift(+nav.dataset.m);draw(null);
   pop.querySelector(`.cal-nav[data-m="${nav.dataset.m}"]`).focus();} return; }
  const b=e.target.closest('.cal-day[data-d]'); if(!b)return;
  input.value=b.dataset.d;
  const v=dd.querySelector('.dd-val'); v.textContent=D(b.dataset.d); v.classList.remove('empty-val');
  close();
 });
 pop.addEventListener('keydown',e=>{
  const b=e.target.closest('.cal-day[data-d]'); if(!b)return;
  const rtl=S.lang==='ar';
  const step={ArrowRight:rtl?-1:1,ArrowLeft:rtl?1:-1,ArrowDown:7,ArrowUp:-7}[e.key];
  if(step===undefined)return;
  e.preventDefault();
  const [y,m,d]=b.dataset.d.split('-').map(Number),n=new Date(y,m-1,d+step),iso=ISO(n);
  if(iso<today)return;
  if(n.getMonth()!==view.getMonth()) view=new Date(n.getFullYear(),n.getMonth(),1);
  draw(iso);
 });
}
S.sel=defaultSel();
render();
