const { chromium } = require('/opt/npm-tools/node_modules/playwright-core');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();
 await p.route('**/*',r=>r.request().url().startsWith('file:')||r.request().url().startsWith('data:')?r.continue():r.abort());
 await p.goto('file://'+process.argv[2]);await p.waitForSelector('.qrow');
 const st=()=>p.evaluate(()=>({lang:document.documentElement.lang,coll:document.getElementById('nav').classList.contains('collapsed'),vis:[...document.querySelectorAll('.nav-lang button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.dataset.v),navW:document.getElementById('nav').getBoundingClientRect().width}));
 console.log('start',JSON.stringify(await st()));
 await p.click('#b-navcollapse');console.log('after collapse btn',JSON.stringify(await st()));
 await p.click('.nav-lang button.on');console.log('after lang click (collapsed class on)',JSON.stringify(await st()));
 await b.close();})();
