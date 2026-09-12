// spine + the three scope columns + compare view.

/* ═══ 6 · REGION 1 · spine ═══ */
function spine(){
 const r=rec(),T_=t(),n=r.accts.length,w=worst(r),rs=reasons(r);
 const openAccts=r.accts.filter(a=>a.ptp&&a.ptp.state==='open');
 const openPtp=openAccts[0];
 const brokenN=r.accts.reduce((s,a)=>s+a.broken,0);
 /* T1: never a bare amount. multi-account records name the account + a count-across-accounts
    line in `sub`; single-account records keep the short date form. Always exactly
    eyebrow -> t-display -> sub, same shape as the other two spine stats, never a 3rd row. */
 const promise=openPtp
   ? (n>1
     ? `<div class="t-display">${M(openPtp.ptp.amt)}</div><span class="sub">${esc(T_.promiseAcross(openAccts.length,n))} · ${esc(E('product',openPtp.product))}</span>`
     : `<div class="t-display">${M(openPtp.ptp.amt)}</div><span class="sub">${esc(T_.promised)} ${D(openPtp.ptp.date)}${brokenN?` · ${esc(T_.brokenN(brokenN))}`:''}</span>`)
   : `<div class="t-display empty">${esc(T_.noPromise)}</div><span class="sub">${brokenN?esc(T_.brokenN(brokenN)):'&nbsp;'}</span>`;

 const chOff=k=>k==='review'||k==='dnc';
 const btn=(k,label,pri,id)=>{
   const off=chOff(r.ch[k]);
   return `<button ${id?`id="${id}"`:''} class="act ${pri&&!off?'primary':''} ${off?'off':''}" ${off?'disabled':''}>
     <span>${esc(label)}</span></button>`;
 };

 const band=rs.length
  ? `<div class="why" data-alert="1" data-g="why"><span class="badge alert"><i class="dot"></i>${esc(T_.why)}</span>
     <span><b>${esc(rs[0].x)}</b>${rs[1]?` ${esc(rs[1].x)}`:''}${rs.length>2?` <span class="dim">${esc(T_.more(rs.length-2))}</span>`:''}</span></div>`
  : `<div class="why calm" data-g="why"><span>${esc(T_.calm)}</span></div>`;

 return `<div class="spine">
  <div class="spine-row">
   <div class="idb">
    <div class="avatar">${esc(r.ini)}</div>
    <div>
     <div class="names" data-g="name"><span class="n1">${esc(L(r.name))}</span>
      <span class="n2">${esc(S.lang==='en'?r.name.ar:r.name.en)}</span></div>
     <div class="idline">
      <span class="badge teal">${esc(E('stage',r.stage))}</span>
      <span>${esc(T_.f.lang)}: <b>${r.lang?(r.lang==='ar'?(S.lang==='en'?'Arabic':'العربية'):(S.lang==='en'?'English':'الإنجليزية')):dash()}</b></span>
      <span>${esc(T_.f.owner)}: ${r.owner?esc(r.owner):dash()}</span>
     </div>
    </div>
   </div>
   <div class="stats">
    <div class="stat" data-g="out"><span class="eyebrow">${esc(T_.outstanding)}</span>
     <div class="t-display">${M(sumOut(r))}</div>
     <span class="sub">${esc(T_.across(n))} · ${esc(T_.original)} ${M(sumTot(r))}</span></div>
    <div class="stat" data-g="dpd"><span class="eyebrow">${esc(T_.worstDpd)}</span>
     <div class="t-display">${N(dpd(w))}</div>
     <span class="sub">${esc(T_.on)} ${esc(L(w.lender))} · ${esc(T_.asOf)} ${D(TODAY.toISOString())}</span></div>
    <div class="stat" data-g="ptp"><span class="eyebrow">${esc(T_.promise)}</span>
     ${promise}</div>
   </div>
  </div>
  <div class="band">
   ${band}
  </div>
  <div class="rail" data-g="rail">
   ${btn('call',T_.call,true)}${btn('sms',T_.sms)}${btn('wa',T_.wa)}${btn('email',T_.email)}
   ${btn('email',T_.emailInbox,false,'b-inbox')}
  </div>
 </div>`;
}
/* ═══ 7 · REGION 2 · borrower column ═══ */
function borrowerCol(){
 const r=rec(),T_=t(),h=hot(r),list=accts();
 const cards=list.map((a,i)=>{
  const flag=h.has(a.ref),p=Math.round((a.out/a.total)*100);
  /* T3: the card already spends one coral element on its status badge when disputed+flagged.
     the dot is a fallback, not an addition — it only fires when neither badge on this card
     is already carrying the coral for the same fact, so one alert is never marked twice. */
  const dotDue=flag&&a.status!=='disputed';
  return `<div class="card${i===S.sel?' on':''}${flag?' hot':''}" data-a="${i}">
   ${i<9?`<span class="kbd">${i+1}</span>`:''}
   <div class="t-pri">${dotDue?'<i class="flagdot"></i>':''}${esc(L(a.lender))}</div>
   <div class="t-sec">${esc(E('product',a.product))} · ${ltr(a.ref)}</div>
   <div class="card-r"><span class="t-display sm">${M(a.out)}</span>
    <span class="t-sec">${esc(T_.of)} ${M(a.total)}</span></div>
   <div class="bar"><i style="inline-size:${p}%"></i></div>
   <div class="card-b">${statusBadge(a,flag)}${dpdBadge(a,flag&&a.status!=='disputed')}
    ${a.broken?`<span class="badge q">${esc(T_.brokenN(a.broken))}</span>`:''}
    ${a.plan?`<span class="badge ok">${M(a.plan.emi)}/${S.lang==='en'?'mo':'شهر'}</span>`:''}</div>
   ${dotDue?`<div class="t-sec reasoncue">${esc(T_.reasonCue)}</div>`:''}
  </div>`;
 }).join('');

 const c=r.calls||{};
 const contactHistory=(c.h||c.ai)?`<div class="rows grid2">
   ${row(T_.f.humanCalls,N(c.h))}${row(T_.f.aiCalls,N(c.ai))}
   ${row(T_.f.lastHuman,c.lastH?DT(c.lastH):null)}${row(T_.lastAi,c.lastAi?DT(c.lastAi):null)}
  </div>
  <div class="row prose">${c.ai_sum?esc(L(c.ai_sum)):`<span class="empty">${esc(T_.noAi)}</span>`}</div>
  ${sparkline(r.logs)}`
  :`<div class="emptyline">${esc(T_.noContact)}</div>`;

 return `<div class="col" id="c-bor">
  <div class="colhead"><span class="eyebrow">${esc(T_.accounts)} · ${N(list.length)}</span>
   <button class="mini" id="b-compare">${esc(S.compare?T_.back:T_.compare)}</button></div>
  <div class="colbody">
   <div class="totals"><span class="eyebrow">${esc(T_.outstanding)}</span>
    <span class="t-pri num">${M(sumOut(r))}</span></div>
   ${cards}
   ${block('calls',contactHistory)}
   <!-- single-column on purpose: at 320px this column only has ~64px of label space, and
        labels like "Emirates ID" / "Date of birth" need close to that — a 2-column split
        would wrap them. Fields ordered narrow-first, wide-last so no row goes stranded. -->
   <div class="blk"><div class="blk-h"><span class="eyebrow">${esc(T_.reference)}</span></div>
    <div class="blk-b"><div class="rows">
     ${row(T_.f.dob,r.dob?D(r.dob):null)}
     ${row(T_.f.gender,r.gender?esc(E('gender',r.gender)):null)}
     ${row(T_.f.nat,r.nat?esc(r.nat):null)}
     ${row(T_.f.submit,r.submit?D(r.submit):null)}
     ${row(T_.f.phone,r.phone?ltr(r.phone,true):null)}
     ${row(T_.f.mail,r.mail?ltr(r.mail,true):null)}
     ${row(T_.f.visa,r.visa?esc(L(r.visa)):null)}
     ${row(T_.f.eid,r.eid?ltr(r.eid):null)}
    </div></div></div>
  </div></div>`;
}
/* ═══ 8 · REGION 3 · account column. fixed block order, no disclosure controls. ═══ */
function accountCol(){
 const a=acc(),T_=t(),d=dpd(a),p=Math.round((a.out/a.total)*100);

 const balance=block('balance',`
  <div class="hero">
   <div class="stat"><span class="eyebrow">${esc(T_.f.out)}</span>
    <div class="t-display">${M(a.out)}</div>
    <span class="sub">${N(p)}% ${esc(T_.of)} ${M(a.total)}</span>
    <div class="bar"><i style="inline-size:${p}%"></i></div></div>
   <div class="stat"><span class="eyebrow">${esc(T_.f.dpd)}</span>
    <div class="t-display">${N(d)}</div>
    <span class="sub">${esc(T_.asOf)} ${D(TODAY.toISOString())}</span></div>
  </div>
  <div class="rows grid2">
   ${row(T_.f.over,M(a.over))}${row(T_.f.due,D(a.due))}
   ${row(T_.f.principal,M(a.principal))}${row(T_.f.interest,a.interest?esc(a.interest):null)}
   ${row(T_.f.status,statusBadge(a,false))}${row(T_.f.product,esc(E('product',a.product)))}
   ${row(T_.f.lender,esc(L(a.lender)))}${row(T_.f.merchant,a.merchant?esc(L(a.merchant)):null)}
   ${row(T_.f.ref,ltr(a.ref))}${row(T_.f.acctRef,ltr(a.aref))}
  </div>`);

 const plan=block('plan',a.plan?`<div class="rows grid2">
   ${row(T_.f.emi,M(a.plan.emi))}${row(T_.f.next,D(a.plan.next))}
   ${row(T_.f.paid,`${N(a.plan.paid)} ${esc(T_.of)} ${N(a.plan.of)}`)}${row(T_.f.flags,esc(L(a.plan.flags)))}
  </div><div class="bar plan"><i style="inline-size:${Math.round(a.plan.paid/a.plan.of*100)}%"></i></div>`
  :`<div class="emptyline">${S.lang==='en'?'No payment plan on this account.':'لا توجد خطة سداد على هذا الحساب.'}</div>`);

 const promises=block('promises',(a.ptp||a.broken)?`<div class="rows grid2">
   ${row(T_.f.ptpAmt,a.ptp?M(a.ptp.amt):null)}${row(T_.f.ptpDate,a.ptp?D(a.ptp.date):null)}
   ${row(T_.f.ptpState,a.ptp?`<span class="badge ${a.ptp.state==='broken'?'q':'ok'}">${esc(E('ptp',a.ptp.state))}</span>`:null)}
   ${row(T_.f.broken,N(a.broken))}
   ${row(T_.f.brokenLast,a.brokenLast?D(a.brokenLast):null)}
   ${row(T_.f.brokenType,a.brokenType?esc(E('brokenType',a.brokenType)):null,false,true)}
  </div>`:`<div class="emptyline">${esc(T_.noPromise)}</div>`);

 const f=a.fields||{},fv=k=>f[k]===undefined?null:(f[k]==='yes'?esc(T_.yes):f[k]==='no'?esc(T_.no):esc(L(f[k])));
 const fields=block('fields',`<div class="rows grid2">
   ${row(T_.f.disputed,a.dispute?`<span class="badge q">${esc(T_.yes)}</span>`:esc(T_.no))}
   ${row(T_.f.disputeWhy,a.dispute?esc(L(a.dispute.why)):null)}
   ${row(T_.f.verif,fv('verif'))}${row(T_.f.settle,fv('settle'))}
   ${row(T_.f.churn,fv('churn'))}${row(T_.f.repo,fv('repo'))}
   ${row(T_.f.hardship,fv('hardship'))}${row(T_.f.employer,fv('employer'))}
  </div>`);

 const m=a.meta||{};
 const meta=block('meta',`<div class="rows grid2">
   ${row(T_.f.cby,esc(m.cby))}${row(T_.f.cat,D(m.cat))}
   ${row(T_.f.uby,esc(m.uby))}${row(T_.f.uat,D(m.uat))}
   ${row(T_.f.lenderId,ltr(a.lid),false,true)}
  </div>`);

 return `<div class="col" id="c-acc">
  <div class="colhead"><span class="eyebrow">${esc(T_.selected)} · ${esc(L(a.lender))} · ${esc(E('product',a.product))} · ${ltr(a.ref)}</span>${statusBadge(a,false)}</div>
  <div class="colbody">
   ${balance}${plan}${promises}${fields}${meta}
  </div></div>`;
}
/* ═══ 9 · REGION 4 · activity column + entry mode ═══ */
function activityCol(){
 const r=rec(),a=acc(),T_=t();
 const filt=l=>S.scope==='a'?l.filter(x=>x.a===a.ref):l;
 const tabs=[['i',T_.tab.i],['m',T_.tab.m],['t',T_.tab.t],['k',T_.tab.k]];

 let body='';
 if(S.tab==='i'||S.tab==='m'){
  const list=filt(S.tab==='i'?r.logs:r.msgs).sort((x,y)=>new Date(y.at)-new Date(x.at));
  body=list.length?list.map(x=>{
   const an=(r.accts.find(z=>z.ref===x.a)||{}).lender;
   const cls=x===S.justLogged?'new':(x.src==='ai'?'ai':'');
   return `<div class="log ${cls}"><span class="when num">${DT(x.at)}</span><span>
    <b class="t-pri">${esc(E('out',x.out))}</b>
    <span class="t-sec"> ${esc(E('src',x.src))} · ${esc(E('dir',x.dir))}</span>
    ${x.note?`<div>${esc(L(x.note))}</div>`:''}
    <div class="meta">${esc(x.by)}${S.scope==='all'&&an?` · ${esc(L(an))}`:''}</div></span></div>`;
  }).join(''):`<div class="emptyline">${esc(T_.noLogs)}</div>`;
 } else if(S.tab==='t'){
  body=r.time.length?r.time.map(x=>`<div class="log"><span class="when num">${D(x.at)}</span>
   <span>${esc(L(x.t))}</span></div>`).join(''):`<div class="emptyline">${esc(T_.noTimeline)}</div>`;
 } else body=`<div class="emptyline">${esc(T_.noTickets)}</div>`;

 const entry=S.entry?`<div class="entry">
   <span class="eyebrow">${esc(T_.logOutcome)} · ${ltr(a.ref)}</span>
   <div class="f">
    <select id="e-out">${['rpc','noans','promise','callback','dispute','hardship','wrong'].map(k=>`<option value="${k}">${esc(E('out',k))}</option>`).join('')}</select>
    <input type="text" id="e-note" placeholder="${esc(T_.notes)}">
   </div>
   <div class="f"><span class="t-sec">${esc(T_.setPtp)}</span>
    <input type="text" id="e-amt" style="max-inline-size:96px" placeholder="AED" dir="ltr">
    <input type="date" id="e-date" dir="ltr">
    <button class="mini pri" id="e-save">${esc(T_.save)}</button>
    <button class="mini" id="e-cancel">${esc(T_.cancel)}</button>
   </div></div>`:'';

 return `<div class="col" id="c-act">
  <div class="colhead">
   <div class="tabs">${tabs.map(([k,l])=>`<button data-t="${k}" class="${S.tab===k?'on':''}" data-gated="${S.tab===k?0:1}">${esc(l)}</button>`).join('')}</div>
   <span style="display:flex;gap:6px">
    <button class="mini" id="b-scope">${esc(S.scope==='a'?T_.scopeAcct:T_.scopeAll)}</button>
    <button class="mini pri" id="b-entry">${esc(T_.logOutcome)}</button></span>
  </div>
  <div class="colbody">
   ${entry}${body}
  </div></div>`;
}
/* ═══ 10 · compare view. comparison is a different job from navigation. ═══ */
function compareView(){
 const r=rec(),T_=t(),h=T_.tbl,list=accts();
 return `<div class="col">
  <div class="colhead"><span class="eyebrow">${esc(T_.compare)} · ${N(list.length)}</span></div>
  <div class="colbody" style="padding:0">
   <table><thead><tr><th>${esc(h.ref)}</th><th>${esc(h.acctRef)}</th><th>${esc(h.product)}</th>
    <th>${esc(h.merchant)}</th><th class="n">${esc(h.bal)}</th><th class="n">${esc(h.total)}</th>
    <th>${esc(h.due)}</th><th class="n">${esc(h.dpd)}</th><th>${esc(h.status)}</th><th></th></tr></thead>
   <tbody>${list.map((a,i)=>`<tr data-a="${i}"><td>${ltr(a.ref)}</td><td>${ltr(a.aref)}</td>
    <td>${esc(E('product',a.product))}</td><td>${a.merchant?esc(L(a.merchant)):dash()}</td>
    <td class="n">${M(a.out)}</td><td class="n">${M(a.total)}</td><td>${D(a.due)}</td>
    <td class="n">${N(dpd(a))}</td><td>${statusBadge(a,false)}</td>
    <td><button class="mini" data-a="${i}">${esc(h.open)}</button></td></tr>`).join('')}</tbody></table>
  </div></div>`;
}
