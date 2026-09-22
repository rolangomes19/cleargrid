// atoms: badge, field row, block, bars, icons.

/* ═══ 5 · atoms ═══ */
function statusBadge(a,flag){
 const cls=(a.status==='disputed'&&flag)?'alert':a.status==='plan'?'ok':a.status==='legal'?'warn':'q';
 return `<span class="badge ${cls}" data-alert="${cls==='alert'?1:0}"><i class="dot"></i>${esc(E('status',a.status))}</span>`;
}
function dpdBadge(a,flag){
 const d=dpd(a),f=flag&&d>=180;
 return `<span class="badge ${f?'alert':'q'}" data-alert="${f?1:0}">${N(d)} ${esc(t().dUnit)}</span>`;
}
function row(k,v,mono,wide){
 const e=v==null||v==='';
 return `<div class="row${e?' is-empty':''}${wide?' wide':''}"><span class="k" title="${esc(k)}">${esc(k)}</span>
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
 dcaret:'caret-left',check:'check',lock:'lock-simple',inbox:'tray',
 calendar:'calendar-blank',prev:'caret-left',next:'caret-right'};
/* every icon here is decorative — the adjacent text/label always carries the meaning,
   so aria-hidden belongs on the shared atom, not repeated at each call site. */
function icon(name,cls){ return `<i class="ph ph-${PH[name]||name} icon${cls?' '+cls:''}" aria-hidden="true"></i>`; }

/* ═══ 5.2 · select + date picker, modelled on shadcn/ui's Select and Popover+Calendar.
   A hidden input carries the value, so forms read .value exactly as with a native
   control. Behaviour (open/close, keyboard, calendar grid) is wired in app.js. ═══ */
function selectMenu(id,opts,labelId){
 const [v0,l0]=opts[0];
 return `<div class="dd" data-dd="select">
  <input type="hidden" id="${id}" value="${v0}">
  <button type="button" class="dd-trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="${labelId} ${id}-v">
   <span class="dd-val" id="${id}-v">${esc(l0)}</span>${icon('caret')}</button>
  <div class="dd-pop" role="listbox" aria-labelledby="${labelId}" hidden>
   ${opts.map(([v,l],i)=>`<div class="dd-opt" role="option" tabindex="-1" data-v="${v}" aria-selected="${i===0}">
    <span>${esc(l)}</span>${icon('check')}</div>`).join('')}
  </div></div>`;
}
function datePicker(id,labelId){
 return `<div class="dd" data-dd="date">
  <input type="hidden" id="${id}">
  <button type="button" class="dd-trigger date" aria-haspopup="dialog" aria-expanded="false" aria-labelledby="${labelId} ${id}-v">
   ${icon('calendar')}<span class="dd-val empty-val" id="${id}-v">${esc(t().pickDate)}</span></button>
  <div class="dd-pop cal" role="dialog" aria-labelledby="${labelId}" hidden></div></div>`;
}
