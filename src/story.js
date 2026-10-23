// story mode, decision log, in-context "why" links (plan P3: X1-X3).
// story mode is an overlay on the live product: same DOM, same fixtures, same code paths.
// every step's state is a URL a reviewer can open without the tour (plan §4.4).

/* ═══ 14 · sources. B4: every external claim links to a page that was opened. ═══ */
const REF={
 R1:['ClearGrid home','https://cleargrid.co'],
 R2:['ClearGrid Arabic site','https://cleargrid.co/ar/'],
 R3:['CBUAE Rulebook 5.2.5','https://rulebook.centralbank.ae/en/rulebook/article-5-business-conduct'],
 R4:['SAMA Debt Collection Regulations (current text, node 10400)','https://rulebook.sama.gov.sa/en/node/10400'],
 R12:['DualKit skills','https://github.com/dualkit/dualkit'],
 R17:['Salesforce Collections','https://www.salesforce.com/financial-services/debt-collection-software/'],
 R22:['Dubai Islamic Bank job ad','https://careers.dib.ae/en/uae/jobs/assistant-consumer-sam-1100009511/'],
 R23:['Experts Plus job ad','https://apply.workable.com/experts-plus/jobs/view/6AE045988A.md'],
 R24:['Sabbar job ad','https://sabbar.com/en/jobs/c-riyadh-r-debt-collector/id-9292efe9-1d57-4f2a-a11b-b29dacf8d476'],
 R26:['Keystroke-level model','https://en.wikipedia.org/wiki/Keystroke-level_model']};
const refs=s=>esc(s).replace(/\[(R\d+)\]/g,(m,k)=>REF[k]?`<a href="${REF[k][1]}" target="_blank" rel="noopener">${esc(REF[k][0])}</a>`:m);

/* ═══ 14.1 · decision cards (plan §7.1). answers are drafts until rewritten by the author
   (plan decision 11). "lives" says where else the card shows: tour step (S#), Why link (A),
   README (R). evidence marked [S] is self-graded; "no evidence" is said out loud. ═══ */
