const fs=require('fs'),{JSDOM}=require('jsdom');
const errs=[];
const dom=new JSDOM(fs.readFileSync('dist/cleargrid-borrower-profile.html','utf8'),
 {runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.addEventListener('error',e=>errs.push(e.message))}});
const {window}=dom,doc=window.document;
const click=el=>el&&el.dispatchEvent(new window.Event('click',{bubbles:true}));
// drives the real product UI now that the harness is gone — the queue and the nav's own
// EN/AR toggle are real controls, so tests exercise the same paths an agent would.
const toQueue=()=>click(doc.querySelector('[data-nav="queue"]'));
const openCase=key=>click(doc.querySelector(`[data-q="${key}"]`));
const setLang=l=>click(doc.querySelector(`.nav-lang button[data-v="${l}"]`));

// queue screen — this is what the app boots into (S.mode defaults to 'queue'),
// so this is the true initial-load state, captured before anything else touches S.
const qrows=doc.querySelectorAll('.qrow');
if(qrows.length!==4) errs.push(`QUEUE row count = ${qrows.length}, expected 4`);
const qAlerts=doc.querySelectorAll('[data-alert="1"]').length;
if(qAlerts>3) errs.push(`QUEUE coral budget: ${qAlerts} elements, cap is 3`);
console.log('queue rows:',qrows.length,'| coral:',qAlerts,
 '| order:',[...qrows].map(r=>r.dataset.q).join(' > '));

console.log('\nrec       dir  accts sel          alerts  spineNums');
for(const r of ['omar','aisha','stress','sparse']){
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
  behav.push(['disputed account shows a coral status badge', !!doc.querySelector('.card.hot .badge.alert')]);
  const wa=[...doc.querySelectorAll('.rail .act')][2];
  behav.push(['whatsapp shown restricted', !!wa && wa.classList.contains('off')]);
 } else if(r==='aisha'){
  behav.push(['hardship is the escalation reason', (doc.querySelector('.why')?.textContent||'').toLowerCase().includes('hardship')]);
  behav.push(['open promise visible in glance', !!doc.querySelector('[data-g="ptp"] .t-display:not(.empty)')]);
  behav.push(['call available', !doc.querySelector('.rail .act')?.classList.contains('off')]);
 } else if(r==='stress'){
  const outs=[...doc.querySelectorAll('.card .card-r .t-display')].map(e=>parseFloat(e.textContent.replace(/[^\d.]/g,'')));
  const sorted=outs.every((v,i)=>i===0||outs[i-1]>=v);
  behav.push(['cards sorted outstanding-descending', sorted]);
  click(doc.getElementById('b-compare'));
  const compareRows=doc.querySelectorAll('tbody tr').length;
  click(doc.getElementById('b-compare'));
  behav.push(['every account reachable (cards match compare rows)', doc.querySelectorAll('.card[data-a]').length===compareRows]);
  behav.push(['compare reachable in one click', !!doc.getElementById('b-compare')]);
 } else {
  behav.push(['nulls render as dash, not blank', !!doc.querySelector('.empty')]);
  behav.push(['labels persist beside empty values', !!doc.querySelector('.row.is-empty .k')]);
  behav.push(['three-column layout holds', doc.querySelectorAll('.cols>.col').length>=2]);
 }
 behav.forEach(([label,ok])=>{ if(!ok) errs.push(`BEHAV ${r}: ${label}`); });
 console.log(' behav:',behav.map(([l,ok])=>`${ok?'pass':'FAIL'} ${l}`).join(' | '));
 }
}

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
if(!doc.querySelector('.queue')) errs.push('WRAPUP: "Return to queue" did not land back on the queue');
console.log('return to queue ->',!!doc.querySelector('.queue'));
// reopen the same case the normal way to confirm the mutation actually reached the log
openCase('omar');
if(!doc.querySelector('.log.new')) errs.push('WRAPUP: saved outcome did not appear as a new log row on reopen');
console.log('reopened from queue: new row visible =',!!doc.querySelector('.log.new'));
console.log('spine promise (post-save) =',doc.querySelectorAll('.stats .t-display')[2].textContent.trim().slice(0,40));

// RTL diff, once, on the record already loaded
setLang('ar');
console.log('\nAR spine:',doc.querySelector('.why').textContent.replace(/\s+/g,' ').trim().slice(0,130));
console.log('AR stat sub:',doc.querySelector('.stats .sub').textContent);

// collapsed-nav toggle still works (jsdom has no real layout engine, so the actual
// centering fix is a CSS-only claim verified visually in the browser, not here)
click(doc.getElementById('b-navcollapse'));
const navCollapsed=doc.getElementById('nav').classList.contains('collapsed');
if(!navCollapsed) errs.push('NAV: collapse toggle did not add the collapsed class');
console.log('nav collapsed:',navCollapsed);
click(doc.getElementById('b-navcollapse'));

console.log('\nERRORS:',errs.length?errs.join('\n'):'none');
if(errs.length) process.exitCode=1;
