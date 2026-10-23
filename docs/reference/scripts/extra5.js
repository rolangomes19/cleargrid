const { chromium } = require('/opt/npm-tools/node_modules/playwright-core');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
 await p.route('**/*',r=>r.request().url().startsWith('file:')||r.request().url().startsWith('data:')?r.continue():r.abort());
 await p.goto('file://'+process.argv[2]);await p.waitForSelector('.qrow');
 await p.click('[data-q="omar"]');await p.waitForSelector('.spine');
 const r=await p.evaluate(()=>{const out=[];const w=document.createTreeWalker(document.getElementById('stack'),NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent;
   if(/12,860|8,000|4,860/.test(t)){const e=n.parentElement;out.push((e.closest('.spine')?'SPINE':e.closest('#c-bor')?'BORROWER-COL':e.closest('#c-acc')?'ACCOUNT-COL':e.closest('#c-act')?'ACTIVITY-COL':'OTHER')+' '+t.trim().slice(0,30)+' <'+e.className+'>');}}return out;});
 console.log(r.join('\n'));await b.close();})();
