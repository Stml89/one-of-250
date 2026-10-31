// Screenshot run of the built game: every screen, every language, phone and desktop width.
// Uses the system Chrome, so no browser download is needed.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: ".",
  testMatch: "screens.spec.js",
  outputDir: "screens/.results",
  fullyParallel: true,
  reporter: [["list"]],
  // reduced motion: stamps and slides sit still, so every screenshot shows the settled layout
  use: { channel: "chrome", colorScheme: "light", contextOptions: { reducedMotion: "reduce" } },
  projects: [
    { name: "phone", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    // a small phone: the shift has to fit the brief, the CV and the decision bar without scrolling
    { name: "phone-small", use: { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true } },
    { name: "desktop", use: { viewport: { width: 1280, height: 860 } } },
  ],
});
