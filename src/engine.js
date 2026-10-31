/* ---------- language-neutral game data ---------- */
const CARD_META={
  comm:{tags:[],base:0.1},edu:{tags:["edu"],base:0.3},hobby:{tags:[],base:0.05},drv:{tags:["driver"]},cert:{tags:[],base:0.05},
  be:{tags:["backend"],strong:1},fe:{tags:["frontend"],strong:1},ops:{tags:["devops"],strong:1},sql:{tags:["data"],strong:1},lead:{tags:["lead"],strong:1},lie_dev:{tags:["lead","backend"],lie:true},
  mk_perf:{tags:["performance"],strong:1},mk_smm:{tags:["smm"],strong:1},mk_an:{tags:["analytics"],strong:1},mk_cont:{tags:["content"],strong:1},mk_brand:{tags:["brand"],strong:1},lie_mk:{tags:["performance","brand"],lie:true},
  pm_del:{tags:["delivery"],strong:1},pm_agile:{tags:["agile"],strong:1},pm_stake:{tags:["stakeholders"],strong:1},pm_budget:{tags:["budget"],strong:1},pm_team:{tags:["team"],strong:1},lie_pm:{tags:["delivery","team"],lie:true},
  hr_rec:{tags:["recruiting"],strong:1},hr_onb:{tags:["onboarding"],strong:1},hr_brand:{tags:["hrbrand"],strong:1},hr_cb:{tags:["cb"],strong:1},hr_ats:{tags:["ats"],strong:1},lie_hr:{tags:["recruiting","onboarding"],lie:true}
};
const COMMON=["comm","edu","hobby","drv"];
const PROF_META={
  dev:{test:0.5,cards:["be","fe","ops","sql","lead","lie_dev"],start:"be",vac:[["backend","devops"],["frontend","backend"],["backend","frontend"],["devops","backend"],["data","backend"],["lead","backend"],["backend","lead"]],graded:[1,1,1,1,1,0,0]},
  mk:{test:0.5,cards:["mk_perf","mk_smm","mk_an","mk_cont","mk_brand","lie_mk"],start:"mk_perf",vac:[["performance","analytics"],["smm","content"],["analytics","performance"],["content","smm"],["brand","content"],["performance","smm"]]},
  pm:{test:0.4,cards:["pm_del","pm_agile","pm_stake","pm_budget","pm_team","lie_pm"],start:"pm_del",vac:[["delivery","agile"],["agile","team"],["delivery","budget"],["stakeholders","delivery"],["delivery","team"],["delivery","stakeholders"]]},
  hr:{test:0.4,cards:["hr_rec","hr_onb","hr_brand","hr_cb","hr_ats","lie_hr"],start:"hr_rec",vac:[["recruiting","ats"],["onboarding","cb"],["hrbrand","recruiting"],["onboarding","recruiting"],["recruiting","hrbrand"],["recruiting","cb"]]}
};
const ROSTER=["dev","mk","pm","hr"];
const EXTRA_TAGS=["edu","driver"];
const LV=["A2","B1","B2","C1"];
const lvOk=(have,need)=>!need||LV.indexOf(have)>=LV.indexOf(need);
const TRUTH_GOOD={invited:1,offer:1,declined:1,accepted:1};
const COURSES=[{id:"pro",price:2},{id:"eng",price:1.5},{id:"scam",price:2.5},{id:"web",price:0}];
const COST={quick:0.5,tailor:2,ref:1,clue:1,interview:1,test:3,portfolio:2};
const ENERGY=6, SHIFT_SEC=150, GOAL_FWD=4;
const MODS=[
  {id:"ai",ai:true},{id:"ghosts",ghost:2.2},{id:"layoffs",apps:2,total:500,cushion:-1},
  {id:"freeze",freeze:0.35},{id:"scam",scam:2.5,subtle:true},{id:"cand",real:1.6,cap:1.12,apps:0.6}
];
const LANG_LIST=[["en","English"],["es","Español"],["it","Italiano"],["fr","Français"],["ja","日本語"],["ru","Русский"],["zh","中文"]];
const LANG_READY=["en","es","it","fr","ja","ru","zh"];
/* the public build (tools/standalone.py) sets this; the artifact keeps tester controls */
const PROD=typeof window!=="undefined"&&!!window.ONEOF250_PROD;
for(const l of Object.keys(COUNTRY_TEXT)) mergeCountryText(l,COUNTRY_TEXT[l]);

