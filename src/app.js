// nav, render, event wiring.

/* ═══ 11 · nav + render ═══ */
/* the brand files as shipped in assets/, never redrawn or re-cropped. same images in
   both directions: a logo is not mirrored or re-lettered for RTL. build.sh inlines them. */
const LOGO=`<img class="logo-full" alt="ClearGrid" src="../assets/cleargrid-icon-lockup.webp">
   <img class="logo-mark" alt="ClearGrid" src="../assets/cleargrid-icon.webp">`;
function nav(){
 const n=t().nav;
 /* a collapsed nav hides the label; aria-label keeps the accessible name (axe aria-command-name) */
 const i=(k,ic,on,key)=>`<div class="item${on?' on':''}"${key?` data-nav="${key}" tabindex="0" role="button" aria-label="${esc(k)}"`:''}>${icon(ic)}<span class="label">${esc(k)}</span></div>`;
 return `<div class="nav-scroll">
   <div class="logo">${LOGO}</div>
   <div class="gl">${esc(n.p)}</div>${i(n.dash,'dash')}${i(n.bor,'users',1,'queue')}${i(n.acc,'wallet')}
   <div class="gl">${esc(n.sup)}</div>${i(n.inbox,'mail')}${i(n.tick,'ticket')}
   <div class="gl">${esc(n.tools)}</div>${i(n.rep,'chartbar')}${i(n.ai,'robot')}${i(n.camp,'megaphone')}${i(n.wf,'flow')}
  </div>
  <div class="nav-bottom">
   <div class="nav-lang">
    <button data-v="en"${S.lang==='en'?' class="on"':''}><span class="full">English</span><span class="ic">EN</span></button>
    <button data-v="ar"${S.lang==='ar'?' class="on"':''} lang="ar"><span class="full">العربية</span><span class="ic">ع</span></button>
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

/* ═══ 11.1 · reviewer bar (H0). chrome around the product, labelled as such, so a
   reviewer can switch fixture and language without guessing. not product UI. ═══ */
const FX=['stress','omar','aisha','sparse','blocked','ksa'];
const REVIEW=['log','sheet','test'];
function rbar(){
 const b=t().bar;
 return `<span class="rb-label">${esc(b.label)}</span>
  <label class="rb-fx"><span>${esc(b.fx)}</span><select id="rb-fx">${FX.map(k=>
   `<option value="${k}"${S.rec===k?' selected':''}>${esc(L(R[k].name))} · ${esc(b.fxName[k])}</option>`).join('')}</select></label>
  <span class="rb-lang"><button data-v="en"${S.lang==='en'?' aria-pressed="true"':''}>EN</button><button data-v="ar" lang="ar"${S.lang==='ar'?' aria-pressed="true"':''}>ع</button></span>
  <span class="rb-note">${esc(b.fixtures)}</span>
  ${SCALED?`<span class="rb-note" data-scaled title="${esc(b.scaledTip)}">${esc(b.scaled)}</span>`:''}
  ${DEBUG?`<span class="rb-t1" id="rb-t1"></span>`:''}
  <span class="rb-links">
   <button type="button" id="rb-tour"${S.step&&!S.paused?' aria-pressed="true"':''}>${esc(t().st.startTour)}</button>
   <button type="button" id="rb-log"${S.mode==='log'?' aria-pressed="true"':''}>${esc(t().st.log)}</button>
   <button type="button" id="rb-sheet"${S.mode==='sheet'?' aria-pressed="true"':''}>${esc(t().st.sheet)}</button>
   <button type="button" id="rb-test"${S.mode==='test'?' aria-pressed="true"':''}>${esc(t().st.test)}</button>
   <button type="button" id="rb-ann" aria-pressed="${S.ann}">${esc(t().st.anns)}</button>
   <button type="button" id="rb-prop" aria-pressed="${S.prop}">${esc(t().st.props)}</button>
  </span>
  <span class="rb-badge">${esc(b.selfGraded)}</span>`;
}

/* ═══ 11.2 · URL state (plan §3.2). every view a reviewer sees is a link they can share.
   unknown values fall back silently; changes replace history, never push. ═══ */
const Q=new URLSearchParams(location.search);
const DEBUG=Q.get('debug')==='1';
let SCALED=false;
function readUrl(){
 if(['en','ar'].includes(Q.get('lang'))) S.lang=Q.get('lang');
 if(FX.includes(Q.get('fx'))) S.rec=Q.get('fx');
 if(['i','m','t','k'].includes(Q.get('tab'))) S.tab=Q.get('tab');
 if(Q.get('scope')==='acct') S.scope='a'; /* default all: the list opens full, the agent narrows it */
 if(Q.get('view')==='queue') S.mode='queue';
 if(Q.get('view')==='log'){ S.mode='log'; S.card=CARDS.some(c=>c[0]===Q.get('card'))?Q.get('card'):null; }
 if(Q.get('ann')==='1') S.ann=true; /* why links: reviewer layer, off by default */
 if(Q.get('prop')==='1') S.prop=true;
 if(Q.get('view')==='sheet') S.mode='sheet';
 if(Q.get('view')==='test') S.mode='test';
 if(STATES.includes(Q.get('state'))) S.state=Q.get('state');
 S.sel=defaultSel();
 const i=accts().findIndex(a=>a.ref===Q.get('acct')); if(i>=0) S.sel=i;
}
function writeUrl(){
 const u=new URLSearchParams();
 u.set('lang',S.lang); u.set('fx',S.rec);
 if(S.mode==='queue') u.set('view','queue');
 else if(S.mode==='log'){ u.set('view','log'); if(S.card) u.set('card',S.card); }
 else if(S.mode==='sheet') u.set('view','sheet');
 else if(S.mode==='test') u.set('view','test');
 else { u.set('acct',acc().ref); u.set('tab',S.tab); u.set('scope',S.scope==='all'?'all':'acct'); }
 if(S.step&&!S.paused) u.set('step',S.step);
 if(S.ann) u.set('ann','1');
 if(S.prop) u.set('prop','1');
 if(S.state) u.set('state',S.state);
 if(DEBUG) u.set('debug','1');
 /* step changes push, so browser Back steps back through the tour; all else replaces */
 try{ history[PUSH?'pushState':'replaceState'](null,'','?'+u); }catch(e){}
}

/* ═══ 11.3 · T1 (rule W5): no column scrolls while another has > 25% of its area empty.
   debug only; also callable from the console as cgT1(). ═══ */
function cgT1(){
 const cols=[...document.querySelectorAll('.cols>.col')].map(c=>{
  const body=c.querySelector('.colbody'),head=c.querySelector('.colhead');
  /* content bottom measured from the column's own top, plus the body's end padding */
  const top=c.getBoundingClientRect().top-c.scrollTop;
  const used=body?[...body.children].reduce((m,el)=>Math.max(m,el.getBoundingClientRect().bottom-top),head?head.offsetHeight:0)+parseFloat(getComputedStyle(body).paddingBlockEnd):0;
  return {id:c.id||'col',w:c.clientWidth,scrolls:c.scrollHeight>c.clientHeight+1,
   empty:Math.max(0,(c.clientHeight-used)/c.clientHeight)};
 });
 const fail=cols.some(c=>c.scrolls)&&cols.some(c=>!c.scrolls&&c.empty>.25);
 return {pass:!fail,cols:cols.map(c=>`${c.id} ${c.w}px ${c.scrolls?'scrolls':Math.round(c.empty*100)+'% empty'}`)};
}
window.cgT1=cgT1;

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
 } else if(S.mode==='log'){
  stack.innerHTML=logView();
 } else if(S.mode==='sheet'){
  stack.innerHTML=sheetView();
 } else if(S.mode==='test'){
  stack.innerHTML=testView();
 } else if(S.state==='loading'&&S.mode==='profile'){
  stack.innerHTML=skeletonView();
 } else if(S.mode==='wrapup'){
  stack.innerHTML=spine()+`<div class="cols${rec().logs.length<8?' act-sparse':''}">${borrowerCol()}${wrapupView()}${activityCol()}</div>`;
 } else {
  stack.innerHTML=spine()+
   `<div class="cols${S.mode==='compare'?' compare':''}${rec().logs.length<8?' act-sparse':''}">${borrowerCol()}${S.mode==='compare'?compareView():accountCol()+activityCol()}</div>`;
 }
 document.getElementById('rbar').innerHTML=rbar();
 writeUrl();
 wire();
 storySync();
 if(S.mode==='log'&&S.card){const c=document.getElementById('card-'+S.card); if(c&&c.scrollIntoView) c.scrollIntoView({block:'start'});}
 if(DEBUG) requestAnimationFrame(()=>{const r=cgT1(),el=document.getElementById('rb-t1');
  if(el){el.textContent=`T1 ${r.pass?'pass':'FAIL'}`;el.title=r.cols.join(' | ');el.dataset.pass=r.pass;}});
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
 /* exit is faster than entry (150ms vs 180ms); reduced motion keeps the fade only */
 /* council R-C: Arabic-keyboard digits are shown as Western as they are typed, not only when parsed on save */
 const amtIn=document.getElementById('w-amt');
 if(amtIn) amtIn.addEventListener('input',()=>{const v=amtIn.value.replace(/[٠-٩۰-۹]/g,c=>(c.charCodeAt(0)&15)%10).replace(/٫/g,'.').replace(/٬/g,',');
  if(v!==amtIn.value) amtIn.value=v;});
 on('w-cancel',()=>{const w=document.querySelector('.wrap'); if(w)w.classList.add('leaving');
  setTimeout(()=>{S.mode='profile';render();},150);});
 on('w-save',()=>{
  const a=acc(),r=rec();
  const out=document.getElementById('w-out').value;
  /* 1.5: save failed keeps every input and says so; nothing is re-rendered */
  if(S.state==='savefail'){ const w=document.querySelector('.wrap');
   if(!w.querySelector('.save-fail')) w.querySelector('.actions').insertAdjacentHTML('beforebegin',`<div class="save-fail" role="alert">${esc(t().sys.saveFail)}</div>`);
   return; }
  const note=document.getElementById('w-note').value.trim();
  const amt=parseFloat(toWesternDigits(document.getElementById('w-amt').value).replace(/[^\d.]/g,''));
  const date=document.getElementById('w-date').value;
  /* council R-E: an unreadable promised amount is marked, not silently dropped */
  const rawAmt=document.getElementById('w-amt').value.trim(), amtBad=!!rawAmt&&!(amt>0);
  document.getElementById('w-amt').setAttribute('aria-invalid',String(amtBad));
  /* a promise needs an amount and a date; an amount that is not a number is marked and nothing is logged */
  const w=document.querySelector('.wrap'), amtEl=document.getElementById('w-amt');
  const stop=msg=>{ let m=w.querySelector('.save-fail');
   if(!m){ w.querySelector('.actions').insertAdjacentHTML('beforebegin','<div class="save-fail" role="alert"></div>'); m=w.querySelector('.save-fail'); }
   m.textContent=msg; };
  const badPtp=out==='promise'&&!(amt>0&&date);
  if(amtBad||badPtp){ amtEl.setAttribute('aria-invalid','true'); stop(amtBad?t().wrap.badAmt:t().wrap.needPtp); amtEl.focus(); return; }
  /* settlement is blocked on a disputed account: warn once, a second save goes through */
  if(out==='promise'&&a.dispute&&!w.dataset.warned){ w.dataset.warned='1'; stop(t().wrap.disputedPtp); return; }
  const entry={at:new Date().toISOString(),a:a.ref,src:'phone',dir:'out',out,
    by:r.owner||'Agent',note:note?{en:note,ar:note}:null};
  r.logs.unshift(entry); S.justLogged=entry; S.enter=true;
  /* 1.4: the call totals and 'latest answered' move with the log, so the record never contradicts itself */
  r.calls.h++; if(out!=='noans') r.calls.lastH=entry.at;
  /* one write, three synchronised reads: spine stat, account card, this list */
  if(amt&&date){ a.ptp={amt,date,state:'open'}; }
  S.wrapDone=true; S.tab='i'; render();
 });
 on('w-return',()=>{S.wrapDone=false;S.mode='queue';render();});
 on('b-navcollapse',()=>{S.navCollapsed=!S.navCollapsed;render();});
 /* the full ID is shown only on request and goes back to masked after 15 s. a real build also records who revealed it */
 on('b-id',()=>{S.showId=!S.showId;clearTimeout(on.idT);
  if(S.showId) on.idT=setTimeout(()=>{if(S.showId){S.showId=false;render();}},15000);
  render();});
 /* 3.5: the editable portfolio field writes back to the record */
 const fv=document.getElementById('f-verif');
 if(fv) fv.addEventListener('change',()=>{ acc().fields.verif=fv.value; });
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
   opts.forEach(x=>x.setAttribute('aria-selected',x===o)); close();
   input.dispatchEvent(new Event('change',{bubbles:true})); };
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
 const today=TODAY_ISO;
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
    <button type="button" class="mini icon-only cal-nav" data-m="-1"${atStart?` aria-disabled="true" data-tip="${esc(T_.noPast)}"`:''} aria-label="${esc(T_.prevMonth)}">${icon('prev')}</button>
    <span class="cal-cap" aria-live="polite">${esc(monthF.format(view))}</span>
    <button type="button" class="mini icon-only cal-nav" data-m="1" aria-label="${esc(T_.nextMonth)}">${icon('next')}</button></div>
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
/* reviewer bar: fixture + language. delegated, the bar re-renders each time. */
document.getElementById('rbar').addEventListener('change',e=>{
 if(e.target.id==='rb-fx'){S.rec=e.target.value;S.mode='profile';S.showId=false;S.sel=defaultSel();render();}});
document.getElementById('rbar').addEventListener('click',e=>{
 const b=e.target.closest('.rb-lang button'); if(b){S.lang=b.dataset.v;render();}});

/* ═══ 13.3 · screen fit (plan §3.4). >=1366 as designed; 1024-1365 the 1366 layout
   scaled down; below 1024 or touch-only, the fallback page unless "Open anyway". ═══ */
function fit(){
 const w=window.innerWidth,root=document.getElementById('root'),fb=document.getElementById('fallback');
 const small=(w<1024||(window.matchMedia&&matchMedia('(hover:none) and (pointer:coarse)').matches))&&!sessionStorageGet('cg-force');
 fb.hidden=!small; root.hidden=small;
 SCALED=!small&&w<1366;
 const k=SCALED?w/1366:1;
 Object.assign(root.style,SCALED?{position:'fixed',top:'0',left:'0',width:'1366px',height:(window.innerHeight/k)+'px',
  transform:`scale(${k})`,transformOrigin:'0 0'}:{position:'',top:'',left:'',width:'',height:'',transform:''});
}
function sessionStorageGet(k){try{return sessionStorage.getItem(k);}catch(e){return null;}}
document.getElementById('fb-open').addEventListener('click',()=>{try{sessionStorage.setItem('cg-force','1');}catch(e){}
 document.getElementById('fallback').hidden=true;document.getElementById('root').hidden=false;fit();render();});
document.getElementById('fb-copy').addEventListener('click',e=>{
 navigator.clipboard&&navigator.clipboard.writeText(location.href).then(()=>{e.target.textContent='✓';});});
window.addEventListener('resize',()=>{const was=SCALED;fit();if(was!==SCALED)render();});

/* ═══ 13.4 · story + decision log wiring ═══ */
/* why links (product annotations and the strip's own): open the card in the log */
document.addEventListener('click',e=>{
 const a=e.target.closest('a.ann'); if(!a||a.hasAttribute('download')) return;
 e.preventDefault();
 if(a.dataset.view==='test'){ if(!REVIEW.includes(S.mode)) S.prevMode=S.mode; if(S.step) S.paused=true; S.mode='test'; render(); return; }
 if(!REVIEW.includes(S.mode)) S.prevMode=S.mode;
 if(S.step) S.paused=true;
 S.card=a.dataset.card||null; S.mode='log'; render();
});
document.getElementById('rbar').addEventListener('click',e=>{
 const b=e.target.closest('button'); if(!b) return;
 if(b.id==='rb-tour') goStep(S.step||1,true);
 /* reviewer pages (log, sheet, test) toggle; Back returns to the product screen you came from */
 const page={'rb-log':'log','rb-sheet':'sheet','rb-test':'test'}[b.id];
 if(page){ if(S.mode!==page){ if(!REVIEW.includes(S.mode)) S.prevMode=S.mode; S.card=null; S.mode=page; } else S.mode=S.prevMode;
  if(S.step) S.paused=true; render(); }
 if(b.id==='rb-ann'){ S.ann=!S.ann; render(); }
 if(b.id==='rb-prop'){ S.prop=!S.prop; render(); }
});
document.getElementById('stack').addEventListener('click',e=>{
 if(e.target.closest('#b-logback')){ S.mode=REVIEW.includes(S.prevMode)?'profile':S.prevMode; S.card=null; render(); }
 if(e.target.closest('#b-harness')) runHarness();
 if(e.target.closest('#b-refresh')){ S.state=null; render(); }
 /* 1.5: an allowed channel refused at dispatch. only in ?state=blocked; otherwise the
    prototype places nothing. the notice says nothing was sent. */
 const ch=e.target.closest('[data-ch]');
 if(ch&&S.state==='blocked'&&ch.getAttribute('aria-disabled')!=='true'){ S.dispatch=ch.dataset.ch; render(); }
});
/* a click inside the product, outside the strip, means the reviewer wants to explore: pause */
document.addEventListener('pointerdown',e=>{
 if(S.step&&!S.paused&&!e.target.closest('#story,#rbar')) pauseStory();
},true);
/* tour keys: forward arrow / back arrow follow reading direction; Backspace back; Esc explore */
document.addEventListener('keydown',e=>{
 if(!S.step||S.paused||e.target.matches('input,textarea,select')||e.target.closest('.dd')) return;
 const fwd=S.lang==='ar'?'ArrowLeft':'ArrowRight', bwd=S.lang==='ar'?'ArrowRight':'ArrowLeft';
 if(e.key==='Escape'){ e.preventDefault(); exitStory(); }
 else if(e.key===fwd){ e.preventDefault(); S.step===STEPS.length?exitStory():goStep(S.step+1,true); }
 else if((e.key===bwd||e.key==='Backspace')&&S.step>1){ e.preventDefault(); goStep(S.step-1,true); }
});
window.addEventListener('popstate',()=>{
 const p=new URLSearchParams(location.search),n=+p.get('step');
 if(n>=1&&n<=STEPS.length) goStep(n,false); else if(S.step){ S.step=0; render(); }
});
window.addEventListener('resize',()=>placeSpot());
/* columns scroll under the spotlight: keep it on its target */
document.addEventListener('scroll',()=>{ if(S.step&&!S.paused) placeSpot(); },true);

readUrl();
fit();
/* landing (plan decision 1): a first visit with a bare link starts the tour at step 1;
   ?step=n opens that step; any other link opens free explore */
const firstVisit=(()=>{try{return !localStorage.getItem('cg-toured');}catch(e){return false;}})();
const stepQ=+Q.get('step');
if(stepQ>=1&&stepQ<=STEPS.length) goStep(stepQ,false);
else if(firstVisit&&!location.search) goStep(1,false);
else render();
