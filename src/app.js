// nav, render, live audit, event wiring.

/* ═══ 11 · nav + render ═══ */
const MARK='<svg class="logo-mark" viewBox="0 0 24 24" fill="#fff"><path d="M2,2 H22 V14 L14,22 H2 Z"/></svg>';
function nav(){
 const n=t().nav;
 const i=(k,ic,on)=>`<div class="item${on?' on':''}">${icon(ic)}<span class="label">${esc(k)}</span></div>`;
 return `<div class="nav-scroll">
   <div class="logo">${MARK}<span class="word"><b>ClearGrid</b><small>كليرجريد</small></span></div>
   <div class="gl">${esc(n.p)}</div>${i(n.dash,'dash')}${i(n.bor,'users',1)}${i(n.acc,'wallet')}
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
 document.getElementById('stack').innerHTML=spine()+
  `<div class="cols${S.compare?' compare':''}">${borrowerCol()}${S.compare?compareView():accountCol()+activityCol()}</div>`;
 /* harness dir switch is a separate control on the same state — keep its highlight in sync */
 document.querySelectorAll('#sw-dir button').forEach(b=>
  b.classList.toggle('on',(b.dataset.v==='rtl')===(S.lang==='ar')));
 wire(); requestAnimationFrame(audit);
}

/* default selection: the account the escalation line names, else the largest. */
function defaultSel(){
 const h=hot(rec()),list=accts();
 const i=list.findIndex(a=>h.has(a.ref));
 return i<0?0:i;
}
/* ═══ 12 · audit. the layout choice is measured, not asserted. ═══ */
const G=['name','why','out','dpd','ptp','rail'];
function audit(){
 const vh=window.innerHeight;
 const vis=G.filter(k=>{const e=document.querySelector(`[data-g="${k}"]`);
  if(!e)return false;const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=vh+1;});
 const gated=document.querySelectorAll('[data-gated="1"]').length;
 const clicks=gated+Math.max(0,accts().length-1);
 const alerts=document.querySelectorAll('[data-alert="1"]').length;
 const scroll=Math.max(1,Math.round((document.documentElement.scrollHeight/vh)*10)/10);
 const c=(ok,mid)=>ok?'good':(mid?'mid':'bad');
 document.getElementById('auditb').innerHTML=`
  <div class="m"><span>Glance facts in first screen</span><span class="${c(vis.length===G.length,vis.length>=4)}">${vis.length}/${G.length}</span></div>
  <div class="m"><span>Page scroll</span><span class="${c(scroll<=1.02,scroll<=1.3)}">${scroll}× viewport</span></div>
  <div class="m"><span>Clicks to all brief data</span><span class="${c(clicks<=4,clicks<=9)}">${clicks}</span></div>
  <div class="m"><span>Coral elements on screen</span><span class="${c(alerts<=3,alerts<=5)}">${alerts} / 3</span></div>
  <div class="m"><span>Accounts</span><span>${accts().length}</span></div>
  ${behavChecks()}
  <div class="h">Glance set: name, escalation reason, outstanding, worst DPD, promise state, action
   rail. Clicks = inactive tabs + account switches. No accordions exist.</div>`;
}
/* ═══ 12.1 · behavioural audit (T4). per-record pass/fail on the facts the agent must reach. ═══ */
function behavChecks(){
 const r=rec(),html=document.body.innerText||'';
 const has=s=>html.indexOf(s)>=0;
 let checks=[];
 if(S.rec==='omar'){
  checks=[
   ['Dispute is the escalation reason', reasons(r)[0]&&reasons(r)[0].x.toLowerCase().includes('disput')],
   ['Disputed account has the dot + reason cue', has(t().reasonCue)],
   ['WhatsApp shown restricted', r.ch.wa!=='ok'],
  ];
 } else if(S.rec==='aisha'){
  checks=[
   ['Hardship is the escalation reason', reasons(r)[0]&&reasons(r)[0].x.toLowerCase().includes('hardship')],
   ['Open promise visible in glance', !!document.querySelector('[data-g="ptp"] .t-display:not(.empty)')],
   ['Call available', !document.querySelector('.rail .act')?.classList.contains('off')],
  ];
 } else if(S.rec==='stress'){
  const list=accts();
  checks=[
   ['Largest account leads the rail', list[0]===[...list].sort((a,b)=>b.out-a.out)[0]],
   ['Every account reachable in one click', document.querySelectorAll('.card[data-a]').length===list.length],
   ['Compare reachable in one click', !!document.getElementById('b-compare')],
  ];
 } else {
  checks=[
   ['Nulls render as dash, not blank', !!document.querySelector('.empty')],
   ['Labels persist beside empty values', !!document.querySelector('.row.is-empty .k')],
   ['Three-column layout holds', document.querySelectorAll('.cols>.col').length>=2],
  ];
 }
 return `<div class="h" style="margin-block-start:9px;opacity:.85">Behavioural checks — ${esc(S.rec)}</div>` +
  checks.map(([label,ok])=>
   `<div class="m"><span>${esc(label)}</span><span class="${ok?'good':'bad'}">${ok?'pass':'fail'}</span></div>`).join('');
}
/* ═══ 13 · events ═══ */
function seg(id,fn){
 document.getElementById(id).addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  [...e.currentTarget.querySelectorAll('button')].forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); fn(b.dataset.v);});
}
seg('sw-rec',v=>{S.rec=v;S.compare=false;S.entry=false;S.justLogged=null;S.sel=0;S.sel=defaultSel();render();});
seg('sw-dir',v=>{S.lang=v==='rtl'?'ar':'en';render();});
/* product nav's own EN/AR toggle — #nav's innerHTML is replaced each render, so this listener
   is delegated on the persistent container rather than rebound per render like wire(). */
document.getElementById('nav').addEventListener('click',e=>{
 const b=e.target.closest('.nav-lang button'); if(!b)return;
 /* collapsed rail only shows the active button (the inactive one is display:none),
    so clicking it must flip rather than re-set the same value or it would be a dead end. */
 S.lang=(b.dataset.v===S.lang)?(S.lang==='en'?'ar':'en'):b.dataset.v; render();
});
const chk=(id,f)=>document.getElementById(id).addEventListener('change',e=>f(e.target.checked));
chk('c-squint',v=>document.body.classList.toggle('t-squint',v));
document.getElementById('audit').addEventListener('click',e=>{
 if(e.target.closest('h4')) document.getElementById('audit').classList.toggle('open');});

/* keyboard: selection is a many-times-a-day action, so it gets no animation */
document.addEventListener('keydown',e=>{
 if(e.target.matches('input,textarea,select'))return;
 const n=parseInt(e.key,10);
 if(n>=1&&n<=9&&accts()[n-1]){S.sel=n-1;S.compare=false;render();}
 if(e.key==='c'){S.compare=!S.compare;render();}
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
  S.sel=+el.dataset.a;S.compare=false;S.entry=false;render();}));
 s.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>{S.tab=b.dataset.t;render();}));
 const on=(id,f)=>{const e=document.getElementById(id); if(e)e.addEventListener('click',f);};
 on('b-compare',()=>{S.compare=!S.compare;render();});
 on('b-scope',()=>{S.scope=S.scope==='a'?'all':'a';render();});
 on('b-entry',()=>{S.entry=true;render();});
 on('b-inbox',()=>{S.compare=false;S.tab='m';S.scope='all';render();});
 on('e-cancel',()=>{S.entry=false;render();});
 on('e-save',()=>{
  const a=acc(),r=rec();
  const out=document.getElementById('e-out').value;
  const note=document.getElementById('e-note').value.trim();
  const amt=parseFloat(document.getElementById('e-amt').value.replace(/[^\d.]/g,''));
  const date=document.getElementById('e-date').value;
  const entry={at:new Date().toISOString().slice(0,16),a:a.ref,src:'phone',dir:'out',out,
    by:r.owner||'Agent',note:note?{en:note,ar:note}:null};
  r.logs.unshift(entry); S.justLogged=entry;
  /* one write, three synchronised reads: spine stat, account card, this list */
  if(amt&&date){ a.ptp={amt,date,state:'open'}; }
  S.entry=false; S.tab='i'; render();
 });
 on('b-navcollapse',()=>{S.navCollapsed=!S.navCollapsed;render();});
 wireNavFlyout();
}
window.addEventListener('resize',()=>requestAnimationFrame(audit));
S.sel=defaultSel();
render();