/* ---------- daily run, storage ---------- */
const DAY0=Date.UTC(2026,9,27);
function today(){ const d=new Date(); return {y:d.getFullYear(),m:d.getMonth(),d:d.getDate()}; }
function dayKey(t){ return `${t.y}-${String(t.m+1).padStart(2,"0")}-${String(t.d).padStart(2,"0")}`; }
function dayNo(t){ return Math.floor((Date.UTC(t.y,t.m,t.d)-DAY0)/864e5)+1; }
function hash(str){ let h=2166136261; for(const c of str){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; }
function dayMod(t){ return MODS[hash("market"+dayKey(t))%MODS.length].id; }
const mod=()=>MODS.find(m=>m.id===S.mod)||{};
const STORE="oneof250.daily", LSTORE="oneof250.lang";
function loadDaily(){ try{ const x=JSON.parse(localStorage.getItem(STORE)||"null"); return x&&x.date===dayKey(today())?x:null; }catch(e){ return null; } }
function clearDaily(){ try{ localStorage.removeItem(STORE); }catch(e){} }
function saveDaily(x){ try{ localStorage.setItem(STORE,JSON.stringify(x)); }catch(e){} }
function loadLang(){ try{ const l=localStorage.getItem(LSTORE); return LANG_READY.includes(l)?l:null; }catch(e){ return null; } }
function saveLang(l){ try{ localStorage.setItem(LSTORE,l); }catch(e){} }
function guessLang(){ const n=(typeof navigator!=="undefined"&&navigator.language||"").slice(0,2).toLowerCase(); return LANG_READY.includes(n)?n:"en"; }
let CUR_LANG=loadLang()||guessLang();

/* ---------- helpers ---------- */
/* on the language screen a picked tile previews its language before the run switches to it */
const uiLang=()=>S.screen==="lang"&&S.pickLang||S.lang;
const T_=()=>LANG[uiLang()];
const tr=x=>x==null?"":typeof x==="string"?x:(x[S.lang]??x.en);
const gx=(s,fem)=>String(s).replace(/\{([^}|]*)\|([^}]*)\}/g,(m,a,b)=>fem?b:a);
const g=s=>gx(s,S&&S.char&&S.char.fem);
const C=()=>COUNTRIES[S.char.country];
const cityName=i=>tr(C().cities[i]);
const cardText=id=>{ const t=T_().cards[id]; return g(S.unlocked[id]&&t.s?t.s:t.t); };
const base=()=>C().base[S.char.prof];
const rnd=v=>Math.round(v/C().step)*C().step;
const ASK={low:0.85,mkt:1,high:1.2};
const askVal=()=>rnd(S.char.prev*ASK[S.ask]);
/* building an Intl formatter is slow and a render formats dozens of numbers: keep one per locale and format */
const FMT=new Map();
function fmt(kind,make){ const k=T_().locale+"|"+kind; let f=FMT.get(k); if(!f){ f=make(T_().locale); FMT.set(k,f); } return f; }
function money0(v){ const cur=C().cur; return fmt("cur"+cur,l=>new Intl.NumberFormat(l,{style:"currency",currency:cur,maximumFractionDigits:0})).format(v); }
function money(v){ return money0(v)+T_().per[C().per]; }
function weeks(x){ const w=Math.floor(x+1e-9),h=x-w>=0.5; return (w||(!h?"0":""))+(h?"½":""); }
const has=(slots,tag)=>slots.some(id=>CARD_META[id].tags.includes(tag));
/* real-market crowding: country pressure, plus the youth gap for players under 25 */
const MS=()=>MARKET_STATS[S.char.country];
/* sources open in a new tab; mark() tags the bit of a translated sentence that becomes the link */
const srcLink=(u,t)=>`<a class="src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
const mark=t=>"\u0001"+t+"\u0002";
const linked=(str,u)=>esc(str).replace(/\u0001([^\u0002]*)\u0002/,(_,t)=>srcLink(u,t));
const isYoung=()=>S.char.age<25&&!!MS().young;
const press=()=>MS().press*(isYoung()?MS().young:1);
const num=v=>fmt("num",l=>new Intl.NumberFormat(l,{maximumFractionDigits:2})).format(v);
function month(m){ const [y,mo]=m.split("-").map(Number); return fmt("month",l=>new Intl.DateTimeFormat(l,{month:"long",year:"numeric",timeZone:"UTC"})).format(new Date(Date.UTC(y,mo-1,15))); }
const tagName=t=>T_().tags[t];

/* ---------- run setup ---------- */
function newRun(seed,opts){
  opts=opts||{};
  S={seed,rs:seed>>>0,lang:CUR_LANG,screen:"intro",tab:"vac",modal:null,vid:0,aid:0,mid:0,toast:"",daily:!!opts.daily,day:opts.day||0,wk:{}};
  const m=MODS[Math.floor(rng()*MODS.length)].id; S.mod=opts.mod||m;
  const country=pick(COUNTRY_KEYS),fem=chance(0.5),prof=pick(ROSTER);
  S.char={country,fem,prof,age:ri(22,44),contacts:ri(1,2)};
  const K=COUNTRIES[country];
  S.char.nameIdx=Math.floor(rng()*K.names[fem?"f":"m"].length);
  S.char.years=clamp(S.char.age-22-ri(0,3),2,14);
  S.char.city=Math.floor(rng()*K.cities.length); S.char.eng=K.eng?pick(["A2","B1","B1","B2","B2","C1"]):"C1";
  S.char.want=pick(["office","hybrid","remote"]);
  S.profile={headline:"title",photo:true,reloc:false,portfolio:false,mode:"any"};
  S.char.prev=Math.round(K.base[prof]*(0.95+rng()*0.15)/K.step)*K.step;
  S.cushion=10+(mod().cushion||0); S.ask="mkt"; S.unlocked={};
  S.resume={slots:["comm","edu",PROF_META[prof].start,"hobby","drv"],twoCol:true};
  S.flags={golden:0,scamPaid:0,negotiated:0,tests:0};
  S.skips=[]; S.attempt=1; S.rounds=[]; S.extra=[]; S.bought={};
  setupShift();
  return S;
}
const charName=()=>tr(C().names[S.char.fem?"f":"m"][S.char.nameIdx]);
function newDaily(){ const t=today(); return newRun(hash("day"+dayKey(t)),{daily:true,day:dayNo(t),mod:dayMod(t)}); }
function newFree(){ return newRun((Math.random()*2**31)>>>0,{}); }
function fullName(fem){
  const K=C(),n=tr(pick(K.names[fem?"f":"m"])),s=tr(pick(K.surn)),cjk=/[\u3040-\u30ff\u4e00-\u9fff]/;
  if(cjk.test(n)&&cjk.test(s)) return s+n;
  return K.surnameFirst?`${s} ${n}`:`${n} ${s}`;
}
function otherCity(not){ const n=C().cities.length; let i=Math.floor(rng()*(n-1)); if(i>=not) i++; return i; }

/* ---------- act 1: the recruiter shift ---------- */
function vacTitle(prof,i){ return T_().prof[prof].vac[i]; }
function setupShift(){
  const P=PROF_META[S.char.prof],T=T_(),mustTag=CARD_META[P.start].tags[0];
  const ti=P.vac.findIndex(v=>v[0]===mustTag);
  const vac={title:vacTitle(S.char.prof,ti),tag:P.vac[ti][0],nice:P.vac[ti][1],minExp:Math.min(3,S.char.years),cap:rnd(Math.max(S.char.prev,base())*1.08),
    city:S.char.city,fmt:chance(0.5)?"office":"hybrid",eng:C().eng&&lvOk(S.char.eng,"B2")?"B2":null,notice:4};
  const kinds=[...Array(3).fill("strong"),...Array(4).fill("ok"),...Array(2).fill("buried"),...Array(4).fill("spam"),...Array(2).fill("pricey"),...Array(1).fill("under"),...Array(3).fill("garbled"),
    ...Array(2).fill(vac.eng?"lang":"city"),...Array(2).fill("city"),...Array(1).fill("notice")];
  const pile=shuffle(kinds.map(k=>mkCand(k,vac)));
  const you={kind:"you",name:charName(),fem:S.char.fem,title:T.prof[S.char.prof].name,prof:S.char.prof,years:S.char.years,salary:S.char.prev,twoCol:true,broke:false,
    city:S.char.city,reloc:false,remoteOnly:false,eng:S.char.eng,notice:2,
    lines:S.resume.slots.map(id=>({t:T.cards[id].t,tags:CARD_META[id].tags}))};
  you.fits=candFits(you,vac); you.ai=aiScore(you);
  const youAt=ri(4,7); pile.splice(youAt,0,you);
  const nf=chance(0.4); const neph={name:fullName(nf),fem:nf,rel:pick(T.relatives),sys:tr(pick(C().insys)),years:ri(1,3)};
  S.shift={neph,vac,pile,i:0,dec:[],started:0,deadline:0,shownAt:0,expanded:false,bossAt:ri(8,10),bossShown:false,youAt,over:false};
}
function mkCand(kind,vac){
  const P=PROF_META[S.char.prof],T=T_(),fem=chance(0.5);
  const c={kind,fem,name:fullName(fem),title:T.prof[S.char.prof].name,prof:S.char.prof,twoCol:chance(0.3),broke:false,
    years:vac.minExp+ri(0,6),salary:rnd(vac.cap*(0.75+rng()*0.25)),lines:[],
    city:chance(0.75)?vac.city:otherCity(vac.city),reloc:false,remoteOnly:false,
    eng:!C().eng?"C1":pick(vac.eng?["B2","B2","C1"]:["A2","B1","B2"]),notice:pick([0,2,2,4])};
  if(c.city!==vac.city) c.reloc=true;
  const must=P.cards.find(id=>CARD_META[id].tags[0]===vac.tag);
  const nice=P.cards.find(id=>CARD_META[id].tags[0]===vac.nice)||"drv";
  const others=P.cards.filter(id=>id!==must&&id!==nice&&!CARD_META[id].lie);
  const L=(id,strong)=>{ const t=T.cards[id]; return {t:strong&&t.s?t.s:t.t,tags:CARD_META[id].tags,strong:!!(strong&&t.s)}; };
  if(kind==="strong"||kind==="pricey"||kind==="garbled"){
    c.lines=[L(must,true),L(nice,true),L(pick(others),chance(0.5)),L("edu",true)];
    if(kind==="pricey") c.salary=rnd(vac.cap*(1.3+rng()*0.4));
    if(kind==="garbled"){ c.twoCol=true; c.broke=true; }
  } else if(kind==="ok"){
    c.lines=shuffle([L(must,false),L(pick(others),false)]).concat([L(pick(["edu","drv","hobby"]),false),L("comm",false)]);
  } else if(kind==="buried"){
    c.lines=[L("comm",false),L("hobby",false),L("edu",false),L(must,true),L(nice,true)];
  } else if(kind==="under"){
    c.years=Math.max(0,vac.minExp-ri(1,2)); c.lines=[L(must,false),L("comm",false),L("edu",false)];
  } else if(kind==="lang"||kind==="city"||kind==="notice"){
    c.lines=[L(must,true),L(nice,chance(0.5)),L(pick(others),false),L("edu",false)];
    if(kind==="lang") c.eng=pick(["A2","B1"]);
    if(kind==="city"){ c.city=otherCity(vac.city); c.reloc=false; if(chance(0.5)) c.remoteOnly=true; }
    if(kind==="notice") c.notice=12;
  } else {
    c.title=pick(T.spam); c.prof=null; c.years=ri(0,8);
    const other=shuffle(ROSTER.filter(k=>k!==S.char.prof))[0];
    c.lines=[L("comm",false),L(pick(PROF_META[other].cards.filter(id=>!CARD_META[id].lie)),false),L("hobby",false)];
  }
  c.fits=candFits(c,vac);
  c.ai=aiScore(c);
  return c;
}
function aiScore(c){
  const r={strong:[84,96],pricey:[82,94],ok:[58,78],under:[70,86],buried:[28,44],garbled:[4,14],spam:[18,72],you:[31,44],nephew:[99,99],lang:[76,90],city:[78,92],notice:[80,93]}[c.kind]||[40,60];
  return ri(r[0],r[1]);
}
function candFits(c,vac){ return !unfit(c,vac); }
function unfit(c,vac){
  const U=T_().ui.unfit;
  if(c.prof!==S.char.prof) return U.prof;
  if(!c.lines.some(l=>l.tags.includes(vac.tag))) return U.skill(tagName(vac.tag));
  if(c.years<vac.minExp) return U.exp;
  if(c.salary>vac.cap) return U.salary;
  if(c.remoteOnly) return U.remote;
  if(c.city!==vac.city&&!c.reloc) return U.city;
  if(!lvOk(c.eng,vac.eng)) return U.eng(c.eng,vac.eng);
  if(c.notice>vac.notice) return U.notice;
  return "";
}
function nephew(){
  const N=S.shift.neph,T=T_();
  return {kind:"nephew",fem:N.fem,name:N.name,title:T.prof[S.char.prof].name,prof:S.char.prof,years:N.years,salary:rnd(S.shift.vac.cap*1.2),twoCol:false,broke:false,
    city:S.shift.vac.city,reloc:false,remoteOnly:false,eng:"A2",notice:0,
    lines:[{t:T.ui.nephExp(N.sys,T.years(N.years)),tags:[]},{t:T.ui.nephRef(N.rel),tags:[]}],fits:false,ai:99};
}
function shiftDecide(pass){
  const sh=S.shift; if(sh.over||sh.paused) return;
  const c=sh.pile[sh.i]; if(!c) return;
  sh.dec.push({c,pass,ms:Date.now()-sh.shownAt,expanded:sh.expanded});
  sh.i++; sh.expanded=false; sh.shownAt=Date.now();
  if(!sh.bossShown&&sh.i>=sh.bossAt){ sh.bossShown=true; sh.bossMsg=true; sh.pile.splice(Math.min(sh.i+2,sh.pile.length),0,nephew()); }
  if(sh.i>=sh.pile.length) endShift();
}
/* a player's decision also leaves a one-shot note for the stamp animation */
function decideFx(pass){ const sh=S.shift,n=sh.dec.length; shiftDecide(pass); if(sh.dec.length>n) sh.fx={pass,i:sh.i-1}; }
function endShift(){ const sh=S.shift; if(sh.over) return; sh.over=true; stopTimer(); S.screen="shiftResult"; }
/* the clock stops while the boss talks or the player pauses; pausedAt is when it stopped,
   so a hidden tab, where intervals barely run, loses no time either */
function syncClock(sh){
  const stop=sh.bossMsg||sh.paused;
  if(stop&&!sh.pausedAt) sh.pausedAt=Date.now();
  else if(!stop&&sh.pausedAt){ const d=Date.now()-sh.pausedAt; sh.deadline+=d; sh.shownAt+=d; sh.pausedAt=null; }
}
const shiftLeft=sh=>Math.max(0,sh.deadline-(sh.pausedAt||Date.now()));
const shiftLive=()=>S&&S.screen==="shift"&&S.shift&&!S.shift.over;
let timerId=null;
function startTimer(){
  stopTimer();
  timerId=setInterval(()=>{
    if(!S||S.screen!=="shift"){ stopTimer(); return; }
    syncClock(S.shift); if(S.shift.pausedAt) return;
    const left=S.shift.deadline-Date.now();
    if(left<=0){ endShift(); render(); return; }
    const b=document.getElementById("tbar"),t=document.getElementById("tleft");
    if(b) b.style.width=(left/(SHIFT_SEC*1000)*100)+"%";
    if(t) t.textContent=Math.ceil(left/1000);
    if(b) b.parentElement.classList.toggle("low",left<15000);
  },200);
}
function stopTimer(){ if(timerId){ clearInterval(timerId); timerId=null; } }
function shiftStats(){
  const sh=S.shift,d=sh.dec;
  const fwdGood=d.filter(x=>x.pass&&x.c.fits).length, fwdBad=d.filter(x=>x.pass&&!x.c.fits).length;
  const rejGood=d.filter(x=>!x.pass&&x.c.fits);
  const unopened=(mod().total||250)-d.length;
  const youDec=d.find(x=>x.c.kind==="you"), neph=d.find(x=>x.c.kind==="nephew");
  return {seen:d.length,fwdGood,fwdBad,rejGood,unopened,youDec,neph,avg:d.length?d.reduce((s,x)=>s+x.ms,0)/d.length:0};
}

/* ---------- act 2: the search, where every vacancy is a case ---------- */
function startSearch(){
  S.screen="week"; S.tab="vac"; S.week=1; S.energy=ENERGY;
  S.vacancies=[]; S.apps=[]; S.inbox=[]; S.events=[];
  for(let i=0;i<6;i++) S.vacancies.push(genVac());
}
function genVac(){
  const P=PROF_META[S.char.prof],T=T_(),K=C(),b=base();
  const md=mod(), W={real:0.48*(md.real||1),ghost:0.26*(md.ghost||1),internal:0.16,scam:0.10*(md.scam||1)};
  let r=rng()*(W.real+W.ghost+W.internal+W.scam), reality="real";
  for(const k of ["scam","ghost","internal","real"]){ if(r<W[k]){ reality=k; break; } r-=W[k]; }
  const nv=P.vac.length+1, ti=Math.floor(rng()*nv);
  let title,tag,nice,graded=false;
  if(ti<P.vac.length){ title=vacTitle(S.char.prof,ti); [tag,nice]=P.vac[ti]; graded=!!(P.graded&&P.graded[ti]); }
  else { const ct=K.titles[S.char.prof]; title=tr(ct); tag=ct.tag; nice=ct.nice; }
  const v={id:++S.vid,title,tag,nice,company:tr(pick(K.companies)),perk:tr(pick(K.perks)),reality,
    minExp:pick([0,1,2,3,3,4,5]),weird:null,test:chance(P.test),age:0,clues:[]};
  v.cap=rnd(b*(0.9+rng()*0.5)*(md.cap||1)); v.lo=rnd(v.cap*0.7); v.capShown=chance(0.6);
  if(reality==="ghost"){ v.posted=ri(25,90); v.applicants=ri(250,900); v.capShown=chance(0.85); v.test=false; }
  else if(reality==="internal"){ v.posted=ri(1,8); v.applicants=ri(20,160); if(chance(0.6)) v.weird=T.ui.weirdSys(tr(pick(K.insys))); }
  else if(reality==="scam"){ v.posted=ri(0,3); v.applicants=ri(5,40); if(!md.subtle&&chance(0.6)){ v.title=T.ui.scamTitle; v.scamTitle=true; }
    v.cap=rnd(b*(1.8+rng())); v.lo=rnd(v.cap*0.8); v.capShown=true; v.minExp=0; v.test=false;
    if(md.subtle){ v.cap=rnd(b*(1.3+rng()*0.3)); v.lo=rnd(v.cap*0.75); }
    else if(chance(0.5)){ v.perk=T.ui.scamPerk(money0(K.fee)); v.scamPerk=true; } }
  else { v.posted=ri(0,10); v.applicants=ri(8,30)+v.posted*ri(12,30); }
  if(graded&&K.grades&&!v.scamTitle){ const gr=pick(K.grades),lab=tr(gr[0]); v.title=gr[2]==="pre"?`${lab} ${v.title.charAt(0).toLowerCase()+v.title.slice(1)}`:`${v.title} ${lab}`; if(reality!=="scam") v.minExp=gr[1]; }
  const wh=reality==="scam"?"remote":pick(["office","office","hybrid","hybrid","remote"]);
  v.where=wh; v.city=wh==="remote"?null:(chance(0.7)?S.char.city:otherCity(S.char.city));
  /* in the US a real vacancy shows ~120 applicants when found and 200–300 before it closes: Greenhouse's average is 244 */
  v.applicants=Math.round(v.applicants*(md.apps||1)*(wh==="remote"?2:1)*press());
  v.eng=K.eng&&reality!=="scam"&&chance(0.3)?"B2":null;
  v.cover=(reality==="real"||reality==="internal")&&chance(0.25);
  v.oform=tr(pick(K.oform[reality])); v.oformScam=reality==="scam";
  v.employment=reality==="scam"?T.ui.scamEmployment:pick(T.ui.employment);
  v.freeProb=reality==="scam";
  v.probation=reality==="scam"?T.ui.freeProbation:reality==="ghost"?"":tr(K.probation);
  const CT=T.content[S.char.prof];
  v.duties=shuffle(CT.duties.slice()).slice(0,reality==="ghost"?2:3);
  v.extras=shuffle(CT.extras.slice()).slice(0,ri(1,3)).map(t=>({t}));
  if(chance(0.6)){ const k=Math.floor(rng()*EXTRA_TAGS.length); v.extras.push({t:T.extraTagged[k],tag:EXTRA_TAGS[k]}); }
  if(chance(0.4)) v.extras.push({t:T.pfReq[S.char.prof],pf:true});
  v.xtags=v.extras.filter(x=>x.tag).map(x=>x.tag);
  v.blurbType=reality==="scam"&&md.subtle?"real":reality;
  v.blurb=pick(T.blurb[v.blurbType]).replace("{x}",money(v.cap));
  v.details=reality==="real"?shuffle(CT.real.slice()).slice(0,ri(1,2)):reality==="internal"&&chance(0.5)?[pick(CT.real)]:[];
  v.procType=reality==="scam"&&md.subtle?"real":reality;
  v.process=T.process[v.procType];
  const pool=T.clues[reality].map(c=>c.replace("{d}",String(v.posted)).replace("{w}",v.weird||T.ui.weirdSys(tr(K.insys[0]))));
  v.cluePool=shuffle(pool.concat([pick(T.noise)])).slice(0,2);
  return v;
}
const vacFormat=v=>{ const F=T_().ui.formats; return v.where==="remote"?F.remote:v.where==="hybrid"?F.hybrid(cityName(v.city)):F.office(cityName(v.city)); };

function rel(id,v){ const c=CARD_META[id]; if(c.tags.includes(v.tag)) return 2; if(c.tags.includes(v.nice)) return 1; if(v.xtags&&c.tags.some(t=>v.xtags.includes(t))) return 0.8; return c.base!=null?c.base:0.2; }
function mult(id){ const c=CARD_META[id]; return c.lie?1.7:(S.unlocked[id]&&T_().cards[id].s?1.6:1); }
const SLOTW=[1,1,0.35,0.35,0.35];
function score(slots,v,broke,twoCol){
  let s=0,best=-1,bestVal=-1;
  slots.forEach((id,i)=>{ const val=rel(id,v)*mult(id); s+=val*SLOTW[i]; if(val>bestVal){bestVal=val;best=i;} });
  if(broke) s*=0.4; else if(twoCol) s*=1.1;
  return {s,best,bestVal};
}
function sched(delay,ev){ ev.week=S.week+delay; S.events.push(ev); }
function rejMaybe(app,p,a,b){ if(chance(p)) sched(ri(a,b),{type:"reject",app:app.id}); }
function apply(vid,method){
  const i=S.vacancies.findIndex(x=>x.id===vid); if(i<0) return;
  const v=S.vacancies[i];
  S.energy=Math.round((S.energy-COST[method])*2)/2;
  if(method==="ref") S.char.contacts--;
  const app={id:++S.aid,v:{...v},method,week:S.week,seen:"silence",truth:"",detail:"",inv:false,slots:S.resume.slots.slice(),twoCol:S.resume.twoCol,prof:{...S.profile},tl:[[S.week,"sent"]]};
  S.vacancies.splice(i,1); S.apps.push(app);
  resolveApp(app);
  S.toast=T_().ui.toast.sent;
}
function resolveApp(app){
  const v=app.v,n=v.applicants,D=T_().ui.detail,K=C();
  if(v.reality==="scam"){ app.truth="scam"; app.detail=D.scam; sched(1,{type:"scam",app:app.id}); return; }
  if(v.reality==="ghost"){ app.truth="ghost"; app.detail=D.ghost(v.posted+v.age*7,n); if(chance(0.25)) sched(ri(1,2),{type:"viewed",app:app.id}); return; }
  if(S.char.years<v.minExp){ app.truth="exp"; app.detail=D.exp(v.minExp,S.char.years); rejMaybe(app,0.7,1,1); return; }
  if(askVal()>v.cap){ app.truth="salary"; app.detail=D.salary(money(askVal()),money(v.cap)); rejMaybe(app,0.6,1,1); return; }
  if(!lvOk(S.char.eng,v.eng)){ app.truth="lang"; app.detail=D.lang(v.eng,S.char.eng); rejMaybe(app,0.6,1,1); return; }
  if(v.city!=null&&v.city!==S.char.city&&!app.prof.reloc){ app.truth="city"; app.detail=D.city(cityName(v.city)); rejMaybe(app,0.6,1,1); return; }
  if(v.cover&&app.method==="quick"){ app.truth="nocover"; app.detail=D.nocover; sched(1,{type:"reject",app:app.id}); return; }
  if(app.prof.mode==="remote"&&v.where!=="remote"){ app.truth="mode"; app.detail=D.mode(vacFormat(v)); rejMaybe(app,0.6,1,1); return; }
  if(!has(app.slots,v.tag)){ app.truth="skill"; app.detail=D.skill(tagName(v.tag)); rejMaybe(app,0.6,1,2); return; }
  if(mod().ai&&app.method!=="ref"&&(app.twoCol||!app.slots.slice(0,2).some(id=>CARD_META[id].tags.includes(v.tag)))){
    app.truth="aibot"; app.detail=app.twoCol?D.aiCols:D.aiTop(tagName(v.tag)); sched(1,{type:"reject",app:app.id}); return;
  }
  const b=n<=60?0.9:Math.max(0.05,55/n);
  const pOpen=app.method==="quick"?b:app.method==="tailor"?Math.min(0.95,b*2.2):1;
  if(!chance(pOpen)){ app.truth="unopened"; app.detail=n<=60?D.vacation:D.queue(ri(56,n),n); rejMaybe(app,0.4,2,3); return; }
  sched(1,{type:"viewed",app:app.id});
  const broke=app.twoCol&&chance(0.35);
  const sc=score(app.slots,v,broke,app.twoCol);
  const pr=app.prof,ph=K.photo;
  sc.s*=(v.extras.some(x=>x.pf)&&!pr.portfolio?0.8:1)*(pr.mode===v.where?1.1:1)*({title:1,strong:1.15,any:0.7}[pr.headline])*(pr.portfolio?1.15:1)*(pr.photo?ph.with:ph.without)*(v.city!=null&&v.city!==S.char.city?0.8:1);
  app.bestIdx=sc.best;
  const p=clamp(0.04+0.13*sc.s,0.03,0.8)*({quick:1,tailor:1.35,ref:1.6}[app.method]);
  if(chance(Math.min(p,0.85))){ app.truth="invited"; app.inv=true; app.detail=D.hooked;
    app.stages=v.reality==="internal"?["hr","pro","final","ceo"]:["hr","pro","final"]; app.stage=0;
    sched(ri(1,2),{type:"invite",app:app.id,stage:0}); return; }
  if(broke){ app.truth="broke"; app.detail=D.broke; }
  else {
    app.truth="weak";
    const bestTxt=cardText(app.slots[sc.best]).slice(0,48);
    app.detail=sc.best>=2?D.buried(bestTxt,sc.best+1):sc.bestVal<2?D.generic(tagName(v.tag)):sc.bestVal<3?D.noNumbers(tagName(v.tag)):D.outcompeted;
  }
  if(chance(0.6)) sched(ri(2,3),{type:"reject",app:app.id});
}

function msg(type,app,text,extra){ S.inbox.unshift(Object.assign({id:++S.mid,type,app,text,week:S.week,read:false,done:false},extra||{})); }
const appById=id=>S.apps.find(a=>a.id===id);
function processEvents(){
  const T=T_(),due=S.events.filter(e=>e.week<=S.week); S.events=S.events.filter(e=>e.week>S.week);
  for(const e of due){
    const app=appById(e.app); if(!app) continue;
    if(e.type==="reject"){
      app.seen="reject"; app.tl.push([S.week,"reject"]);
      const gold=chance(0.05); if(gold) S.flags.golden++;
      msg("reject",app.id,gold?pick(T.golden):pick(T.reject),{gold});
    } else if(e.type==="viewed"){ if(!app.tl.some(x=>x[1]==="viewed")) app.tl.push([S.week,"viewed"]); }
    else if(e.type==="invite"){
      const st=e.stage||0, key=app.stages[st];
      if(st>0&&chance(0.08)){ app.truth="ghostAfter"; app.detail=T.ui.detail.ghostStage(T.stages[app.stages[st-1]].name); app.seen="silence"; continue; }
      app.seen="interview"; app.tl.push([S.week,"stage:"+key]); S.wk[S.week]=Math.max(S.wk[S.week]||0,1);
      msg("invite",app.id,T.stages[key].invite,{expires:S.week+1,stage:st}); }
    else if(e.type==="test"){ app.tl.push([S.week,"test"]); msg("test",app.id,T.prof[S.char.prof].testText); }
    else if(e.type==="scam"){ app.seen="scam"; app.tl.push([S.week,"scam"]); msg("scam",app.id,T.ui.scamMsg(money0(C().fee))); spot(app.v); }
    else if(e.type==="decide") decide(app);
  }
  const N=T.ui.note;
  for(const m of S.inbox){
    if(m.done) continue;
    const a=appById(m.app);
    if(m.type==="invite"&&S.week>m.expires){ m.done=true; m.note=N.inviteBurnt; a.truth="noshow"; a.detail=T.ui.detail.noshow; }
    if(m.type==="test"&&S.week>m.week+1){ m.done=true; m.note=N.testLate; a.truth="declinedTest"; a.detail=T.ui.detail.testLate; }
    if(m.type==="offer"&&S.week>m.week+1){ m.done=true; m.note=N.offerBurnt; a.truth="withdrawn"; a.detail=T.ui.detail.offerLate; }
  }
}
function decide(app){
  const v=app.v,T=T_(),D=T.ui.detail;
  if(v.reality==="internal"){ app.truth="internal"; app.detail=D.internal; app.seen="reject"; app.tl.push([S.week,"reject"]); msg("reject",app.id,T.ui.internalReject); return; }
  if(mod().freeze&&chance(mod().freeze)){ app.truth="frozen"; app.detail=D.frozen; app.seen="reject"; app.tl.push([S.week,"frozen"]); msg("reject",app.id,T.ui.freezeReject); return; }
  if(chance(0.08)){ app.truth="ghostAfter"; app.detail=D.ghostFinal; app.seen="silence"; return; }
  const p=0.12+0.045*(app.a||0)+(app.testDone?0.1:0)+(app.method==="ref"?0.1:0);
  if(chance(p)){
    app.truth="offer"; app.seen="offer"; app.tl.push([S.week,"offer"]); S.wk[S.week]=2;
    const ask=askVal(); app.salary=ask<=v.cap?rnd(ask*(1+rng()*0.05)):v.cap;
    msg("offer",app.id,T.ui.offerMsg(v.title,money(app.salary)));
  } else {
    app.truth="lost"; app.detail=app.testDone?D.lostTest(T.prof[S.char.prof].testTruth):D.lost; app.seen="reject"; app.tl.push([S.week,"reject"]);
    msg("reject",app.id,pick(T.reject));
  }
}
function endWeek(){
  S.week++; S.cushion=Math.round((S.cushion-1)*2)/2;
  const before=S.inbox.length;
  processEvents();
  S.energy=ENERGY;
  for(const v of S.vacancies){ v.age++; v.applicants+=Math.round((v.reality==="ghost"?ri(5,30):ri(40,140))*press()); }
  S.vacancies=S.vacancies.filter(v=>v.reality==="ghost"?v.age<5:v.age<2);
  for(let i=0;i<5;i++) S.vacancies.push(genVac());
  S.vacancies.sort((a,b)=>a.age-b.age);
  const pendingOffer=S.inbox.some(m=>m.type==="offer"&&!m.done);
  if(S.cushion<=0&&!pendingOffer){ endSearch({type:"planB"}); return; }
  S.toast=S.inbox.length>before?T_().ui.toast.mail:T_().ui.toast.silence;
}
function endSearch(outcome){
  for(const a of S.apps) if(a.truth==="invited"&&a.seen!=="offer") a.detail=T_().ui.detail.tooLate;
  S.outcome=outcome; S.screen="xray"; S.modal=null;
  S.rounds=S.rounds||[];
  S.rounds.push({attempt:S.attempt||1,apps:S.apps,skips:S.skips,outcome,weeks:S.week,wk:S.wk,cushion:S.cushion});
}
function stageQs(key){
  S.usedQ=S.usedQ||[];
  const T=T_(),P=T.prof[S.char.prof];
  const take=(arr,pre,n)=>{ let pool=arr.map((q,i)=>[pre+i,q]).filter(x=>!S.usedQ.includes(x[0]));
    if(pool.length<n){ S.usedQ=S.usedQ.filter(k=>!k.startsWith(pre)); pool=arr.map((q,i)=>[pre+i,q]); }
    const ch=shuffle(pool).slice(0,n); ch.forEach(x=>S.usedQ.push(x[0])); return ch.map(x=>x[1]); };
  if(key==="hr") return take(T.qs,"g",2);
  if(key==="pro") return take(P.qs,"p",2);
  if(key==="final") return [...take(T.qs,"g",1),T.finalQ];
  return [T.ceoQ];
}
function nextStage(app){
  if(app.stages[app.stage]==="pro"&&app.v.test&&!app.testOffered){ app.testOffered=true; sched(1,{type:"test",app:app.id}); return; }
  const i=app.stage+1;
  if(i<app.stages.length){ app.stage=i; sched(1,{type:"invite",app:app.id,stage:i}); }
  else sched(1,{type:"decide",app:app.id});
}
function planBJob(){ return tr(C().planB[S.char.prof==="dev"||S.char.prof==="pm"?0:1]); }

/* ---------- actions ---------- */
const ACT={
  reroll(){ newFree(); },
  free(){ newFree(); },
  daily(){ newDaily(); },
  resetDaily(){ if(PROD) return; clearDaily(); newDaily(); S.toast=""; },
  langScreen(){ S.prevScreen=S.screen; S.screen="lang"; S.pickLang=S.lang; },
  pickLang(l){ if(LANG_READY.includes(l)) S.pickLang=l; },
  langBack(){ S.screen=S.prevScreen||"intro"; S.pickLang=null; },
  /* Start applies the picked language; a different one rebuilds the same run in it, since names and texts are made in the run's language */
  langGo(){ const l=S.pickLang||S.lang; S.pickLang=null; CUR_LANG=l; saveLang(l); S.langChosen=true;
    if(l===S.lang){ S.screen=S.prevScreen||"intro"; return; }
    if(S.daily) newDaily(); else newRun(S.seed,{mod:S.mod}); },
  shiftStart(){ const sh=S.shift; S.screen="shift"; sh.started=Date.now(); sh.deadline=sh.started+SHIFT_SEC*1000; sh.shownAt=Date.now(); sh.paused=false; sh.pausedAt=null; startTimer(); },
  pause(){ if(shiftLive()&&!S.shift.bossMsg) S.shift.paused=true; },
  resume(){ if(S.shift) S.shift.paused=false; },
  pass(){ decideFx(true); }, rej(){ decideFx(false); },
  more(){ S.shift.expanded=true; },
  bossOk(){ S.shift.bossMsg=false; },
  toReveal(){ S.screen="reveal"; },
  revealOpen(){ S.revealOpen=true; },
  toTask(){ S.screen="task"; },
  toAct2(){ S.screen="act2"; },
  toPlanB(){ S.savings=10; S.screen="planb"; },
  buy(id){
    const c=COURSES.find(x=>x.id===id),P=PROF_META[S.char.prof],B=T_().ui.bought; if(!c||S.bought[id]||S.savings<c.price) return;
    S.savings-=c.price;
    if(id==="pro"){ const up=shuffle(P.cards.filter(k=>!CARD_META[k].lie&&!S.unlocked[k])).slice(0,2); up.forEach(k=>S.unlocked[k]=true); S.bought[id]=B.pro(up.map(k=>"«"+cardText(k)+"»").join(", ")); }
    else if(id==="eng"){ if(!lvOk(S.char.eng,"B2")) S.char.eng="B2"; S.bought[id]=B.eng(S.char.eng); }
    else if(id==="scam"){ S.extra.push("cert"); S.bought[id]=B.scam; }
    else S.bought[id]=B.web;
  },
  retry(){ S.attempt=2; S.char.age++; S.char.years++; S.cushion=Math.max(2,S.savings); S.apps=[]; S.skips=[]; S.wk={}; S.outcome=null; S.screen="build"; },
  toBuild(){ S.screen="build"; },
  /* the search opens straight onto the jobs; week 1 teaches on the first posting, which starts open */
  start(){ startSearch(); S.vopen={[S.vacancies[0].id]:true}; },
  memoGo(){ if(S.screen!=="week") ACT.start(); },
  coachOk(){ S.coachDone=true; },
  tab(t){ S.tab=t; if(t==="inbox") S.inbox.forEach(m=>m.read=true); },
  ask(a){ S.ask=a; },
  hl(k){ S.profile.headline=k; },
  memo(){ S.memo=!S.memo; },
  /* the preview can open what sits below the fold, marked as the part the recruiter rarely reaches */
  eyesMore(){ S.eyesOpen=!S.eyesOpen; },
  mode(k){ S.profile.mode=k; },
  photo(v){ S.profile.photo=v==="1"; },
  reloc(v){ S.profile.reloc=v==="1"; },
  portfolio(){ if(S.profile.portfolio||S.energy<COST.portfolio) return; S.energy-=COST.portfolio; S.profile.portfolio=true; S.toast=T_().ui.toast.portfolio; },
  fmt(v){ S.resume.twoCol=v==="2"; },
  up(i){ i=+i; const s=S.resume.slots; [s[i-1],s[i]]=[s[i],s[i-1]]; },
  down(i){ i=+i; const s=S.resume.slots; [s[i+1],s[i]]=[s[i],s[i+1]]; },
  rm(i){ S.resume.slots.splice(+i,1); },
  add(id){ if(S.resume.slots.length<5) S.resume.slots.push(id); },
  swapPick(id){ S.swapIn=S.swapIn===id?null:id; },
  swapTo(i){ if(S.swapIn&&!S.resume.slots.includes(S.swapIn)) S.resume.slots[+i]=S.swapIn; S.swapIn=null; },
  swapCancel(){ S.swapIn=null; },
  clue(id){ const v=S.vacancies.find(x=>x.id===+id); if(!v||S.energy<COST.clue||v.clues.length>=v.cluePool.length) return; S.energy-=COST.clue; v.clues.push(v.cluePool[v.clues.length]); },
  skip(id){
    const i=S.vacancies.findIndex(x=>x.id===+id); if(i<0) return; const v=S.vacancies[i],T=T_();
    const right=v.reality!=="real"; S.skips.push({v:{...v},right,week:S.week}); S.vacancies.splice(i,1); spot(v);
    S.toast=right?T.ui.toast.skipRight(T.real[v.reality].toLowerCase(),tells(v)):T.ui.toast.skipWrong(v.applicants);
    S.flash={right,label:T.real[v.reality]};
  },
  /* one posting open at a time keeps the list short; the opened one is brought into view */
  vopen(id){ const was=S.vopen&&S.vopen[id]; S.vopen=was?{}:{[id]:true}; if(!was) scrollTarget="vb"+id; },
  vreal(id){ S.vreal=S.vreal||{}; S.vreal[id]=true; },
  vback(id){ if(S.vreal) S.vreal[id]=false; },
  quick(id){ apply(+id,"quick"); }, tailor(id){ apply(+id,"tailor"); }, ref(id){ apply(+id,"ref"); },
  /* after the week turns, sum it up: what moved, what expired, how many are still silent */
  end(){
    const open0=S.inbox.filter(m=>!m.done).map(m=>m.id);
    endWeek(); if(S.screen!=="week") return;
    const w=S.week,items=[];
    for(const a of S.apps) for(const x of a.tl) if(x[0]===w&&x[1]!=="sent") items.push([a.id,x[1]]);
    S.modal={type:"week",w:w-1,items,expired:S.inbox.filter(m=>m.done&&open0.includes(m.id)).map(m=>m.id),
      waiting:S.apps.filter(a=>a.seen==="silence"&&!a.tl.some(x=>x[0]===w)).length,fresh:S.vacancies.filter(v=>v.age===0).length};
  },
  weekGo(t){ S.modal=null; ACT.tab(t); window.scrollTo(0,0); },
  interview(mid){
    const m=S.inbox.find(x=>x.id===+mid); if(!m||S.energy<COST.interview) return;
    const T=T_(); S.energy-=COST.interview; m.done=true;
    const app=appById(m.app),st=m.stage||0,key=app.stages[st],qs=stageQs(key),lie=app.slots.find(id=>CARD_META[id].lie);
    m.note=T.ui.note.stageDone(T.stages[key].name);
    if(key==="pro"&&lie&&chance(0.7)) qs.splice(1,0,{t:T.ui.lieQ(cardText(lie)),lie:true,o:[[T.ui.lieOpts[0],-1],[T.ui.lieOpts[1],-2]]});
    S.modal={type:"interview",app:app.id,qs,i:0,a:0,exposed:false,company:app.v.company,key,st,total:app.stages.length,who:pick(T.stages[key].who),order:qs.map(q=>shuffle(q.o.map((_,k)=>k)))};
  },
  answer(k){
    const M=S.modal,q=M.qs[M.i],o=q.o[+k],T=T_();
    if(q.lie){ if(o[1]===-1){ if(!chance(0.35)) M.exposed=true; } else M.a-=1; }
    else M.a+=o[1];
    M.i++;
    if(M.i>=M.qs.length){
      const app=appById(M.app); app.a=(app.a||0)+Math.max(0,M.a);
      const nq=M.qs.filter(q=>!q.lie).length, sc=Math.max(0,M.a)/(2*nq);
      const pass=M.key==="hr"?0.55+0.4*sc:M.key==="pro"?0.4+0.5*sc:1;
      if(M.exposed){ app.truth="lie"; app.detail=T.ui.detail.lie; sched(1,{type:"reject",app:app.id}); }
      else if(!chance(pass)){ app.truth="lost"; app.detail=g(T.ui.detail.stageFail(T.stages[M.key].name)); sched(1,{type:"reject",app:app.id}); }
      else nextStage(app);
      S.modal={type:"done",stage:T.stages[M.key].name,last:M.st===M.total-1};
    }
  },
  close(){ S.modal=null; },
  testDo(mid){ const m=S.inbox.find(x=>x.id===+mid); if(!m||S.energy<COST.test) return; S.energy-=COST.test; m.done=true; m.note=T_().ui.note.testDone;
    const app=appById(m.app); app.testDone=true; S.flags.tests++; nextStage(app); },
  testNo(mid){ const m=S.inbox.find(x=>x.id===+mid),T=T_(); m.done=true; m.note=T.ui.note.testNo; const app=appById(m.app); app.truth="declinedTest"; app.detail=T.ui.detail.testNo; app.seen="reject"; },
  scamPay(mid){ const m=S.inbox.find(x=>x.id===+mid),T=T_(); m.done=true; m.note=T.ui.note.scamPaid; S.cushion=Math.max(0.5,S.cushion-1.5); S.flags.scamPaid++;
    const a=appById(m.app); a.truth="scamPaid"; a.detail=T.ui.detail.scamPaid; },
  scamNo(mid){ const m=S.inbox.find(x=>x.id===+mid); m.done=true; m.note=T_().ui.note.scamNo; },
  offer(mid){ S.modal={type:"offer",mid:+mid}; },
  accept(){ const m=S.inbox.find(x=>x.id===S.modal.mid),app=appById(m.app); m.done=true; app.truth="accepted"; app.detail=T_().ui.detail.accepted(money(app.salary));
    endSearch({type:"job",salary:app.salary,title:app.v.title,company:app.v.company,where:app.v.where}); },
  haggle(){ const m=S.inbox.find(x=>x.id===S.modal.mid),app=appById(m.app); app.haggled=true;
    if(chance(0.7)){ app.salary=Math.min(rnd(app.salary*1.12),rnd(app.v.cap*1.05)); S.flags.negotiated++; S.modal.result="ok"; }
    else { m.done=true; app.truth="withdrawn"; app.detail=T_().ui.detail.haggleFail; app.seen="reject"; S.modal={type:"withdrawn"}; } },
  decline(){ const m=S.inbox.find(x=>x.id===S.modal.mid),app=appById(m.app),T=T_(); m.done=true; m.note=T.ui.note.declined; app.truth="declined"; app.detail=T.ui.detail.declined; S.modal=null; },
  toEpitaph(){ S.screen="epitaph"; },
  copy(){
    const el=document.getElementById("share"),T=T_();
    const fallback=()=>{ el.select(); S.toast=T.ui.toast.selected; render(); };
    const text=el?el.value:shareText();
    try{ navigator.clipboard.writeText(text).then(()=>{ S.toast=T.ui.toast.copied; render(); },fallback); }catch(e){ fallback(); }
  },
  again(){ newFree(); }
};

/* ---------- views ---------- */
/* icons as inline SVG in the text colour: font glyphs like ✓ ▾ ↑ look different on every system */
const svgI=(d,extra)=>`<svg class="ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra||""}/></svg>`;
const ICON={check:svgI("M3 8.5l3.2 3.2L13 4.8"),cross:svgI("M4 4l8 8M12 4l-8 8"),chev:svgI("M4 6l4 4 4-4"),up:svgI("M8 13V3M4 7l4-4 4 4"),down:svgI("M8 3v10M4 9l4 4 4-4")};
const iconize=t=>String(t).replace(/✓/g,ICON.check).replace(/✗/g,ICON.cross);
const btn=(act,arg,label,cls,dis)=>`<button class="btn ${cls||""}" data-act="${act}" data-arg="${arg??""}"${dis?" disabled":""}>${label}</button>`;
const ff=s=>s.replace(/\{([^}|]*)\|([^}]*)\}/g,(m,a,b)=>S.char.fem?b:a);
function header(){
  /* the run number lives on the x-ray; the language screen shows no country yet; the CV builder runs wider */
  const T=T_(),showLang=S.screen==="intro";
  const plat=S.screen==="lang"?"":`${esc(tr(C().platform))} · ${esc(tr(C().name))}`;
  return `<header class="top"><div class="wrap top-in${S.screen==="build"?" wide":""}"><div class="brand">${T.ui.brand}</div><div class="plat">${plat}${showLang?` ${btn("langScreen","",S.lang.toUpperCase(),"ghost lbtn")}`:""}</div></div></header>`;
}
function garble(s){ let k=s.length; return s.replace(/[А-Яа-яЁёA-Za-zÀ-ÿ0-9\u3040-\u30ff\u4e00-\u9fff]/g,c=>{ k=(k*31+7)%97; return k%3===0?"▒":k%5===0?"¿":c; }); }
/* ---------- CV photos ----------
   whether a CV has a photo, and what it looks like, comes from a hash of the CV's language-neutral facts:
   the same in every language, stable across reloads, and it never draws from the run's random numbers */