const CARDS=[
 ['D1','Spine plus three scope columns','Why not one long page like today?','Today the five glance answers sit in four places and need up to three actions. The spine puts all five in one place, always visible. Columns split by scope: person, account, activity.','Keystroke-level estimate [R26]; production screenshots 01-04.','Less vertical room for history at 1366.','S2, A, R'],
 ['D2','Escalation line: why this reached you','This field doesn’t exist. Aren’t you inventing data?','It is computed from fields that exist (dispute, hardship, broken promises, first human contact) and shown as a finished field, so agents can use it. It is disclosed as a proposal in the tour, here, and by the reviewer bar’s “Proposed fields” switch. ClearGrid routes by borrower state, so the state likely exists. If not, it is the top data ask.','Routing claims on [R1]; Disputed field on screen 03; competitors rank cases but do not explain why [R17].','Shows a computed reason that may not match the router’s.','S1, A, R'],
 ['D3','AI outcome summary','Why show an AI summary that doesn’t exist?','Agents see AI call counts but not what was said. ClearVoice already keeps transcripts and captures promises. The field is a proposal, disclosed in the tour and the log rather than on the agent’s screen.','Screens 01 and 03; ClearVoice on [R1].','Without an on-screen tag, a reader could take it for an existing feature; the tour and this log say otherwise.','S4, A'],
 ['D4','Channel state on every button','Who decides WhatsApp is blocked?','Regulators do, per market: UAE allows other channels only with consent; KSA lists five channels and excludes WhatsApp. ClearGrid stops attempts before dispatch; the agent should see why before clicking.','[R3]; [R4]; 12,904 attempts stopped before dispatch on [R1].','The rail gets taller; reasons must not read as errors.','S5, A, R'],
 ['D5','Sort accounts by outstanding, never by flag','Shouldn’t risky accounts be first?','Places must not move between records, so agents learn where things are. Urgency is carried by the escalation line and the default selection, not by order.','Spatial stability (goals 1.8). No external evidence: judgement.','The most urgent account may not be first.','S11, A'],
 ['D6','One alert hue','Isn’t red for overdue standard?','When everything is red, nothing is. Coral means one thing: why this reached you. Overdue is a number, not an alarm.','Healey and Ancker, cited in the earlier audit; not reopened this round.','Less colour cueing for days past due.','S9'],
 ['D7','Inline labels','Labels above are more readable.','Inline labels halve row height in dense panels; scanning runs down one value column. Hairlines tie each label to its value.','Salesforce compact density, cited in the earlier audit; not reopened. Review of P2: spacing-only rows read as floating.','Long labels can truncate in narrow columns.',''],
 ['D8','Mono for numbers and IDs','Mono looks technical.','Tabular figures line digits up in columns. Geist Mono pairs with Geist.','Not re-verified this round: judgement.','Wider numerals.',''],
 ['D9','Full mirror from one dictionary','Why not side-by-side bilingual?','Side-by-side doubles density on a screen whose problem is density. ClearGrid uses side-by-side for transcripts, which are a sequential stream.','ClearVoice transcript view on [R1]; DualKit rules [R12].','Agents switch language; they cannot see both.','S6, R'],
 ['D10','Western digits in Arabic','Arabic should use Arabic numerals.','Western digits are standard in UAE apps and on ClearGrid’s own Arabic site. Saudi formal content often uses Arabic-Indic, so it is a product setting, default Western.','[R12]; [R2].','The KSA default is debatable.','S6'],
 ['D11','No accordions','Accordions save space.','Accordions hide answers behind clicks; today Broken Promise Details hides the track record. Empty blocks collapse to one line instead.','Screens 02-04; keystroke-level estimate [R26].','Longer columns in heavy records.','S11'],
 ['D12','Entry keeps the record visible','Why not a modal?','A modal covers the record the agent is describing. The wrap-up screen keeps the spine and accounts in view.','Goals 1.3; self-graded walkthrough.','Tight at 1366.','S8'],
 ['D13','Compare as a separate mode','Why hide the deals table?','Comparing accounts is a review job; working one account is the live job. The table is one key away (C).','Brief table D; judgement.','The table is one step away.',''],
 ['D14','Light mode only','Why no dark mode?','ClearGrid’s product is light. One theme done well beats two half done.','Production screens 01-04.','No dark mode.',''],
 ['D15','No marketing in the agent tool','ClearGrid ships the promo.','The agent screen is work. A promo competes with the escalation line for attention.','Goals 2.10. No external evidence: judgement.','Removes a ClearGrid business choice.',''],
 ['D16','Preferred language in the spine (proposed)','How do you know language matters?','Production agents log “Arabic_speaker” as a call outcome. Language is being forced into the outcome list; a field fixes both.','Screen 04; job ads requiring both languages [R23] [R24].','One more item in the spine.','A'],
 ['D17','Width follows content','Why is there empty space here?','It was a fixed grid. Now spare width goes to the column that overflows, short histories get a narrow column, and a debug check (T1) flags a column that scrolls beside empty space.','T1 results in the README (29 of 36 pass); self-graded.','Columns resize between records; fields do not move within them.','S7, A, R']];

