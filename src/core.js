// clock, formatters, state, selectors, escalation logic. changes rarely.

/* ═══ 0 · clock. every derived figure computed against it, and stamped. ═══ */
const TODAY=new Date(2026,8,11), DAY=864e5;
const days=iso=>Math.round((TODAY-new Date(iso))/DAY);
/* ═══ 3 · formatters. one per locale. Western digits + Gregorian, pinned. ═══ */
const F={
 en:{m:new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',maximumFractionDigits:0}),
     d:new Intl.DateTimeFormat('en-AE-u-ca-gregory',{day:'numeric',month:'short',year:'numeric'}),
     dt:new Intl.DateTimeFormat('en-AE-u-ca-gregory',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}),
     n:new Intl.NumberFormat('en-AE')},
 ar:{m:new Intl.NumberFormat('ar-AE-u-nu-latn',{style:'currency',currency:'AED',maximumFractionDigits:0}),
     d:new Intl.DateTimeFormat('ar-AE-u-ca-gregory-nu-latn',{day:'numeric',month:'short',year:'numeric'}),
     dt:new Intl.DateTimeFormat('ar-AE-u-ca-gregory-nu-latn',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}),
     n:new Intl.NumberFormat('ar-AE-u-nu-latn')}};

let S={rec:'omar',lang:'en',sel:0,tab:'i',scope:'a',compare:false,entry:false,justLogged:null};

const t=()=>T[S.lang];
const L=o=>o==null?null:(typeof o==='string'?o:(o[S.lang]??o.en));
const rec=()=>R[S.rec];
const dash=()=>'<span class="empty">–</span>';
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const M=v=>v==null?dash():F[S.lang].m.format(v);
const D=v=>v?F[S.lang].d.format(new Date(v)):dash();
const DT=v=>v?F[S.lang].dt.format(new Date(v)):dash();
const N=v=>v==null?dash():F[S.lang].n.format(v);
const ltr=s=>s?`<span class="ltr num">${esc(s)}</span>`:dash();   // inline island only
const E=(g,k)=>(t().e[g]&&t().e[g][k])||k;

/* accounts always sorted by outstanding desc. deterministic, never by flag. */
const accts=()=>[...rec().accts].sort((a,b)=>b.out-a.out);
const acc=()=>accts()[Math.min(S.sel,accts().length-1)];
const dpd=a=>days(a.due);
const sumOut=r=>r.accts.reduce((s,a)=>s+a.out,0);
const sumTot=r=>r.accts.reduce((s,a)=>s+a.total,0);
const worst=r=>r.accts.reduce((w,a)=>dpd(a)>dpd(w)?a:w,r.accts[0]);
/* ═══ 4 · escalation line. computed from existing fields, capped at two shown. ═══ */
function reasons(r){
 const o=[],T_=t();
 r.accts.forEach(a=>{
  if(a.status==='disputed'&&a.dispute) o.push({s:5,ref:a.ref,x:T_.r.dispute(L(a.lender),D(a.dispute.date))});
 });
 if(r.hardship) o.push({s:4,ref:r.accts[0].ref,x:T_.r.hardship(D(r.hardship))});
 r.accts.forEach(a=>{ if(a.broken>0) o.push({s:3,ref:a.ref,x:T_.r.broken(a.broken,L(a.lender))}); });
 if(r.calls.ai>0&&r.calls.h===0) o.push({s:2,ref:null,x:T_.r.first(r.calls.ai)});
 return o.sort((a,b)=>b.s-a.s);
}
/* only the accounts the line names may carry coral. 1 band + max 2 cards = the budget. */
const hot=r=>new Set(reasons(r).slice(0,2).map(x=>x.ref).filter(Boolean));