const photoShare=()=>{ const p=C().photo; return p.with<p.without?0.12:p.without<1?0.9:p.with>p.without?0.75:0.45; };
const photoSeed=c=>c.kind==="you"?hash(S.seed+"|you"):hash([S.seed,c.kind,c.fem,c.years,c.salary,c.ai,c.city,c.notice].join("|"));
function hasPhoto(c){ return c.kind==="you"?!!S.profile.photo:photoSeed(c)%1000<photoShare()*1000; }
const SKIN=["#F3D7C2","#EBC3A2","#DDAA84","#C28B63","#9A6544","#6E472F"];
const HAIR=["#1D1A19","#33251C","#55392A","#86593A","#B98E58","#A5A29E"];
const CLOTH=["#2E3B55","#3B3F47","#56677A","#6C4853","#2F5246","#7A6A55"];
const BACKDROP=["#C7D2DE","#D6D0C6","#CAD6CD","#D3CFDA"];
/* an ID photo, head and shoulders, drawn flat in the CV's own muted palette */
function portrait(c){
  let h=photoSeed(c);
  const r=n=>{ h=Math.imul(h^(h>>>15),2246822519)>>>0; h=(h^(h>>>13))>>>0; return h%n; };
  const east=C()===COUNTRIES.jp||C()===COUNTRIES.cn;
  const age=c.kind==="you"?S.char.age:24+(c.years||0);
  const skin=SKIN[east?r(3):r(6)], hair=age>46&&r(3)?HAIR[5]:HAIR[east?r(2):r(5)];
  const cloth=CLOTH[r(6)], bg=BACKDROP[r(4)], fem=c.fem, style=r(3), glasses=r(5)===0, beard=!fem&&r(4)===0;
  const back=fem&&style===0?`<path d="M23 48C21 25 31 17 42 17C53 17 63 25 61 48L64 84C55 89 29 89 20 84Z" fill="${hair}"/>`
    :fem&&style===1?`<path d="M24 48C22 26 31 18 42 18C53 18 62 26 60 48L61 64C54 68 30 68 23 64Z" fill="${hair}"/>`:"";
  const top=fem?(style===2?`<circle cx="42" cy="19" r="8" fill="${hair}"/><path d="M27 42C26 27 34 22 42 22C50 22 58 27 57 42C54 33 48 29 42 29C36 29 30 33 27 42Z" fill="${hair}"/>`
      :`<path d="M27 43C27 27 35 21 43 22C52 23 58 30 57 43C53 33 45 30 38 33C33 35 29 39 27 43Z" fill="${hair}"/>`)
    :age>50&&style===2?`<path d="M27 44C26 36 28 32 31 30L31 40ZM57 44C58 36 56 32 53 30L53 40Z" fill="${hair}"/>`
    :style===1?`<path d="M27 42C26 26 34 21 43 21C52 21 58 27 57 42C55 33 51 30 47 29C40 28 31 32 27 42Z" fill="${hair}"/>`
    :`<path d="M27 41C26 27 34 22 42 22C51 22 58 27 57 41C55 33 50 30 42 30C35 30 29 33 27 41Z" fill="${hair}"/>`;
  return `<svg viewBox="0 0 84 104" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <rect width="84" height="104" fill="${bg}"/>${back}
    <path d="M4 104C6 83 22 75 42 75C62 75 78 83 80 104Z" fill="${cloth}"/>
    <path d="M34 75L42 88L50 75Z" fill="#EFEDE8"/>
    <rect x="35" y="58" width="14" height="19" rx="5" fill="${skin}"/><rect x="35" y="58" width="14" height="8" fill="#000" opacity=".08"/>
    <ellipse cx="27.5" cy="46" rx="3" ry="4" fill="${skin}"/><ellipse cx="56.5" cy="46" rx="3" ry="4" fill="${skin}"/>
    <ellipse cx="42" cy="44" rx="15" ry="18" fill="${skin}"/>
    ${beard?`<path d="M28 48C29 60 35 63 42 63C49 63 55 60 56 48C53 56 48 57 42 57C36 57 31 56 28 48Z" fill="${hair}" opacity=".85"/>`:""}
    ${top}
    <path d="M33 39.5h6M45 39.5h6" stroke="${hair}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="36" cy="45" r="1.6" fill="#22201E"/><circle cx="48" cy="45" r="1.6" fill="#22201E"/>
    <path d="M42 47v5" stroke="#000" stroke-opacity=".18" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M38 55.5Q42 58 46 55.5" stroke="#7A3B33" stroke-opacity=".7" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    ${glasses?`<g fill="none" stroke="#2A2A2A" stroke-width="1.2"><rect x="31" y="41" width="9" height="7" rx="2.5"/><rect x="44" y="41" width="9" height="7" rx="2.5"/><path d="M40 44h4"/></g>`:""}
  </svg>`;
}
function cvView(c,opts){
  opts=opts||{}; const U=T_().ui.cv;
  const lines=c.lines.map(l=>gx(l.t,c.fem));
  const vis=opts.full||opts.fold||!opts.peek&&S.shift.expanded?lines:lines.slice(0,2);
  const show=s=>esc(c.broke?garble(s):s);
  const more=lines.length-vis.length;
  const ph=hasPhoto(c);
  return `<article class="cv${ph?" ph":""}${c.twoCol?" two":""}${opts.enter?" enter":""}">
    ${ph?`<div class="photo">${portrait(c)}</div>`:""}
    <div><div class="nm">${show(c.name)}</div><div class="ttl">${show(c.title)}</div></div>
    <div class="facts"><span>${U.exp} ${c.broke?"▒▒":T_().years(c.years)}</span><span>${U.wants} ${c.broke?"▒▒▒ ▒▒▒":money(c.salary)}</span>
      <span>${c.broke?"▒▒▒▒▒▒":esc(cityName(c.city))+(c.remoteOnly?U.remoteOnly:c.reloc?gx(U.reloc,c.fem):"")}</span>
      ${C().eng?`<span>${U.eng} ${c.broke?"▒▒":c.eng}</span>`:""}<span>${U.start}: ${c.broke?"▒▒▒":T_().notice(c.notice)}</span>
      ${mod().ai&&!opts.full&&c.ai!=null?`<span class="aisc">${U.ai}: ${c.ai}%</span>`:""}</div>
    <ul>${vis.map((s,i)=>(opts.fold&&i===2?`<li class="foldline" aria-hidden="true">${opts.fold}</li>`:"")+`<li${opts.fold&&i>=2?` class="under" style="animation-delay:${(i-2)*120}ms"`:""}>${show(s)}</li>`).join("")}</ul>
    ${more>0&&opts.peek?(opts.peekAct?`<button class="more" data-act="${opts.peekAct}" aria-expanded="false">${U.more(more)}</button>`:`<span class="more peek">${U.more(more)}</span>`)
      :more>0&&!opts.full?`<button class="more" data-act="more">${U.more(more)}</button>`:""}
    ${opts.fold&&opts.foldAct&&lines.length>2?`<button class="more" data-act="${opts.foldAct}" aria-expanded="true">${opts.less}</button>`:""}
  </article>`;
}
function modBanner(){ const T=T_(),m=T.mods[S.mod]; return `<div class="modb"><span class="lbl">${T.ui.marketOfDay}</span><b>${esc(m.name)}</b><p>${esc(g(m.desc))}</p></div>`; }
function playedCard(){
  const d=loadDaily(),U=T_().ui; if(!d||S.daily) return "";
  return `<div class="card"><h2 class="sec-h">${U.playedTitle(d.day)}</h2><div class="big">${U.points(d.points)}</div>
    <textarea class="share" id="share" readonly>${esc(typeof d.share==="string"?d.share:d.share[S.lang]||d.share.en)}</textarea><div class="acts">${btn("copy","",U.copyResult)}${PROD?"":btn("resetDaily","",U.resetDaily,"warn")}</div>
    <p class="hint">${U.playedHint}</p></div>`;
}
/* the real market sits on the x-ray, next to the result it helps explain */
function factCard(){
  const M=MS(),F=T_().facts,x=press();
  const months=[...new Set(M.facts.map(f=>f[2]))].sort();
  const srcs=[]; for(const f of M.facts) if(!srcs.some(x=>x[0]===f[3])) srcs.push([f[3],f[4]]);
  const when=months.length>1?`${month(months[0])} – ${month(months[months.length-1])}`:month(months[0]);
  const parts=M.facts.map(([k,v,,,u])=>srcLink(u,esc(F[k](num,v))));
  return `<div class="film fact"><h2 class="sec-h muted">${F.hdr}</h2><p>${F.line(esc(tr(C().name)),parts)}</p>
    ${isYoung()?`<p class="hint">${esc(F.young)}</p>`:""}${x!==1?`<p class="hint">${esc(F.press(num(x)))}</p>`:""}
    <p class="hint mono">${F.src(srcs.map(([n,u])=>srcLink(u,esc(n))).join(", "),esc(when))}</p></div>`;
}
function youCand(){ return S.shift.pile.find(c=>c.kind==="you"); }
/* where the preselected language came from: the player's last choice, the browser, or English when the browser's isn't available */
function langSource(){
  if(loadLang()) return "saved";
  const n=(typeof navigator!=="undefined"&&navigator.language||"").slice(0,2).toLowerCase();
  return LANG_READY.includes(n)?"browser":"fallback";
}
function langScreen(){
  const T=T_(),U=T.ui,pick=uiLang(),changing=!!S.prevScreen;
  const items=LANG_LIST.map(([k,n])=>{ const ok=LANG_READY.includes(k);
    return `<button class="langb ${pick===k?"on":""}" data-act="pickLang" data-arg="${k}" aria-pressed="${pick===k}" lang="${k}"${ok?"":" disabled"}><b>${n}</b>${ok?"":`<span>${U.soon}</span>`}</button>`; }).join("");
  /* the note explains the preselected tile; once the player picks another one it has nothing left to say */
  const note=pick===S.lang?`${U.langFrom[langSource()]} `:"";
  return header()+`<main class="wrap stack" style="padding-block:28px 40px">
    <section class="hero"><h1>${U.brand}</h1><p>${U.langSub}</p></section>
    <div class="langs" role="group" aria-label="${U.langSub}">${items}</div>
    <p class="hint">${note}${U.langLater}</p>
    <div class="acts">${btn("langGo","",U.start+" →","pri")}${changing?btn("langBack","",U.vac.back):""}</div>
    <p class="hint">${U.langHint}</p>
  </main>`;
}
function introScreen(){
  const played=loadDaily(),U=T_().ui;
  const modeLine=S.daily?U.dailyLine(S.day):U.freeLine;
  const acts=S.daily?btn("toTask","",U.next,"pri")+btn("free","",U.freePlay)
    :btn("toTask","",U.next,"pri")+btn("reroll","",U.otherLife)+(played?"":btn("daily","",U.backDaily));
  return header()+`<main class="wrap stack" style="padding-block:8px 40px">
    <section class="hero"><div class="mode">${modeLine}</div><h1>${U.brand}</h1>
      ${playedCard()}
      ${modBanner()}
      <div class="modb story"><p>${ff(U.rumor)}</p></div></section>
    <h2 class="sec-h">${U.thisIsYou}</h2>
    <div class="you">${cvView(youCand(),{full:true})}</div>
    <p class="hint">${ff(U.youHint)}</p>
    <div class="acts">${acts}</div>
  </main>`;
}
function actCard(n,title,sub){ return `<section class="act"><span class="act-n">${T_().ui.part(n)}</span><h1>${title}</h1><p>${sub}</p></section>`; }
/* on a touch screen the how-to shows a CV being swiped instead of arrow keys */
const swipePic=dir=>`<span class="swp only-touch" aria-hidden="true"><svg viewBox="0 0 56 46"><rect x="16" y="5" width="24" height="34" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M21 14h14M21 20h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="${dir<0?"M11 30H2m0 0 5-5m-5 5 5 5":"M45 30h9m0 0-5-5m5 5-5 5"}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
function taskScreen(){
  const v=S.shift.vac,T=T_(),U=T.ui.task;
  return header()+`<main class="wrap stack" style="padding-block:8px 40px">
    ${actCard(1,U.title,U.intro(tr(C().my),mod().total||250))}
    <p class="hint">${linked(T.facts.apps(WORLD_STATS.appsPerJob,mark(WORLD_STATS.appsSrc),WORLD_STATS.appsYear),WORLD_STATS.appsUrl)}</p>
    <div class="card"><h2 class="sec-h">${U.boss}</h2>
      <dl class="boss">
        <dt>${U.vacancy}</dt><dd>${esc(v.title)}</dd>
        <dt>${U.must}</dt><dd>${tagName(v.tag)}</dd>
        <dt>${U.exp}</dt><dd>${T.expFrom(v.minExp)}</dd>
        <dt>${U.budget}</dt><dd>${U.upTo(money(v.cap))}</dd>
        <dt>${U.where}</dt><dd>${U.whereTxt(T.ui.mode[v.fmt],cityName(v.city))}</dd>
        ${v.eng?`<dt>${U.eng}</dt><dd>${U.engFrom(v.eng)}</dd>`:""}
        <dt>${U.start}</dt><dd>${U.startTxt}</dd>
        <dt>${U.nice}</dt><dd>${tagName(v.nice)}</dd>
        <dt>${U.need}</dt><dd>${U.needTxt(GOAL_FWD)}</dd>
        <dt>${U.time}</dt><dd>${U.timeTxt(SHIFT_SEC)}</dd>
      </dl></div>
    <div class="card howto"><h2 class="sec-h">${U.how}</h2>
      <div class="keysdemo">
        <div class="kd"><kbd class="only-kb">←</kbd>${swipePic(-1)}<span><b>${U.rej}</b><br>${U.rejSub}</span></div>
        <div class="kd"><kbd class="only-kb">→</kbd>${swipePic(1)}<span><b>${U.pass}</b><br>${U.passSub}</span></div>
      </div>
      <ul class="tips">${U.howTips.map(t=>`<li>${t}</li>`).join("")}</ul></div>
    <div class="acts">${btn("shiftStart","",U.go,"pri")}</div>
  </main>`;
}
function act2Screen(){
  const T=T_(),U=T.ui.act2;
  return header()+`<main class="wrap stack" style="padding-block:8px 40px">
    ${actCard(2,U.title,ff(U.text))}
    <div class="card"><dl class="boss">
      <dt>${U.cushion}</dt><dd>${U.cushionTxt(weeks(S.cushion))}</dd>
      <dt>${U.goal}</dt><dd>${U.goalTxt(money(S.char.prev))}</dd>
      <dt>${U.bonus}</dt><dd>${U.bonusTxt(T.want[S.char.want])}</dd>
      <dt>${T.ui.marketOfDay}</dt><dd>${esc(T.mods[S.mod].name)}</dd>
    </dl></div>
    <p class="lead">${ff(U.lead)}</p>
    <div class="acts">${btn("toBuild","",U.go,"pri")}</div>
  </main>`;
}
function shiftScreen(){
  const sh=S.shift,c=sh.pile[sh.i],v=sh.vac,left=shiftLeft(sh),T=T_(),U=T.ui.shift,hold=sh.bossMsg||sh.paused;
  const fwd=sh.dec.filter(d=>d.pass).length,TU=T.ui.task;
  /* the brief as chips, in the order the CV lists its facts: experience, money, place, English, start */
  const rq=(l,x)=>`<span class="rq">${l?`<i>${l}</i> `:""}${x}</span>`;
  const reqs=rq(TU.must,`<b>${tagName(v.tag)}</b>`)+rq("",T.expFrom(v.minExp))+rq(TU.budget,TU.upTo(money(v.cap)))
    +rq(TU.where,`${T.ui.mode[v.fmt]}, ${esc(cityName(v.city))}`)+(v.eng?rq(TU.eng,TU.engFrom(v.eng)):"")+rq(TU.start,TU.startTxt);
  /* the card just decided leaves with its stamp on, over the next one sliding in */
  const fx=sh.fx; sh.fx=null; const gone=fx&&sh.pile[fx.i];
  const ghost=gone?`<div class="outgoing ${fx.pass?"out-r":"out-l"}" aria-hidden="true" inert>${cvView(gone,{peek:true})}<span class="stamp slam ${fx.pass?"good":""}">${fx.pass?U.stampPass:U.stampRej}</span></div>`:"";
  return header()+`<main class="wrap shift"><h1 class="sr">${T.ui.task.title}</h1>
    <div class="timer"><div class="bar e ${left<15000?"low":""}"><i id="tbar" style="width:${left/(SHIFT_SEC*1000)*100}%"></i></div><b id="tleft">${Math.ceil(left/1000)}</b>${btn("pause","",U.pause,"ghost sm",hold)}</div>
    <div class="queue"><span>${U.resumeOf(sh.i+1,mod().total||250,sh.pile.length)}</span><span>${U.passed(fwd,GOAL_FWD)}</span></div>
    <div class="reqs"><span class="rtitle">${esc(v.title)}</span>${reqs}</div>
    <div class="stage">
      ${sh.bossMsg?`<div class="boss-msg">${U.bossMsg(esc(sh.neph.name),esc(sh.neph.sys),sh.neph.fem)} ${btn("bossOk","",ff(U.understood))}</div>`:""}
      ${sh.paused?`<div class="card paused"><h2>${U.paused}</h2><p class="hint">${U.pausedTxt}</p>${btn("resume","",U.resume,"pri")}</div>`
        :`${c?cvView(c,{enter:true}):""}${ghost}`}
    </div>
    <div class="decide">${btn("rej","",U.rejBtn,"warn",hold)}${btn("pass","",U.passBtn,"pri",hold)}</div>
    <div class="keys keys-kb">${U.keys}</div><div class="keys keys-touch">${U.keysTouch}</div>
  </main>`;
}
function shiftResultScreen(){
  const st=shiftStats(),sh=S.shift,T=T_(),U=T.ui.result;
  const verdict=st.fwdGood>=GOAL_FWD&&st.fwdBad<=2?U.vGood:st.fwdGood<GOAL_FWD?U.vFew:U.vBad;
  const N=sh.neph;
  const neph=st.neph?U.neph(esc(N.name),N.fem,st.neph.pass,esc(N.rel)):"";
  const reasons=st.rejGood.filter(d=>d.c.kind!=="you").slice(0,4).map(d=>{
    const k=d.c.kind, why=k==="buried"?U.whyBuried:k==="garbled"?U.whyGarbled:U.whyWeak(T.secs(d.ms));
    return `<li>${esc(gx(d.c.name,d.c.fem))}: ${gx(why,d.c.fem)}</li>`;
  }).join("");
  const badFwd=sh.dec.filter(d=>d.pass&&!d.c.fits&&d.c.kind!=="nephew").slice(0,4).map(d=>`<li>${esc(gx(d.c.name,d.c.fem))}: ${esc(gx(unfit(d.c,sh.vac),d.c.fem))}</li>`).join("");
  return header()+`<main class="wrap stack" style="padding-block:20px 40px">
    <div class="sec-h">${U.over}</div><h1 class="h2">${ff(verdict)}</h1>
    <div class="result">
      <div><span class="lbl">${U.opened}</span><b>${st.seen}</b></div>
      <div><span class="lbl">${U.notOpened}</span><b>${st.unopened}</b></div>
      <div><span class="lbl">${U.fwdGood}</span><b>${st.fwdGood}</b></div>
      <div><span class="lbl">${U.rejGood}</span><b>${st.rejGood.length}</b></div>
    </div>
    <p class="hint">${ff(U.avg(T.secs(st.avg),st.unopened))} ${linked(T.facts.glance(WORLD_STATS.glanceSec,mark(WORLD_STATS.glanceSrc),WORLD_STATS.glanceYear),WORLD_STATS.glanceUrl)}</p>
    ${reasons?`<div class="card"><h2 class="sec-h">${ff(U.rejGoodTitle)}</h2><ul class="note">${reasons}</ul></div>`:""}
    ${badFwd?`<div class="card"><h2 class="sec-h">${U.badFwdTitle}</h2><ul class="note">${badFwd}</ul></div>`:""}
    ${neph?`<p class="lead">${ff(neph)}</p>`:""}
    <div class="acts">${btn("toReveal","",U.special,"pri")}</div>
  </main>`;
}
function revealScreen(){
  const st=shiftStats(),sh=S.shift,you=youCand(),d=st.youDec,T=T_(),U=T.ui.reveal;
  const line=!d?U.notReached(sh.youAt+1):d.pass?U.passed(T.secs(d.ms)):U.rejected(T.secs(d.ms),d.expanded);
  const notes=[];
  if(CARD_META[S.resume.slots[0]].base!=null) notes.push(U.n1(cardText(S.resume.slots[0])));
  const strongIdx=S.resume.slots.findIndex(id=>CARD_META[id].tags.includes(sh.vac.tag));
  if(strongIdx>=2) notes.push(U.n2(tagName(sh.vac.tag),strongIdx+1));
  notes.push(U.n3);
  if(S.resume.twoCol) notes.push(U.n4);
  /* replay: the CV exactly as it was seen, with your verdict stamped on; then unfold what sat below the fold */
  const open=!!S.revealOpen,SH=T.ui.shift;
  const stamp=!d?U.stampNone:`${d.pass?SH.stampPass:SH.stampRej} · ${U.secs(T.secs(d.ms))}`;
  return header()+`<main class="wrap stack" style="padding-block:20px 40px">
    <div class="sec-h">${U.no(sh.youAt+1)}</div>
    <h1 class="h2">${U.title}</h1>
    <p class="lead">${ff(line)} ${you.fits?U.fits:""}</p>
    <div class="you replay">${cvView(you,open?{fold:U.fold}:{peek:true})}<span class="stamp slam ${d&&d.pass?"good":""}${open?" still":""}">${stamp}</span></div>
    ${open?`<div class="card"><h2 class="sec-h">${U.sees}</h2><ul class="note">${notes.map(n=>`<li>${esc(ff(n))}</li>`).join("")}</ul></div>
    <div class="acts">${btn("toAct2","",T.ui.next,"pri")}</div>`:`<div class="acts">${btn("revealOpen","",U.unfold,"pri")}</div>`}
  </main>`;
}
function statusBar(){
  const c=S.cushion,right=S.skips.filter(s=>s.right).length,U=T_().ui.status;
  return `<section class="statusbar"><div class="wrap"><div class="status">
    <div class="stat"><span class="lbl">${U.week}</span><b class="num">${S.week}</b><span class="sub">${U.goal(money(S.char.prev))}</span></div>
    <div class="stat"><span class="lbl">${U.cushion}</span><b class="num">${weeks(c)} ${U.wk}</b><div class="bar ${c<=2?"low":""}"><i style="width:${clamp(c/10*100,0,100)}%"></i></div></div>
    <div class="stat"><span class="lbl en">${U.energy}</span><b class="num">${S.energy}/${ENERGY}</b><div class="bar e"><i style="width:${S.energy/ENERGY*100}%"></i></div></div>
    <div class="stat"><span class="lbl">${U.contacts}</span><b class="num">${S.char.contacts}</b><span class="sub">${U.forRefs}</span></div>
    <div class="stat"><span class="lbl">${U.instinct}</span><b class="num">${right}/${S.skips.length}</b><span class="sub">${U.rightSkips}</span></div>
  </div></div></section>`;
}
/* a vacancy is a case file: a one-glance summary that opens into the full posting,
   where the player first rules on «real?» and only then picks how to apply */
function vacCard(v){
  const T=T_(),U=T.ui.vac,sl=S.resume.slots,open=!!(S.vopen&&S.vopen[v.id]),real=!!(S.vreal&&S.vreal[v.id]);
  const sal=v.capShown?`${money0(v.lo)} – ${money(v.cap)}`:U.salaryHidden;
  const posted=v.posted+v.age*7;
  const marks=[];
  const li=(t,ok)=>{ marks.push(ok); return `<li class="${ok===true?"hit":ok===false?"miss":""}">${esc(t)}</li>`; };
  const pm=S.profile.mode;
  const req=[li(U.must(tagName(v.tag)),has(sl,v.tag)),li(U.nice(tagName(v.nice)),has(sl,v.nice)?true:null),
    li(v.minExp?T.expFrom(v.minExp):U.noExp,S.char.years>=v.minExp),
    ...(v.eng?[li(U.engFrom(v.eng),lvOk(S.char.eng,v.eng))]:[]),
    ...(v.city!=null?[li(v.city===S.char.city?U.workIn(cityName(v.city)):U.workInFar(cityName(v.city),cityName(S.char.city)),v.city===S.char.city?true:S.profile.reloc?null:false)]:[]),
    li(U.format(T.ui.mode[v.where]),pm==="any"?null:pm===v.where?true:pm==="remote"?false:null),
    ...(v.cover?[li(U.cover,null)]:[]),
    ...v.extras.map(x=>li(x.t,x.pf?S.profile.portfolio:x.tag?has(sl,x.tag):null))];
  if(v.weird) req.push(li(v.weird,false));
  const cond=[v.employment,v.oform,v.probation,...v.details,v.perk].filter(Boolean).map(t=>`<li>${esc(t)}</li>`).join("");
  const e=S.energy,canClue=v.clues.length<v.cluePool.length;
  const hit=marks.filter(x=>x===true).length,miss=marks.filter(x=>x===false).length;
  const head=`<h3 class="vh"><button class="vhead" data-act="vopen" data-arg="${v.id}" aria-expanded="${open}" aria-controls="vb${v.id}">
      <span class="vt"><span class="vtitle">${esc(v.title)}</span><span class="co">${esc(v.company)} · ${esc(vacFormat(v))}</span></span>
      <span class="sal">${sal}</span>
      <span class="vmeta"><span class="fit" title="${esc(U.fit(hit,miss))}"><i class="y${hit?"":" z"}">${ICON.check}${hit}</i><i class="n${miss?"":" z"}">${ICON.cross}${miss}</i></span>
        <span>${posted===0?U.today:U.ago(posted)}</span><span>${U.applicants(v.applicants)}</span>
        ${v.clues.length?`<span class="pen">${U.clues(v.clues.length,v.cluePool.length)}</span>`:""}<span class="chev" aria-hidden="true">${ICON.chev}</span></span>
    </button></h3>`;
  if(!open) return `<article class="card vac">${head}</article>`;
  const verdict=real
    ?`<div class="sec-h">${U.q2}</div><div class="acts">
      ${btn("tailor",v.id,`${U.apply} <span class="cost">${COST.tailor}</span>`,"pri",e<COST.tailor)}
      ${btn("quick",v.id,`${U.quick} <span class="cost">${COST.quick}</span>`,"",e<COST.quick)}
      ${btn("ref",v.id,`${U.ref} <span class="cost">${COST.ref} ${U.contact}</span>`,"",e<COST.ref||S.char.contacts<1)}
      ${btn("vback",v.id,U.back,"ghost")}</div>`
    :`<div class="sec-h">${U.q1}</div><div class="acts">
      ${btn("vreal",v.id,U.real,"pri")}
      ${canClue?btn("clue",v.id,`${U.clue} <span class="cost">${COST.clue}</span>`,"ghost",e<COST.clue):""}
      ${btn("skip",v.id,U.skip,"warn")}</div>`;
  return `<article class="card vac open">${head}<div class="vbody" id="vb${v.id}">
    <p class="blurb">${esc(v.blurb)}</p>
    <div class="jd">
      <div><h4 class="sec-h">${U.duties}</h4><ul class="req">${v.duties.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>
      <div><h4 class="sec-h">${U.reqs}</h4><ul class="req">${req.join("")}</ul><div class="legend">${iconize(U.legend)}</div></div>
      <div><h4 class="sec-h">${U.conds}</h4><ul class="req">${cond}</ul></div>
    </div>
    <div class="proc">${esc(v.process)}</div>
    ${v.clues.length?`<div class="clues">${v.clues.map(c=>`<div class="clue">${esc(c)}</div>`).join("")}</div>`:""}
    <div class="verdict">${verdict}</div></div></article>`;
}
/* the signs that give a fake vacancy away, as language-neutral keys */
function tellKeys(v){
  const t=[],b=base(),age=v.posted+v.age*7;
  if(age>25) t.push("age");
  if(v.applicants>250&&v.reality==="ghost") t.push("apps");
  if(v.blurbType==="ghost") t.push("ghostBlurb");
  if(v.procType==="ghost") t.push("ghostProc");
  if(v.weird) t.push("weird");
  if(v.blurbType==="internal") t.push("intBlurb");
  if(v.procType==="internal") t.push("intProc");
  if(v.reality==="scam"&&v.cap>b*1.4) t.push("highPay");
  if(v.scamTitle) t.push("anyProf");
  if(v.scamPerk) t.push("payYou");
  if(v.oformScam) t.push("oform");
  if(v.freeProb) t.push("freeProb");
  if(v.procType==="scam") t.push("messenger");
  if(v.blurbType==="scam") t.push("noExpPay");
  return t;
}
function tells(v){
  const L=T_().tells;
  return tellKeys(v).map(k=>k==="age"?L.age(v.posted+v.age*7):k==="apps"?L.apps(v.applicants):k==="oform"?`«${v.oform}»`:L[k]);
}
/* each sign ticks one line of the cheat sheet: column and row in memo.ghostL / internalL / scamL */
const SIGN={age:"ghost0",apps:"ghost1",ghostBlurb:"ghost2",ghostProc:"ghost3",weird:"internal0",intBlurb:"internal1",intProc:"internal2",
  highPay:"scam0",noExpPay:"scam0",anyProf:"scam1",messenger:"scam1",oform:"scam2",payYou:"scam3",freeProb:"scam3"};
const SIGN_ROWS=new Set(Object.values(SIGN)).size;
function spot(v){ S.signs=S.signs||{}; for(const k of tellKeys(v)) S.signs[SIGN[k]]=(S.signs[SIGN[k]]||0)+1; }
const spotted=()=>Object.keys(S.signs||{}).length;
function memoBody(){
  const M=T_().memo,sg=S.signs||{};
  const col=(h,items,key)=>`<div><b>${h}</b><ul class="req">${items.map((x,i)=>{ const n=key&&sg[key+i];
    return `<li${n?` class="spot"`:""}>${x}${n?` <span class="cnt">×${n}</span>`:""}</li>`; }).join("")}</ul></div>`;
  return `<div class="mgrid">${col(M.ghost,M.ghostL,"ghost")}${col(M.internal,M.internalL,"internal")}${col(M.scam,M.scamL,"scam")}${col(M.real,M.realL)}</div><p class="hint" style="margin-top:8px">${M.two}</p>`;
}
function memo(){
  const open=!!S.memo,M=T_().memo;
  return `<div class="card memo"><div class="row" style="justify-content:space-between"><div><h2 class="sec-h" style="margin:0">${M.title}</h2><div class="tagline">${M.spotted(spotted(),SIGN_ROWS)}</div></div>${btn("memo","",open?M.close:M.open,"ghost")}</div>${open?memoBody():""}</div>`;
}
function coach(){
  const T=T_(),M=T.memo;
  if(S.week!==1||S.coachDone) return "";
  return `<div class="card coach"><h2 class="sec-h">${M.what}</h2><p>${M.intro}</p>
    <ul class="req" style="margin-top:8px">${M.whatL.slice(0,2).map(x=>`<li>${x}</li>`).join("")}</ul>
    <p class="hint" style="margin-top:8px">${M.coachNotes}</p><div class="acts">${btn("coachOk","",T.ui.modal.ok)}</div></div>`;
}
function vacTab(){
  const U=T_().ui.vac;
  return memo()+coach()+`<div class="stack" style="margin-top:12px">${S.vacancies.length?S.vacancies.map(vacCard).join(""):`<p class="hint">${U.none}</p>`}</div>`;
}
function tlLabel(x){ const L=T_().ui.tl; if(x.startsWith("stage:")) return T_().stages[x.slice(6)].name.toLowerCase(); return L[x]||x; }
function inboxTab(){
  const T=T_(),U=T.ui.inbox,e=S.energy;
  const open=S.inbox.filter(m=>!m.done&&["invite","test","scam","offer"].includes(m.type));
  const action=open.map(m=>{
    const a=appById(m.app); let acts="";
    if(m.type==="invite"){ const k=a.stages[m.stage||0]; acts=`<span class="hint">${U.stageOf((m.stage||0)+1,a.stages.length,T.stages[k].name)}</span>`+btn("interview",m.id,`${U.go} <span class="cost">${COST.interview}</span>`,"pri",e<COST.interview); }
    if(m.type==="test") acts=btn("testDo",m.id,`${U.doTest} <span class="cost">${COST.test}</span>`,"pri",e<COST.test)+btn("testNo",m.id,U.refuse);
    if(m.type==="scam") acts=btn("scamPay",m.id,U.pay,"warn")+btn("scamNo",m.id,U.noPay);
    if(m.type==="offer") acts=btn("offer",m.id,U.openOffer,"pri");
    return `<article class="card msg unread"><div class="from"><span>${esc(a.v.company)} · ${esc(a.v.title)}</span><span class="mono">${U.wk(m.week)}</span></div>
      <div>${esc(g(m.text))}</div><div class="acts">${acts}</div></article>`;
  }).join("");
  const golden=S.inbox.filter(m=>m.gold).map(m=>`<article class="card msg"><span class="gold">${U.rare}</span><div>${esc(m.text)}</div></article>`).join("");
  /* ordinary rejections: one folded card, newest first; it stays open across re-renders */
  const rej=S.inbox.filter(m=>m.type==="reject"&&!m.gold);
  const rejects=rej.length?`<details class="card rejects"${S.rejOpen?" open":""}><summary class="sec-h">${U.rejects(rej.length,rej.filter(m=>m.week===S.week).length)}</summary>
    <div class="rlist">${rej.map(m=>{ const a=appById(m.app);
      return `<div class="msg"><div class="from"><span>${esc(a.v.company)} · ${esc(a.v.title)}</span><span class="mono">${U.wk(m.week)}</span></div><div>${esc(g(m.text))}</div></div>`; }).join("")}</div></details>`:"";
  const list=S.apps.slice().reverse().map(a=>`<div class="slot" style="grid-template-columns:minmax(0,1fr)"><div class="tx">
      <div>${esc(a.v.title)} · <span class="co">${esc(a.v.company)}</span></div>
      <div class="tl">${a.tl.map((x,i)=>`<span class="${i===a.tl.length-1?"last":""}">${tlLabel(x[1])} (${U.wk(x[0])})</span>`).join("")}${a.tl.length===1&&S.week>a.week?`<span class="last">${U.notViewed}</span>`:""}</div>
    </div></div>`).join("");
  return `<div class="stack">${action}${golden}${rejects}
    <div class="card"><h2 class="sec-h">${U.apps(S.apps.length)}</h2>${list||`<p class="hint">${U.empty}</p>`}</div></div>`;
}
function headline(){
  const T=T_(),U=T.ui.resume,P=PROF_META[S.char.prof],pname=T.prof[S.char.prof].name;
  const mainTag=CARD_META[S.resume.slots.find(id=>P.cards.includes(id))||P.start].tags[0];
  return {title:pname,strong:U.hlStrongText(pname,T.years(S.char.years),tagName(mainTag)),any:U.hlAnyText}[S.profile.headline];
}
function resumeEditor(){
  const T=T_(),U=T.ui.resume,P=PROF_META[S.char.prof],slots=S.resume.slots,pool=[...P.cards,...COMMON,...(S.extra||[])].filter(id=>!slots.includes(id));
  const line=id=>{ const c=CARD_META[id],tags=c.tags.filter(t=>t!=="edu").map(tagName).join(", "),strong=S.unlocked[id]&&T.cards[id].s;
    return `<div class="${c.lie?"lie":strong?"strong":""}">${esc(cardText(id))}</div><div class="tagline">${c.lie?U.lieTag:""}${strong?U.strongTag:""}${tags||U.generic}</div>`; };
  /* rows drag to reorder (the arrows stay for keyboard and touch); with five lines, a new one is swapped in */
  const sw=S.swapIn&&!slots.includes(S.swapIn)?S.swapIn:null;
  const rows=slots.map((id,i)=>`<div class="slot" draggable="true" data-drag="${i}"><span class="n">${i+1}</span><div class="tx">${line(id)}</div>
    ${sw?`<div class="ctl">${btn("swapTo",i,U.putHere)}</div></div>`:`<div class="ctl"><button class="ib" data-act="up" data-arg="${i}" aria-label="${U.up}"${i===0?" disabled":""}>${ICON.up}</button><button class="ib" data-act="down" data-arg="${i}" aria-label="${U.down}"${i===slots.length-1?" disabled":""}>${ICON.down}</button><button class="ib" data-act="rm" data-arg="${i}" aria-label="${U.remove}">${ICON.cross}</button></div></div>`}`).join("");
  const poolRows=pool.map(id=>`<div class="slot"><span class="n">+</span><div class="tx">${line(id)}</div><div class="ctl">${slots.length<5?btn("add",id,U.add):btn("swapPick",id,U.swap,sw===id?"pri":"")}</div></div>`).join("");
  const seg=(act,cur,opts)=>`<div class="seg" role="group">${opts.map(([k,l])=>`<button data-act="${act}" data-arg="${k}" aria-pressed="${cur===k}">${l}</button>`).join("")}</div>`;
  const inSearch=S.screen==="week",pf=T.pf[S.char.prof];
  const pfHtml=S.profile.portfolio?`<span class="strong">${U.pfHave(pf)}</span>`
    :inSearch?btn("portfolio","",`${U.pfBuild(pf)} <span class="cost">${COST.portfolio}</span>`,"",S.energy<COST.portfolio):`<span class="hint">${U.pfLater(COST.portfolio)}</span>`;
  const pm=S.profile.mode;
  const profile=`<div class="card"><h2 class="sec-h">${U.profile}</h2><div class="pgrid">
    <div class="pl">${U.headline}</div><div>${seg("hl",S.profile.headline,[["title",U.hlTitle],["strong",U.hlStrong],["any",U.hlAny]])}<div class="hint">«${esc(headline())}»</div></div>
    <div class="pl">${U.photo}</div><div>${seg("photo",S.profile.photo?"1":"0",[["1",U.withPhoto],["0",U.noPhoto]])}<div class="hint">${tr(C().photo.hint)}</div></div>
    <div class="pl">${U.columns}</div><div>${seg("fmt",S.resume.twoCol?"2":"1",[["1",U.one],["2",U.two]])}<div class="hint">${S.resume.twoCol?U.twoHint:U.oneHint}</div></div>
    <div class="pl">${U.city}</div><div>${seg("reloc",S.profile.reloc?"1":"0",[["0",U.onlyCity(cityName(S.char.city))],["1",U.ready]])}<div class="hint">${U.cityHint}</div></div>
    <div class="pl">${U.modeL}</div><div>${seg("mode",pm,[["any",U.mAny],["office",U.mOffice],["hybrid",U.mHybrid],["remote",U.mRemote]])}<div class="hint">${pm==="remote"?U.modeRemote:pm==="any"?U.modeAny:U.modeMatch} ${U.dream(T.want[S.char.want])}</div></div>
    <div class="pl">${U.eng}</div><div><b class="mono">${C().eng?S.char.eng:U.native}</b><div class="hint">${C().eng?U.engHint:""}</div></div>
    <div class="pl">${U.portfolio}</div><div>${pfHtml}</div>
  </div></div>`;
  return ff(`<div class="stack">
    ${profile}
    <div class="card"><h2 class="sec-h">${U.title(slots.length)}</h2>
      ${sw?`<div class="swapbar"><span>${esc(U.pickSlot(cardText(sw).slice(0,48)))}</span>${btn("swapCancel","",U.cancel,"ghost")}</div>`:""}
      ${rows||`<p class="hint">${U.empty}</p>`}</div>
    <div class="card"><h2 class="sec-h">${U.canAdd}</h2>${poolRows}</div>
  </div>`);
}
function askCard(){
  const U=T_().ui.ask;
  const ask=["low","mkt","high"].map(k=>`<button data-act="ask" data-arg="${k}" aria-pressed="${S.ask===k}">${U[k]}</button>`).join("");
  return `<div class="card"><h2 class="sec-h">${U.title}</h2><div class="row"><div class="seg" role="group" aria-label="${U.title}">${ask}</div><span class="mono">${money(askVal())}</span></div>
    <p class="hint" style="margin-top:8px">${U.hint(money(S.char.prev))}</p></div>`;
}
/* the CV as a recruiter meets it in seven seconds, with how many choices work for you;
   the reasons stay folded, so the player looks before reading the answers */
function eyes(){
  const T=T_(),E=T.ui.eyes,U=T.ui.check,items=checkItems(),ok=items.filter(x=>x[0]).length,n=items.length;
  const me={kind:"you",name:charName(),fem:S.char.fem,title:headline(),years:S.char.years,salary:askVal(),twoCol:S.resume.twoCol,broke:false,
    city:S.char.city,reloc:S.profile.reloc,remoteOnly:S.profile.mode==="remote",eng:S.char.eng,notice:2,lines:S.resume.slots.map(id=>({t:cardText(id)}))};
  const lvl=ok/n>=0.75?"good":ok/n>=0.45?"mid":"low";
  return ff(`<div class="card eyes"><div class="row" style="justify-content:space-between"><h2 class="sec-h" style="margin:0">${E.title}</h2>
      <span class="meter ${lvl}" role="img" aria-label="${esc(E.score(ok,n))}" title="${esc(E.score(ok,n))}">${"<i></i>".repeat(ok)}${"<i class=\"off\"></i>".repeat(n-ok)}</span></div>
    <p class="hint" style="margin:6px 0 10px">${E.hint}</p>
    ${cvView(me,S.eyesOpen?{fold:E.fold,foldAct:"eyesMore",less:E.less}:{peek:true,peekAct:"eyesMore"})}
    <details class="why"${S.whyOpen?" open":""}><summary>${E.why} · ${E.score(ok,n)}</summary>
      <ul class="req">${items.map(([g,t])=>`<li class="${g?"hit":"miss"}">${t}</li>`).join("")}</ul><p class="hint" style="margin-top:8px">${U.hint}</p></details></div>`);
}
function checkItems(){
  const pr=S.profile,ph=C().photo,U=T_().ui.check,items=[];
  const it=(ok,t)=>items.push([ok,t]);
  it(pr.headline==="strong",pr.headline==="any"?U.hlAny:pr.headline==="title"?U.hlTitle:U.hlStrong);
  const first=CARD_META[S.resume.slots[0]];
  it(!first||first.base==null,first&&first.base!=null?U.firstBad(cardText(S.resume.slots[0])):U.firstOk);
  it(!S.resume.twoCol,S.resume.twoCol?U.twoBad:U.oneOk);
  const photoBad=(pr.photo&&ph.with<1)||(!pr.photo&&ph.without<1);
  it(!photoBad,photoBad?tr(ph.hint):U.photoOk);
  it(pr.mode!=="remote",pr.mode==="remote"?U.modeRemote:U.modeOk(T_().ui.mode[pr.mode]));
  it(pr.reloc,pr.reloc?U.relocOk:U.relocNo(cityName(S.char.city)));
  it(pr.portfolio,pr.portfolio?U.pfOk:U.pfNo(COST.portfolio));
  return items;
}
function buildScreen(){
  const U=T_().ui.build;
  return header()+`<main class="wrap wide stack" style="padding-block:20px 40px">
    <h1 class="h2">${U.title}</h1>
    <p class="hint">${ff(U.hint)}</p>
    <div class="bgrid"><aside class="bside">${eyes()}</aside><div class="bmain stack">
      ${lastTime()}
      ${resumeEditor()}
      ${askCard()}
    </div></div>
  </main>
  <div class="weekbar buildbar"><div class="wrap wide">${btn("start","",S.attempt===2?U.again:U.start,"pri",S.resume.slots.length===0)}</div></div>`;
}
function weekScreen(){
  const T=T_(),U=T.ui.week,pend=S.inbox.filter(m=>!m.done&&["invite","test","scam","offer"].includes(m.type)).length;
  const tabs=[["vac",`${U.tabVac} <span class="mono">${S.vacancies.length}</span>`],["inbox",`${U.tabInbox}${pend?`<span class="badge">${pend}</span>`:""}`],["cv",U.tabCv]];
  const body=S.tab==="vac"?vacTab():S.tab==="inbox"?inboxTab():eyes()+`<div style="margin-top:12px"></div>`+resumeEditor()+`<div style="margin-top:12px">${askCard()}</div>`;
  const fl=S.flash; S.flash=null;
  /* while a dialog is open the page behind it is inert: no clicks, no Tab stops */
  return `<div style="display:contents"${S.modal?" inert":""}>`+header()+statusBar()+`<main class="wrap">
    <h1 class="sr">${T.ui.status.week} ${S.week}</h1>
    <div class="modline">${T.ui.marketOfDay}: <b>${esc(T.mods[S.mod].name)}</b></div>
    <div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab" role="tab" id="tab-${k}" aria-controls="panel" aria-selected="${S.tab===k}" tabindex="${S.tab===k?0:-1}" data-act="tab" data-arg="${k}">${l}</button>`).join("")}</div>
    <div id="panel" role="tabpanel" aria-labelledby="tab-${S.tab}">${body}</div></main>
    <div class="weekbar"><div class="wrap">
      <span class="grow" aria-live="polite">${fl?`<span class="stamp ${fl.right?"good":""}">${fl.label}</span> `:""}${esc(g(S.toast||U.defaultToast))}</span>
      ${btn("end","",U.end,"pri")}
    </div></div></div>`+modal();
}
function modal(){
  const M=S.modal; if(!M) return "";
  const T=T_(),U=T.ui.modal; let inner="";
  if(M.type==="interview"){
    const q=M.qs[M.i];
    inner=`<div class="sec-h">${U.stageHdr(M.st+1,M.total,T.stages[M.key].name,esc(M.company))}</div><p class="hint">${U.who(esc(M.who),M.i+1,M.qs.length)}</p>
      <div class="q">${esc(g(q.t))}</div><div class="opts">${(M.order&&M.order[M.i]||q.o.map((_,k)=>k)).map(k=>btn("answer",k,esc(g(q.o[k][0])))).join("")}</div>`;
  } else if(M.type==="done"){
    inner=`<div class="sec-h">${esc(M.stage||"")}</div><div class="q">${U.thanks}</div><p class="hint">${M.last?U.lastStage:U.nextStage}</p><div class="acts">${btn("close","",U.wait,"pri")}</div>`;
  } else if(M.type==="offer"){
    const m=S.inbox.find(x=>x.id===M.mid),app=appById(m.app),diff=Math.round((app.salary/S.char.prev-1)*100);
    inner=`<div class="sec-h">${U.offerHdr(esc(app.v.company))}</div>
      <div class="q">${esc(app.v.title)}: ${money(app.salary)}</div>
      <p class="hint">${U.formatLine(T.ui.mode[app.v.where],T.want[S.char.want],app.v.where===S.char.want)}</p>
      <p class="hint">${U.prevLine(money(S.char.prev),diff,M.result==="ok",weeks(S.cushion))}</p>
      <div class="acts">${btn("accept","",U.accept,"pri")}${app.haggled?"":btn("haggle","",U.haggle)}${btn("decline","",U.decline)}</div>`;
  } else if(M.type==="week"){
    const W=T.ui.week,ST=T.ui.status,pri=k=>k==="offer"?0:k.startsWith("stage:")||k==="scam"?1:k==="test"?2:k==="viewed"?3:4;
    const row=(id,k)=>{ const a=appById(id); return `<li><span class="stamp ${k==="viewed"?"n":k==="reject"||k==="frozen"?"":"good"}">${tlLabel(k)}</span><span>${esc(a.v.company)} · ${esc(a.v.title)}</span></li>`; };
    const gone=mid=>{ const m=S.inbox.find(x=>x.id===mid),a=appById(m.app); return `<li class="gone">${esc(a.v.company)} · ${esc(a.v.title)}: ${esc(m.note)}</li>`; };
    const rows=M.items.slice().sort((a,b)=>pri(a[1])-pri(b[1])).map(x=>row(...x)).concat(M.expired.map(gone)).join("");
    const pend=S.inbox.some(m=>!m.done&&["invite","test","scam","offer"].includes(m.type));
    inner=`<div class="sec-h ${S.cushion<=2?"lie":""}">${ST.cushion}: ${weeks(S.cushion)} ${ST.wk}</div><div class="q">${W.sumTitle(M.w)}</div>
      ${rows?`<ul class="wsum">${rows}</ul>`:`<p style="margin-bottom:12px">${W.sumNone}</p>`}
      <p class="hint">${W.sumWaiting(M.waiting)} · ${W.sumFresh(M.fresh)}</p>
      <div class="acts">${pend?btn("weekGo","inbox",W.toInbox,"pri")+btn("weekGo","vac",W.toJobs):btn("weekGo","vac",W.toJobs,"pri")}</div>`;
  } else if(M.type==="withdrawn"){
    inner=`<div class="q">${U.withdrawn}</div><p class="hint">${U.withdrawnHint}</p><div class="acts">${btn("close","",U.ok,"pri")}</div>`;
  }
  return `<div class="ov" role="dialog" aria-modal="true" aria-labelledby="dlg-q"><div class="card">${g(inner).replace('class="q"','class="q" id="dlg-q"')}</div></div>`;
}
function tally(apps){ const t={}; for(const a of apps) t[a.truth]=(t[a.truth]||0)+1; return t; }
function tipFor(apps){
  const t=tally(apps),n=apps.length||1,weakLow=apps.filter(a=>a.truth==="weak"&&a.bestIdx>=2).length,U=T_().tips;
  const wrongApps=apps.filter(a=>a.v.reality!=="real").length,ph=C().photo;
  if(!apps.length) return U.none;
  if((t.aibot||0)>=2) return U.aibot(t.aibot);
  if((t.nocover||0)>=2) return U.nocover(t.nocover);
  if((t.mode||0)>=2) return U.mode(t.mode);
  if((t.city||0)>=2) return U.city(t.city);
  if((t.lang||0)>=2) return U.lang(t.lang);
  if(ph.with<1&&apps.every(a=>a.prof.photo)&&(t.weak||0)>=2) return tr(ph.hint);
  if(ph.without<1&&apps.every(a=>!a.prof.photo)&&(t.weak||0)>=2) return tr(ph.hint);
  if(apps.every(a=>a.prof.headline==="any")) return U.anyHl;
  if(t.lie) return U.lie;
  if(wrongApps>=n*0.5) return U.fakes(wrongApps,apps.length);
  if((t.broke||0)>=2) return U.broke(t.broke);
  if((t.salary||0)>=2) return U.salary(t.salary);
  if(weakLow>=2) return U.weakLow;
  if((t.unopened||0)>=n*0.4) return U.unopened(t.unopened);
  if((t.skill||0)>=2) return U.skill(t.skill);
  if((t.exp||0)>=2) return U.exp(t.exp);
  if((t.weak||0)>=2) return U.weak;
  return U.fine;
}
function causeGroups(apps){
  const by={}; for(const a of apps) (by[a.truth]=by[a.truth]||[]).push(a);
  return Object.entries(by).sort((x,y)=>(TRUTH_GOOD[x[0]]?1:0)-(TRUTH_GOOD[y[0]]?1:0)||y[1].length-x[1].length);
}
function causeTip(k,list,apps){
  const U=T_().tips,n=list.length;
  if(["ghost","internal","scam","scamPaid"].includes(k)) return U.fakes(n,apps.length);
  if(k==="weak") return list.some(a=>a.bestIdx>=2)?U.weakLow:U.weak;
  if(k==="lie") return U.lie;
  return typeof U[k]==="function"?U[k](n):"";
}
/* on the second attempt the CV builder opens with what sank the first search */
function lastTime(){
  const r=S.attempt===2&&S.rounds&&S.rounds[0]; if(!r) return "";
  const T=T_(),items=causeGroups(r.apps).filter(([k])=>!TRUTH_GOOD[k]).map(([k,list])=>[k,causeTip(k,list,r.apps)]).filter(x=>x[1]).slice(0,3);
  if(!items.length) return "";
  return `<div class="card last"><h2 class="sec-h">${T.ui.build.lastTime}</h2><ul class="lt">${items.map(([k,tip])=>`<li><span class="stamp">${T.truth[k]}</span><span>${esc(g(tip))}</span></li>`).join("")}</ul></div>`;
}
function xrayScreen(){
  const T=T_(),U=T.ui.xray,apps=S.apps,o=S.outcome,t=tally(apps);
  const out=o.type==="job"?U.outJob(esc(o.title),esc(o.company),money(o.salary)):U.outPlanB(planBJob());
  const chips=Object.entries(t).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<span class="chip">${T.truth[k].toLowerCase()} · ${n}</span>`).join("");
  const appRight=apps.filter(a=>a.v.reality==="real").length,skRight=S.skips.filter(s=>s.right).length,total=apps.length+S.skips.length;
  /* applications grouped by what stopped them, biggest cause first; each group carries its lesson unless it's the headline one */
  const head=tipFor(apps);
  const rows=causeGroups(apps).map(([k,list])=>{ const tip=causeTip(k,list,apps);
    return `<div class="xgrp"><div class="xgh"><span class="stamp ${TRUTH_GOOD[k]?"good":""}">${T.truth[k]}</span><b class="num">× ${list.length}</b></div>
      ${tip&&tip!==head?`<p class="xtip">${esc(g(tip))}</p>`:""}
      ${list.map(a=>`<div class="xrow"><div class="what">${esc(a.v.title)} · ${esc(a.v.company)}<div class="saw">${U.saw(a.week,T.method[a.method],T.real[a.v.reality].toLowerCase())}</div></div>
        <div class="det">${esc(g(a.detail))}${a.v.reality!=="real"&&tells(a.v).length?`<br>${U.could(esc(tells(a.v).join(", ")))}`:""}</div></div>`).join("")}</div>`; }).join("");
  const skips=S.skips.map(s=>`<div class="xrow"><div class="what">${esc(s.v.title)} · ${esc(s.v.company)}<div class="saw">${U.skipSaw(s.week)}</div></div>
      <span class="stamp ${s.right?"good":""}">${T.real[s.v.reality]}</span>${s.right&&tells(s.v).length?`<div class="det">${U.signs(esc(tells(s.v).join(", ")))}</div>`:""}</div>`).join("");
  return `<div class="xray"><div class="wrap">
    <div class="hint mono">${esc(tr(C().platform))} · ${T.ui.run} #${S.seed}</div>
    <h1>${U.title(S.attempt===2)}</h1>
    <p>${out} ${U.summary(S.week,apps.length)}</p>
    ${MS().search?`<p class="hint">${g(linked(T.facts.search(S.week,num(MS().search.median),num(MS().search.long),mark(`${MS().search.src}, ${month(MS().search.month)}`)),MS().search.url))}</p>`:""}
    ${factCard()}
    <div class="chips">${chips||`<span class="chip">${U.noApps}</span>`}</div>
    <div class="film"><h2 class="sec-h muted">${U.instinct}</h2><table class="mtable">
      <tr><td>${U.appsReal}</td><td>${U.of(appRight,apps.length)}</td></tr>
      <tr><td>${U.rightSkips}</td><td>${U.of(skRight,S.skips.length)}</td></tr>
      <tr><td>${U.allRight}</td><td>${U.of(appRight+skRight,total)}</td></tr></table></div>
    <div class="tip">${esc(g(head))}</div>
    ${rows?`<div class="film"><h2 class="sec-h muted">${U.appsTitle}</h2>${g(rows)}</div>`:""}
    ${skips?`<div class="film"><h2 class="sec-h muted">${U.skipsTitle}</h2>${skips}</div>`:""}
    <div class="acts">${o.type==="planB"&&S.attempt===1?btn("toPlanB","",U.nextYear,"pri")+btn("toEpitaph","",U.endHere):btn("toEpitaph","",U.toEpitaph,"pri")}</div>
  </div></div>`;
}
function planBScreen(){
  const T=T_(),U=T.ui.planb,job=planBJob();
  const cards=COURSES.filter(c=>c.id!=="eng"||C().eng).map(c=>{ const CT=T.courses[c.id],name=CT.name.replace("{P}",T.prof[S.char.prof].name),owned=S.bought[c.id];
    return `<article class="card"><div class="row" style="justify-content:space-between"><h3>${esc(name)}</h3><span class="mono">${c.price?U.price(weeks(c.price)):U.free}</span></div>
      <p class="hint" style="margin-top:6px">${esc(CT.text)}</p>
      ${owned?`<p class="lead" style="margin-top:8px">${esc(g(owned))}</p>`:`<div class="acts">${btn("buy",c.id,c.price?U.pay:U.enroll,"",S.savings<c.price)}</div>`}</article>`; }).join("");
  return header()+`<main class="wrap stack" style="padding-block:8px 40px">
    ${actCard(3,U.title,g(U.text(job,weeks(S.savings))))}
    <h2 class="sec-h">${U.learning}</h2>
    <div class="stack">${cards}</div>
    <p class="hint">${U.next(weeks(Math.max(2,S.savings)))}</p>
    <div class="acts">${btn("retry","",U.retry,"pri")}${btn("toEpitaph","",g(U.stay(job)))}</div>
  </main>`;
}
const allApps=()=>(S.rounds||[]).flatMap(r=>r.apps);
const allSkips=()=>(S.rounds||[]).flatMap(r=>r.skips);
function epitaph(){
  const c=S.char,o=S.outcome,T=T_(),U=T.ui.ep,st=shiftStats(),d=st.youDec;
  const AA=allApps(),SK=allSkips(),weeksAll=S.rounds.reduce((n,r)=>n+r.weeks,0);
  const right=AA.filter(a=>a.v.reality==="real").length+SK.filter(s=>s.right).length,total=AA.length+SK.length;
  const roleOf=r=>r.outcome.type==="job"?r.outcome.title.toLowerCase():planBJob();
  const bought=Object.keys(S.bought||{}).filter(k=>k!=="web").length;
  const role=S.rounds.map((r,i)=>(i===1&&bought?U.courses:"")+roleOf(r)).join(" → ");
  const rec=!d?U.recNone:d.pass?U.recPass(T.secs(d.ms)):U.recRej(T.secs(d.ms));
  const end=o.type==="planB"?U.endPlanB:S.attempt===2?U.endRetry:o.salary>=c.prev?U.endGood:U.endLow;
  return {line1:U.line1(charName(),T.age(c.age)),line2:`${T.prof[c.prof].name} → ${role}`,rec:g(rec),
    facts:U.facts(AA.length,weeksAll,right,total,S.flags.tests),end:g(end)};
}
function achievements(){
  const a=[],t=tally(allApps()),st=shiftStats(),SK=allSkips(),A=T_().ach;
  if(st.youDec&&!st.youDec.pass) a.push(A.self);
  if(st.neph&&st.neph.pass) a.push(A.own);
  if((t.ghost||0)>=2) a.push(A.ghosts);
  if(SK.length>=5&&SK.every(s=>s.right)) a.push(A.nose);
  if(S.attempt===2&&S.outcome.type==="job") a.push(A.second);
  if(S.bought&&S.bought.scam) a.push(A.course);
  if(S.flags.scamPaid) a.push(A.investor);
  if(S.flags.tests>=2) a.push(A.free);
  if(S.flags.golden) a.push(A.golden);
  if(S.flags.negotiated) a.push(A.haggle);
  return a;
}
function points(){
  const st=shiftStats(),o=S.outcome,AA=allApps(),SK=allSkips();
  const right=AA.filter(a=>a.v.reality==="real").length+SK.filter(s=>s.right).length;
  const wrong=AA.length+SK.length-right;
  const win=S.attempt===2?[60,40]:[100,60];
  let p=st.fwdGood*10-st.fwdBad*5+right*5-wrong*3+(o.type==="job"?(o.salary>=S.char.prev?win[0]:win[1]):0)+Math.round(Math.max(0,S.cushion))*10;
  if(st.youDec&&st.youDec.pass) p+=15;
  if(o.type==="job"&&o.where===S.char.want) p+=30;
  return Math.max(0,p);
}
function weekGrid(){ return (S.rounds||[]).map(r=>{ let s=""; for(let w=1;w<=r.weeks;w++) s+=r.wk[w]===2?"★":r.wk[w]===1?"●":"○"; return s; }).join(" · "); }
/* the daily record keeps the share text in every language, so switching language later still shows it right */
function shareAll(){ const keep=S.lang,o={}; for(const l of Object.keys(LANG)){ S.lang=l; o[l]=shareText(); } S.lang=keep; return o; }
function shareText(){
  const e=epitaph(),T=T_(),U=T.ui.ep;
  return `${S.daily?U.shareDaily(S.day):U.shareFree}\n${tr(C().name)} · ${T.ui.marketOfDay}: ${T.mods[S.mod].name}\n${weekGrid()} ${T.ui.points(points())}\n${e.rec}\n${e.end}`;
}
function epitaphScreen(){
  const e=epitaph(),ach=achievements(),pts=points(),T=T_(),U=T.ui.ep;
  if(S.daily&&!S.saved){ S.saved=true; saveDaily({date:dayKey(today()),day:S.day,points:pts,share:shareAll()}); }
  return header()+`<main class="wrap stack" style="padding-block:28px 40px">
    <section class="stone"><span class="rip">${U.rip}</span>
      <h1 class="ep">${esc(e.line1)}<br>${esc(e.line2)}</h1>
      <div class="ep">${esc(e.rec)}</div>
      <div class="facts">${esc(e.facts)}</div>
      <div class="ep">${esc(e.end)}</div></section>
    <div class="card"><h2 class="sec-h">${S.daily?U.dailyHdr(S.day):U.freeHdr} · ${esc(T.mods[S.mod].name)}</h2><div class="big">${T.ui.points(pts)}</div>
      <p class="hint mono">${weekGrid()}</p><p class="hint">${U.gridLegend}</p></div>
    ${ach.length?`<div><h2 class="sec-h">${U.ach}</h2><div class="ach">${ach.map(x=>`<span>${x}</span>`).join("")}</div></div>`:""}
    <div class="card"><h2 class="sec-h">${U.share}</h2><textarea class="share" id="share" readonly>${esc(shareText())}</textarea>
      <div class="acts">${btn("copy","",U.copy)}</div></div>
    <div class="acts">${btn("again","",S.daily?T.ui.freePlay:U.newLife,"pri")}</div>
    ${S.daily?`<p class="hint">${U.tomorrow}</p>`:""}
  </main>`;
}

