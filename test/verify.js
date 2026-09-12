const fs=require('fs'),{JSDOM}=require('jsdom');
const errs=[];
const dom=new JSDOM(fs.readFileSync('dist/cleargrid-borrower-profile.html','utf8'),
 {runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.addEventListener('error',e=>errs.push(e.message))}});
const {window}=dom,doc=window.document;
const pick=(id,v)=>doc.querySelector(`#${id} [data-v="${v}"]`).dispatchEvent(new window.Event('click',{bubbles:true}));
const click=el=>el&&el.dispatchEvent(new window.Event('click',{bubbles:true}));
console.log('rec       dir  accts sel          alerts gated  spineNums');
for(const r of ['omar','aisha','stress','sparse']){
 pick('sw-rec',r);
 for(const d of ['ltr','rtl']){
  pick('sw-dir',d);
  const html=doc.getElementById('stack').innerHTML;
  if(html.length<800) errs.push('EMPTY '+r+'/'+d);
  const bad=html.match(/.{50}(undefined|NaN|\[object Object\]).{30}/s); // s: '.' must cross newlines or this silently misses matches
  if(bad) errs.push(`TOKEN ${r}/${d}: ${bad[0].replace(/\s+/g,' ')}`);
  const sel=doc.querySelector('.card.on .t-pri');
  const nums=[...doc.querySelectorAll('.stats .t-display')].map(e=>e.textContent.trim()).join(' | ');
  console.log(r.padEnd(9),d.padEnd(4),String(doc.querySelectorAll('.card').length).padEnd(5),
   (sel?sel.textContent:'-').slice(0,12).padEnd(12),
   String(doc.querySelectorAll('[data-alert="1"]').length).padEnd(6),
   String(doc.querySelectorAll('[data-gated="1"]').length).padEnd(6), nums);
 }
}
// reconciliation
pick('sw-rec','omar');pick('sw-dir','ltr');
const bal=[...doc.querySelectorAll('.card .t-display.sm')].map(e=>parseFloat(e.textContent.replace(/[^\d]/g,'')));
const tot=parseFloat(doc.querySelector('.stats .t-display').textContent.replace(/[^\d]/g,''));
console.log('\nreconcile: cards',bal.join('+'),'=',bal.reduce((a,b)=>a+b,0),'| spine',tot,bal.reduce((a,b)=>a+b,0)===tot?'OK':'MISMATCH');
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
// entry mode round trip
click(doc.getElementById('b-entry'));
doc.getElementById('e-out').value='promise';
doc.getElementById('e-note').value='Agreed 500 after payday.';
doc.getElementById('e-amt').value='500';
doc.getElementById('e-date').value='2026-09-25';
click(doc.getElementById('e-save'));
console.log('after save: new row =',!!doc.querySelector('.log.new'),
 '| spine promise =',doc.querySelectorAll('.stats .t-display')[2].textContent.trim().slice(0,40));
window.audit();
console.log('\nAUDIT:',doc.getElementById('auditb').textContent.replace(/\s+/g,' ').slice(0,220));
pick('sw-dir','rtl');
console.log('\nAR spine:',doc.querySelector('.why').textContent.replace(/\s+/g,' ').trim().slice(0,130));
console.log('AR stat sub:',doc.querySelector('.stats .sub').textContent);
console.log('\nERRORS:',errs.length?errs.join('\n'):'none');
