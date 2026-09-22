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
 const btn=(k,label,ic,pri,id)=>{
   const off=chOff(r.ch[k]);
   /* aria-disabled, not disabled: the button stays focusable and hoverable so the
      tooltip saying why can reach both mouse and keyboard users */
   return `<button ${id?`id="${id}" `:''}class="act${pri&&!off?' primary':''}${off?' off':''}"${off?` aria-disabled="true" data-tip="${esc(T_.ch[r.ch[k]])}"`:''}>
     ${icon(off?'lock':ic)}<span>${esc(label)}</span></button>`;
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
     <div class="names" data-g="name"><span class="t-title">${esc(L(r.name))}</span>
      <span class="n2">${esc(S.lang==='en'?r.name.ar:r.name.en)}</span></div>
     <div class="idline">
      <span class="badge teal">${esc(E('stage',r.stage))}</span>
      <span>${esc(T_.f.lang)}: <b>${r.lang?esc(T_.langName[r.lang]):dash()}</b></span>
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
   ${btn('call',T_.call,'phone',true)}${btn('sms',T_.sms,'chat')}${btn('wa',T_.wa,'wa')}${btn('email',T_.email,'mail')}
   ${btn('email',T_.emailInbox,'inbox',false,'b-inbox')}
   <!-- the post-call write lives with the other actions: the activity head can't hold
        four tabs, a scope toggle and this button at 1280–1440 without wrapping -->
   <button class="act log-btn" id="b-entry">${icon('pencil')}<span>${esc(T_.logOutcome)}</span></button>
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
  return `<div class="card${i===S.sel?' on':''}${flag?' hot':''}" data-a="${i}" tabindex="0" role="button">
   ${i<9?`<span class="kbd">${i+1}</span>`:''}
   <div class="t-pri">${dotDue?'<i class="flagdot"></i>':''}${esc(L(a.lender))}</div>
   <div class="t-sec">${esc(E('product',a.product))} · ${ltr(a.ref)}</div>
   <div class="card-r"><span class="t-display sm">${M(a.out)}</span>
    <span class="t-sec">${esc(T_.of)} ${M(a.total)}</span></div>
   <div class="bar"><i style="inline-size:${p}%"></i></div>
   <div class="card-b">${statusBadge(a,flag)}${dpdBadge(a,flag&&a.status!=='disputed')}
    ${a.broken?`<span class="badge q">${esc(T_.brokenN(a.broken))}</span>`:''}
    ${a.plan?`<span class="badge ok">${M(a.plan.emi)}/${esc(T_.perMo)}</span>`:''}</div>
   ${dotDue?`<div class="t-sec reasoncue">${esc(T_.reasonCue)}</div>`:''}
  </div>`;
 }).join('');

 const c=r.calls||{};
 const contactHistory=(c.h||c.ai)?`<div class="rows grid2">
   ${row(T_.f.humanCalls,N(c.h))}${row(T_.f.aiCalls,N(c.ai))}
   ${row(T_.f.lastHuman,c.lastH?DT(c.lastH):null)}${row(T_.lastAi,c.lastAi?DT(c.lastAi):null)}
  </div>
  <div class="row prose">${c.ai_sum?esc(L(c.ai_sum)):`<span class="empty">${esc(T_.noAi)}</span>`}</div>`
  :`<div class="emptyline">${esc(T_.noContact)}</div>`;

 return `<div class="col" id="c-bor">
  <div class="colhead"><span class="eyebrow">${esc(T_.accounts)} · ${N(list.length)}</span>
   <button class="mini" id="b-compare">${esc(S.mode==='compare'?T_.back:T_.compare)}</button></div>
  <div class="colbody">
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
   ${row(T_.f.paid,`${N(a.plan.paid)} ${esc(T_.of)} ${N(a.plan.of)}`)}
   ${row(T_.f.flags,esc(L(a.plan.flags)),false,true)}
  </div><div class="bar plan"><i style="inline-size:${Math.round(a.plan.paid/a.plan.of*100)}%"></i></div>`
  :`<div class="emptyline">${esc(T_.noPlan)}</div>`);

 const promises=block('promises',(a.ptp||a.broken)?`<div class="rows grid2">
   ${row(T_.f.ptpAmt,a.ptp?M(a.ptp.amt):null)}${row(T_.f.ptpDate,a.ptp?D(a.ptp.date):null)}
   ${row(T_.f.ptpState,a.ptp?`<span class="badge ${a.ptp.state==='broken'?'q':'ok'}">${esc(E('ptp',a.ptp.state))}</span>`:null)}
   ${row(T_.f.broken,N(a.broken))}
   ${row(T_.f.brokenLast,a.brokenLast?D(a.brokenLast):null)}
   ${row(T_.f.brokenType,a.brokenType?esc(E('brokenType',a.brokenType)):null,false,true)}
  </div>`:`<div class="emptyline">${esc(T_.noPromise)}</div>`);

 const f=a.fields||{},fv=k=>f[k]===undefined?null:(f[k]==='yes'?esc(T_.yes):f[k]==='no'?esc(T_.no):esc(L(f[k])));
 const fields=block('fields',`<div class="rows grid2">
   ${row(T_.f.disputed,a.dispute?`<span class="badge q">${esc(T_.yes)}</span>`:esc(T_.no))}${row(T_.f.verif,fv('verif'))}
   ${row(T_.f.churn,fv('churn'))}${row(T_.f.repo,fv('repo'))}
   ${row(T_.f.hardship,fv('hardship'))}${row(T_.f.employer,fv('employer'))}
   ${row(T_.f.disputeWhy,a.dispute?esc(L(a.dispute.why)):null,false,true)}
   ${row(T_.f.settle,fv('settle'),false,true)}
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

 /* the post-call write used to open inline here (S.entry). it's now its own screen
    (wrapupView, S.mode='wrapup') — same reasoning as before (the record must stay
    visible while transcribing), just given the room a sustained-attention task needs.
    "Log outcome" below is the one entry point into it. */
 return `<div class="col" id="c-act">
  <div class="colhead">
   <div class="tabs">${tabs.map(([k,l])=>`<button data-t="${k}" class="${S.tab===k?'on':''}" data-gated="${S.tab===k?0:1}">${esc(l)}</button>`).join('')}</div>
   <button class="mini" id="b-scope">${esc(S.scope==='a'?T_.scopeAcct:T_.scopeAll)}</button>
  </div>
  <div class="colbody">
   ${body}
  </div></div>`;
}
/* ═══ 10 · compare view. comparison is a different job from navigation. ═══ */
function compareView(){
 const r=rec(),T_=t(),h=T_.tbl,list=accts();
 return `<div class="col">
  <div class="colhead"><span class="eyebrow">${esc(T_.compare)} · ${N(list.length)}</span></div>
  <div class="colbody flush">
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
/* ═══ 11 · SCREEN · queue. the case arrives here before any borrower record is open.
   Reuses the four existing records — no invented cases, no invented "time waited" field
   (none of the fixtures carry one, and fabricating it would be exactly the kind of
   unsourced number the defensibility pass exists to catch). ═══ */
function queueView(){
 const T_=t();
 /* sort: top escalation severity desc, then exposure desc — reuses reasons()'s own
    severity score, no new scoring logic. See spec.md's queue section for why. */
 const keys=Object.keys(R).sort((x,y)=>{
  const sx=reasons(R[x])[0]?.s||0, sy=reasons(R[y])[0]?.s||0;
  return sy!==sx ? sy-sx : sumOut(R[y])-sumOut(R[x]);
 });
 const flagged=keys.filter(k=>(reasons(R[k])[0]?.s||0)>0).length;
 const rows=keys.map(k=>{
  const r=R[k],rs=reasons(r),top=rs[0],w=worst(r);
  /* the badge names the reason's type (a triage column the agent scans without reading);
     the detail line carries the specifics. top-1 reason only: one coral badge per flagged
     row holds the fixtures at exactly 3, the existing budget cap (see spec.md). */
  const why=top
    ?`<div class="top"><span class="badge alert" data-alert="1"><i class="dot"></i>${esc(T_.rk[top.k])}</span>
      ${rs.length>1?`<span class="t-sec">${esc(T_.more(rs.length-1))}</span>`:''}</div>
     <span class="t-sec detail" title="${esc(top.x)}">${esc(top.d)}</span>`
    :`<span class="t-sec">${esc(T_.q.noFlag)}</span>`;
  return `<div class="qrow" data-q="${k}" tabindex="0" role="button">
   <div class="qrow-id">
    <div class="avatar">${esc(r.ini)}</div>
    <div class="who"><span class="t-title">${esc(L(r.name))}</span>
     <span class="t-sec">${esc(S.lang==='en'?r.name.ar:r.name.en)}</span></div>
   </div>
   <div class="qrow-why">${why}</div>
   <div class="qrow-num"><div class="t-display sm">${M(sumOut(r))}</div>
    <span class="t-sec">${esc(T_.across(r.accts.length))}</span></div>
   <div class="qrow-num"><div class="t-display sm">${N(dpd(w))}</div>
    <span class="t-sec">${esc(T_.on)} ${esc(L(w.lender))}</span></div>
   <div class="qrow-contact">${icon('robot')}<span class="num">${N(r.calls.ai)}</span>
    ${icon('phone')}<span class="num">${N(r.calls.h)}</span></div>
   <span class="mini pri" aria-hidden="true">${esc(T_.q.openCase)}</span>
  </div>`;
 }).join('');

 const c=T_.q.cols;
 return `<div class="queue">
  <div class="qhead">
   <span class="t-title">${esc(T_.q.title)} · ${esc(T_.q.count(keys.length))}</span>
   <span class="t-sec">${esc(T_.q.needsAttention(flagged))}</span>
  </div>
  <div class="qbody">
   <div class="qcols" aria-hidden="true"><span>${esc(c.who)}</span><span>${esc(c.why)}</span>
    <span class="n">${esc(T_.outstanding)}</span><span class="n">${esc(T_.worstDpd)}</span>
    <span class="n">${esc(c.calls)}</span><span></span></div>
   ${rows}
  </div>
 </div>`;
}
/* ═══ 12 · SCREEN · wrap-up. replaces the old inline entry form (one canonical home).
   Spine + borrowerCol stay mounted around this (see app.js render()) for the same
   reason the inline form was never a modal: the record must stay visible while
   the agent is transcribing from it. ═══ */
function wrapupView(){
 const a=acc(),T_=t();
 if(S.wrapDone){
  return `<div class="col"><div class="colhead"><span class="eyebrow">${esc(T_.wrap.title)}</span></div>
   <div class="colbody"><div class="wrap-done">
    ${icon('check')}<div class="t-pri">${esc(T_.wrap.logged)}</div>
    <button class="act primary" id="w-return">${esc(T_.wrap.returnToQueue)}</button>
   </div></div></div>`;
 }
 return `<div class="col"><div class="colhead">
   <span class="eyebrow">${esc(T_.wrap.title)} · ${esc(T_.wrap.forAccount)} ${esc(L(a.lender))} · ${ltr(a.ref)}</span>
  </div>
  <div class="colbody"><div class="wrap">
   <div class="f"><span id="w-out-l">${esc(T_.outcome)}</span>
    ${selectMenu('w-out',['rpc','noans','promise','callback','dispute','hardship','wrong'].map(k=>[k,E('out',k)]),'w-out-l')}</div>
   <label class="f"><span>${esc(T_.notes)}</span>
    <input type="text" id="w-note"></label>
   <div class="f" role="group" aria-labelledby="w-ptp-l"><span id="w-ptp-l">${esc(T_.setPtp)}</span>
    <span class="pair">
     <input type="text" id="w-amt" class="amt" placeholder="AED" dir="ltr" aria-label="${esc(T_.f.ptpAmt)}">
     ${datePicker('w-date','w-ptp-l')}</span></div>
   <div class="wrap-note">${esc(T_.wrap.note)}</div>
   <div class="actions">
    <button class="act primary" id="w-save">${esc(T_.wrap.save)}</button>
    <button class="act" id="w-cancel">${esc(T_.cancel)}</button>
   </div>
  </div></div></div>`;
}
