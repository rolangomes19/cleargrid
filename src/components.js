// atoms: badge, field row, block, bars, icons.

/* ═══ 5 · atoms ═══ */
/* 2.4: a badge only for minority states. amber = the account needs care (dispute, legal),
   green = a plan is running. the majority state (in collection) is plain text. never coral:
   coral means "why this reached you" and nothing else. */
function statusBadge(a){
 const cls={disputed:'warn',legal:'warn',plan:'ok'}[a.status];
 return cls?`<span class="badge ${cls}"><i class="dot"></i>${esc(E('status',a.status))}</span>`
  :`<span class="status-plain">${esc(E('status',a.status))}</span>`;
}
/* days past due is a number, not an alarm (D6). the old >=180 coral had no source (B1). */
const dpdBadge=a=>`<span class="badge q">${esc(t().days(dpd(a)))}</span>`;
/* the one stat component (3.3): label, value, sub, optional bar. a missing value is said
   in body text at the value's line height, so a null never sits at hero size (2.2) and
   the row below does not move (1.8). */
function stat(label,value,sub,o={}){
 return `<div class="stat"${o.g?` data-g="${o.g}"`:''}><span class="stat-k">${esc(label)}${o.ann||''}</span>
  ${value==null?`<div class="stat-v is-null">${esc(o.none||'–')}</div>`:`<div class="stat-v t-display${o.sm?' sm':''}">${value}</div>`}
  <span class="stat-sub">${sub||'&nbsp;'}</span>${o.bar!=null?`<div class="bar"><i style="inline-size:${o.bar}%"></i></div>`:''}</div>`;
}
function row(k,v,mono,wide){
 const e=v==null||v==='';
 return `<div class="row${e?' is-empty':''}${wide?' wide':''}"><span class="k" title="${esc(k)}">${esc(k)}</span>
  <span class="v${mono?' num':''}">${e?dash():v}</span></div>`;
}
/* 3.5: a field the agent can change is a visible control; read-only values stay text.
   same row anatomy, so the label column does not move. */
function rowEdit(k,id,opts,cur){
 return `<div class="row edit"><span class="k" id="${id}-l" title="${esc(k)}">${esc(k)}</span>
  <span class="v">${selectMenu(id,opts,id+'-l',cur,1)}</span></div>`;
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
function selectMenu(id,opts,labelId,cur,sm){
 const [v0,l0]=opts.find(([v])=>v===cur)||opts[0];
 return `<div class="dd${sm?' sm':''}" data-dd="select">
  <input type="hidden" id="${id}" value="${v0}">
  <button type="button" class="dd-trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="${labelId} ${id}-v">
   <span class="dd-val" id="${id}-v">${esc(l0)}</span>${icon('caret')}</button>
  <div class="dd-pop" role="listbox" aria-labelledby="${labelId}" hidden>
   ${opts.map(([v,l])=>`<div class="dd-opt" role="option" tabindex="-1" data-v="${v}" aria-selected="${v===v0}">
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

/* ═══ 5.3 · honesty atoms. B2: a field that does not exist today says so.
   B4: a rule's source links to the page it was read from; client policy has no link. ═══ */
/* the product screen reads as finished UI; whether a field exists today is reviewer
   information, shown only when the reviewer bar's "Proposed fields" switch is on (B2, amended) */
const proposedTag=()=>S.prop?`<span class="tag" title="${esc(t().proposedTip)}">${esc(t().proposed)}</span>`:'';
function srcChip(s){
 const T_=t();
 if(!s) return `<span class="src" title="${esc(T_.src.title)}">${esc(T_.src.client)}</span>`;
 const label=s.t==='cg'?T_.src.cg:s.t;
 return `<a class="src" href="${s.u}" target="_blank" rel="noopener" title="${esc(T_.src.title)}">${esc(label)}</a>`;
}