/* ---------- the run in progress survives a reload or a phone dropping the tab ---------- */
const RSTORE="oneof250.run";
/* JSON with shared objects kept shared: an application and the vacancy it points to stay one object */
function pack(x){
  const ids=new Map(); let n=0;
  const enc=v=>{
    if(v===null||typeof v!=="object") return v;
    if(ids.has(v)) return {$r:ids.get(v)};
    const id=++n; ids.set(v,id);
    if(Array.isArray(v)) return {$a:id,v:v.map(enc)};
    const o={$o:id}; for(const k in v) o[k]=enc(v[k]); return o;
  };
  return enc(x);
}
function unpack(x){
  const ids=new Map();
  const dec=v=>{
    if(v===null||typeof v!=="object") return v;
    if("$r" in v) return ids.get(v.$r);
    if("$a" in v){ const a=[]; ids.set(v.$a,a); for(const e of v.v) a.push(dec(e)); return a; }
    const o={}; ids.set(v.$o,o); for(const k in v) if(k!=="$o") o[k]=dec(v[k]); return o;
  };
  return dec(x);
}
function saveRun(){
  if(typeof localStorage==="undefined"||!S) return;
  try{ if(S.shift) S.shift.left=shiftLeft(S.shift); localStorage.setItem(RSTORE,JSON.stringify({v:1,day:dayKey(today()),S:pack(S)})); }catch(e){}
}
function loadRun(){
  if(typeof localStorage==="undefined") return null;
  try{
    const x=JSON.parse(localStorage.getItem(RSTORE)||"null"); if(!x||x.v!==1) return null;
    const s=unpack(x.S);
    /* yesterday's daily run is over: today has its own */
    return s&&s.lang&&s.char&&s.char.country&&!(s.daily&&x.day!==dayKey(today()))?s:null;
  }catch(e){ return null; }
}
let saveT=null;
const saveSoon=()=>{ clearTimeout(saveT); saveT=setTimeout(saveRun,300); };
/* a restored shift waits, paused, for the player; the time left is what it was when the page went away */
function resumeShift(){
  const sh=S.shift; if(S.screen!=="shift"||!sh||sh.over) return;
  sh.paused=!sh.bossMsg; sh.pausedAt=Date.now(); sh.deadline=Date.now()+Math.max(5000,sh.left||0); sh.shownAt=Date.now(); startTimer();
}

