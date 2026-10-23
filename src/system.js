// system proof (plan P4): data dictionary (1.4), system states (1.5), component sheet (3.8).
// the sheet renders the same component functions the product uses; nothing is redrawn.

/* ═══ 15 · data dictionary (1.4): every number on screen, one meaning each.
   source = the production field it maps to; DPD is derived, never stored. ═══ */
const DICT=[
 ['Total outstanding','Sum of the outstanding balance on every account of this borrower placed with ClearGrid.','Outstanding (per deal), summed','At the record’s last sync'],
 ['… of (original)','Sum of the original amount of those same accounts.','Total Amount, summed','At placement'],
 ['Worst days past due','Highest days past due across the borrower’s accounts.','Derived: today minus Last Due Date','Fixture clock, 11 Sep 2026 (Dubai)'],
 ['Promise amount','Amount of the most recent open promise to pay.','PTP Amount Via Interaction Log; Ptp Amount A I when the AI took it','Promise date shown beside it'],
 ['Broken promises','Promises whose date passed without the promised payment.','Broken Promise Count','All time, this account or borrower as labelled'],
 ['Outstanding (account)','Balance still owed on this account.','Outstanding','At the record’s last sync'],
 ['Overdue','Part of the balance that is past due now. Never more than outstanding.','Overdue','At the record’s last sync'],
 ['Principal','Amount originally lent, before interest and fees.','Principal Amount','At origination'],
 ['Days past due (account)','Today minus this account’s last due date.','Derived: today minus Last Due Date','Fixture clock, 11 Sep 2026 (Dubai)'],
 ['Instalment','Payment due each period under an active plan.','Payment plan EMI (brief table E)','Per month'],
 ['Total human calls','Calls placed by agents, answered or not. At least the number of agent calls in the log.','Total Human Calls','All time'],
 ['Total AI calls','Calls placed by the AI agent, answered or not.','Total AI Calls','All time'],
 ['Latest human call answered','Most recent agent call the borrower picked up. Equals the latest answered phone row in the log.','Latest Human Call Ans.','Dubai time'],
 ['Latest AI call answered','Most recent AI call the borrower picked up.','Latest AI Call Answered','Dubai time'],
 ['Call attempts in 30 days (KSA)','Phone attempts to this borrower in the trailing 30 days. SAMA caps it at 10.','Interaction log, phone rows','Trailing 30 days to the fixture clock']];

/* ═══ 15.1 · system states (1.5). each is a URL: ?state=loading|stale|savefail|blocked ═══ */
const STATES=['loading','stale','savefail','blocked'];
function skeletonView(){
 const col=n=>`<div class="col"><div class="colhead"><span class="sk" style="inline-size:40%"></span></div><div class="colbody">
   ${Array.from({length:n},()=>`<div class="blk"><div class="blk-b"><span class="sk lg"></span><span class="sk"></span><span class="sk"></span></div></div>`).join('')}</div></div>`;
 return `<div class="spine" aria-busy="true"><span class="t-sec" role="status">${esc(t().sys.loading)}</span>
   <span class="sk lg"></span><span class="sk"></span></div>
  <div class="cols" aria-busy="true">${col(3)}${col(3)}${col(4)}</div>`;
}
const staleBand=()=>S.state==='stale'?`<div class="why stale" role="status"><span>${esc(t().sys.stale(DT(rec().synced)))}</span>
  <button type="button" class="mini" id="b-refresh">${esc(t().sys.refresh)}</button></div>`:'';
const dispatchNote=()=>S.dispatch?`<div class="dispatch" role="status">${icon('lock')}<span>${esc(t().sys.blocked(t()[S.dispatch]))}</span></div>`:'';

