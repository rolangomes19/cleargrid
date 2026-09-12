// atoms: badge, field row, block, bars, icons, sparkline.

/* ═══ 5 · atoms ═══ */
function statusBadge(a,flag){
 const cls=(a.status==='disputed'&&flag)?'alert':a.status==='plan'?'ok':a.status==='legal'?'warn':'q';
 return `<span class="badge ${cls}" data-alert="${cls==='alert'?1:0}"><i class="dot"></i>${esc(E('status',a.status))}</span>`;
}
function dpdBadge(a,flag){
 const d=dpd(a),f=flag&&d>=180;
 return `<span class="badge ${f?'alert':'q'}" data-alert="${f?1:0}">${N(d)} ${S.lang==='en'?'d':'يوم'}</span>`;
}
function row(k,v,mono,wide){
 const e=v==null||v==='';
 return `<div class="row${e?' is-empty':''}${wide?' wide':''}"><span class="k">${esc(k)}</span>
  <span class="v${mono?' num':''}">${e?dash():v}</span></div>`;
}
function block(key,body,head){
 return `<div class="blk"><div class="blk-h"><span class="eyebrow">${esc(t().blk[key])}</span>${head||''}</div>
  <div class="blk-b">${body}</div></div>`;
}

/* ═══ 5.1 · icons — Phosphor paths, inlined raw. no icon font/lib dependency. ═══ */
const ICONS={
 phone:'<path d="M104,56v32a8,8,0,0,1-8,8A96.11,96.11,0,0,1,0,0,8,8,0,0,1,8,0H40a8,8,0,0,1,8,8,88.86,88.86,0,0,0,3.66,25.21A8,8,0,0,1,50,42.72L36.51,51.6A88.67,88.67,0,0,0,164.4,179.49l8.88-13.49a8,8,0,0,1,9.51-1.7A88.86,88.86,0,0,0,208,168a8,8,0,0,1,8,8v32a8,8,0,0,1-8,8A152,152,0,0,1,56,64,8,8,0,0,1,64,56Z" transform="translate(20,20)"/>',
 chat:'<path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Z"/>',
 wa:'<path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Z"/><circle class="dot" cx="128" cy="128" r="10"/>',
 mail:'<rect x="24" y="56" width="208" height="144" rx="8"/><polyline points="24,64 128,144 232,64"/>',
 dash:'<rect x="24" y="24" width="88" height="88" rx="4"/><rect x="144" y="24" width="88" height="56" rx="4"/><rect x="144" y="112" width="88" height="120" rx="4"/><rect x="24" y="144" width="88" height="88" rx="4"/>',
 users:'<circle cx="88" cy="108" r="44"/><path d="M16,224a72,72,0,0,1,144,0"/><path d="M172,92a44,44,0,0,1,0,88"/><path d="M172,140a72,72,0,0,1,68,72"/>',
 wallet:'<path d="M216,80H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56a24,24,0,0,0-24,24V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V96A16,16,0,0,0,216,80Zm-36,80a20,20,0,1,1,20-20A20,20,0,0,1,180,160Z"/>',
 chartbar:'<line x1="32" y1="224" x2="224" y2="224"/><rect x="56" y="128" width="32" height="72"/><rect x="112" y="88" width="32" height="112"/><rect x="168" y="56" width="32" height="144"/>',
 robot:'<rect x="40" y="88" width="176" height="120" rx="16"/><line x1="128" y1="56" x2="128" y2="88"/><circle class="dot" cx="128" cy="40" r="12"/><circle class="dot" cx="92" cy="148" r="12"/><circle class="dot" cx="164" cy="148" r="12"/><line x1="88" y1="192" x2="168" y2="192"/>',
 megaphone:'<path d="M32,112v32a16,16,0,0,0,16,16H64l14,54a8,8,0,0,0,7.75,6H96a8,8,0,0,0,8-8V160h8l88,48V48L112,96H48A16,16,0,0,0,32,112Z"/>',
 flow:'<circle cx="56" cy="56" r="24"/><circle cx="200" cy="56" r="24"/><circle cx="128" cy="200" r="24"/><path d="M80,56H144a48,48,0,0,1,48,48v8"/><path d="M128,176V112A48,48,0,0,0,80,64"/>',
 pencil:'<path d="M92,220H40a8,8,0,0,1-8-8V160a8,8,0,0,1,2.34-5.66l128-128a8,8,0,0,1,11.32,0l40,40a8,8,0,0,1,0,11.32l-128,128A8,8,0,0,1,92,220Z"/><line x1="136" y1="64" x2="192" y2="120"/>',
 columns:'<rect x="32" y="40" width="70" height="176" rx="6"/><rect x="154" y="40" width="70" height="176" rx="6"/>',
 timeline:'<line x1="40" y1="128" x2="216" y2="128"/><circle cx="76" cy="128" r="14"/><circle cx="140" cy="128" r="14"/><circle cx="196" cy="128" r="14"/>',
 ticket:'<path d="M32,88a24,24,0,0,1,0-48H224a24,24,0,0,1,0,48,24,24,0,0,0,0,48,24,24,0,0,1,0,48H32a24,24,0,0,1,0-48,24,24,0,0,0,0-48Z"/>',
 mic:'<rect x="88" y="24" width="80" height="128" rx="40"/><path d="M56,112v8a72,72,0,0,0,144,0v-8"/><line x1="128" y1="192" x2="128" y2="232"/>',
 caret:'<polyline points="88,96 128,136 168,96"/><polyline points="88,160 128,120 168,160" transform="translate(0,0)"/>',
 dcaret:'<polyline points="160,64 96,128 160,192"/>',
};
function icon(name,cls){ return `<svg class="icon${cls?' '+cls:''}" viewBox="0 0 256 256">${ICONS[name]||''}</svg>`; }

/* ═══ 5.2 · contact-history sparkline. buckets last 10 weeks of logs. ═══ */
const ANSWERED=new Set(['rpc','promise','plan','kept']);
function sparkline(logs){
 const weeks=Array.from({length:10},()=>({n:0,ans:false}));
 (logs||[]).forEach(l=>{
  const w=Math.floor(days(l.at)/7);
  if(w>=0&&w<10){ const b=weeks[9-w]; b.n++; if(ANSWERED.has(l.out)) b.ans=true; }
 });
 const max=Math.max(1,...weeks.map(w=>w.n));
 return `<div class="spark">${weeks.map(w=>
   `<i class="${w.ans?'ans':''}" style="block-size:${w.n?Math.max(15,Math.round((w.n/max)*100)):4}%"></i>`).join('')}</div>`;
}
