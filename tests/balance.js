const fs=require('fs'),path=require('path');
global.document={getElementById:()=>({innerHTML:"",style:{},parentElement:{classList:{toggle(){}}},value:""}),addEventListener:()=>{},documentElement:{}};
global.window={scrollTo(){}};
eval(fs.readFileSync(path.join(__dirname,'../dist/game.js'),'utf8')+`
const bad=[]; let renders=0;
function R(){ render(); renders++; const h=$app.innerHTML; if(/undefined|NaN|\\[object/.test(h)) bad.push(S.lang+"/"+S.char.country+"/"+S.screen+": "+(h.match(/.{0,60}(undefined|NaN|\\[object).{0,40}/)||[""])[0]); }
global.$app=null;
// 1. structure parity
function shape(o,p){ const out=[]; if(Array.isArray(o)) { out.push(p+"#"+o.length); o.forEach((x,i)=>out.push(...shape(x,p+"["+i+"]"))); }
  else if(o&&typeof o==="object") for(const k of Object.keys(o).sort()) out.push(...shape(o[k],p+"."+k)); else out.push(p+":"+typeof o); return out; }
const a=shape(LANG.ru,""),b=shape(LANG.en,""); const sa=new Set(a),sb=new Set(b);
const diff=[...a.filter(x=>!sb.has(x)),...b.filter(x=>!sa.has(x))];
console.log("lang shape diffs:",diff.length, diff.slice(0,12));
// 2. daily parity across languages
function sig(){ return JSON.stringify([S.char,S.mod,S.shift.pile.map(c=>c.kind+c.fits),S.shift.vac.tag]); }
CUR_LANG="ru"; newDaily(); const d1=sig(); CUR_LANG="en"; newDaily(); const d2=sig();
console.log("daily same in ru/en:", d1===d2, "country", S.char.country, "prof", S.char.prof, "mod", S.mod);
// search generation parity
CUR_LANG="ru"; newRun(777,{}); ACT.toTask(); ACT.shiftStart(); stopTimer(); endShift(); ACT.start(); ACT.memoGo(); const v1=S.vacancies.map(v=>v.reality+v.tag+v.cap).join();
CUR_LANG="en"; newRun(777,{}); ACT.toTask(); ACT.shiftStart(); stopTimer(); endShift(); ACT.start(); ACT.memoGo(); const v2=S.vacancies.map(v=>v.reality+v.tag+v.cap).join();
console.log("vacancies same in ru/en:", v1===v2);
// 3. play
function playShift(policy){
  R(); ACT.toTask(); R(); ACT.shiftStart(); stopTimer(); R();
  const sh=S.shift;
  while(!sh.over && sh.i<sh.pile.length){ const c=sh.pile[sh.i];
    const pass=policy==="oracle"?(c.fits||c.kind==="nephew"):c.lines.slice(0,2).some(l=>l.tags.includes(sh.vac.tag))&&!c.broke;
    if(policy==="top2"&&sh.i>24){ endShift(); break; }
    ACT[pass?"pass":"rej"](); if(sh.bossMsg){ R(); ACT.bossOk(); } R(); }
  if(!sh.over) endShift();
  R(); ACT.toReveal(); R(); ACT.toAct2(); R(); ACT.toBuild(); R();
}
function playSearch(policy){
  let guard=0;
  while(S.screen==="week"&&guard++<40){
    for(const m of S.inbox){ if(m.done) continue;
      if(m.type==="invite"&&S.energy>=1){ ACT.interview(m.id); while(S.modal&&S.modal.type==="interview"){ R(); const q=S.modal.qs[S.modal.i]; let k=q.lie?1:q.o.findIndex(o=>o[1]===2); ACT.answer(k<0?0:k);} R(); S.modal=null; }
      if(m.type==="test"&&S.energy>=3) ACT.testDo(m.id);
      if(m.type==="scam") ACT.scamNo(m.id);
      if(m.type==="offer"){ ACT.offer(m.id); R(); ACT.accept(); return; }
    }
    if(S.screen!=="week") return;
    S.tab="vac"; R(); S.tab="inbox"; R(); S.tab="cv"; R(); S.tab="vac";
    for(const v of S.vacancies.slice()){
      if(policy==="naive"){ if(S.energy>=2) ACT.tailor(v.id); }
      else {
        if(!S.profile.portfolio&&S.energy>=2) ACT.portfolio();
        const vv=S.vacancies.find(x=>x.id===v.id), age=vv.posted+vv.age*7;
        const sus=age>20||vv.weird||vv.scamTitle||vv.scamPerk||vv.oformScam||vv.freeProb||vv.blurbType!=="real"||vv.procType!=="real"||!lvOk(S.char.eng,vv.eng);
        if(sus){ ACT.skip(v.id); continue; }
        if(S.energy>=2) ACT.tailor(v.id);
      }
    }
    ACT.end();
  }
}
const out={}; const errors=[];
/* outcomes don't depend on the language (the parity checks above prove it), so the balance numbers
   come from English alone; every other language plays a few full runs per country to catch broken text */
const RUNS=+(process.env.BALANCE_RUNS||60), SMOKE=+(process.env.SMOKE_RUNS||6);
for(const lang of LANG_READY) for(const ck of COUNTRY_KEYS) for(const [sp,rp,fix] of [["top2","naive",false],["oracle","smart",true]]){
  const Rr={runs:0,jobs:0,pts:0};
  for(let r=0;r<(lang==="en"?RUNS:SMOKE);r++){ try{
    CUR_LANG=lang; let seed=(r*7919+13)>>>0; newRun(seed,{}); let tries=0; while(S.char.country!==ck&&tries<500){ seed=(seed*31+7)>>>0; newRun(seed,{}); tries++; }
    playShift(sp);
    if(fix){ const P=PROF_META[S.char.prof], tag=S.shift.vac.tag; S.resume.slots=[P.cards.find(id=>CARD_META[id].tags[0]===tag),...P.cards.filter(id=>!CARD_META[id].lie&&CARD_META[id].tags[0]!==tag)].slice(0,5); S.resume.twoCol=false;
      S.profile.headline="strong"; S.profile.photo=C().photo.with>=C().photo.without; S.profile.reloc=true; }
    ACT.start(); R(); ACT.memoGo(); playSearch(rp); R();
    if(S.outcome.type!=="job"){ ACT.toPlanB(); R(); if(fix){ ACT.buy("pro"); ACT.buy("eng"); } else { ACT.buy("scam"); ACT.buy("web"); } R(); ACT.retry(); R(); ACT.start(); playSearch(rp); R(); }
    ACT.toEpitaph(); R(); shareText();
    Rr.runs++; if(S.outcome.type==="job") Rr.jobs++; Rr.pts+=points();
  }catch(e){ errors.push(lang+"/"+ck+": "+e.message+" "+String(e.stack).split("\\n").slice(1,3).join(" ")); } }
  if(lang==="en") out[ck+" "+sp]="jobs "+(Rr.jobs/Math.max(1,Rr.runs)*100|0)+"% pts "+(Rr.pts/Math.max(1,Rr.runs)|0);
}
console.log(JSON.stringify(out,null,0).replace(/","/g,'",\\n"'));
console.log("errors:",errors.length,errors.slice(0,5));
console.log("renders:",renders,"bad:",bad.length,[...new Set(bad)].slice(0,8));
`);