/* ---------- render loop ---------- */
const $app=document.getElementById("app");
let lastScreen=null,scrollTarget=null;
function render(){
  document.documentElement.lang=uiLang(); document.title=T_().ui.brand;
  if(S.screen==="shift"&&S.shift) syncClock(S.shift);
  const prev=focusMark();
  const v={lang:langScreen,intro:introScreen,task:taskScreen,act2:act2Screen,planb:planBScreen,shift:shiftScreen,shiftResult:shiftResultScreen,reveal:revealScreen,build:buildScreen,week:weekScreen,xray:xrayScreen,epitaph:epitaphScreen}[S.screen]||introScreen;
  $app.innerHTML=v();
  restoreFocus(prev);
  announce();
  if(scrollTarget){ const el=document.getElementById(scrollTarget); scrollTarget=null;
    const card=el&&el.closest&&el.closest(".card"); if(card){ const r=card.getBoundingClientRect(); if(r.top<0||r.top>innerHeight*0.6) card.scrollIntoView({block:"start"}); } }
  lastScreen=S.screen;
  saveSoon();
}
/* one live region outside #app (which is rebuilt every time) says what changed: energy, savings, the week, the pass count */
let lastSaid=null;
function announce(){
  if(!document.body||!document.body.appendChild) return;
  const T=T_(),U=T.ui.status,parts={};
  if(S.screen==="week"){ parts.week=`${U.week} ${S.week}`; parts.cushion=`${U.cushion}: ${weeks(S.cushion)} ${U.wk}`; parts.energy=`${U.energy}: ${S.energy}/${ENERGY}`; }
  if(S.screen==="shift"&&S.shift) parts.fwd=T.ui.shift.passed(S.shift.dec.filter(d=>d.pass).length,GOAL_FWD);
  const prev=lastSaid&&lastSaid.screen===S.screen?lastSaid.parts:null;
  lastSaid={screen:S.screen,parts};
  if(!prev) return;
  const say=Object.keys(parts).filter(k=>parts[k]!==prev[k]).map(k=>parts[k]).join(". ");
  if(!say) return;
  let el=document.getElementById("sr-status");
  if(!el){ el=document.createElement("div"); el.id="sr-status"; el.className="sr"; el.setAttribute("role","status"); document.body.appendChild(el); }
  el.textContent=say;
}
/* every action rebuilds the page, so keyboard focus is put back by hand:
   into an open dialog, onto a new screen, or onto the same control (or its neighbour if it went away) */