/* ═══ 14.2 · tour steps (plan §4.1). claims are drafts of the author's 30-second answers. ═══ */
const STEPS=[
 {fx:'stress',t:'.why',card:'D2',
  en:'95% of contacts are automated. You get the 5% that need judgement, so the first thing on screen is why this case reached you.',
  ar:'يتم 95% من التواصل آلياً. يصل إليك 5% من الحالات التي تحتاج إلى تقدير بشري، لذلك أول ما يظهر هو سبب وصول هذه الحالة إليك.'},
 {fx:'stress',t:'.stats',card:'D1',
  en:'How much is owed and how late, with zero clicks, on every record.',
  ar:'المبلغ المستحق ومدة التأخر، دون أي نقرة، في كل سجل.'},
 {fx:'aisha',t:'[data-g="ptp"]',card:'D5',
  en:'The promise and the track record sit together. A payment plan is shown on its own.',
  ar:'الوعد بالسداد وسجل الالتزام يظهران معاً. أما خطة السداد فتظهر منفصلة.'},
 {fx:'aisha',t:'#c-bor .row.prose',card:'D3',
  en:'What the AI agent last heard, in words. This field does not exist today; it is a proposal, built to look finished.',
  ar:'آخر ما سمعه الوكيل الآلي، بالكلمات. هذا الحقل غير موجود حالياً؛ إنه مقترح مصمم ليبدو مكتملاً.'},
 {fx:'blocked',t:'.rail',t2:'.cnotes',card:'D4',
  en:'Compliance before the click. Each blocked channel names its reason and its rule: CBUAE 5.2.5, SAMA, or the client’s own policy.',
  ar:'الامتثال قبل النقر. كل قناة مقيدة تذكر سببها وقاعدتها: المصرف المركزي الإماراتي 5.2.5 أو ساما أو سياسة الجهة الدائنة.'},
 {fx:'stress',lang:'ar',t:'#c-bor .row:has(.ltr)',card:'D9',
  en:'Same answers, same places, in Arabic. IDs and phone numbers stay left-to-right inside right-to-left text.',
  ar:'الإجابات نفسها، في الأماكن نفسها، بالعربية. وتبقى المعرّفات وأرقام الهاتف من اليسار إلى اليمين داخل النص من اليمين إلى اليسار.'},
 {fx:'sparse',lang:'en',t:'.cols',card:'D17',
  en:'Width follows content. A short history gets a narrow column, so the columns that overflow get the room.',
  ar:'العرض يتبع المحتوى. السجل القصير يأخذ عموداً ضيقاً، لتحصل الأعمدة الممتلئة على المساحة.'},
 {fx:'omar',mode:'wrapup',t:'.wrap',t2:'#c-act',card:'D12',
  en:'Logging an outcome puts the form in the middle and keeps the accounts and the interaction log in view on either side, so the agent can read while writing.',
  ar:'تسجيل النتيجة يضع النموذج في الوسط ويُبقي الحسابات وسجل التفاعل ظاهرين على الجانبين، فتمكن القراءة أثناء الكتابة.'},
 {fx:'omar',t:'#c-acc .hero',card:'D6',
  en:'One stat component, one button family, colour by role. Coral means only why this reached you.',
  ar:'مكوّن واحد للأرقام، وعائلة أزرار واحدة، وألوان حسب الدور. اللون المرجاني يعني فقط سبب وصول الحالة إليك.'},
 {fx:'omar',mode:'queue',t:'#q-list',card:'D2',
  en:'The queue is a second screen built from the same parts, with no new styles.',
  ar:'قائمة الانتظار شاشة ثانية مبنية من الأجزاء نفسها، دون أنماط جديدة.'},
 {fx:'stress',t:'#c-bor .colbody',card:'D11',
  en:'Trade-offs accepted: no accordions, so columns run longer; accounts sort by amount, not risk, so places stay put.',
  ar:'تنازلات مقبولة: لا طيّ للأقسام، فتطول الأعمدة؛ وترتيب الحسابات حسب المبلغ لا المخاطر، فتبقى الأماكن ثابتة.'},
 {fx:'stress',t:null,card:null,
  en:'Self-graded so far. The decision log gives the evidence for each choice, its trade-off, and what would make me drop it.',
  ar:'التقييم ذاتي حتى الآن. يعرض سجل القرارات الدليل لكل خيار، والتنازل المقبول، وما قد يجعلني أتخلى عنه.'}];

/* ═══ 14.3 · in-context why links (X2). six, each opens its card in the log. ═══ */
const ann=id=>S.ann?`<a class="ann" href="?view=log&card=${id}" data-card="${id}">${esc(t().st.why)}</a>`:'';

/* ═══ 14.4 · decision log view. reviewer material, English only (stated in Arabic). ═══ */
function logView(){
 const T_=t();
 return `<div class="log-page"${S.lang==='ar'?'':''}>
  <div class="log-top"><button class="mini" id="b-logback">${icon(S.lang==='ar'?'next':'prev')}${esc(T_.st.back2)}</button>
   ${S.lang==='ar'?`<span class="t-sec">${esc(T_.st.enOnly)}</span>`:''}</div>
  <div lang="en" dir="ltr" class="log-doc">
   <h1 class="t-title">Decision log</h1>
   <p class="t-sec">17 decisions. Self-graded: no agents or experts have reviewed these yet. Answers are drafts.
    Sources open the page they cite.</p>
   ${CARDS.map(([id,title,q,a,ev,tr,lives])=>`<article class="dcard${S.card===id?' on':''}" id="card-${id}">
    <div class="dcard-h"><span class="badge q">${id}</span><span class="t-pri">${esc(title)}</span>${lives?`<span class="t-sec">${esc(lives)}</span>`:''}</div>
    <div class="rows">
     <div class="row prose"><span class="k">Hardest question</span><div>${esc(q)}</div></div>
     <div class="row prose"><span class="k">30-second answer (draft)</span><div>${esc(a)}</div></div>
     <div class="row prose"><span class="k">Evidence</span><div>${refs(ev)}</div></div>
     <div class="row prose"><span class="k">Trade-off accepted</span><div>${esc(tr)}</div></div>
    </div></article>`).join('')}
  </div></div>`;
}

/* ═══ 14.5 · strip + spotlight. story motion lives in the --story-* namespace (SM2) and
   never runs on a product component (SM1). ═══ */
