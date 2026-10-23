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
 const promise=stat(T_.promise,openPtp?M(openPtp.ptp.amt):null,
   openPtp
    ? (n>1?`${esc(T_.promiseAcross(openAccts.length,n))} · ${esc(E('product',openPtp.product))}`
          :`${esc(T_.promised)} ${D(openPtp.ptp.date)}${brokenN?` · ${esc(T_.brokenN(brokenN))}`:''}`)
    : (brokenN?esc(T_.brokenN(brokenN)):''),
   {g:'ptp',none:T_.noPromise});

 /* KSA: an open complaint stops reminders on every channel (SAMA Art. 6(4)), not one */
 const complaint=r.market==='SA'&&r.accts.some(a=>a.dispute);
 const rule=k=>k&&chRule(complaint?'complaint':r.ch[k],r.market);
 const btn=(k,label,ic,pri,id)=>{
   const ru=rule(k);
   /* aria-disabled, not disabled: stays focusable; the reason is described, not hidden */
   return `<button ${id?`id="${id}" `:''}${k?`data-ch="${k}" `:''}class="act${pri&&!ru?' primary':''}${ru?' off':''}"${ru?` aria-disabled="true" aria-describedby="cr-${k}"`:''}>
     ${icon(ru?'lock':ic)}<span>${esc(label)}</span></button>`;
 };
 const chNames={call:T_.call,sms:T_.sms,wa:T_.wa,email:T_.email};
 const notes=Object.keys(chNames).filter(k=>rule(k)).map(k=>{const ru=rule(k);
   return `<span class="cnote" id="cr-${k}"><b>${esc(chNames[k])}</b> ${esc(T_.ch[ru.r])} ${srcChip(ru.s)}</span>`;}).join('');
 /* Q4: last thing said, across all accounts, whatever the activity column's scope */
 const last=[...r.logs].sort((x,y)=>when(y.at)-when(x.at))[0];
 const lastLine=last?`<div class="lastc" data-g="last"><span class="k">${esc(T_.lastContact)}</span>
   <span class="num">${DT(last.at)}</span><span>${esc(E('src',last.src))} · <b>${esc(E('out',last.out))}</b>${last.note?` · ${esc(L(last.note))}`:''}</span></div>`
  /* Q4 is answered even when there is nothing to say: the line stays, it says so */
  :`<div class="lastc" data-g="last"><span class="k">${esc(T_.lastContact)}</span><span class="empty">${esc(T_.noContact)}</span></div>`;

 const band=rs.length
  ? `<div class="why" data-alert="1" data-role="escalation" data-g="why"><span class="badge alert"><i class="dot"></i>${esc(T_.why)}</span>${proposedTag()}${ann('D2')}
     <span><b>${esc(rs[0].x)}</b>${rs[1]?` ${esc(rs[1].x)}`:''}${rs.length>2?` <span class="dim">${esc(T_.more(rs.length-2))}</span>`:''}</span></div>`
  : `<div class="why calm" data-g="why"><span>${esc(T_.calm)}</span></div>`;

 return `<div class="spine">
  <div class="spine-row">
   <div class="idb">
    <div class="avatar">${esc(r.ini)}</div>
    <div>
     <div class="names" data-g="name"><span class="t-title">${esc(L(r.name))}</span>
      <span class="n2" lang="${S.lang==='en'?'ar':'en'}">${esc(S.lang==='en'?r.name.ar:r.name.en)}</span></div>
     <div class="idline">
      <span class="badge q">${esc(E('stage',r.stage))}</span>
      <span>${esc(T_.market)}: <b>${esc(T_.mk[r.market])}</b></span>
      <span>${esc(T_.f.lang)}: <b>${r.lang?esc(T_.langName[r.lang]):dash()}</b></span>
      <span>${esc(T_.f.owner)}: ${r.owner?lat(r.owner):dash()}</span>
     </div>
    </div>
   </div>
   <div class="stats">
    ${stat(T_.outstanding,M(sumOut(r)),`${esc(T_.across(n))} · ${esc(T_.original)} ${M(sumTot(r))}`,{g:'out',ann:ann('D1')})}
    ${stat(T_.worstDpd,N(dpd(w)),`${esc(T_.on)} ${esc(L(w.lender))} · ${esc(T_.asOf)} ${D(TODAY_ISO)}`,{g:'dpd'})}
    ${promise}
   </div>
  </div>
  <div class="band">
   ${staleBand()}${band}${lastLine}
  </div>
  <div class="rail" data-g="rail">
   ${btn('call',T_.call,'phone',true)}${btn('sms',T_.sms,'chat')}${btn('wa',T_.wa,'wa')}${btn('email',T_.email,'mail')}
   ${btn(null,T_.emailInbox,'inbox',false,'b-inbox')}
   <!-- the post-call write lives with the other actions: the activity head can't hold
        four tabs, a scope toggle and this button at 1280–1440 without wrapping -->
   <button class="act log-btn" id="b-entry">${icon('pencil')}<span>${esc(T_.logOutcome)}</span></button>
  </div>
  ${notes?`<div class="cnotes">${notes}${ann('D4')}</div>`:''}
  ${dispatchNote()}
 </div>`;
}
/* ═══ 6.1 · account card (3.3: one component; the sheet renders the same function).
   the only coral on a card: one cue, on the accounts the escalation line names (2.4).
   static = specimen with no selection behaviour. ═══ */
