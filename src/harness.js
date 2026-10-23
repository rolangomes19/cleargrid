// P5: harness report (plan §5a) and "How I'd test this" (plan §8), at ?view=test.
// the harness runs in the reviewer's own browser: each fixture × language × screen size is
// loaded in a hidden frame of that exact size and checked with real layout, real fonts, axe.
// anyone can rerun it; nothing here is a screenshot or a stored claim.

const AXE_URL='https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
const HX={fx:['stress','omar','aisha','sparse','blocked','ksa'],lang:['en','ar'],
 vp:[[1366,768],[1920,1080],[2560,1440]],fb:[[1280,800],[1024,768],[390,844]]};
const HCHECKS=[
 ['glance','1.2','Q1-Q5 visible with zero clicks (why, owed, late, promise, last contact, channels)'],
 ['t1','W5 / T1','No column scrolls while another is more than 25% empty'],
 ['type','2.1','At most 4 font sizes in this script'],
 ['coral','2.4','Coral only on escalation elements'],
 ['mono','Mono','Mono text at real weights only (no faux bold)'],
 ['clip','A7','No clipped column head, action rail or reviewer bar'],
 ['contrast','2.5','axe colour-contrast: 0 violations'],
 ['a11y','a11y','axe WCAG 2.2 A/AA: 0 serious or critical']];
let HRUN=null;

