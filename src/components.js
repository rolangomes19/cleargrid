// atoms: badge, field row, block, bars.

/* ═══ 5 · atoms ═══ */
function statusBadge(a,flag){
 const cls=(a.status==='disputed'&&flag)?'alert':a.status==='plan'?'ok':a.status==='legal'?'warn':'q';
 return `<span class="badge ${cls}" data-alert="${cls==='alert'?1:0}"><i class="dot"></i>${esc(E('status',a.status))}</span>`;
}
function dpdBadge(a,flag){
 const d=dpd(a),f=flag&&d>=180;
 return `<span class="badge ${f?'alert':'q'}" data-alert="${f?1:0}">${N(d)} ${S.lang==='en'?'d':'يوم'}</span>`;
}
function row(k,v,mono){
 const e=v==null||v==='';
 return `<div class="row${e?' is-empty':''}"><span class="k">${esc(k)}</span>
  <span class="v${mono?' num':''}">${e?dash():v}</span></div>`;
}
function block(key,body,head){
 return `<div class="blk"><div class="blk-h"><span class="eyebrow">${esc(t().blk[key])}</span>${head||''}</div>
  <div class="blk-b">${body}</div></div>`;
}
const BUCK=[30,60,90,180,365,720];
function dpdScale(d){
 const p=Math.min(100,(Math.min(d,760)/760)*100);
 return `<div class="dpdbar" title="0 / 30 / 60 / 90 / 180 / 365 / 720+"><i style="inline-size:${p}%"></i>
  ${BUCK.map(b=>`<u style="inset-inline-start:${(b/760)*100}%"></u>`).join('')}</div>`;
}
