// Phase 3 measurement. Reads dist (built from src at HEAD), writes JSON. Does not touch the repo.
const { chromium } = require('/opt/npm-tools/node_modules/playwright-core');
const fs = require('fs');
const [,, distPath, outPath] = process.argv;
const RECS = ['omar','aisha','stress','sparse'], DIRS = ['en','ar'], VPS = [[1440,900],[1280,900]];

function inPage() {
  const CORAL = {'rgb(220, 74, 62)':'coral','rgb(178, 58, 48)':'coralDeep','rgb(253, 238, 236)':'coralWash','rgb(184, 52, 42)':'coralText'};
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none'; };
  const all = [...document.querySelectorAll('body *')].filter(vis);
  const q = s => { const m = s.match(/rgba?\(([^)]+)\)/); if(!m) return [0,0,0,0]; const p = m[1].split(',').map(x=>parseFloat(x)); return [p[0],p[1],p[2],p.length>3?p[3]:1]; };
  const lum = ([r,g,b]) => { const f = c => { c/=255; return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4); }; return .2126*f(r)+.7152*f(g)+.0722*f(b); };
  const over = (top,bot) => { const a = top[3]+bot[3]*(1-top[3]); if(a===0) return [0,0,0,0];
    return [0,1,2].map(i=>(top[i]*top[3]+bot[i]*bot[3]*(1-top[3]))/a).concat(a); };
  const effBg = el => { let stack=[]; for(let n=el;n;n=n.parentElement){ stack.push(q(getComputedStyle(n).backgroundColor)); }
    let bg=[255,255,255,1]; for(let i=stack.length-1;i>=0;i--) bg=over(stack[i],bg); return bg; };
  const effOpacity = el => { let o=1; for(let n=el;n;n=n.parentElement) o*=parseFloat(getComputedStyle(n).opacity); return o; };
  const label = e => e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).join('.'):'');

  // coral
  const painted = [];
  for (const e of all) { const cs = getComputedStyle(e), par = e.parentElement?getComputedStyle(e.parentElement):null; const hits = [];
    const bg = cs.backgroundColor; if (CORAL[bg]) hits.push('bg:'+CORAL[bg]);
    ['Top','Right','Bottom','Left'].forEach(s=>{ if(parseFloat(cs['border'+s+'Width'])>0 && CORAL[cs['border'+s+'Color']]) hits.push('border'+s+':'+CORAL[cs['border'+s+'Color']]); });
    if (CORAL[cs.color] && (!par || par.color!==cs.color) && [...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) hits.push('text:'+CORAL[cs.color]);
    if (parseFloat(cs.outlineWidth)>0 && CORAL[cs.outlineColor]) hits.push('outline');
    if (hits.length) painted.push({el:e,label:label(e),hits}); }
  const paintedSet = new Set(painted.map(p=>p.el));
  const regions = painted.filter(p=>{ for(let n=p.el.parentElement;n;n=n.parentElement) if(paintedSet.has(n)) return false; return true; });
  const coral = { dataAlert: document.querySelectorAll('[data-alert="1"]').length, paintedElements: painted.length, paintedRegions: regions.length,
    regions: regions.map(r=>({label:r.label,hits:r.hits,text:(r.el.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)})) };

  // type + contrast
  const sizes = {}, weights = {}, fams = {}, bad = [], contrastFail = [], arChecks = {lh:[],ls:[],italic:0,lowWeight:0,notTajawal:0,arEls:0};
  const hasAr = s => /[؀-ۿ]/.test(s);
  const isAr = document.documentElement.lang==='ar';
  for (const e of all) {
    const own = [...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim(); if(!own) continue;
    const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize), fw = cs.fontWeight, fam = cs.fontFamily.split(',')[0].replace(/['"]/g,'').trim();
    sizes[fs]=(sizes[fs]||0)+1; weights[fw]=(weights[fw]||0)+1; fams[fam]=(fams[fam]||0)+1;
    if(![12,13,16,24].includes(fs)) bad.push({kind:'size',fs,label:label(e),text:own.slice(0,30)});
    if(!['400','500','600'].includes(String(fw))) bad.push({kind:'weight',fw,label:label(e),text:own.slice(0,30)});
    if(String(fw)==='500' && fam!=='JetBrains Mono') bad.push({kind:'weight500-nonmono',label:label(e),text:own.slice(0,30)});
    if(isAr && hasAr(own)){ arChecks.arEls++; const lh=parseFloat(cs.lineHeight)/fs; arChecks.lh.push(+lh.toFixed(2));
      if(cs.letterSpacing!=='normal' && parseFloat(cs.letterSpacing)!==0) arChecks.ls.push(label(e));
      if(cs.fontStyle!=='normal') arChecks.italic++; if(parseInt(fw)<400) arChecks.lowWeight++;
      if(!cs.fontFamily.startsWith('Tajawal') && !cs.fontFamily.startsWith('"Tajawal"')) arChecks.notTajawal++; }
    const fg = q(cs.color); const op = effOpacity(e); const bg = effBg(e);
    const fgc = over([fg[0],fg[1],fg[2],fg[3]*op], bg);
    const L1 = lum(fgc), L2 = lum(bg), ratio = (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    const large = fs>=24 || (fs>=18.66 && parseInt(fw)>=600);
    const need = large?3:4.5;
    if (ratio < need) contrastFail.push({ratio:+ratio.toFixed(2),need,fs,label:label(e),text:own.slice(0,28),fg:cs.color,bg:'rgb('+bg.slice(0,3).map(Math.round).join(',')+')'});
  }
  const lhArr = arChecks.lh; arChecks.lhMin = lhArr.length?Math.min(...lhArr):null; arChecks.lhMax = lhArr.length?Math.max(...lhArr):null; delete arChecks.lh;

  // spine + page
  const sp = document.querySelector('.spine'), R = e => { if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]; };
  const g = {}; document.querySelectorAll('.spine [data-g]').forEach(e=>g[e.dataset.g]=R(e));
  const cols = [...document.querySelectorAll('.cols>.col')].map(c=>({id:c.id,rect:R(c),scrolls:c.scrollHeight>c.clientHeight+1}));
  const scrollable = [...document.querySelectorAll('.cols>.col, .col *')].find(c=>c.scrollHeight>c.clientHeight+1 && ['auto','scroll'].includes(getComputedStyle(c).overflowY));
  const before = R(sp); let after=null; if(scrollable){ scrollable.scrollTop = 200; after = R(sp); scrollable.scrollTop = 0; }
  const spine = { rect: before, gRegions: Object.keys(g).length, g, factNodes: sp?{
      idline: sp.querySelectorAll('.idline > *').length, stats: sp.querySelectorAll('.stat').length, why: sp.querySelectorAll('.why').length, rail: sp.querySelectorAll('.rail .act').length }:null,
    movedOnPaneScroll: scrollable? JSON.stringify(before)!==JSON.stringify(after) : 'no scrollable pane found' };
  const page = { innerW: innerWidth, innerH: innerHeight, docScrollH: document.documentElement.scrollHeight, docScrollW: document.documentElement.scrollWidth,
    bodyOverflow: getComputedStyle(document.body).overflow, navW: Math.round(document.getElementById('nav').getBoundingClientRect().width), cols };
  const accordions = [...document.querySelectorAll('details,summary,[aria-expanded],[aria-controls],.accordion,[data-toggle]')].map(label);
  const cards = [...document.querySelectorAll('.card[data-a]')].map(c=>parseFloat((c.querySelector('.card-r .t-display')||{textContent:'0'}).textContent.replace(/[^\d.]/g,'')));
  const sortedDesc = cards.every((v,i)=>i===0||cards[i-1]>=v);
  const empties = [...document.querySelectorAll('.empty')].map(e=>e.textContent.trim());
  const ltr = [...document.querySelectorAll('.ltr')].map(e=>getComputedStyle(e).display);
  const ltrDisp = ltr.reduce((a,d)=>(a[d]=(a[d]||0)+1,a),{});
  const why = (document.querySelector('.why')||{textContent:''}).textContent.replace(/\s+/g,' ').trim();
  return { coral, type:{sizes,weights,fams,bad:bad.slice(0,12),badCount:bad.length}, contrast:{failCount:contrastFail.length, worst:contrastFail.sort((a,b)=>a.ratio-b.ratio)}, arChecks, spine, page, accordions, cards:{n:cards.length,sortedDesc}, empties:[...new Set(empties)], ltrDisp, why };
}

(async () => {
  const browser = await chromium.launch();
  const out = [];
  for (const [w,h] of VPS) {
    const ctx = await browser.newContext({ viewport:{width:w,height:h} });
    const page = await ctx.newPage();
    await page.route('**/*', r => r.request().url().startsWith('file:') || r.request().url().startsWith('data:') ? r.continue() : r.abort());
    const errs = []; page.on('pageerror', e=>errs.push(e.message));
    for (const rec of RECS) for (const dir of DIRS) {
      await page.goto('file://'+distPath); await page.waitForSelector('.qrow');
      const queueCoral = await page.evaluate(()=>document.querySelectorAll('[data-alert="1"]').length);
      let langNote=null;
      const cur = await page.evaluate(()=>document.documentElement.lang);
      if (cur!==dir) {
        const vis = await page.locator(`.nav-lang button[data-v="${dir}"]`).isVisible();
        if (vis) await page.click(`.nav-lang button[data-v="${dir}"]`);
        else { await page.click('.nav-lang button.on'); // what a real user can click when the nav is narrow
          const after = await page.evaluate(()=>document.documentElement.lang);
          if (after!==dir) { langNote='real user click on visible lang button did NOT switch language; forced via hidden button'; await page.evaluate(d=>document.querySelector(`.nav-lang button[data-v="${d}"]`).click(),dir); } }
      }
      await page.click(`[data-q="${rec}"]`); await page.waitForSelector('.spine');
      const m = await page.evaluate(inPage);
      out.push({ vp:`${w}x${h}`, rec, dir, langNote, queueCoral, pageErrors:[...errs], ...m });
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(outPath, JSON.stringify(out,null,1));
  console.log('runs', out.length);
})();
