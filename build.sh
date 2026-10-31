#!/bin/bash
# Builds dist/index.html (the playable single file) and dist/game.js (the bare script the tests load).
set -e
cd "$(dirname "$0")"
OUT=dist/index.html
cat src/head.html src/extra.css > $OUT
printf '\n<div id="app"></div>\n\n<script>\n' >> $OUT
# order matters: core helpers, country data, language packs (ru defines LANG), engine last
cat src/core.js src/countries.js src/ru.js src/en.js src/es.js src/it.js src/fr.js src/ja.js src/zh.js src/engine.js >> $OUT
printf '</script>\n' >> $OUT
python3 -c "
s=open('$OUT').read(); i=s.index('<script>')+8; j=s.rindex('</script>'); open('dist/game.js','w').write(s[i:j])"
node --check dist/game.js
echo "built $OUT ($(wc -c < $OUT) bytes)"
# standalone page + zip for static hosting (AWS Amplify, S3, Netlify)
python3 tools/standalone.py
