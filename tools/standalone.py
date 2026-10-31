"""Wrap dist/index.html into a standalone page for static hosting (Amplify, S3, Netlify).

The artifact platform adds the doctype, charset, viewport and a small CSS reset itself;
a static host does not, so this script adds the same pieces.
"""
import pathlib
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "dist" / "index.html"
OUT_DIR = ROOT / "dist" / "amplify"
ZIP = ROOT / "dist" / "amplify.zip"

# The same reset the artifact viewer applies, so the page looks identical on both.
RESET = """<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>"""

META = """<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A game about job hunting: screen 250 CVs as a recruiter, find your own in the pile, then hunt for a job yourself.">
<meta property="og:title" content="1 in 250">
<meta property="og:description" content="A game about job hunting. One daily run, the same for everyone.">
<meta property="og:type" content="website">"""

# The public build hides tester-only controls, such as resetting today's daily result.
PROD = "<script>window.ONEOF250_PROD=true</script>"


def main() -> None:
    page = SRC.read_text(encoding="utf-8")
    cut = page.index('<div id="app">')
    head, body = page[:cut], page[cut:]
    # crawlers and link previews read the title before the game sets it per language; match lang="en" and og:title
    head = head.replace("<title>1 из 250</title>", "<title>1 in 250</title>", 1)
    html = (
        "<!doctype html>\n<html lang=\"en\">\n<head>\n"
        + META + "\n" + RESET + "\n" + PROD + "\n" + head.strip()
        + "\n</head>\n<body>\n" + body.strip() + "\n</body>\n</html>\n"
    )
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "index.html").write_text(html, encoding="utf-8")
    # Amplify "Deploy without Git" wants index.html at the root of the archive.
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(OUT_DIR / "index.html", "index.html")
    print(f"built {OUT_DIR / 'index.html'} and {ZIP} ({ZIP.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