function hFrame(url,w,h){
 return new Promise(res=>{
  const f=document.createElement('iframe');
  /* off-screen at its true size, so layout is real; hidden from assistive tech */
  Object.assign(f.style,{position:'fixed',top:'0',left:'-200000px',width:w+'px',height:h+'px',border:'0'});
  f.setAttribute('aria-hidden','true'); f.tabIndex=-1;
  f.onload=async()=>{ try{ await f.contentDocument.fonts.ready; }catch(e){} setTimeout(()=>res(f),300); };
  f.src=url; document.body.appendChild(f);
 });
}
function hAxe(f){
 const w=f.contentWindow; if(w.axe) return Promise.resolve();
 return new Promise((res,rej)=>{ const s=f.contentDocument.createElement('script'); s.src=AXE_URL;
  s.onload=res; s.onerror=()=>rej(new Error('axe did not load')); f.contentDocument.head.appendChild(s); });
}
async function hCheck(f,W,H){
 const w=f.contentWindow,d=f.contentDocument,out={};
 const seen=e=>{ if(!e) return false; const b=e.getBoundingClientRect();
  return b.width>0&&b.height>0&&b.top>=0&&b.bottom<=H&&e.textContent.trim().length>0; };
 const missing=['why','out','dpd','ptp','last','rail'].filter(g=>!seen(d.querySelector(`[data-g="${g}"]`)));
 out.glance=[!missing.length,missing.length?'not visible: '+missing.join(', '):'all six visible'];
 const t1=w.cgT1(); out.t1=[t1.pass,t1.cols.join(' | ')];
 /* council R-E: the escalation colours are resolved from the live tokens and counted as painted, not trusted from an attribute */
 const tok=n=>{const p=d.createElement('i');p.style.color=`var(${n})`;d.body.appendChild(p);const c=w.getComputedStyle(p).color;p.remove();return c;};
 const ESC=new Set(['--escalation-fg','--escalation-bg','--escalation-mark'].map(tok));
 const painted=[];
 const sizes=new Set(),coral=[],mono=[];
 d.querySelectorAll('#stack *').forEach(e=>{
  if(!e.getClientRects().length) return;
  const cs=w.getComputedStyle(e),txt=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
  if(txt) sizes.add(cs.fontSize);
  /* every way an element can be painted coral: text, fill, any border edge, outline, shadow, and its ::before/::after */
  const paintsOf=(el,ps)=>{const c=w.getComputedStyle(el,ps);
   if(ps&&(c.content==='none'||c.content==='normal')) return [];
   const edge=['Top','Right','Bottom','Left'].filter(x=>+parseFloat(c['border'+x+'Width'])>0&&c['border'+x+'Style']!=='none').map(x=>c['border'+x+'Color']);
   return [c.backgroundColor,c.color,c.outlineStyle!=='none'?c.outlineColor:null,...edge,...(c.boxShadow==='none'?[]:[...ESC].filter(k=>c.boxShadow.includes(k)))];};
  const paints=[...paintsOf(e,null),...paintsOf(e,'::before'),...paintsOf(e,'::after')];
  /* only these three components may be coral; the data-role attribute alone no longer earns the exemption */
  if(paints.some(c=>ESC.has(c))){ painted.push(e); if(!e.closest('.why[data-role="escalation"],.reasoncue,.badge.alert')) coral.push(e.className||e.tagName); }
  if(txt&&/Mono/.test(cs.fontFamily.split(',')[0])&&+cs.fontWeight>500) mono.push(e.className||e.tagName);
 });
 out.type=[sizes.size<=4,[...sizes].sort().join(', ')];
 const roots=painted.filter(e=>!painted.some(o=>o!==e&&o.contains(e)));
 out.coral=[!coral.length&&roots.length<=3,coral.length?'outside escalation: '+coral.slice(0,4).join(', '):`${roots.length} painted, cap 3`];
 out.mono=[!mono.length,mono.length?mono.slice(0,4).join(', '):'400/500 only'];
 const clipped=[...d.querySelectorAll('.colhead,.rail,#rbar')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.id||e.className);
 out.clip=[!clipped.length,clipped.length?clipped.join(', '):'none'];
 try{
  await hAxe(f);
  const ax=await w.axe.run(d.getElementById('root'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
  const cc=ax.violations.filter(v=>v.id==='color-contrast').reduce((n,v)=>n+v.nodes.length,0);
  const bad=ax.violations.filter(v=>['serious','critical'].includes(v.impact));
  out.contrast=[cc===0,`${cc} nodes`];
  out.a11y=[!bad.length,bad.length?bad.map(v=>`${v.id} (${v.nodes.length})`).join(', '):'0 serious or critical'];
 }catch(e){ out.contrast=[null,e.message]; out.a11y=[null,e.message]; }
 return out;
}
async function hFallback(f,W){
 const d=f.contentDocument,fb=d.getElementById('fallback'),root=d.getElementById('root');
 const hscroll=d.documentElement.scrollWidth>W+1;
 if(W<1024) return {fallback:[!fb.hidden&&root.hidden&&!hscroll,`fallback ${fb.hidden?'hidden':'shown'}, page scroll ${hscroll?'yes':'no'}`]};
 const scaled=/scale/.test(root.style.transform)&&!!d.querySelector('#rbar .rb-note[data-scaled]');
 return {fallback:[scaled&&!hscroll,`${scaled?'1366 layout scaled, notice shown':'not scaled'}, page scroll ${hscroll?'yes':'no'}`]};
}
async function runHarness(){
 if(HRUN&&HRUN.running) return;
 const base=location.pathname, jobs=[];
 HX.vp.forEach(v=>HX.fx.forEach(fx=>HX.lang.forEach(l=>jobs.push({fx,l,v}))));
 HX.fb.forEach(v=>HX.lang.forEach(l=>jobs.push({fx:'stress',l,v,fb:1})));
 HRUN={running:true,started:new Date().toISOString(),ua:navigator.userAgent,rows:[],total:jobs.length};
 hPaint();
 for(const j of jobs){
  const [W,H]=j.v;
  const f=await hFrame(`${base}?fx=${j.fx}&lang=${j.l}`,W,H);
  let res; try{ res=j.fb?await hFallback(f,W):await hCheck(f,W,H); }catch(e){ res={error:[false,e.message]}; }
  f.remove();
  HRUN.rows.push({fx:j.fx,lang:j.l,vp:`${W}×${H}`,fb:!!j.fb,res});
  hPaint();
 }
 HRUN.running=false; HRUN.finished=new Date().toISOString(); hPaint();
}
/* repaint only the report block, so a run is not interrupted by a full render */
function hPaint(){ const el=document.getElementById('h-report'); if(el) el.innerHTML=hReport(); }
function hReport(){
 if(!HRUN) return `<p class="t-sec">Not run yet in this browser. A full run loads 42 frames and takes about one to two minutes.</p>`;
 const cell=c=>c?`<td title="${esc(c[1])}">${c[0]===true?'<span class="badge ok">pass</span>':c[0]===false?'<span class="badge warn">fail</span>':'<span class="badge q">n/a</span>'}</td>`:'<td></td>';
 const main=HRUN.rows.filter(r=>!r.fb),fb=HRUN.rows.filter(r=>r.fb);
 const tally=HCHECKS.map(([k,id])=>{const v=main.map(r=>r.res[k]).filter(Boolean);return `${id}: ${v.filter(x=>x[0]===true).length}/${v.length}`;});
 const json=encodeURIComponent(JSON.stringify(HRUN,null,1));
 return `<p class="t-sec">${HRUN.running?`Running ${HRUN.rows.length} of ${HRUN.total}…`:`Finished ${esc(HRUN.finished)}. `}
   ${!HRUN.running?`<a class="ann" download="report.json" href="data:application/json;charset=utf-8,${json}">Download report.json</a>`:''}</p>
  <p class="t-sec">${esc(tally.join(' · '))}</p>
  <table><thead><tr><th>Fixture</th><th>Lang</th><th>Viewport</th>${HCHECKS.map(([k,id,d])=>`<th title="${esc(d)}">${esc(id)}</th>`).join('')}</tr></thead>
  <tbody>${main.map(r=>`<tr><td>${esc(r.fx)}</td><td>${esc(r.lang)}</td><td class="n">${esc(r.vp)}</td>${HCHECKS.map(([k])=>cell(r.res[k]||r.res.error)).join('')}</tr>`).join('')}</tbody></table>
  ${fb.length?`<table><thead><tr><th>Fallback widths (Stress)</th><th>Lang</th><th>Viewport</th><th>Result</th><th>Detail</th></tr></thead>
   <tbody>${fb.map(r=>{const c=r.res.fallback||r.res.error;return `<tr><td>stress</td><td>${esc(r.lang)}</td><td class="n">${esc(r.vp)}</td>${cell(c)}<td>${esc(c[1])}</td></tr>`;}).join('')}</tbody></table>`:''}`;
}

/* ═══ 16 · "How I'd test this" (plan §8). pre-registered before any session is run. ═══ */
const TPLAN={
 hyp:[['H1','Do agents use the escalation line first?','First fixation or first click lands on the line for Q1','≥ 4 of 5 per language'],
  ['H2','Are glance answers faster than today?','Median time for Q1-Q5 below the baseline schematic','Q1, Q3, Q4 at least 50% faster'],
  ['H3','Are channel reasons read as rules, not errors?','Agents describe a blocked channel with its reason, no “broken” language','≥ 4 of 5'],
  ['H4','Does RTL scan order match LTR?','Arabic first-click targets mirror English targets','Same target, ≥ 4 of 5'],
  ['H5','Is the density acceptable?','SEQ for Q1-Q5 at or above 5.5','Mean ≥ 5.5'],
  ['H6','Can an outcome be logged mid-call?','Log outcome and promise in one pass','≥ 4 of 5, ≤ 1 error'],
  ['H7','Do agents miss accordions?','Few unprompted requests to hide sections','≤ 1 of 5'],
  ['H8','Do reviewers use the tour?','Panel members finish ≥ 8 of 12 steps','Most']],
 methods:[['5-second test','H1','Show the spine for 5 seconds; ask “why was this case sent to you?”, in English and Arabic.'],
  ['First-click test','H1, H3, H4','Five prompts (Q1-Q5) per language.'],
  ['Moderated tasks, think-aloud','H2, H3, H5, H6, H7','60 minutes, remote, both languages, order counterbalanced (half start in Arabic).'],
  ['Baseline','H2','The same tasks on a redrawn schematic of today’s screen (no production pixels).']],
 tasks:['T1-T5: answer Q1-Q5 on the 7-account record','T6: log an outcome with a promise','T7: find an account’s original amount using Compare','T8: explain why WhatsApp is unavailable (KSA record)'],
 rubric:[['Task success','≥ 80% per task','Glance tasks are simple lookups (assumption)'],['Time','Q1-Q5 median ≤ baseline × 0.5','Matches the keystroke-level prediction'],
  ['Clicks','0 for Q1-Q5','Rule 1.2'],['Errors','≤ 1 per task','Entry must survive a live call (assumption)'],
  ['Confidence (1-5)','Median ≥ 4','Wrong and confident is the danger case'],['SEQ','Mean ≥ 5.5','Benchmark average 5.3-5.6 (MeasuringU)'],['SUS','≥ 68','Average across about 500 studies (MeasuringU)']],
 decide:[['H1 fails: agents ignore the escalation line','Move it into the name row; test the wording; if still ignored after 2 rounds, drop D2 and keep only dispute and hardship badges.'],
  ['Agents read it but distrust it','Add provenance: “Source: AI agent, 8 Sep”.'],
  ['RTL users scan in a different order (H4 fails)','Keep the mirroring; check whether LTR number islands pull the eye; test a spine order variant for Arabic only.'],
  ['Channel reasons read as errors (H3 fails)','Neutral icon, “Available after 09:00” phrasing, no strike-through; retest.'],
  ['Agents ask for accordions back (H7 fails)','Offer per-group collapse, remembered, default open. Glance stays zero-click.'],
  ['Density SEQ below 5.5','Raise row height one step in the review columns only; the spine stays.'],
  ['Entry fails at 1366','Move entry to a pinned sheet over the activity column (record still visible).'],
  ['Tour skipped (H8 fails)','Shorten to 6 steps; put the 4 rationale bullets on the landing view.'],
  ['Glance faster but confidence low','Add the data dictionary definitions on hover.'],
  ['Agents want both languages at once','Reopen assumption #10 for names and notes only.']],
 drop:[['D2 escalation line','Ignored in 2 rounds, or ClearGrid confirms no stored state and none derivable'],
  ['D3 AI outcome','Agents trust it less than reading the transcript'],['D5 sort by outstanding','Agents miss urgent accounts in 2+ sessions'],
  ['D11 no accordions','3 of 5 agents prefer collapsed and are faster with it'],['D9 full mirror','Arabic agents slower than English by > 25% on the same tasks after 2 iterations']],
 klm:[['Q1 why me','No field; open Custom Attributes, read “Disputed”','6.65 s, partial','1.35 s'],['Q2 owed, how late','Financial Status card, no currency','1.35 s','1.35 s, with unit'],
  ['Q3 promise + record','PTP card, scroll, open Broken Promise Details','6.65 s','1.35 s'],['Q4 last thing said','Scroll to logs, open Details','6.6 s','1.35 s (spine line)'],
  ['Q5 channels + why not','Not shown; learned after the click','not answerable','1.35 s, with reason']]};
function testView(){
 const T_=t(),tbl=(head,rows)=>`<table><thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const sec=(id,title,body)=>`<section class="blk" id="${id}"><div class="blk-h"><span class="eyebrow">${esc(title)}</span></div>${body}</section>`;
 return `<div class="log-page"><div class="log-top"><button class="mini" id="b-logback">${icon(S.lang==='ar'?'next':'prev')}${esc(T_.st.back2)}</button>
   ${S.lang==='ar'?`<span class="t-sec">${esc(T_.st.enOnly)}</span>`:''}</div>
  <div lang="en" dir="ltr" class="log-doc wide">
   <h1 class="t-title">How I’d test this</h1>
   <p class="t-sec">Everything so far is self-graded: no agents, team leads or compliance officers have used it. Below is a harness anyone can rerun, then the study I would run with agents, with hypotheses written down before any session.</p>
   ${sec('harness','Harness report (plan §5a)',`<div class="blk-b">
     <p class="t-sec">Loads every fixture × language × viewport (1366, 1920, 2560) in a hidden frame of that size and checks it with real layout, fonts and axe-core; then the fallback widths. Node checks (fixtures, integrity, states, tour, token use) run separately: <span class="num">./build.sh && node test/verify.js</span>. DualKit lint is not wired in yet.</p>
     <button class="act primary" id="b-harness">${HRUN&&HRUN.running?'Running…':'Run the harness'}</button></div>
    <div class="blk-b" id="h-report">${hReport()}</div>`)}
   ${sec('klm','Predicted baseline: glance questions as tasks (keystroke-level model, self-graded)',tbl(['Question','Today’s screen','Today (est.)','Prototype (est.)'],TPLAN.klm))}
   ${sec('hyp','Research questions and pre-registered hypotheses',tbl(['#','Question','Hypothesis','Predicted'],TPLAN.hyp))}
   ${sec('methods','Methods',tbl(['Method','For','Details'],TPLAN.methods)+`<div class="blk-b">
     <p class="t-sec"><b>Participants.</b> 5 agents per language group (UAE and KSA, at least 3 Arabic-primary), 2 team leads, 1 compliance officer. ≥ 6 months in live collections, daily CRM use, bilingual mix stated; nobody who saw round 1. Five per group is a convention, not sourced here.</p>
     <p class="t-sec"><b>Tasks.</b> ${esc(TPLAN.tasks.join(' · '))}</p>
     <p class="t-sec"><b>Script.</b> Consent and recording notice · role and tools warm-up (2 min) · 5-second test · first-click set · tasks T1-T8 with SEQ after each · SUS · debrief: “what would you remove?”, “what’s missing for a live call?”</p></div>`)}
   ${sec('rubric','Pass rubric',tbl(['Measure','Pass','Reason'],TPLAN.rubric))}
   ${sec('decide','If a result comes back, then',tbl(['If','Then'],TPLAN.decide))}
   ${sec('drop','What would make me drop a decision',tbl(['Decision','Drop if'],TPLAN.drop))}
  </div></div>`;
}
