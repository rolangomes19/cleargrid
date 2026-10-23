// the four test records. every DPD derived from its due date.

/* ═══ 2 · records. every DPD derived from its due date. nothing hardcoded twice. ═══ */
const R={
omar:{
  name:{en:'Omar Al-Hassan',ar:'عمر الحسن'},market:'AE',ini:'OH',lang:'ar',gender:'m',nat:'JOR',
  dob:'1988-11-05',eid:'784-1988-4471209-5',visa:{en:'Resident',ar:'مقيم'},
  owner:'Faisal Noor',stage:'disp',submit:'2026-04-30',synced:'2026-09-11T08:41',
  phone:'+971 55 321 7740',mail:'omar.h@example.com',
  ch:{call:'ok',sms:'ok',wa:'review',email:'ok'},
  calls:{h:1,ai:3,lastH:'2026-08-27T16:20',lastAi:'2026-09-09T20:15',
    ai_sum:{en:'Borrower disputed the card transaction and declined to discuss payment on either account.',
            ar:'اعترض المدين على عملية البطاقة ورفض مناقشة السداد على أي من الحسابين.'}},
  accts:[
   {ref:'CC-77102',aref:'AC-33011-GMB',lender:{en:'Gulf Meridian Bank',ar:'بنك الخليج ميريديان'},lid:'GMB-021',
    merchant:null,product:'card',total:7000,out:4860,over:4860,principal:6500,due:'2026-04-18',
    status:'disputed',interest:{en:'2.99% monthly',ar:'2.99% شهرياً'},plan:null,ptp:null,broken:0,
    dispute:{date:'2026-08-26',why:{en:'Transaction not recognised',ar:'عملية غير معروفة'}},
    fields:{verif:'no',settle:{en:'Blocked while disputed',ar:'موقوفة أثناء الاعتراض'}},
    meta:{cby:'System',cat:'2026-04-30',uby:'Faisal Noor',uat:'2026-08-26'}},
   {ref:'PL-11833',aref:'AC-33011-GMB2',lender:{en:'Gulf Meridian Bank',ar:'بنك الخليج ميريديان'},lid:'GMB-021',
    merchant:null,product:'personal',total:11500,out:8000,over:1420,principal:11000,due:'2026-05-06',
    status:'plan',interest:{en:'4.2% flat',ar:'4.2% ثابتة'},plan:{emi:1420,paid:4,of:12,next:'2026-10-06',
      flags:{en:'On schedule, next instalment not yet due',ar:'ملتزم بالجدول، القسط القادم لم يستحق بعد'}},
    ptp:{amt:1420,date:'2026-10-06',state:'open'},broken:0,
    fields:{verif:'yes',settle:{en:'Up to 20%',ar:'حتى 20%'}},
    meta:{cby:'System',cat:'2026-04-30',uby:'System',uat:'2026-09-06'}}],
  logs:[
   {at:'2026-09-09T20:15',a:'CC-77102',src:'ai',dir:'out',out:'dispute',by:'ClearVoice',
    note:{en:'Borrower repeated that the transaction is not his and asked for the investigation result.',ar:'كرر المدين أن العملية ليست له وطلب نتيجة التحقيق.'}},
   {at:'2026-08-27T16:20',a:'CC-77102',src:'phone',dir:'out',out:'rpc',by:'Faisal Noor',
    note:{en:'Explained the review takes up to 14 days. No payment requested on this account.',ar:'تم توضيح أن المراجعة تستغرق حتى 14 يوماً. لم يُطلب سداد على هذا الحساب.'}},
   {at:'2026-08-26T14:05',a:'CC-77102',src:'portal',dir:'in',out:'dispute',by:'Borrower',
    note:{en:'Dispute filed through the borrower portal.',ar:'تم تسجيل الاعتراض عبر بوابة المدين.'}},
   {at:'2026-09-06T09:30',a:'PL-11833',src:'sys',dir:'out',out:'plan',by:'System',
    note:{en:'Instalment 4 of 12 posted.',ar:'تم تسجيل القسط 4 من 12.'}},
   {at:'2026-07-14T11:40',a:'PL-11833',src:'phone',dir:'out',out:'promise',by:'Faisal Noor',
    note:{en:'Plan agreed at AED 1,420 monthly.',ar:'تم الاتفاق على خطة بقيمة 1,420 درهماً شهرياً.'}}],
  msgs:[
   {at:'2026-09-08T10:00',a:'CC-77102',src:'sms',dir:'out',out:'delivered',by:'System',note:{en:'Dispute acknowledgement (AR)',ar:'إشعار استلام الاعتراض (عربي)'}},
   {at:'2026-09-06T19:30',a:'CC-77102',src:'wa',dir:'out',out:'failed',by:'System',note:{en:'Blocked: channel paused while the dispute is open.',ar:'مُنعت: القناة موقوفة أثناء الاعتراض.'}},
   {at:'2026-09-01T14:05',a:'CC-77102',src:'email',dir:'in',out:'received',by:'Borrower',note:{en:'Sent the transaction reference for review.',ar:'أرسل المرجع الخاص بالعملية للمراجعة.'}}],
  time:[
   {at:'2026-09-06',t:{en:'Instalment 4 of 12 posted on the personal loan.',ar:'تم تسجيل القسط 4 من 12 على القرض الشخصي.'}},
   {at:'2026-08-26',t:{en:'Dispute opened on the credit card.',ar:'فُتح اعتراض على البطاقة الائتمانية.'}},
   {at:'2026-04-30',t:{en:'Two accounts placed with ClearGrid.',ar:'تم إسناد حسابين إلى كليرجريد.'}}]
},

aisha:{
  name:{en:'Aisha Rahman',ar:'عائشة رحمن'},market:'AE',ini:'AR',lang:'en',gender:'f',nat:'IND',
  dob:'1992-03-12',eid:'784-1992-3318407-8',visa:{en:'Employment visa',ar:'تأشيرة عمل'},
  owner:'Nadia Karim',stage:'rpc',submit:'2026-07-14',synced:'2026-09-11T08:41',
  phone:'+971 50 555 0188',mail:'aisha.r@example.com',
  ch:{call:'cap',sms:'ok',wa:'ok',email:'ok'},
  hardship:'2026-09-08',
  calls:{h:1,ai:4,lastH:'2026-09-02T11:10',lastAi:'2026-09-08T18:42',
    ai_sum:{en:'Employer delayed payroll. Borrower still intends to pay and asked for a shorter-term arrangement.',
            ar:'تأخر صاحب العمل في صرف الرواتب. لا تزال المدينة تنوي السداد وطلبت ترتيباً قصير الأجل.'}},
  accts:[
   {ref:'DL-20481',aref:'AC-90812-EFIN',lender:{en:'Emirates Finance',ar:'إمارات للتمويل'},lid:'EFN-014',
    merchant:null,product:'personal',total:10000,out:7420,over:1000,principal:10000,due:'2026-06-10',
    status:'coll',interest:{en:'3.5% flat',ar:'3.5% ثابتة'},plan:null,
    ptp:{amt:1000,date:'2026-09-18',state:'open'},broken:1,brokenLast:'2026-08-18',brokenType:'missed',
    fields:{verif:'yes',employer:{en:'Private sector',ar:'القطاع الخاص'},hardship:{en:'Medium',ar:'متوسط'}},
    meta:{cby:'System',cat:'2026-07-14',uby:'Nadia Karim',uat:'2026-09-02'}}],
  logs:[
   {at:'2026-09-08T18:42',a:'DL-20481',src:'ai',dir:'out',out:'hardship',by:'ClearVoice',
    note:{en:'Salary delay explained. Asked to be called after the next payroll date.',ar:'أوضحت تأخر الراتب وطلبت الاتصال بها بعد موعد الصرف القادم.'}},
   {at:'2026-09-02T11:10',a:'DL-20481',src:'phone',dir:'out',out:'rpc',by:'Nadia Karim',
    note:{en:'Confirmed identity. Borrower asked for a callback after payday.',ar:'تم التحقق من الهوية. طلبت المدينة معاودة الاتصال بعد صرف الراتب.'}},
   {at:'2026-08-18T12:00',a:'DL-20481',src:'sys',dir:'out',out:'broken',by:'System',
    note:{en:'Promise of AED 1,000 due 18 Aug not received.',ar:'لم يتم استلام الوعد بمبلغ 1,000 درهم المستحق في 18 أغسطس.'}}],
  msgs:[{at:'2026-09-09T09:15',a:'DL-20481',src:'sms',dir:'out',out:'read',by:'System',note:{en:'Arrangement options (EN)',ar:'خيارات الترتيب (إنجليزي)'}}],
  time:[{at:'2026-09-08',t:{en:'Hardship flag raised by the AI agent.',ar:'رصد الوكيل الآلي حالة تعثر مالي.'}},
        {at:'2026-07-14',t:{en:'Account placed with ClearGrid.',ar:'تم إسناد الحساب إلى كليرجريد.'}}]
},

sparse:{
  name:{en:'Khalid Noor',ar:'خالد نور'},market:'AE',ini:'KN',lang:null,gender:'na',nat:null,
  dob:null,eid:null,visa:null,owner:null,stage:'ntc',submit:'2026-09-09',synced:'2026-09-11T08:41',
  phone:'+971 52 000 0140',mail:null,
  ch:{call:'window',sms:'ok',wa:'ok',email:'ok'},
  calls:{h:0,ai:0,lastH:null,lastAi:null,ai_sum:null},
  accts:[
   {ref:'TL-40021',aref:'AC-77120-DU',lender:{en:'du',ar:'دو'},lid:'DU-004',
    merchant:null,product:'telecom',total:640,out:640,over:640,principal:640,due:'2026-08-28',
    status:'coll',interest:null,plan:null,ptp:null,broken:0,
    fields:{verif:'no',churn:{en:'High',ar:'مرتفع'}},
    meta:{cby:'System',cat:'2026-09-09',uby:'System',uat:'2026-09-09'}}],
  logs:[],msgs:[],time:[]
}};