const actBtns=()=>[...$app.querySelectorAll("[data-act]")].filter(b=>!b.disabled&&!b.closest("[inert]"));
function focusMark(){
  if(!$app.contains) return null;
  const a=document.activeElement; if(!a||!$app.contains(a)||!a.dataset||!a.dataset.act) return null;
  return {act:a.dataset.act,arg:a.dataset.arg||"",idx:actBtns().indexOf(a)};
}
function restoreFocus(p){
  if(!$app.querySelector) return;
  const ov=$app.querySelector(".ov");
  if(ov){ const f=ov.querySelector("button:not(:disabled)"); if(f) f.focus({preventScroll:true}); return; }
  if(S.screen!==lastScreen){ const m=$app.querySelector("main,.xray"); if(m){ m.tabIndex=-1; m.focus({preventScroll:true}); } return; }
  if(!p) return;
  const all=actBtns(),el=all.find(b=>b.dataset.act===p.act&&(b.dataset.arg||"")===p.arg)||all[Math.min(p.idx,all.length-1)];
  if(el) el.focus({preventScroll:true});
}
/* ---------- Back moves within the game ----------
   one extra history entry catches the browser's or phone's Back. It is added only from a tap or key press,
   because Chrome skips entries a page adds on its own, so after a Back it returns with the next tap.
   Back goes to the game's step back where there is one, and either way says the run is saved:
   until the player taps again, the next Back leaves */