/* ═══ 15.2 · component sheet (3.8). anatomy · variants · states · usage rule, live. ═══ */
function sheetView(){
 const r=R.omar,a0=accts(r)[1],a1=accts(r)[0],T_=t();
 const spec=(name,rule,body,note)=>`<section class="blk"><div class="blk-h"><span class="eyebrow">${esc(name)}</span></div>
  <div class="blk-b"><div class="spec">${body}</div><p class="t-sec">${esc(rule)}</p>${note?`<p class="t-sec">${esc(note)}</p>`:''}</div></section>`;
 const roles=['--text','--text-muted','--text-null','--canvas','--surface','--border','--divider','--action-primary','--link','--selected',
  '--escalation-fg','--escalation-bg','--care-fg','--care-bg','--positive-fg','--positive-bg'];
 const cs=getComputedStyle(document.documentElement);
 const matrix=[
  ['Button md / sm','surface-hover + border-control','focus-ring','scale(.97), surface-sunken','.off: surface-sunken, not-allowed, no press'],
  ['Primary button','action-primary-hover','focus-ring','scale(.97)','not used disabled; becomes secondary .off'],
  ['Link button / Why link','action-primary-hover, 2px underline','focus-ring','text colour','n/a'],
  ['Account card','border-strong + shadow-sm','focus-ring','scale(.99)','n/a; selected = selected border + ring'],
  ['Tab','text + border-strong underline','focus-ring','border-control underline','n/a; selected = selected underline'],
  ['Select / date trigger','surface-hover + text-muted border','focus-ring','surface-sunken','open = selected border'],
  ['Option / calendar day','surface-sunken','focus-ring','border','past day = text-null, not focusable'],
  ['Source chip (link)','selected-wash + link border','focus-ring','surface-sunken','client policy chip is text, not a link'],
  ['Table row','selected-wash','via its button','n/a','n/a'],
  ['Input','text-muted border','focus-ring','n/a',':disabled = surface-sunken; aria-invalid = care border']];
 return `<div class="log-page"><div class="log-top"><button class="mini" id="b-logback">${icon(S.lang==='ar'?'next':'prev')}${esc(T_.st.back2)}</button>
   ${S.lang==='ar'?`<span class="t-sec">${esc(T_.st.enOnly)}</span>`:''}</div>
  <div lang="en" dir="ltr" class="log-doc wide">
   <h1 class="t-title">Components</h1>
   <p class="t-sec">Live: every specimen is the product’s own function, in the current language. Hover, focus and press them.
    Tokens are three layers: palette → role → component; components use roles only (verify.js fails below 90% token use).</p>
   <div class="sheet-grid">
   ${spec('Button','One shape, two sizes (md 32, sm 28), three variants. Width comes from padding. Primary is one per region.',
    `<button class="act primary">${icon('phone')}<span>${esc(T_.call)}</span></button><button class="act">${icon('mail')}<span>${esc(T_.email)}</span></button>
     <button class="act off" aria-disabled="true">${icon('lock')}<span>${esc(T_.wa)}</span></button>
     <button class="mini pri">${esc(T_.q.openCase)}</button><button class="mini">${esc(T_.compare)}</button>
     <button class="mini icon-only" aria-label="${esc(T_.nextMonth)}">${icon('next')}</button><button class="linkbtn">${esc(T_.showId)}</button>`,
    'Restricted channels stay focusable (aria-disabled) and name their reason in a channel note.')}
   ${spec('Badge','Only for minority states. Amber = needs care, green = plan running, coral = why this reached you only, neutral = counts.',
    `${statusBadge({status:'disputed'})}${statusBadge({status:'legal'})}${statusBadge({status:'plan'})}${statusBadge({status:'coll'})}
     <span class="badge q">${esc(T_.days(146))}</span><span class="badge alert"><i class="dot"></i>${esc(T_.why)}</span>`,
    '“In collection” is the majority state, so it is plain text.')}
   ${spec('Stat','Label, value, sub, optional bar. A missing value is said in body text at the value’s height, never at hero size.',
    `${stat(T_.outstanding,M(12860,r),`${esc(T_.across(2))}`)}${stat(T_.promise,null,'',{none:T_.noPromise})}${stat(T_.f.out,M(4860,r),'69%',{bar:69})}`)}
   ${spec('Field row','Label start, value end, hairline between rows so the pair reads as one. Nulls are an en dash; the label stays. An editable value is a control.',
    `<div class="rows" style="flex:1 1 100%">${row(T_.f.over,M(4860,r))}${row(T_.f.merchant,null)}
     ${row(T_.f.flags,esc(L(accts(r)[0].plan.flags)),false,true)}${rowEdit(T_.f.verif,'sheet-verif',[['yes',T_.yes],['no',T_.no]],'no')}</div>`,
    'Long labels truncate with the full text in a tooltip; prose values take the full row (wide).')}
   ${spec('Account card','Selectable panel. Sorted by outstanding, never by flag. One coral cue only on accounts the escalation line names.',
    `${acctCard(a1,0,false,false,true)}${acctCard(a0,1,true,true,true)}`, 'Second card: selected and named by the escalation line.')}
   ${spec('Escalation band','The one coral surface. Calm variant when nothing is flagged.',
    `<div class="why" style="flex:1 1 100%"><span class="badge alert"><i class="dot"></i>${esc(T_.why)}</span><span>${esc(reasons(r)[0].x)}</span></div>
     <div class="why calm" style="flex:1 1 100%"><span>${esc(T_.calm)}</span></div>`)}
   ${spec('Channel note + source chip','Every restricted channel: name, reason, rule source. A regulation links to the page; client policy is text.',
    `<span class="cnote"><b>${esc(T_.wa)}</b> ${esc(T_.ch.consent)} ${srcChip(SRC.cbuae)}</span>
     <span class="cnote"><b>${esc(T_.sms)}</b> ${esc(T_.ch.capClient)} ${srcChip(null)}</span>`)}
   ${spec('Log row','Time, outcome, source and direction, note, author. AI rows carry a dot; a just-saved row is washed and enters once.',
    `<div style="flex:1 1 100%">${logRow(r.logs[0],r,'ai')}${logRow(r.logs[1],r,'')}${logRow(r.logs[1],r,'new')}</div>`)}
   ${spec('Tabs','Underline on the column head’s rule. One stream at a time is the job here, so tabs are allowed.',
    `<div class="tabs"><button class="on">${esc(T_.tab.i)}</button><button>${esc(T_.tab.m)}</button><button>${esc(T_.tab.t)}</button></div>`)}
   ${spec('Select and date picker','Trigger has input metrics; popover opens instantly and returns focus. Past dates cannot be picked.',
    `<div style="flex:1 1 180px">${selectMenu('sheet-sel',['rpc','promise','callback'].map(k=>[k,E('out',k)]),'sheet-sel')}</div>
     <div style="flex:1 1 180px">${datePicker('sheet-date','sheet-date')}</div>`)}
   ${spec('Proposal tag and Why link','Reviewer layer only: off on the agent screen by default (B2, X2).',
    `<span class="tag">${esc(T_.proposed)}</span><a class="ann" href="?view=log&card=D2" data-card="D2">${esc(T_.st.why)}</a>`)}
   ${spec('System states','Each state is a URL. Open one to see it in the product.',
    STATES.map(k=>`<a class="src" href="?fx=omar&state=${k}" data-state="${k}">${k}</a>`).join(''),
    'loading: placeholders, aria-busy · stale: amber band with Refresh · savefail: wrap-up keeps the entry and says so · blocked: an allowed channel refused at dispatch says nothing was sent.')}
   </div>
   <section class="blk"><div class="blk-h"><span class="eyebrow">State matrix (2.8)</span></div>
    <table><thead><tr><th>Component</th><th>Hover</th><th>Focus-visible</th><th>Active</th><th>Disabled / selected</th></tr></thead>
    <tbody>${matrix.map(m=>`<tr>${m.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></section>
   <section class="blk"><div class="blk-h"><span class="eyebrow">Role tokens (3.1)</span></div><div class="blk-b"><div class="rows grid2">
    ${roles.map(k=>`<div class="row"><span class="k"><span class="swatch" style="background:var(${k});display:inline-block;vertical-align:middle"></span> ${k}</span>
     <span class="v num">${esc(cs.getPropertyValue(k).trim())}</span></div>`).join('')}</div></div></section>
   <section class="blk" id="dict"><div class="blk-h"><span class="eyebrow">Data dictionary (1.4)</span></div>
    <table><thead><tr><th>Figure</th><th>Definition</th><th>Source field</th><th>Reference</th></tr></thead>
    <tbody>${DICT.map(d=>`<tr>${d.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <div class="blk-b"><p class="t-sec">Integrity checks run in verify.js on every fixture: overdue ≤ outstanding ≤ original; principal ≤ original;
     account cards sum to the spine; broken promises are dated in the past; open promises are today or later; total calls ≥ logged calls;
     latest answered call equals the latest answered log row; KSA attempts in 30 days ≤ 10; every national ID passes its check digit.
     Production data showed two of these failing (latest answered call older than logged RPC calls), which is why the rule exists.</p></div></section>
  </div></div>`;
}
