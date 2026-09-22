const fs=require('fs'),{JSDOM}=require('jsdom');
const errs=[];
const dom=new JSDOM(fs.readFileSync('dist/cleargrid-borrower-profile.html','utf8'),
 {runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.addEventListener('error',e=>errs.push(e.message))}});
const {window}=dom,doc=window.document;
const pick=(id,v)=>doc.querySelector(`#${id} [data-v="${v}"]`).dispatchEvent(new window.Event('click',{bubbles:true}));
const click=el=>el&&el.dispatchEvent(new window.Event('click',{bubbles:true}));

// queue screen — this is what the app boots into (S.mode defaults to 'queue'),
// so this is the true initial-load state, captured before anything else touches S.
const qrows=doc.querySelectorAll('.qrow');
if(qrows.length!==4) errs.push(`QUEUE row count = ${qrows.length}, expected 4`);
const qAlerts=doc.querySelectorAll('[data-alert="1"]').length;
if(qAlerts>3) errs.push(`QUEUE coral budget: ${qAlerts} elements, cap is 3`);
console.log('queue rows:',qrows.length,'| coral:',qAlerts,
 '| order:',[...qrows].map(r=>r.dataset.q).join(' > '));

console.log('\nrec       dir  accts sel          alerts gated  spineNums');
for(const r of ['omar','aisha','stress','sparse']){
 pick('sw-rec',r);
 for(const d of ['ltr','rtl']){
  pick('sw-dir',d);
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
   String(alertCount).padEnd(6),
   String(doc.querySelectorAll('[data-gated="1"]').length).padEnd(6), nums);
 }
}
// reconciliation — was only console.log'd before (a MISMATCH never failed the script)
pick('sw-rec','omar');pick('sw-dir','ltr');
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
// wrap-up screen round trip (replaces the old inline entry form)
click(doc.getElementById('b-entry'));
if(!doc.querySelector('.wrap')) errs.push('WRAPUP: opening "Log outcome" did not render the wrap-up pane');
doc.getElementById('w-out').value='promise';
doc.getElementById('w-note').value='Agreed 500 after payday.';
doc.getElementById('w-amt').value='500';
doc.getElementById('w-date').value='2026-09-25';
click(doc.getElementById('w-save'));
if(!doc.querySelector('.wrap-done')) errs.push('WRAPUP: save did not show the confirmation state');
console.log('wrapup save: new row =',!!doc.querySelector('.log.new'),'| confirmation shown =',!!doc.querySelector('.wrap-done'));
click(doc.getElementById('w-return'));
if(!doc.querySelector('.queue')) errs.push('WRAPUP: "Return to queue" did not land back on the queue');
console.log('return to queue ->',!!doc.querySelector('.queue'));
// reopen the same case the normal way (a queue click, not the harness switcher, which
// resets the "just logged" highlight) to confirm the mutation actually reached the log
click(doc.querySelector('[data-q="omar"]'));
if(!doc.querySelector('.log.new')) errs.push('WRAPUP: saved outcome did not appear as a new log row on reopen');
console.log('reopened from queue: new row visible =',!!doc.querySelector('.log.new'));
// back into the profile for the remaining spine/audit/RTL checks
pick('sw-rec','omar');pick('sw-dir','ltr');
console.log('spine promise (post-save) =',doc.querySelectorAll('.stats .t-display')[2].textContent.trim().slice(0,40));
window.audit();
console.log('\nAUDIT:',doc.getElementById('auditb').textContent.replace(/\s+/g,' ').slice(0,220));
pick('sw-dir','rtl');
console.log('\nAR spine:',doc.querySelector('.why').textContent.replace(/\s+/g,' ').trim().slice(0,130));
console.log('AR stat sub:',doc.querySelector('.stats .sub').textContent);
console.log('\nERRORS:',errs.length?errs.join('\n'):'none');
