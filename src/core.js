// clock, formatters, state, selectors, escalation logic. changes rarely.

/* ═══ 0 · clock. every derived figure computed against it, and stamped.
   pinned to Dubai midnight so a reviewer in any time zone sees the same dates. ═══ */
const TODAY=new Date('2026-09-11T00:00:00+04:00'), TODAY_ISO='2026-09-11', DAY=864e5, TZ='Asia/Dubai';
/* fixture times are Dubai wall time without an offset; date-only strings are calendar dates */
const when=v=>new Date(/T\d\d:\d\d$/.test(v)?v+':00+04:00':v);
const days=iso=>Math.round((TODAY-when(iso))/DAY);
/* ═══ 3 · formatters. one per locale. Western digits + Gregorian, pinned (D10).
   currency follows the record's market; built once per lang+currency. ═══ */
const LOC={en:'en-AE-u-ca-gregory',ar:'ar-AE-u-ca-gregory-nu-latn'},NLOC={en:'en-AE',ar:'ar-AE-u-nu-latn'};
const CUR={AE:'AED',SA:'SAR'};
const F={en:{},ar:{}};
['en','ar'].forEach(l=>Object.assign(F[l],{
 d:new Intl.DateTimeFormat(LOC[l],{day:'numeric',month:'short',year:'numeric',timeZone:TZ}),
 dt:new Intl.DateTimeFormat(LOC[l],{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:TZ}),
 n:new Intl.NumberFormat(NLOC[l])}));
const money=(l,c)=>F[l]['m'+c]||(F[l]['m'+c]=new Intl.NumberFormat(NLOC[l],{style:'currency',currency:c,maximumFractionDigits:0}));
/* A10: typed Arabic-Indic / Persian digits and Arabic separators become Western before parsing */
const toWesternDigits=s=>String(s).replace(/[٠-٩۰-۹]/g,c=>(c.charCodeAt(0)&15)%10)
 .replace(/٫/g,'.').replace(/[٬,\s]/g,'');
/* privacy default, not a legal requirement found: keep the first 3 and last digit */
const maskId=s=>{const n=s.replace(/\D/g,'').length;let i=0;return s.replace(/\d/g,c=>(i++<3||i===n)?c:'•');};

/* ═══ 3.1 · channel rules (goals 1.9). a state's reason and its source depend on market.
   src null = no regulation found: shown as the client's own policy, never as law. ═══ */
const SRC={
 cbuae:{t:'CBUAE 5.2.5',u:'https://rulebook.centralbank.ae/en/rulebook/article-5-business-conduct'},
 /* current SAMA Debt Collection Regulations (node/10400). the 2018 text (node/1696) is marked "no longer applicable".
    articles as read by the council's compliance reviewer from a summary, to be checked against the PDF before production */
 sama43:{t:'SAMA Art. 4(3)',u:'https://rulebook.sama.gov.sa/en/node/10400'},
 sama51:{t:'SAMA Art. 5(1)',u:'https://rulebook.sama.gov.sa/en/node/10400'},
 sama64:{t:'SAMA Art. 6(4)',u:'https://rulebook.sama.gov.sa/en/node/10400'},
 cg:{t:'cg',u:'https://cleargrid.co'},
 data:{t:'data'}};   // not a rule: the record itself has no address to use
function chRule(k,m){
 const sa=m==='SA';
 return {window:{r:'window',s:sa?null:SRC.cbuae},
  cap:{r:sa?'capSama':'capClient',s:sa?SRC.sama43:null},
  consent:{r:'consent',s:SRC.cbuae},
  notPermitted:{r:'notPermitted',s:SRC.sama51},
  complaint:{r:'complaint',s:SRC.sama64},
  review:{r:'review',s:null},
  dnc:{r:'dnc',s:SRC.cg},
  noPhone:{r:'noPhone',s:SRC.data},noMail:{r:'noMail',s:SRC.data}}[k]||null;
}

