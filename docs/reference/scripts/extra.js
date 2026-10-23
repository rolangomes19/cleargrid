const { chromium } = require('/opt/npm-tools/node_modules/playwright-core');
const dist='file://'+process.argv[2];
(async()=>{
 const b=await chromium.launch();
 const mk=async(w)=>{const c=await b.newContext({viewport:{width:w,height:900}});const p=await c.newPage();
   await p.route('**/*',r=>r.request().url().startsWith('file:')||r.request().url().startsWith('data:')?r.continue():r.abort());
   await p.goto(dist);await p.waitForSelector('.qrow');return p;};
 // 1 lang toggle at 1280
 let p=await mk(1280);
 const st=()=>p.evaluate(()=>({lang:document.documentElement.lang,navCollapsedClass:document.getElementById('nav').classList.contains('collapsed'),visibleLangBtns:[...document.querySelectorAll('.nav-lang button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.dataset.v)}));
 console.log('1280 initial',JSON.stringify(await st()));
 await p.click('.nav-lang button.on'); console.log('1280 after click visible lang btn',JSON.stringify(await st()));
 await p.click('.nav-lang button.on'); console.log('1280 after 2nd click',JSON.stringify(await st()));
 const hasCollapse=await p.locator('#b-navcollapse').count(); console.log('b-navcollapse present on queue screen:',hasCollapse);
 await p.click('[data-q="omar"]'); await p.waitForSelector('.spine');
 console.log('1280 profile',JSON.stringify(await st()), 'collapse btn count',await p.locator('#b-navcollapse').count(),'visible',await p.locator('#b-navcollapse').isVisible().catch(()=>false));
 await p.close();
 // 1440 control
 p=await mk(1440); await p.click('.nav-lang button[data-v="ar"]'); console.log('1440 click AR ->',JSON.stringify(await st()));
 // 2 coral grouping on stress/aisha 1440 en
 for(const rec of ['aisha','stress','omar']){
  await p.click('[data-nav="queue"]'); await p.click('.nav-lang button[data-v="en"]'); await p.click(`[data-q="${rec}"]`); await p.waitForSelector('.spine');
  const g=await p.evaluate(()=>{const C=['rgb(220, 74, 62)','rgb(178, 58, 48)','rgb(253, 238, 236)','rgb(184, 52, 42)'];
   const out=[];document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e),r=e.getBoundingClientRect();if(!r.width)return;
    const hit=C.includes(cs.backgroundColor)||['Top','Right','Bottom','Left'].some(s=>parseFloat(cs['border'+s+'Width'])>0&&C.includes(cs['border'+s+'Color']))||(C.includes(cs.color)&&e.parentElement&&getComputedStyle(e.parentElement).color!==cs.color&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
    if(hit){const card=e.closest('.card'),why=e.closest('.why');out.push({tag:e.tagName+'.'+e.className,container:why?'WHY-BAND':card?('card '+card.dataset.a+(card.classList.contains('hot')?' hot':'')):'other'});}});return out;});
  const byC={};g.forEach(x=>(byC[x.container]=byC[x.container]||[]).push(x.tag));console.log('coral',rec,JSON.stringify(byC));
  const hot=await p.evaluate(()=>[...document.querySelectorAll('.card')].map(c=>c.dataset.a+':'+c.className.replace('card','').trim()));console.log('  cards',JSON.stringify(hot));
 }
 // 3 Arabic low-lh / non-Tajawal elements
 await p.click('[data-nav="queue"]'); await p.click('.nav-lang button[data-v="ar"]'); await p.click('[data-q="omar"]'); await p.waitForSelector('.spine');
 const ar=await p.evaluate(()=>{const o=[];document.querySelectorAll('body *').forEach(e=>{const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(!own||!/[؀-ۿ]/.test(own))return;const cs=getComputedStyle(e),fs=parseFloat(cs.fontSize),lh=parseFloat(cs.lineHeight)/fs;
   if(lh<1.69||!cs.fontFamily.startsWith('Tajawal'))o.push({cls:e.className,text:own.slice(0,22),fs,lh:+lh.toFixed(2),fam:cs.fontFamily.split(',')[0]});});return o;});
 console.log('AR odd',JSON.stringify(ar));
 await b.close();
})();
