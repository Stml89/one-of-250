#!/bin/bash
# Full check: structure of every language pack vs English, country text coverage,
# renders of every screen in every language and country, daily-run parity, balance,
# colour contrast, and (when Playwright is installed) layout of every screen at phone and desktop width.
# About 1.5 minutes; SHOTS=0 tests/run.sh skips writing the screenshots and takes about 1 minute.
set -e
cd "$(dirname "$0")/.."
./build.sh
node tests/langcheck.js
node tests/balance.js | grep -E "diffs|daily same|vacancies same|errors|bad"
python3 tests/contrast.py
if [ -d node_modules/@playwright/test ]; then
  npx playwright test --config tests/playwright.config.js --reporter=dot
else
  echo "screens skipped: run «npm install» once to enable them"
fi