/* stress record: 7 accounts, long history. generated so the case is real. */
(function(){
 const b=JSON.parse(JSON.stringify(R.omar));
 b.name={en:'Mohammed Al Suwaidi',ar:'محمد السويدي'};b.ini='MS';b.lang='ar';b.gender='m';b.nat='AE';
 b.dob='1979-11-05';b.eid='784-1979-6620143-2';b.owner='Rabab Abbas';b.stage='rpc';
 const seed=[
  ['FB-8802','First Abu Dhabi Bank','بنك أبوظبي الأول','card',56000,44210,'2024-11-02','coll',3,'missed'],
  ['TM-8815','Tamara','تمارا','bnpl',2400,2400,'2026-05-19','disputed',0,null],
  ['ET-8820','Etisalat','اتصالات','telecom',1310,980,'2026-07-01','coll',1,'partial'],
  ['AD-8834','ADCB','بنك أبوظبي التجاري','auto',132000,88400,'2026-08-25','plan',0,null],
  ['EN-8841','Emirates NBD','بنك الإمارات دبي الوطني','personal',90000,71250,'2025-06-30','legal',4,'noContact'],
  ['PP-8855','Postpay','بوست باي','bnpl',760,760,'2026-04-12','coll',2,'missed'],
  ['RK-8860','RAKBANK','بنك رأس الخيمة','sme',210000,153900,'2026-01-15','coll',0,null]];
 b.accts=seed.map(([ref,l,la,p,tot,out,due,st,bk,bt],i)=>({
  ref,aref:`AC-77${i}0-${l.slice(0,3).toUpperCase()}`,lender:{en:l,ar:la},lid:`${l.slice(0,3).toUpperCase()}-0${i}`,
  merchant:p==='bnpl'?{en:l,ar:la}:null,product:p,total:tot,out,over:st==='plan'?3100:out,
  principal:Math.round(tot*.94),due,status:st,interest:null,
  plan:st==='plan'?{emi:3100,paid:7,of:48,next:'2026-10-02',flags:{en:'On schedule',ar:'ملتزم بالجدول'}}:null,
  ptp:bk?{amt:1500,date:'2026-08-30',state:'broken'}:null,broken:bk,brokenLast:bk?'2026-08-30':null,brokenType:bt,
  dispute:st==='disputed'?{date:'2026-06-01',why:{en:'Duplicate charge',ar:'رسوم مكررة'}}:null,
  fields:{verif:i%2?'yes':'no'},
  meta:{cby:'System',cat:'2026-01-15',uby:'System',uat:'2026-09-09'}}));
 b.calls={h:11,ai:26,lastH:'2026-09-05T13:02',lastAi:'2026-09-10T19:15',
  ai_sum:{en:'Asked for one combined settlement across all accounts and refused to discuss them one by one.',
          ar:'طلب تسوية واحدة مجمعة لكل الحسابات ورفض مناقشتها حساباً حساباً.'}};
 const o=['rpc','noans','promise','broken','callback','dispute'];
 b.logs=[];
 for(let i=0;i<34;i++){
  const d=new Date(TODAY-((i*3+2)*DAY));
  b.logs.push({at:d.toISOString().slice(0,16),a:b.accts[i%7].ref,src:i%3?'phone':'ai',
   dir:i%9?'out':'in',out:o[i%o.length],by:i%3?'Rabab Abbas':'ClearVoice',note:null});
 }
 R.stress=b;
})();

