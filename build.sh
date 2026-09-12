#!/usr/bin/env bash
# Inline every module back into one self-contained deliverable file.
set -e
cd "$(dirname "$0")"
OUT=dist/cleargrid-borrower-profile.html
mkdir -p dist
python3 - <<'PY'
import re,pathlib
src=pathlib.Path('src')
html=(src/'index.html').read_text(encoding='utf-8')
css=(src/'tokens.css').read_text(encoding='utf-8')
js="\n".join((src/f).read_text(encoding='utf-8') for f in
    ['core.js','i18n.js','data.js','components.js','regions.js','app.js'])
html=html.replace('<link rel="stylesheet" href="tokens.css">', '<style>\n'+css+'</style>')
html=re.sub(r'(<script src="[^"]+"></script>\s*)+', lambda m: '<script>\n'+js+'</script>\n', html)
pathlib.Path('dist').mkdir(exist_ok=True)
pathlib.Path('dist/cleargrid-borrower-profile.html').write_text(html, encoding='utf-8')
print('built dist/cleargrid-borrower-profile.html', len(html), 'bytes')
PY
