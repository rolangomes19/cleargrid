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

/* ═══ 5.1 · icons — real Phosphor Icons (regular weight), loaded in index.html via
   unpkg. Replaces a hand-simplified inline-SVG set that didn't hold up at small sizes —
   this maps our short internal names to the library's actual icon slugs. ═══ */
const PH={phone:'phone',chat:'chat-circle',wa:'whatsapp-logo',mail:'envelope-simple',
 dash:'squares-four',users:'users',wallet:'wallet',chartbar:'chart-bar',robot:'robot',
 megaphone:'flag',flow:'flow-arrow',pencil:'pencil-simple',columns:'columns',
 timeline:'clock-countdown',ticket:'ticket',mic:'microphone',caret:'caret-down',
 dcaret:'caret-left',check:'check'};
/* every icon here is decorative — the adjacent text/label always carries the meaning,
   so aria-hidden belongs on the shared atom, not repeated at each call site. */
function icon(name,cls){ return `<i class="ph ph-${PH[name]||name} icon${cls?' '+cls:''}" aria-hidden="true"></i>`; }

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