const canHist=typeof history!=="undefined"&&!!history.pushState;
function arm(){ if(canHist&&!(history.state&&history.state.g)) history.pushState({g:1},""); }
function goBack(){
  const M=S.modal;
  if(M){ if(["done","withdrawn","offer","week"].includes(M.type)){ ACT.close(); return true; } return false; }
  if(S.screen==="lang"&&S.prevScreen){ ACT.langBack(); return true; }
  if(S.screen==="task"){ S.screen="intro"; return true; }
  if(shiftLive()&&!S.shift.paused&&!S.shift.bossMsg){ ACT.pause(); return true; }
  if(S.screen==="build"&&S.swapIn){ ACT.swapCancel(); return true; }
  if(S.screen==="week"&&S.tab!=="vac"){ ACT.tab("vac"); return true; }
  return false;
}
let hintT=null;
function backHint(){
  let el=document.getElementById("backhint");
  if(!el){ el=document.createElement("div"); el.id="backhint"; el.className="backhint"; el.setAttribute("role","status"); document.body.appendChild(el); }
  el.textContent=T_().ui.backLeave; el.hidden=false;
  clearTimeout(hintT); hintT=setTimeout(()=>{ el.hidden=true; },4000);
}
if(window.addEventListener){
  window.addEventListener("popstate",()=>{ if(!S) return; const prev=S.screen; if(goBack()){ if(S.screen!==prev) window.scrollTo(0,0); render(); } backHint(); });
  /* a phone may drop a background tab without warning: pause the shift and save on the way out */
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState!=="hidden") return; if(shiftLive()&&!S.shift.bossMsg&&!S.shift.paused){ ACT.pause(); render(); } saveRun(); });
  window.addEventListener("pagehide",saveRun);
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]"); if(!b||b.disabled) return;
  arm();
  const act=b.dataset.act; if(!ACT[act]) return;
  const prev=S.screen;
  if(act!=="copy"&&act!=="tab") S.toast="";
  ACT[act](b.dataset.arg);
  if(act==="copy") return;
  if(S.screen!==prev) window.scrollTo(0,0);
  render();
});
/* folded parts remember being open across re-renders */
let dragFrom=null;
document.addEventListener("dragstart",e=>{ const r=e.target.closest&&e.target.closest("[data-drag]"); if(!r) return; dragFrom=+r.dataset.drag; r.classList.add("dragging"); e.dataTransfer.effectAllowed="move"; e.dataTransfer.setData("text/plain",String(dragFrom)); });
document.addEventListener("dragover",e=>{ if(dragFrom==null) return; const r=e.target.closest("[data-drag]"); if(!r) return; e.preventDefault(); $app.querySelectorAll(".drop").forEach(x=>x.classList.remove("drop")); r.classList.add("drop"); });
document.addEventListener("drop",e=>{ if(dragFrom==null) return; const r=e.target.closest("[data-drag]"); if(r){ e.preventDefault(); const s=S.resume.slots,to=+r.dataset.drag; if(to!==dragFrom){ s.splice(to,0,s.splice(dragFrom,1)[0]); } } dragFrom=null; render(); });
document.addEventListener("dragend",()=>{ if(dragFrom!=null){ dragFrom=null; render(); } });
document.addEventListener("toggle",e=>{ const c=S&&e.target.classList; if(!c) return; if(c.contains("rejects")) S.rejOpen=e.target.open; if(c.contains("why")) S.whyOpen=e.target.open; },true);
/* swipe on the shift: the CV follows the finger and shows the stamp it would get. Only a clearly sideways
   move counts, past a quarter of the card's width; anything else is a scroll, and a short swipe snaps back */
