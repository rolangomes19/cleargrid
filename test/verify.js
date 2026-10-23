const fs=require('fs'),{JSDOM}=require('jsdom');
const errs=[];
// council R-E: verify reads dist/, so a stale build would test old HTML. fail loudly instead.
{const newest=fs.readdirSync('src').map(f=>fs.statSync('src/'+f).mtimeMs).reduce((a,b)=>Math.max(a,b),0);
 if(fs.statSync('dist/cleargrid-borrower-profile.html').mtimeMs<newest-1000) errs.push('STALE: dist/ is older than src/. run ./build.sh first');}
const dom=new JSDOM(fs.readFileSync('dist/cleargrid-borrower-profile.html','utf8'),
 {url:'http://localhost/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.addEventListener('error',e=>errs.push(e.message))}});
const {window}=dom,doc=window.document;
function R10(){return window.eval('R.ksa.logs').filter(l=>l.src==='phone').length===10;}
const click=el=>el&&el.dispatchEvent(new window.Event('click',{bubbles:true}));
// drives the real product UI now that the harness is gone — the queue and the nav's own
// EN/AR toggle are real controls, so tests exercise the same paths an agent would.
const toQueue=()=>click(doc.querySelector('[data-nav="queue"]'));
const openCase=key=>click(doc.querySelector(`[data-q="${key}"]`));
const setLang=l=>click(doc.querySelector(`.nav-lang button[data-v="${l}"]`));

// landing (plan decision 1): a first visit with a bare link opens the tour at step 1
if(!doc.querySelector('#story .strip')||!/step=1/.test(window.location.search)) errs.push('P3: first visit did not open the tour at step 1');
// boot state (plan §3.1): the 7-account Stress profile, English, URL carries the state
if(!doc.querySelector('.spine')||doc.querySelectorAll('.card').length!==7) errs.push('BOOT: expected the Stress profile with 7 accounts');
if(!/fx=stress/.test(window.location.search)) errs.push('URL: fx not written to the address bar');
if(doc.querySelector('.nav-promo')) errs.push('2.10: promo still in nav');
toQueue();
const qrows=doc.querySelectorAll('.qrow');
if(qrows.length!==6) errs.push(`QUEUE row count = ${qrows.length}, expected 6`);
const qAlerts=doc.querySelectorAll('[data-alert="1"]').length;
if(qAlerts>3) errs.push(`QUEUE coral budget: ${qAlerts} elements, cap is 3`);
console.log('queue rows:',qrows.length,'| coral:',qAlerts,
 '| order:',[...qrows].map(r=>r.dataset.q).join(' > '));

console.log('\nrec       dir  accts sel          alerts  spineNums');
for(const r of ['omar','aisha','stress','sparse','blocked','ksa']){
 toQueue();
 openCase(r);
 for(const d of ['en','ar']){
  setLang(d);
  const html=doc.getElementById('stack').innerHTML;
  if(html.length<800) errs.push('EMPTY '+r+'/'+d);
  const bad=html.match(/.{50}(undefined|NaN|\[object Object\]).{30}/s); // s: '.' must cross newlines or this silently misses matches
  if(bad) errs.push(`TOKEN ${r}/${d}: ${bad[0].replace(/\s+/g,' ')}`);
  const alertCount=doc.querySelectorAll('[data-alert="1"]').length;
  if(alertCount>3) errs.push(`CORAL ${r}/${d}: ${alertCount} elements, cap is 3`);
  // 1.9: every restricted channel shows a reason and a source chip, before any click
  const off=doc.querySelectorAll('.rail .act.off').length, notes=doc.querySelectorAll('.cnote').length,
   chips=doc.querySelectorAll('.cnote .src').length;
  if(off!==notes||notes!==chips) errs.push(`1.9 ${r}/${d}: ${off} restricted, ${notes} reasons, ${chips} sources`);
  // B2 (amended): the agent screen carries no proposal tags; the reviewer switch adds them
  if(doc.querySelector('#stack .tag')) errs.push(`B2 ${r}/${d}: proposal tag on the product screen by default`);
  if(doc.querySelector('.why[data-alert]')){ click(doc.getElementById('rb-prop'));
   if(!doc.querySelector('.why .tag')) errs.push(`B2 ${r}/${d}: reviewer switch did not mark the escalation line`);
   click(doc.getElementById('rb-prop')); }
  // A4: no English left in the Arabic view (names, brands, IDs excepted)
  if(d==='ar'){const txt=doc.getElementById('stack').textContent;
   const left=['System','Borrower','monthly','flat','AED','Proposed','Client policy'].filter(w=>txt.includes(w));
   if(left.length) errs.push(`A4 ${r}/ar: English left: ${left.join(', ')}`);}
  const sel=doc.querySelector('.card.on .t-pri');
  const nums=[...doc.querySelectorAll('.stats .t-display')].map(e=>e.textContent.trim()).join(' | ');
  console.log(r.padEnd(9),d.padEnd(4),String(doc.querySelectorAll('.card').length).padEnd(5),
   (sel?sel.textContent:'-').slice(0,12).padEnd(12),
   String(alertCount).padEnd(8), nums);
  if(d!=='en') continue;
 // behavioural checks (formerly the audit panel's per-record pass/fail list, now real
 // assertions) — text-substring checks need the English build, so these run inside the
 // loop while 'en' is still the active language, not after it's moved on to 'ar'.
 const behav=[];
 if(r==='omar'){
  behav.push(['dispute is the escalation reason', (doc.querySelector('.why')?.textContent||'').toLowerCase().includes('disput')]);
  // a disputed card's own status badge already says "Disputed" in coral — that IS its
  // escalation-to-account link (regions.js: .reasoncue is a fallback for non-dispute
  // flags only, so checking for it here was asserting the wrong element).
  behav.push(['named account carries the escalation cue', !!doc.querySelector('.card.hot [data-role=escalation]')]);
  const wa=[...doc.querySelectorAll('.rail .act')][2];
  behav.push(['whatsapp shown restricted', !!wa && wa.classList.contains('off')]);
 } else if(r==='aisha'){
  behav.push(['hardship is the escalation reason', (doc.querySelector('.why')?.textContent||'').toLowerCase().includes('hardship')]);
  behav.push(['open promise visible in glance', !!doc.querySelector('[data-g="ptp"] .t-display:not(.empty)')]);
  behav.push(['call cap shown as client policy, not law', /Client policy/.test(doc.querySelector('#cr-call')?.textContent||'')]);
 } else if(r==='stress'){
  const outs=[...doc.querySelectorAll('.card .card-r .t-display')].map(e=>parseFloat(e.textContent.replace(/[^\d.]/g,'')));
  const sorted=outs.every((v,i)=>i===0||outs[i-1]>=v);
  behav.push(['cards sorted outstanding-descending', sorted]);
  click(doc.getElementById('b-compare'));
  const inCompare=!!doc.querySelector('.cols.compare');
  const compareRows=doc.querySelectorAll('tbody tr').length;
  click(doc.getElementById('b-compare'));
  behav.push(['every account reachable (cards match compare rows)', doc.querySelectorAll('.card[data-a]').length===compareRows]);
  behav.push(['compare reachable in one click', inCompare]);
 } else if(r==='sparse'){
  behav.push(['nulls render as dash, not blank', !!doc.querySelector('.row.is-empty')&&[...doc.querySelectorAll('.row.is-empty .v')].every(v=>v.textContent.trim()==='–')]);
  behav.push(['labels persist beside empty values', !!doc.querySelector('.row.is-empty .k')]);
  behav.push(['three-column layout holds', doc.querySelectorAll('.cols>.col').length===3]);
 } else if(r==='blocked'){
  behav.push(['all four channels restricted with reasons', doc.querySelectorAll('.cnote').length===4]);
  behav.push(['UAE hours cite CBUAE', /CBUAE/.test(doc.querySelector('#cr-call')?.textContent||'')]);
 } else if(r==='ksa'){
  behav.push(['KSA call cap cites SAMA', /SAMA/.test(doc.querySelector('#cr-call')?.textContent||'')]);
  behav.push(['10 call attempts logged to back the cap', R10()]);
  behav.push(['amounts in SAR', /SAR/.test(doc.querySelector('.stats').textContent)]);
  behav.push(['KSA cites the current SAMA articles, not the 2018 text', !/2018/.test(doc.getElementById('stack').innerHTML)&&/Art\. 4\(3\)/.test(doc.querySelector('#cr-call')?.textContent||'')]);
  // SAMA 6(4): an open complaint stops reminders on every channel, not one
  window.eval("R.ksa.accts[0].dispute={date:'2026-07-01',why:{en:'t',ar:'t'}};render()");
  behav.push(['KSA open complaint blocks all four channels', doc.querySelectorAll('.rail .act.off').length===4&&[...doc.querySelectorAll('.cnote')].every(n=>/6\(4\)/.test(n.textContent))]);
  window.eval("R.ksa.accts[0].dispute=null;render()");
 }
 behav.forEach(([label,ok])=>{ if(!ok) errs.push(`BEHAV ${r}: ${label}`); });
 console.log(' behav:',behav.map(([l,ok])=>`${ok?'pass':'FAIL'} ${l}`).join(' | '));
 }
}

// 1.4: every fixture national ID passes its check digit (Luhn)
const luhn=s=>{const d=s.replace(/\D/g,'');let t=0;for(let i=0;i<d.length;i++){let n=+d[d.length-1-i];if(i%2){n*=2;if(n>9)n-=9}t+=n}return t%10===0};
for(const [k,r] of Object.entries(window.eval('R'))) if(r.eid&&!luhn(r.eid)) errs.push(`1.4 ${k}: ID ${r.eid} fails check digit`);
// A10: typed Arabic-Indic digits survive
const tw=window.eval('toWesternDigits');
[['١٤٢٠','1420'],['١٬٤٢٠٫٥','1420.5'],['۱۲۳','123'],['1,420','1420']].forEach(([a,b])=>{if(tw(a)!==b) errs.push(`A10: ${a} -> ${tw(a)}, expected ${b}`);});
// privacy default: ID masked until revealed
toQueue();openCase('omar');setLang('en');
if(/4471209/.test(doc.getElementById('c-bor').textContent)) errs.push('PRIVACY: Emirates ID shown unmasked by default');

// reconciliation — a MISMATCH fails the script, not just a console note
toQueue();openCase('omar');setLang('en');
const bal=[...doc.querySelectorAll('.card .t-display.sm')].map(e=>parseFloat(e.textContent.replace(/[^\d]/g,'')));
const tot=parseFloat(doc.querySelector('.stats .t-display').textContent.replace(/[^\d]/g,''));
const sum=bal.reduce((a,b)=>a+b,0);
console.log('\nreconcile: cards',bal.join('+'),'=',sum,'| spine',tot,sum===tot?'OK':'MISMATCH');
if(sum!==tot) errs.push(`RECONCILE: cards sum to ${sum}, spine shows ${tot}`);
// interactions
click(doc.querySelectorAll('.card')[1]);
console.log('select 2nd card ->',doc.querySelector('#c-acc .colhead .ltr').textContent);
click(doc.getElementById('b-compare'));
console.log('compare rows:',doc.querySelectorAll('tbody tr').length);
click(doc.getElementById('b-compare'));
click(doc.querySelector('[data-t="m"]'));
console.log('tab ->',doc.querySelector('.tabs button.on').textContent);
click(doc.getElementById('b-scope'));
console.log('scope ->',doc.getElementById('b-scope').textContent);
click(doc.getElementById('b-scope'));
click(doc.querySelector('[data-t="i"]'));
// wrap-up screen round trip
click(doc.getElementById('b-entry'));
if(!doc.querySelector('.wrap')) errs.push('WRAPUP: opening "Log outcome" did not render the wrap-up pane');
doc.getElementById('w-out').value='promise';
doc.getElementById('w-note').value='Agreed 500 after payday.';
doc.getElementById('w-amt').value='500';
doc.getElementById('w-date').value='2026-09-25';
click(doc.getElementById('w-save'));
if(!doc.querySelector('.wrap-done')) errs.push('WRAPUP: save did not show the confirmation state');
console.log('wrapup save: confirmation shown =',!!doc.querySelector('.wrap-done'));
click(doc.getElementById('w-return'));
if(!doc.querySelector('#queue')) errs.push('WRAPUP: "Return to queue" did not land back on the queue');
console.log('return to queue ->',!!doc.querySelector('#queue'));
// reopen the same case the normal way to confirm the mutation actually reached the log
openCase('omar');
if(!doc.querySelector('.log.new')) errs.push('WRAPUP: saved outcome did not appear as a new log row on reopen');
console.log('reopened from queue: new row visible =',!!doc.querySelector('.log.new'));
console.log('spine promise (post-save) =',doc.querySelectorAll('.stats .t-display')[2].textContent.trim().slice(0,40));

// RTL diff, once, on the record already loaded
setLang('ar');
console.log('\nAR spine:',doc.querySelector('.why').textContent.replace(/\s+/g,' ').trim().slice(0,130));
console.log('AR stat sub:',doc.querySelector('.stats .stat-sub').textContent);

// collapsed-nav toggle still works (jsdom has no real layout engine, so the actual
// centering fix is a CSS-only claim verified visually in the browser, not here)
click(doc.getElementById('b-navcollapse'));
const navCollapsed=doc.getElementById('nav').classList.contains('collapsed');
if(!navCollapsed) errs.push('NAV: collapse toggle did not add the collapsed class');
console.log('nav collapsed:',navCollapsed);
click(doc.getElementById('b-navcollapse'));

console.log('\nERRORS:',errs.length?errs.join('\n'):'none');
if(errs.length) process.exitCode=1;

// P3: story mode, decision log, why links
{
 const key=k=>doc.body.dispatchEvent(new window.KeyboardEvent('keydown',{key:k,bubbles:true}));
 click(doc.getElementById('rb-tour'));
 const STEPS=window.eval('STEPS'),CARDS=window.eval('CARDS'),ids=CARDS.map(c=>c[0]);
 for(let i=1;i<=STEPS.length;i++){
  const st=STEPS[i-1];
  if(window.eval('S.step')!==i) errs.push(`P3: expected step ${i}, at ${window.eval('S.step')}`);
  if(!new RegExp('step='+i+'(&|$)').test(window.location.search)) errs.push(`P3: step ${i} not in URL`);
  if(st.t&&!doc.querySelector(st.t)) errs.push(`P3: step ${i} target ${st.t} missing`);
  if(st.card&&!ids.includes(st.card)) errs.push(`P3: step ${i} cites unknown card ${st.card}`);
  if(!st.en||!st.ar) errs.push(`P3: step ${i} missing EN or AR claim`);
  if(i<STEPS.length) key(window.eval("S.lang==='ar'?'ArrowLeft':'ArrowRight'"));
 }
 key('Escape');
 if(doc.querySelector('#story .strip')||/step=/.test(window.location.search)) errs.push('P3: Esc did not leave the tour');
 if(CARDS.length!==17) errs.push(`P3: ${CARDS.length} decision cards, expected 17`);
 toQueue();openCase('omar');setLang('en');
 if(doc.querySelector('#stack a.ann')) errs.push('P3: why links on the agent screen by default');
 click(doc.getElementById('rb-ann'));
 const anns=[...doc.querySelectorAll('#stack a.ann')].map(a=>a.dataset.card);
 if(anns.length!==6) errs.push(`P3: ${anns.length} why links on Omar, expected 6 (${anns.join(',')})`);
 anns.filter(c=>!ids.includes(c)).forEach(c=>errs.push(`P3: why link to unknown card ${c}`));
 click(doc.querySelector('#stack a.ann[data-card="D4"]'));
 const logCards=doc.querySelectorAll('.dcard').length;
 if(logCards!==17) errs.push(`P3: log shows ${logCards} cards`);
 if(!doc.querySelector('#card-D4.on')) errs.push('P3: why link did not open its card');
 if(/\[R\d+\]/.test(doc.querySelector('.log-doc').textContent)) errs.push('P3: unresolved [R#] source in the log');
 click(doc.getElementById('b-logback'));
 if(!doc.querySelector('.spine')) errs.push('P3: log Back did not return to the profile');
 console.log(`P3: ${STEPS.length} steps walked, ${logCards} cards, ${anns.length} why links`);
 if(errs.length&&!process.exitCode){console.log('ERRORS:',errs.join(' | '));process.exitCode=1;}
}

// P4: system proof
{
 const W=window.eval.bind(window), R_=W('R'), today=W('TODAY'), when=W('when'), days=W('days');
 // 1.4 integrity, every fixture
 for(const [k,r] of Object.entries(R_)){
  r.accts.forEach(a=>{
   if(!(a.over<=a.out&&a.out<=a.total)) errs.push(`1.4 ${k}/${a.ref}: overdue ≤ outstanding ≤ original fails`);
   if(a.principal>a.total) errs.push(`1.4 ${k}/${a.ref}: principal above original`);
   if(a.ptp&&a.ptp.state==='broken'&&!(when(a.ptp.date)<today)) errs.push(`1.4 ${k}/${a.ref}: broken promise not in the past`);
   if(a.ptp&&a.ptp.state==='open'&&days(a.ptp.date)>0) errs.push(`1.4 ${k}/${a.ref}: open promise dated in the past`);
   if(a.broken&&!a.brokenLast&&a.ptp?.state!=='broken'&&k!=='omar') errs.push(`1.4 ${k}/${a.ref}: broken count without a date`);
   if(a.plan&&a.plan.paid>a.plan.of) errs.push(`1.4 ${k}/${a.ref}: plan paid > instalments`);
  });
  const ph=r.logs.filter(l=>l.src==='phone'), ai=r.logs.filter(l=>l.src==='ai');
  if(r.calls.h<ph.length) errs.push(`1.4 ${k}: total human calls ${r.calls.h} < ${ph.length} logged`);
  if(r.calls.ai<ai.length) errs.push(`1.4 ${k}: total AI calls ${r.calls.ai} < ${ai.length} logged`);
  const lastAns=ph.filter(l=>l.out!=='noans').map(l=>when(l.at)).sort((x,y)=>y-x)[0];
  if((lastAns?+lastAns:null)!==(r.calls.lastH?+when(r.calls.lastH):null)) errs.push(`1.4 ${k}: latest human call answered ≠ latest answered phone log`);
  if(r.market==='SA'){ const n=ph.filter(l=>days(l.at)<=30).length; if(n>10) errs.push(`1.4 ${k}: ${n} attempts in 30 days > SAMA 10`);
   if(r.ch.call==='cap'&&n!==10) errs.push(`1.4 ${k}: cap shown but ${n} attempts logged`); }
 }
 // 3.7: the queue owns no CSS
 const css=fs.readFileSync('src/tokens.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');
 if(/(^|[\s,}])(\.q[\w-]*|#q-?[\w-]*|[^{}]*\[data-q\]|[^{}]*queue)[^{}]*\{/m.test(css)) errs.push('3.7: queue-specific CSS rules found');
 // council R-E: the state matrix is a contract. every control it lists needs the hover/active rules it claims,
 // and one shared focus-visible ring.
 {const cssAll=fs.readFileSync('src/tokens.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');
  const ctrl={'.act':'hover','.mini':'hover','.card':'hover','.tabs button':'hover','.dd-trigger':'hover','.dd-opt':'hover','.linkbtn':'hover'};
  for(const [sel,st] of Object.entries(ctrl)){
   const re=new RegExp(sel.replace(/[.]/g,'\\.')+'[^{}]*:'+st+'\\b[^{}]*\\{');
   if(!re.test(cssAll)) errs.push('3.8: state matrix lists '+sel+' but the stylesheet has no :'+st+' rule for it');}
  if(!/:focus-visible\{outline:none;box-shadow:var\(--focus-ring\)\}/.test(cssAll.replace(/\s+/g,''))) errs.push('3.8: shared focus-visible ring missing');
  if(/\.mini:disabled\{/.test(cssAll)&&!/\.act:disabled,\.mini:disabled/.test(cssAll)) errs.push('3.8: two disabled idioms (.mini:disabled vs .off)');}
 // 1.5 system states
 toQueue();openCase('omar');setLang('en');
 W("S.state='loading';render()"); if(!doc.querySelector('[aria-busy="true"]')) errs.push('1.5: loading state not rendered');
 W("S.state='stale';render()"); if(!doc.querySelector('.why.stale')) errs.push('1.5: stale band missing');
 click(doc.getElementById('b-refresh')); if(doc.querySelector('.why.stale')) errs.push('1.5: Refresh did not clear stale');
 W("S.state='blocked';render()"); click(doc.querySelector('.rail [data-ch="call"]'));
 if(!doc.querySelector('.dispatch')) errs.push('1.5: blocked-at-dispatch notice missing');
 W("S.state='savefail';S.dispatch=null;render()"); click(doc.getElementById('b-entry'));
 doc.getElementById('w-note').value='kept'; const before=W('rec().logs.length');
 click(doc.getElementById('w-save'));
 if(!doc.querySelector('.save-fail')||doc.getElementById('w-note').value!=='kept'||W('rec().logs.length')!==before) errs.push('1.5: save failed did not keep the entry');
 W("S.state=null;S.mode='profile';render()");
 // 3.5: an editable field is a control and writes back
 click(doc.querySelectorAll('.card')[1]);
 const ed=doc.querySelector('.row.edit .dd-trigger');
 if(!ed) errs.push('3.5: editable field is not a control');
 else { click(ed); click(doc.querySelector('.row.edit .dd-opt[data-v="yes"]'));
  if(W('acc().fields.verif')!=='yes') errs.push('3.5: editable field did not write back'); }
 // 3.8 component sheet + dictionary
 click(doc.getElementById('rb-sheet'));
 const specs=doc.querySelectorAll('.sheet-grid>.blk').length, dict=doc.querySelectorAll('#dict tbody tr').length;
 if(specs<12) errs.push(`3.8: sheet shows ${specs} components`);
 if(dict!==W('DICT').length) errs.push('1.4: dictionary rows missing');
 click(doc.getElementById('b-logback'));
 console.log(`P4: ${specs} components on the sheet, ${dict} dictionary entries, 4 states checked`);
 if(errs.length&&!process.exitCode){console.log('ERRORS:',errs.join(' | '));process.exitCode=1;}
}

// P5: the test page renders its harness and the pre-registered plan
{
 click(doc.getElementById('rb-test'));
 const ids=['harness','klm','hyp','methods','rubric','decide','drop'].filter(id=>!doc.getElementById(id));
 if(ids.length) errs.push('P5: test page sections missing: '+ids.join(', '));
 if(!doc.getElementById('b-harness')) errs.push('P5: harness run button missing');
 if(doc.querySelectorAll('#hyp tbody tr').length!==8) errs.push('P5: expected 8 hypotheses');
 click(doc.getElementById('b-logback'));
 console.log('P5: test page sections present; harness runs in a real browser (layout, fonts, axe)');
 if(errs.length&&!process.exitCode){console.log('ERRORS:',errs.join(' | '));process.exitCode=1;}
}

// 3.2: values come from tokens. every colour, space, size, radius and type declaration in the
// component layer counts; a literal px or colour fails it. target >= 90%.
{
 const css=fs.readFileSync('src/tokens.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');
 const comp=css.slice(css.indexOf('*{box-sizing'));
 const props=/^(color|background(-color)?|border(-[a-z-]+)?|padding(-[a-z-]+)?|margin(-[a-z-]+)?|gap|row-gap|column-gap|font-size|line-height|border-radius|inline-size|block-size|min-[a-z-]+|max-[a-z-]+|inset[a-z-]*|box-shadow|flex)$/;
 let tok=0,lit=0;const lits=[];
 for(const m of comp.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/g)){
  const [,p,v]=m; if(!props.test(p)) continue;
  if(/#[0-9a-f]{3,8}\b|rgba?\(|\b\d+(\.\d+)?px\b/i.test(v.replace(/var\([^)]*\)/g,''))){lit++;lits.push(p+':'+v.trim());} else if(/var\(/.test(v)) tok++;
 }
 const ratio=tok/(tok+lit);
 console.log(`3.2 token ratio: ${tok}/${tok+lit} = ${(ratio*100).toFixed(1)}%`);
 const rawType=lits.filter(l=>/^(font-size|line-height):/.test(l));
 if(rawType.length) errs.push('3.2: raw type sizes bypass the --fs-*/--lh-* tokens: '+rawType.join(' | '));
 if(ratio<.9) errs.push(`3.2: token ratio ${(ratio*100).toFixed(1)}% < 90%. literals: ${lits.join(' | ')}`);
 if(errs.length&&!process.exitCode) {console.log('ERRORS:',errs.join('\n'));process.exitCode=1;}
}
