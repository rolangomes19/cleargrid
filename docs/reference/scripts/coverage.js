const { chromium } = require('/opt/npm-tools/node_modules/playwright-core');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
 await p.route('**/*',r=>r.request().url().startsWith('file:')||r.request().url().startsWith('data:')?r.continue():r.abort());
 await p.goto('file://'+process.argv[2]);await p.waitForSelector('.qrow');
 const txt=async()=>p.evaluate(()=>document.getElementById('stack').innerText.replace(/\s+/g,' '));
 const all={};
 for(const rec of ['omar','stress']){
  await p.click('[data-nav="queue"]');await p.click(`[data-q="${rec}"]`);await p.waitForSelector('.spine');
  let t=await txt();
  for(const tab of ['i','m','t','k']){ await p.click(`[data-t="${tab}"]`).catch(()=>{}); t+=' '+await txt(); }
  await p.click('#b-compare').catch(()=>{}); t+=' '+await txt(); await p.click('#b-compare').catch(()=>{});
  all[rec]=t;
 }
 const U=(all.omar+' '+all.stress).toLowerCase();
 const kw={A:['name','gender','nationality','date of birth','emirates id','owner','stage','visa','submit'],
 B:['total','outstanding','overdue','due','days past due','status'],
 C:['human','ai','answered','promise','broken','interaction','message','timeline'],
 D:['reference','account reference','balance','loan type','product','merchant','action','view'],
 E:['payment plan','installment','emi','interest','lender','principal','schedule','timeline','custom','attribute'],
 F:['call','sms','whatsapp','email','inbox']};
 for(const g in kw){console.log(g,kw[g].map(k=>`${k}:${U.includes(k)?'Y':'-'}`).join(' '));}
 console.log('compare columns:',await p.evaluate(()=>{const t=document.querySelector('table');return t?[...t.querySelectorAll('th')].map(h=>h.textContent.trim()).join(' | '):'(none)'}));
 await p.click('[data-nav="queue"]');await p.click('[data-q="stress"]');await p.waitForSelector('.spine');await p.click('#b-compare');
 console.log('compare cols (stress):',await p.evaluate(()=>[...document.querySelectorAll('table th')].map(h=>h.textContent.trim()).join(' | ')));
 await b.close();})();