function acctCard(a,i,flag,on,staticCard){
 const T_=t(),p=Math.round((a.out/a.total)*100);
 return `<div class="card${on?' on':''}${flag?' hot':''}"${staticCard?'':` data-a="${i}" tabindex="0" role="button"`}>
   ${i<9?`<span class="kbd">${i+1}</span>`:''}
   <div class="t-pri">${esc(L(a.lender))}</div>
   <div class="t-sec">${esc(E('product',a.product))} · ${ltr(a.ref)}</div>
   <div class="card-r"><span class="t-display sm">${M(a.out)}</span>
    <span class="t-sec">${esc(T_.of)} ${M(a.total)}</span></div>
   <div class="bar"><i style="inline-size:${p}%"></i></div>
   <div class="card-b">${statusBadge(a)}${dpdBadge(a)}
    ${a.broken?`<span class="badge q">${esc(T_.brokenN(a.broken))}</span>`:''}
    ${a.plan?`<span class="badge ok">${M(a.plan.emi)}/${esc(T_.perMo)}</span>`:''}</div>
   ${flag?`<div class="reasoncue" data-alert="1" data-role="escalation"><i class="dot"></i>${esc(T_.reasonCue)}</div>`:''}
  </div>`;
}
/* ═══ 6.2 · log row (3.3). cls: '' | 'ai' | 'new' | 'new enter' ═══ */
function logRow(x,r,cls){
 const an=(r.accts.find(z=>z.ref===x.a)||{}).lender;
 return `<div class="log ${cls}"><span class="when num">${DT(x.at)}</span><span>
    <b class="t-pri">${esc(E('out',x.out))}</b>
    <span class="t-sec"> ${esc(E('src',x.src))} · ${esc(E('dir',x.dir))}</span>
    ${x.note?`<div>${esc(L(x.note))}</div>`:''}
    <div class="meta">${lat(E('by',x.by))}${S.scope==='all'&&an?` · ${esc(L(an))}`:''}</div></span></div>`;
}
/* ═══ 7 · REGION 2 · borrower column ═══ */
function borrowerCol(){
 const r=rec(),T_=t(),h=hot(r),list=accts();
 const cards=list.map((a,i)=>acctCard(a,i,h.has(a.ref),i===S.sel)).join('');

 const c=r.calls||{};
 const contactHistory=(c.h||c.ai)?`<div class="rows">
   ${row(T_.f.humanCalls,N(c.h))}${row(T_.f.aiCalls,N(c.ai))}
   ${row(T_.f.lastHuman,c.lastH?DT(c.lastH):null)}${row(T_.lastAi,c.lastAi?DT(c.lastAi):null)}
  </div>
  <div class="row prose"><div class="prose-h"><span class="k">${esc(T_.f.aiSummary)}</span><span>${proposedTag()}${ann('D3')}</span></div>
   ${c.ai_sum?esc(L(c.ai_sum)):`<span class="empty">${esc(T_.noAi)}</span>`}</div>`
  :`<div class="emptyline">${esc(T_.noContact)}</div>`;

 return `<div class="col" id="c-bor">
  <div class="colhead"><span class="eyebrow">${esc(T_.accounts)} · ${N(list.length)} ${ann('D5')}</span>
   <button class="mini" id="b-compare">${esc(S.mode==='compare'?T_.back:T_.compare)}</button></div>
  <div class="colbody">
   ${cards}
   ${block('calls',contactHistory)}
   <!-- single-column on purpose: at 320px this column only has ~64px of label space, and
        labels like "Emirates ID" / "Date of birth" need close to that — a 2-column split
        would wrap them. Fields ordered narrow-first, wide-last so no row goes stranded. -->
   <div class="blk"><div class="blk-h"><span class="eyebrow">${esc(T_.reference)}</span></div>
    <div class="blk-b"><div class="rows grid2">
     ${row(T_.f.dob,r.dob?D(r.dob):null)}
     ${row(T_.f.gender,r.gender?esc(E('gender',r.gender)):null)}
     ${row(T_.f.nat,r.nat?esc(natName(r.nat)):null)}
     ${row(T_.f.submit,r.submit?D(r.submit):null)}
     ${row(T_.f.phone,r.phone?ltr(r.phone,true):null)}
     ${row(T_.f.mail,r.mail?ltr(r.mail,true):null,false,true)}
     ${row(T_.f.visa,r.visa?esc(L(r.visa)):null)}
     ${row(T_.natId[r.market]||T_.f.eid,r.eid?`${ltr(S.showId?r.eid:maskId(r.eid))} <button class="linkbtn" id="b-id" aria-pressed="${S.showId}">${esc(S.showId?T_.hideId:T_.showId)}</button>`:null,false,true)}
    </div></div></div>
  </div></div>`;
}
/* ═══ 8 · REGION 3 · account column. fixed block order, no disclosure controls. ═══ */
function accountCol(){
 const a=acc(),T_=t(),d=dpd(a),p=Math.round((a.out/a.total)*100);

 const balance=block('balance',`
  <div class="hero">
   ${stat(T_.f.out,M(a.out),`${N(p)}% ${esc(T_.of)} ${M(a.total)}`,{bar:p})}
   ${stat(T_.f.dpd,N(d),`${esc(T_.asOf)} ${D(TODAY_ISO)}`)}
  </div>
  <div class="rows grid2">
   ${row(T_.f.over,M(a.over))}${row(T_.f.due,D(a.due))}
   ${row(T_.f.principal,M(a.principal))}${row(T_.f.interest,a.interest?esc(L(a.interest)):null)}
   ${row(T_.f.status,statusBadge(a))}${row(T_.f.product,esc(E('product',a.product)))}
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
 /* 3.6: label-driven. an account shows the portfolio fields its lender sends, in a fixed
    order; a vertical adds keys without a layout change. disputed always shows (brief). */
 const pf=[['verif'],['churn'],['repo'],['hardship'],['employer'],['settle',1]].filter(([k])=>f[k]!==undefined);
 const fields=block('fields',`<div class="rows grid2">
   ${row(T_.f.disputed,a.dispute?`<span class="badge q">${esc(T_.yes)}</span>`:esc(T_.no))}
   ${pf.map(([k,w])=>k==='verif'?rowEdit(T_.f.verif,'f-verif',[['yes',T_.yes],['no',T_.no]],f.verif):row(T_.f[k],fv(k),false,!!w)).join('')}
   ${a.dispute?row(T_.f.disputeWhy,esc(L(a.dispute.why)),false,true):''}
  </div>`);

 const m=a.meta||{};
 const meta=block('meta',`<div class="rows grid2">
   ${row(T_.f.cby,lat(E('by',m.cby)))}${row(T_.f.cat,D(m.cat))}
   ${row(T_.f.uby,lat(E('by',m.uby)))}${row(T_.f.uat,D(m.uat))}
   ${row(T_.f.lenderId,ltr(a.lid),false,true)}
  </div>`);

 return `<div class="col" id="c-acc">
  <div class="colhead"><span class="eyebrow">${esc(T_.selected)} · ${esc(L(a.lender))} · ${esc(E('product',a.product))} · ${ltr(a.ref)}</span>${statusBadge(a)}</div>
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
  const list=filt(S.tab==='i'?r.logs:r.msgs).sort((x,y)=>when(y.at)-when(x.at));
  /* the saved row enters once (2.9); later renders show it static */
  body=list.length?list.map(x=>logRow(x,r,x===S.justLogged?(S.enter?(S.enter=false,'new enter'):'new'):(x.src==='ai'?'ai':''))).join(''):`<div class="emptyline">${esc(S.scope==='all'?T_.noContact:T_.noLogs)}</div>`;
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
  </div>
  <div class="colbody">
   <!-- scope sits with the list it filters, so the head holds the tabs alone at the 340px minimum -->
   <div class="scope-row"><span class="t-sec">${esc(T_.showing)} ${ann('D17')}</span><button class="mini" id="b-scope">${esc(S.scope==='a'?T_.scopeAcct:T_.scopeAll)}</button></div>
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
    <td class="n">${N(dpd(a))}</td><td>${statusBadge(a)}</td>
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
    ?`<div class="card-b"><span class="badge alert" data-alert="1" data-role="escalation"><i class="dot"></i>${esc(T_.rk[top.k])}</span>
      ${rs.length>1?`<span class="t-sec">${esc(T_.more(rs.length-1))}</span>`:''}</div>
     <div class="t-sec" title="${esc(top.x)}">${esc(top.d)}</div>`
    :`<span class="t-sec">${esc(T_.q.noFlag)}</span>`;
  /* 3.7: built from existing parts only: panel, compare table, stat, badge, button */
  return `<tr class="qrow" data-q="${k}">
   <td><div class="idb"><div class="avatar">${esc(r.ini)}</div>
    <div><div class="t-title">${esc(L(r.name))}</div>
     <div class="t-sec" lang="${S.lang==='en'?'ar':'en'}">${esc(S.lang==='en'?r.name.ar:r.name.en)}</div></div></div></td>
   <td>${why}</td>
   <td><div class="stats">${stat('',M(sumOut(r),r),esc(T_.across(r.accts.length)),{sm:1})}</div></td>
   <td><div class="stats">${stat('',N(dpd(w)),`${esc(T_.on)} ${esc(L(w.lender))}`,{sm:1})}</div></td>
   <td><div class="stats"><span class="t-sec">${icon('robot')} <span class="num">${N(r.calls.ai)}</span></span>
    <span class="t-sec">${icon('phone')} <span class="num">${N(r.calls.h)}</span></span></div></td>
   <td><button type="button" class="mini pri">${esc(T_.q.openCase)}</button></td>
  </tr>`;
 }).join('');

 const c=T_.q.cols;
 return `<div class="log-page" id="queue">
  <div class="blk" id="q-list">
   <div class="blk-h"><span class="eyebrow">${esc(T_.q.title)} · ${esc(T_.q.count(keys.length))}</span>
    <span class="t-sec">${esc(T_.q.needsAttention(flagged))}</span></div>
   <table><thead><tr><th>${esc(c.who)}</th><th>${esc(c.why)}</th>
    <th class="n">${esc(T_.outstanding)}</th><th class="n">${esc(T_.worstDpd)}</th><th class="n">${esc(c.calls)}</th><th></th></tr></thead>
   <tbody>${rows}</tbody></table>
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
    <input type="text" id="w-note" dir="auto"></label>
   <div class="f" role="group" aria-labelledby="w-ptp-l"><span id="w-ptp-l">${esc(T_.setPtp)}</span>
    <span class="pair">
     <input type="text" id="w-amt" class="amt" inputmode="decimal" placeholder="${esc(T_.amtPh)}" dir="ltr" aria-label="${esc(T_.f.ptpAmt)}">
     ${datePicker('w-date','w-ptp-l')}</span></div>
   <div class="wrap-note">${esc(T_.wrap.note)}</div>
   <div class="actions">
    <button class="act primary" id="w-save">${esc(T_.wrap.save)}</button>
    <button class="act" id="w-cancel">${esc(T_.cancel)}</button>
   </div>
  </div></div></div>`;
}