let sw=null;
document.addEventListener("touchstart",e=>{
  arm();
  const el=e.target.closest&&e.target.closest(".stage>.cv");
  if(!el||!shiftLive()||S.shift.bossMsg||S.shift.paused||e.touches.length>1){ sw=null; return; }
  sw={el,x:e.touches[0].clientX,y:e.touches[0].clientY,dx:0,dir:null,w:el.offsetWidth};
},{passive:true});
document.addEventListener("touchmove",e=>{
  if(!sw) return;
  const t=e.touches[0],dx=t.clientX-sw.x,dy=t.clientY-sw.y;
  if(!sw.dir){ if(Math.abs(dx)<10&&Math.abs(dy)<10) return; sw.dir=Math.abs(dx)>Math.abs(dy)*1.5?"x":"y"; }
  if(sw.dir!=="x") return;
  const U=T_().ui.shift,far=Math.abs(dx)>sw.w/4;
  sw.dx=dx; sw.el.classList.add("drag");
  sw.el.style.transform=`translateX(${dx}px) rotate(${dx/24}deg)`;
  sw.el.dataset.sw=far?(dx>0?"pass":"rej"):"";
  sw.el.dataset.swl=far?(dx>0?U.stampPass:U.stampRej):"";
},{passive:true});
function swipeEnd(){
  const s=sw; sw=null; if(!s||s.dir!=="x") return;
  if(Math.abs(s.dx)>s.w/4&&shiftLive()){ ACT[s.dx>0?"pass":"rej"](); render(); return; }
  s.el.classList.remove("drag"); s.el.style.transform=""; delete s.el.dataset.sw; delete s.el.dataset.swl;
}
document.addEventListener("touchend",swipeEnd);
document.addEventListener("touchcancel",()=>{ if(sw) sw.dx=0; swipeEnd(); });
const TABS=["vac","inbox","cv"];
document.addEventListener("keydown",e=>{
  if(!S) return;
  /* Esc closes the dialogs that have nothing left to answer; an interview has to be finished */
  if(S.modal){ if(e.key==="Escape"&&["done","withdrawn","offer","week"].includes(S.modal.type)){ e.preventDefault(); ACT.close(); render(); } return; }
  const tab=e.target.closest&&e.target.closest('[role="tab"]');
  if(tab){
    const i=TABS.indexOf(tab.dataset.arg),n=TABS.length;
    const j={ArrowRight:(i+1)%n,ArrowLeft:(i+n-1)%n,Home:0,End:n-1}[e.key];
    if(j==null) return;
    e.preventDefault(); ACT.tab(TABS[j]); render(); document.getElementById("tab-"+TABS[j]).focus();
    return;
  }
  if(S.screen!=="shift"||e.repeat) return;
  arm();
  if(S.shift.paused){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); ACT.resume(); render(); } return; }
  if((e.key==="Escape"||e.code==="KeyP")&&!S.shift.bossMsg&&!S.shift.over){ e.preventDefault(); ACT.pause(); render(); return; }
  if(S.shift.bossMsg){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); ACT.bossOk(); render(); } return; }
  if(e.key==="ArrowRight"){ e.preventDefault(); ACT.pass(); render(); }
  else if(e.key==="ArrowLeft"){ e.preventDefault(); ACT.rej(); render(); }
});
function boot(data){
  /* states from before v1.0 have no country or language: start fresh rather than guess */
  const saved=data&&data.S&&data.S.lang&&data.S.char&&data.S.char.country?data.S:loadRun();
  if(saved){ S=saved; resumeShift(); }
  else { if(loadDaily()) newFree(); else newDaily(); if(!loadLang()) S.screen="lang"; }
  render();
}
window.claude?.hot?.snapshot?.(()=>{ if(S&&S.shift) S.shift.left=shiftLeft(S.shift); return {S}; });
window.claude?.hot?.ready?window.claude.hot.ready(boot):boot(window.claude?.hot?.data??{});