/* mode: 'queue' (case list, screen zero) | 'profile' | 'compare' | 'wrapup' (post-call write) */
let S={rec:'stress',lang:'en',sel:0,tab:'i',scope:'all',mode:'profile',wrapDone:false,justLogged:null,navCollapsed:false,showId:false,
 step:0,paused:false,ann:false,prop:false,state:null,dispatch:null,card:null,prevMode:'profile'};

const t=()=>T[S.lang];
const L=o=>o==null?null:(typeof o==='string'?o:(o[S.lang]??o.en));
const rec=()=>R[S.rec];
const dash=()=>'<span class="empty">–</span>';
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const M=(v,r=rec())=>v==null?dash():money(S.lang,CUR[r.market]||'AED').format(v);
const D=v=>v?F[S.lang].d.format(when(v)):dash();
const DT=v=>v?F[S.lang].dt.format(when(v)):dash();
const N=v=>v==null?dash():F[S.lang].n.format(v);
const ltr=(s,plain)=>s?`<span class="ltr${plain?'':' num'}" title="${esc(s)}">${esc(s)}</span>`:dash();   // inline island only; plain=phone/email text, not an ID
/* plain-text bidi isolate (FSI…PDI) for an ID inside a sentence that is escaped as text */
const iso=s=>'\u2068'+s+'\u2069';
const E=(g,k)=>(t().e[g]&&t().e[g][k])||k;
/* a Latin-script name inside Arabic UI text: tagged lang=en and isolated (bdi), so screen readers and bidi both treat it as English */
const lat=s=>S.lang==='ar'&&s&&!/[؀-ۿ]/.test(s)?`<bdi lang="en">${esc(s)}</bdi>`:esc(s);
/* nationality is stored as ISO-3; shown as the country name in the UI language (Intl, never hand-written) */
const NAT2={JOR:'JO',SAU:'SA',ARE:'AE',IND:'IN',LBN:'LB'};
const natName=c=>{try{return new Intl.DisplayNames(S.lang,{type:'region'}).of(NAT2[c]||c)}catch(e){return c}};

/* accounts always sorted by outstanding desc. deterministic, never by flag.
   takes an optional record so the queue screen can sort accounts of a borrower
   that isn't the currently-loaded one, without duplicating this logic. */
const accts=(r=rec())=>[...r.accts].sort((a,b)=>b.out-a.out);
const acc=()=>accts()[Math.min(S.sel,accts().length-1)];
const dpd=a=>days(a.due);
const sumOut=r=>r.accts.reduce((s,a)=>s+a.out,0);
const sumTot=r=>r.accts.reduce((s,a)=>s+a.total,0);
const worst=r=>r.accts.reduce((w,a)=>dpd(a)>dpd(w)?a:w,r.accts[0]);
/* ═══ 4 · escalation line. computed from existing fields, capped at two shown.
   x = the spine's full sentence; k + d = the queue's type label and specifics. ═══ */
function reasons(r){
 const o=[],T_=t();
 r.accts.forEach(a=>{
  if(a.status==='disputed'&&a.dispute) o.push({s:5,k:'dispute',ref:a.ref,x:T_.r.dispute(L(a.lender),iso(a.ref),D(a.dispute.date)),d:T_.rd.dispute(L(a.lender),D(a.dispute.date))});
 });
 if(r.hardship) o.push({s:4,k:'hardship',ref:r.accts[0].ref,x:T_.r.hardship(D(r.hardship)),d:T_.rd.hardship(D(r.hardship))});
 r.accts.forEach(a=>{ if(a.broken>0) o.push({s:3,k:'broken',ref:a.ref,x:T_.r.broken(a.broken,L(a.lender),iso(a.ref)),d:T_.rd.broken(a.broken,L(a.lender))}); });
 if(r.calls.ai>0&&r.calls.h===0) o.push({s:2,k:'first',ref:null,x:T_.r.first(r.calls.ai),d:T_.rd.first(r.calls.ai)});
 return o.sort((a,b)=>b.s-a.s);
}
/* only the accounts the line names may carry coral. 1 band + max 2 cards = the budget. */
const hot=r=>new Set(reasons(r).slice(0,2).map(x=>x.ref).filter(Boolean));