/* blocked record (UAE): every restricted channel state at once, so the reasons and
   their sources can be checked on one screen. no escalation flag. */
R.blocked={
  name:{en:'Layla Haddad',ar:'ليلى حداد'},ini:'LH',market:'AE',lang:'en',gender:'f',nat:'LBN',
  dob:'1990-02-21',eid:'784-1990-5521736-0',visa:{en:'Resident',ar:'مقيمة'},
  owner:'Nadia Karim',stage:'rpc',submit:'2026-06-02',synced:'2026-09-11T08:41',
  phone:'+971 56 410 2297',mail:'layla.h@example.com',
  ch:{call:'window',sms:'cap',wa:'consent',email:'dnc'},
  calls:{h:2,ai:3,lastH:'2026-09-04T10:20',lastAi:'2026-09-10T17:05',ai_sum:null},
  accts:[
   {ref:'BN-30417',aref:'AC-41870-TBY',lender:{en:'Tabby',ar:'تابي'},lid:'TBY-007',
    merchant:{en:'Tabby',ar:'تابي'},product:'bnpl',total:3200,out:2150,over:1075,principal:3200,due:'2026-07-20',
    status:'coll',interest:null,plan:null,ptp:null,broken:0,
    fields:{verif:'yes'},meta:{cby:'System',cat:'2026-06-02',uby:'Nadia Karim',uat:'2026-09-04'}}],
  logs:[
   {at:'2026-09-10T17:05',a:'BN-30417',src:'ai',dir:'out',out:'callback',by:'ClearVoice',
    note:{en:'Asked to be called back after work hours.',ar:'طلبت معاودة الاتصال بعد ساعات العمل.'}},
   {at:'2026-09-04T10:20',a:'BN-30417',src:'phone',dir:'out',out:'rpc',by:'Nadia Karim',
    note:{en:'Confirmed identity. Prefers calls to messages.',ar:'تم التحقق من الهوية. تفضّل الاتصال على الرسائل.'}},
   {at:'2026-06-14T09:00',a:'BN-30417',src:'email',dir:'in',out:'received',by:'Borrower',
    note:{en:'Asked to stop receiving emails.',ar:'طلبت إيقاف رسائل البريد.'}}],
  msgs:[],time:[{at:'2026-06-02',t:{en:'Account placed with ClearGrid.',ar:'تم إسناد الحساب إلى كليرجريد.'}}]
};

