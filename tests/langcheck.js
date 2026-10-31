const fs=require('fs'),path=require('path');
global.document={getElementById:()=>({innerHTML:"",style:{},parentElement:{classList:{toggle(){}}},value:""}),addEventListener:()=>{},documentElement:{}};
global.window={scrollTo(){}};
eval(fs.readFileSync(path.join(__dirname,'../dist/game.js'),'utf8')+`
function shape(o,p){ const out=[]; if(Array.isArray(o)){ out.push(p+"#"+o.length); o.forEach((x,i)=>out.push(...shape(x,p+"["+i+"]"))); }
  else if(o&&typeof o==="object") for(const k of Object.keys(o).sort()) out.push(...shape(o[k],p+"."+k)); else out.push(p+":"+typeof o); return out; }
const ref=new Set(shape(LANG.en,""));
for(const l of Object.keys(LANG)){ const s=shape(LANG[l],""),ss=new Set(s); const d=[...s.filter(x=>!ref.has(x)).map(x=>"+"+x),...[...ref].filter(x=>!ss.has(x)).map(x=>"-"+x)]; console.log(l,"diffs",d.length,d.slice(0,8).join(" | ")); }
// country text coverage per language
for(const l of Object.keys(COUNTRY_TEXT)) { let miss=0; for(const ck of COUNTRY_KEYS){ const K=COUNTRIES[ck]; const chk=x=>{ if(x&&typeof x==="object"&&!Array.isArray(x)&&("en" in x)&&!(l in x)) miss++; };
  [K.name,K.probation,K.photo.hint,...K.cities,...K.perks,...K.insys,...K.planB,...Object.values(K.oform).flat(),...Object.values(K.titles)].forEach(chk); } console.log(l,"country texts missing",miss); }
// real-market numbers: every country has them, every kind has wording, each links to its source, none is older than 12 months
{ const now=new Date(),age=m=>{ const [y,mo]=m.split("-").map(Number); return (now.getFullYear()-y)*12+now.getMonth()+1-mo; };
  const missing=COUNTRY_KEYS.filter(k=>!MARKET_STATS[k]||!MARKET_STATS[k].facts.length);
  const stale=Object.entries(MARKET_STATS).flatMap(([k,M])=>[...M.facts.map(f=>[k+"."+f[0],f[2]]),...(M.search?[[k+".search",M.search.month]]:[])]).filter(x=>age(x[1])>12);
  const kinds=[...new Set(Object.values(MARKET_STATS).flatMap(M=>M.facts.map(f=>f[0])))].filter(k=>typeof LANG.en.facts[k]!=="function");
  const https=u=>typeof u==="string"&&u.startsWith("https://");
  const nolink=[...Object.entries(MARKET_STATS).flatMap(([k,M])=>[...M.facts.filter(f=>!https(f[4])).map(f=>k+"."+f[0]),...(M.search&&!https(M.search.url)?[k+".search"]:[])]),...["appsUrl","glanceUrl"].filter(k=>!https(WORLD_STATS[k]))];
  console.log("market stats missing",missing.length,missing,"stale",stale.length,stale.map(x=>x.join(" ")),"unknown kinds",kinds.length,kinds,"no source link",nolink.length,nolink); }
// render all screens in every language/country
let bad=[],renders=0,errs=[];
function R(){ render(); renders++; const h=$app.innerHTML; if(/undefined|NaN|\\[object|\\{[^}]*\\|[^}]*\\}|\\u0001|\\u0002/.test(h)||S.screen==="xray"&&!/class="src"/.test(h)) bad.push(S.lang+"/"+S.char.country+"/"+S.screen+": "+(h.match(/.{0,50}(undefined|NaN|\\[object|\\{[^}]*\\|[^}]*\\}).{0,30}/)||[""])[0]); }
global.$app=null;
for(const l of LANG_READY) for(let r=0;r<40;r++){ try{
  CUR_LANG=l; newRun((r*7919+l.charCodeAt(0)*13)>>>0,{}); S.screen="lang"; R(); S.screen="intro"; R(); ACT.toTask(); R(); ACT.shiftStart(); stopTimer(); R();
  const sh=S.shift; while(!sh.over&&sh.i<sh.pile.length){ ACT[sh.pile[sh.i].fits?"pass":"rej"](); if(sh.bossMsg){ R(); ACT.bossOk(); } R(); } if(!sh.over) endShift();
  R(); ACT.toReveal(); R(); ACT.toAct2(); R(); ACT.toBuild(); R(); ACT.start(); R(); ACT.memoGo();
  let guard=0; while(S.screen==="week"&&guard++<30){ for(const m of S.inbox){ if(m.done) continue; if(m.type==="invite"&&S.energy>=1){ ACT.interview(m.id); while(S.modal&&S.modal.type==="interview"){ R(); ACT.answer(S.modal.qs[S.modal.i].o.findIndex(o=>o[1]===2)); } R(); S.modal=null; }
      if(m.type==="test"&&S.energy>=3) ACT.testDo(m.id); if(m.type==="scam"){ R(); ACT.scamNo(m.id);} if(m.type==="offer"){ ACT.offer(m.id); R(); if(r%2){ ACT.haggle(); R(); if(S.modal&&S.modal.type==="offer") ACT.accept(); else S.modal=null; } else ACT.accept(); break; } }
    if(S.screen!=="week") break; S.tab="vac"; R(); S.tab="inbox"; R(); S.tab="cv"; R(); S.tab="vac";
    for(const v of S.vacancies.slice()){ if(v.reality!=="real"){ ACT.skip(v.id); R(); } else if(S.energy>=2) ACT.tailor(v.id); else if(S.energy>=0.5) ACT.quick(v.id); }
    ACT.end(); R(); }
  if(S.screen==="week") endSearch({type:"planB"});
  R(); if(S.outcome.type==="planB"){ ACT.toPlanB(); R(); for(const c of ["pro","eng","scam","web"]) ACT.buy(c); R(); ACT.retry(); R(); ACT.start(); startSearch(); R(); endSearch({type:"planB"}); R(); }
  ACT.toEpitaph(); R(); shareText();
}catch(e){ errs.push(l+": "+e.message+" "+String(e.stack).split("\\n")[1]); } }
console.log("renders",renders,"bad",bad.length,[...new Set(bad)].slice(0,10));
console.log("errors",errs.length,errs.slice(0,5));
`);
