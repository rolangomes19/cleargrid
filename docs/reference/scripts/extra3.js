const { chromium } = require('/opt/npm-tools/node_modules/playwright-core');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
 await p.route('**/*',r=>r.request().url().startsWith('file:')||r.request().url().startsWith('data:')?r.continue():r.abort());
 await p.goto('file://'+process.argv[2]);await p.waitForSelector('.qrow');
 for(const rec of ['omar','aisha','stress','sparse']){
  for(const dir of ['en','ar']){
   await p.click('[data-nav="queue"]');await p.click(`.nav-lang button[data-v="${dir}"]`);await p.click(`[data-q="${rec}"]`);await p.waitForSelector('.spine');
   const o=await p.evaluate(()=>{
    const H=s=>[...new Set([...document.querySelectorAll(s)].map(e=>Math.round(e.getBoundingClientRect().height)))];
    const ids=[];document.querySelectorAll('body *').forEach(e=>{const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
      if(!own)return; if(/784-?\d{4}-?\d{7}-?\d|\+?9715\d|@\w+\.|^\+?\d[\d\s-]{8,}$|[A-Z]{2,}-\d{3,}/.test(own)&&!e.closest('.ltr'))ids.push(own.slice(0,30));});
    return {colhead:H('.colhead'),act:H('.act'),mini:H('.mini'),badge:H('.badge'),ltrN:document.querySelectorAll('.ltr').length,ltrTexts:[...document.querySelectorAll('.ltr')].map(e=>e.textContent.trim().slice(0,24)),idsOutsideLtr:ids};});
   console.log(rec,dir,JSON.stringify(o));
  }}
 await b.close();})();
