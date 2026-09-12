// nav, render, live audit, event wiring.

/* ═══ 11 · nav + render ═══ */
function nav(){
 const n=t().nav;
 const i=(k,on)=>`<div class="item${on?' on':''}"><span class="label">${esc(k)}</span></div>`;
 return `<div class="logo">ClearGrid<small>كليرجريد</small></div>
  <div class="gl">${esc(n.p)}</div>${i(n.dash)}${i(n.bor,1)}${i(n.acc)}
  <div class="gl">${esc(n.sup)}</div>${i(n.inbox)}${i(n.tick)}
  <div class="gl">${esc(n.tools)}</div>${i(n.rep)}${i(n.ai)}${i(n.camp)}${i(n.wf)}
  <div class="nav-lang">
   <button data-v="en"${S.lang==='en'?' class="on"':''}>English</button>
   <button data-v="ar"${S.lang==='ar'?' class="on"':''}>العربية</button>
  </div>`;
}

function render(){
 document.documentElement.lang=S.lang;
 document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';
 const list=accts(); if(S.sel>=list.length) S.sel=0;
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
const G=['name','why','ai','out','dpd','ptp','rail'];
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
  <div class="m"><span>Glance facts in first screen</span><span class="${c(vis.length===G.length,vis.length>=5)}">${vis.length}/${G.length}</span></div>
  <div class="m"><span>Page scroll</span><span class="${c(scroll<=1.02,scroll<=1.3)}">${scroll}× viewport</span></div>
  <div class="m"><span>Clicks to all brief data</span><span class="${c(clicks<=4,clicks<=9)}">${clicks}</span></div>
  <div class="m"><span>Coral elements on screen</span><span class="${c(alerts<=3,alerts<=5)}">${alerts} / 3</span></div>
  <div class="m"><span>Accounts</span><span>${accts().length}</span></div>
  <div class="h">Glance set: name, escalation reason, last AI outcome, outstanding, worst DPD,
   promise state, action rail. Clicks = inactive tabs + account switches. No accordions exist.</div>`;
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
 S.lang=b.dataset.v; render();
});
const chk=(id,f)=>document.getElementById(id).addEventListener('change',e=>f(e.target.checked));
chk('c-notes',v=>document.body.classList.toggle('notes',v));
chk('c-grey',v=>document.body.classList.toggle('t-grey',v));
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

function wire(){
 const s=document.getElementById('stack');
 s.querySelectorAll('[data-a]').forEach(el=>el.addEventListener('click',()=>{
  S.sel=+el.dataset.a;S.compare=false;S.entry=false;render();}));
 s.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>{S.tab=b.dataset.t;render();}));
 const on=(id,f)=>{const e=document.getElementById(id); if(e)e.addEventListener('click',f);};
 on('b-compare',()=>{S.compare=!S.compare;render();});
 on('b-scope',()=>{S.scope=S.scope==='a'?'all':'a';render();});
 on('b-entry',()=>{S.entry=true;render();});
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
}
window.addEventListener('resize',()=>requestAnimationFrame(audit));
S.sel=defaultSel();
render();
