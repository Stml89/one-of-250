"use strict";
let S=null;

/* ---------- seeded randomness: every run is reproducible from its seed ---------- */
function rng(){ S.rs=(S.rs+0x6D2B79F5)>>>0; let t=S.rs; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }
const ri=(a,b)=>a+Math.floor(rng()*(b-a+1));
const pick=a=>a[Math.floor(rng()*a.length)];
const chance=p=>rng()<p;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* job title for mid-sentence use: lower-case the first letter, but leave acronyms such as «HR-специалист» alone */
const lc=s=>/^\p{Lu}\p{Lu}/u.test(s)?s:s.charAt(0).toLowerCase()+s.slice(1);
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
