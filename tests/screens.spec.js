// Plays one fixed run through every screen in every language and checks the layout survives the translation:
// no sideways page scroll, no clipped chip, stamp or button label, nothing sticking out of its card.
// Full-page screenshots land in tests/screens/<width>/ with an index.html contact sheet for a human look.
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const LANGS = ["en", "es", "it", "fr", "ja", "ru", "zh"];
const PAGE = "file://" + path.join(__dirname, "..", "dist", "amplify", "index.html");
const OUT = path.join(__dirname, "screens");
const SEED = 4242;
// SHOTS=0 runs only the layout checks; the screenshots are for a human look and take most of the time
const SHOTS = process.env.SHOTS !== "0";

/* each step moves the game to one screen; they run in the page, where the game's globals live */
const STEPS = [
  ["lang", (seed) => { S.screen = "lang"; }],
  ["intro", (seed) => { newRun(seed, { mod: "ai" }); }],
  ["task", () => ACT.toTask()],
  ["shift", () => { ACT.shiftStart(); stopTimer(); }],
  ["shift-paused", () => { ACT.pause(); }],
  ["shift-boss", () => { ACT.resume(); const sh = S.shift; while (!sh.bossMsg && !sh.over) ACT[sh.pile[sh.i].fits ? "pass" : "rej"](); stopTimer(); }],
  ["shift-result", () => { const sh = S.shift; ACT.bossOk(); while (!sh.over && sh.i < sh.pile.length) ACT[sh.pile[sh.i].fits ? "pass" : "rej"](); if (!sh.over) endShift(); }],
  ["reveal", () => ACT.toReveal()],
  ["reveal-open", () => ACT.revealOpen()],
  ["act2", () => ACT.toAct2()],
  ["build", () => { ACT.toBuild(); ACT.swapPick([...PROF_META[S.char.prof].cards, ...COMMON].find((id) => !S.resume.slots.includes(id))); }],
  ["week-jobs", () => { ACT.swapCancel(); ACT.start(); S.memo = true; }],
  ["week-summary", () => {
    for (let w = 0; w < 3; w++) {
      for (const v of S.vacancies.slice()) { if (v.reality !== "real") ACT.skip(v.id); else if (S.energy >= 2) ACT.tailor(v.id); }
      ACT.end(); if (w < 2) S.modal = null;
    }
  }],
  ["week-inbox", () => { ACT.weekGo("inbox"); S.rejOpen = true; }],
  ["interview", () => { const m = S.inbox.find((x) => x.type === "invite" && !x.done); if (m) { S.energy = 6; ACT.interview(m.id); } else S.modal = { type: "withdrawn" }; }],
  ["week-cv", () => { S.modal = null; S.tab = "cv"; S.whyOpen = true; }],
  ["xray", () => endSearch({ type: "planB" })],
  ["planb", () => ACT.toPlanB()],
  ["build-retry", () => ACT.retry()],
  ["epitaph", () => { ACT.start(); endSearch({ type: "planB" }); ACT.toEpitaph(); }],
];

/* everything that can break when a translation runs long */
function layoutIssues() {
  const W = document.documentElement.clientWidth, out = [];
  const name = (el) => `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join(".")} «${el.textContent.trim().slice(0, 40)}»`;
  if (document.documentElement.scrollWidth > W) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth} > ${W}`);
  // one main heading per screen, so screen-reader users can tell where they are
  const h1 = document.querySelectorAll("#app h1").length;
  if (h1 !== 1) out.push(`${h1} h1 headings instead of 1`);
  for (const el of document.querySelectorAll("#app button, #app .rq, #app .stamp, #app .tab, #app .lbl, #app .chip, #app .fit i, #app kbd, #app .badge")) {
    const r = el.getBoundingClientRect();
    if (!r.width || el.closest(".outgoing")) continue;
    if (el.scrollWidth > el.clientWidth + 1) out.push(`clipped: ${name(el)}`);
    if (r.right > W + 0.5 || r.left < -0.5) out.push(`off screen: ${name(el)}`);
  }
  for (const box of document.querySelectorAll("#app .card, #app .cv, #app .film, #app .status, #app .stone")) {
    const b = box.getBoundingClientRect();
    for (const el of box.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > b.right + 1 && !el.classList.contains("slam")) { out.push(`sticks out of ${box.className.split(" ")[0]}: ${name(el)}`); break; }
    }
  }
  return out;
}

for (const lang of LANGS) {
  test(`every screen in ${lang}`, async ({ page }, info) => {
    await page.goto(PAGE);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((l) => { CUR_LANG = l; }, lang);
    const dir = path.join(OUT, info.project.name);
    fs.mkdirSync(dir, { recursive: true });
    for (const [i, [screen, step]] of STEPS.entries()) {
      await test.step(screen, async () => {
        await page.evaluate(`(${step})(${SEED}); render(); window.scrollTo(0,0);`);
        expect.soft(await page.evaluate(layoutIssues), `${lang} · ${info.project.name} · ${screen}`).toEqual([]);
        if (SHOTS) await page.screenshot({ path: path.join(dir, `${lang}-${String(i).padStart(2, "0")}-${screen}.png`), fullPage: true });
      });
    }
  });
}

/* a contact sheet per width: one row per screen, one column per language */
test.afterAll(async ({}, info) => {
  const dir = path.join(OUT, info.project.name);
  if (!SHOTS || !fs.existsSync(dir)) return;
  const rows = STEPS.map(([screen], i) => `<tr><th>${screen}</th>${LANGS.map((l) => {
    const f = `${l}-${String(i).padStart(2, "0")}-${screen}.png`;
    return `<td><a href="${f}"><img src="${f}" alt="${l} ${screen}" loading="lazy"></a></td>`;
  }).join("")}</tr>`).join("\n");
  fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><meta charset="utf-8"><title>Screens · ${info.project.name}</title>
<style>body{font:13px system-ui;margin:16px}table{border-collapse:collapse}th{text-align:left;padding:6px;vertical-align:top;position:sticky;left:0;background:#fff}
td{padding:4px;vertical-align:top}img{width:${info.project.name.startsWith("phone") ? 150 : 260}px;border:1px solid #ccc}thead th{position:sticky;top:0}</style>
<table><thead><tr><th></th>${LANGS.map((l) => `<th>${l}</th>`).join("")}</tr></thead>${rows}</table>`);
});