function strip(){
 const T_=t(),n=S.step,st=STEPS[n-1],last=n===STEPS.length;
 if(S.paused) return `<button type="button" class="st-chip" id="st-resume">${esc(T_.st.paused(N(n),N(STEPS.length)))}</button>`;
 return `<div class="strip" role="region" aria-label="${esc(T_.st.tour)}">
  <div class="st-prog">${STEPS.map((_,i)=>`<button type="button" class="st-seg${i<n?' done':''}${i===n-1?' on':''}" data-step="${i+1}" aria-label="${esc(T_.st.go(N(i+1)))}"></button>`).join('')}</div>
  <div class="st-row">
   <span class="st-count num">${N(n)} / ${N(STEPS.length)}</span>
   <p class="st-claim" id="st-claim" aria-live="polite">${esc(st[S.lang]||st.en)}${!st.card&&last?'':''}</p>
   ${st.card?`<a class="ann" href="?view=log&card=${st.card}" data-card="${st.card}">${esc(T_.st.why)} · ${st.card}</a>`
     :`<a class="ann" href="?view=log" data-card="">${esc(T_.st.log)}</a><a class="ann" href="?view=test" data-view="test">${esc(T_.st.testLink)}</a>`}
   <div class="st-act">
    <button type="button" class="mini" id="st-back"${n===1?' disabled':''}>${esc(T_.st.back)}</button>
    <button type="button" class="mini pri" id="st-next">${esc(last?T_.st.finish:T_.st.next)}</button>
    <button type="button" class="mini" id="st-exit">${esc(T_.st.explore)}</button>
   </div></div></div>`;
}
function placeSpot(){
 const sp=document.getElementById('spot'),st=S.step&&!S.paused&&STEPS[S.step-1];
 const els=st&&st.t?[st.t,st.t2].filter(Boolean).map(q=>document.querySelector(q)).filter(Boolean):[];
 document.body.classList.toggle('story-on',!!(S.step&&!S.paused));
 if(!els.length){sp.classList.toggle('dim-only',!!st);sp.hidden=!st;if(st){Object.assign(sp.style,{width:'0px',height:'0px'});}return;}
 if(els[0].scrollIntoView) els[0].scrollIntoView({block:'nearest'});
 const r=els.map(e=>e.getBoundingClientRect()),pad=6;
 const x=Math.min(...r.map(b=>b.left))-pad,y=Math.min(...r.map(b=>b.top))-pad;
 const w=Math.max(...r.map(b=>b.right))-x+pad,h=Math.max(...r.map(b=>b.bottom))-y+pad;
 sp.hidden=false; sp.classList.remove('dim-only');
 const to=`translate(${x}px,${y}px)`;
 Object.assign(sp.style,{width:w+'px',height:h+'px',transform:to});
 /* council R-A: a CSS transition only moves in a focused, rendering tab; in a throttled or driven browser the ring
    stayed on the previous step's target. once the travel time is up, snap to the final box (no-op when the transition finished). */
 clearTimeout(placeSpot.t);
 placeSpot.t=setTimeout(()=>{sp.style.transition='none';sp.style.transform=to;void sp.offsetWidth;sp.style.transition='';},400);
}
function storySync(){
 const host=document.getElementById('story');
 host.innerHTML=S.step?strip():'';
 placeSpot();
 const go=(id,f)=>{const b=document.getElementById(id);if(b)b.addEventListener('click',f);};
 go('st-next',()=>S.step===STEPS.length?exitStory():goStep(S.step+1,true));
 go('st-back',()=>goStep(S.step-1,true));
 go('st-exit',exitStory);
 go('st-resume',()=>goStep(S.step,true));
 host.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>goStep(+b.dataset.step,true)));
}
let PUSH=false;
function goStep(n,push){
 const st=STEPS[n-1]; if(!st) return;
 S.step=n; S.paused=false;
 if(st.fx&&st.fx!==S.rec){S.rec=st.fx;S.showId=false;}
 S.sel=defaultSel();
 if(st.lang) S.lang=st.lang;
 S.mode=st.mode||'profile'; S.tab='i'; S.scope='all';
 PUSH=!!push; render(); PUSH=false;
 const f=document.getElementById('st-next'); if(f) f.focus({preventScroll:true});
}
function exitStory(){
 S.step=0; S.paused=false;
 try{localStorage.setItem('cg-toured','1');}catch(e){}
 PUSH=true; render(); PUSH=false;
}
function pauseStory(){ if(S.step&&!S.paused){S.paused=true;storySync();} }