/* KSA record: SAMA rules. ten unanswered call attempts in the last 30 days, so the
   attempt cap shown on the rail matches the log underneath it. */
R.ksa={
  name:{en:'Fahad Al-Qahtani',ar:'فهد القحطاني'},ini:'FQ',market:'SA',lang:'ar',gender:'m',nat:'SAU',
  dob:'1986-07-30',eid:'1082345677',visa:null,
  owner:'Rabab Abbas',stage:'ntc',submit:'2026-07-01',synced:'2026-09-11T08:41',
  phone:'+966 55 218 4410',mail:'fahad.q@example.com',
  ch:{call:'cap',sms:'ok',wa:'notPermitted',email:'ok'},
  calls:{h:10,ai:0,lastH:null,lastAi:null,ai_sum:null},
  accts:[
   {ref:'PL-52190',aref:'AC-61020-RJH',lender:{en:'Al Rajhi Bank',ar:'مصرف الراجحي'},lid:'RJH-011',
    merchant:null,product:'personal',total:18000,out:12600,over:2100,principal:18000,due:'2026-06-25',
    status:'coll',interest:null,plan:null,ptp:null,broken:0,
    fields:{verif:'yes'},meta:{cby:'System',cat:'2026-07-01',uby:'System',uat:'2026-09-10'}}],
  logs:Array.from({length:10},(_,i)=>({at:new Date(Date.UTC(2026,8,10-i*3,10+i%8)).toISOString().slice(0,16),
    a:'PL-52190',src:'phone',dir:'out',out:'noans',by:'Rabab Abbas',note:null})),
  msgs:[],time:[{at:'2026-07-01',t:{en:'Account placed with ClearGrid.',ar:'تم إسناد الحساب إلى كليرجريد.'}}]
};
