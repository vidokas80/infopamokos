#!/usr/bin/env python3
"""Tikrina projektą prieš publikavimą.

Naudojimas:
  python check.py              – tikrina šaltinio failus (content/, src/)
  python check.py --built      – papildomai tikrina sugeneruotą dist/ (paleiskite po build.py)
  python check.py --external   – papildomai tikrina, ar veikia išorinės nuorodos (reikia interneto)

Grąžina klaidos kodą 1, jei rasta klaidų – tada GitHub Actions svetainės nepublikuoja.
"""
import json
import re
import sys
import urllib.request
import xml.dom.minidom
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content" / "vbe"
DIST = ROOT / "dist"
errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def topic_ids():
    ids = {}
    for grade in ("iii", "iv"):
        for path in sorted((CONTENT / grade).glob("*.html")):
            text = path.read_text(encoding="utf-8")
            m = re.match(r"<!--.*?id:\s*(\w+)", text, re.S)
            if not m:
                err(f"{path.relative_to(ROOT)}: nėra antraštės su id")
                continue
            tid = m.group(1)
            if tid in ids:
                err(f"Tema „{tid}“ kartojasi: {ids[tid]} ir {path.relative_to(ROOT)}")
            ids[tid] = path.relative_to(ROOT)
            if "kopija:" not in text.split("-->")[0]:
                if f'<section class="topic" id="{tid}">' not in text:
                    err(f"{path.relative_to(ROOT)}: antraštės id „{tid}“ nesutampa su <section id>")
                if '<aside class="sources">' not in text:
                    err(f"{path.relative_to(ROOT)}: temoje nėra šaltinių bloko <aside class=\"sources\">")
                if '<div class="key">' not in text:
                    warn(f"{path.relative_to(ROOT)}: temoje nėra langelio „Svarbiausia“")
                for svg in re.findall(r"<svg.*?</svg>", text, re.S):
                    try:
                        xml.dom.minidom.parseString(svg)
                    except Exception as e:
                        err(f"{path.relative_to(ROOT)}: netaisyklingas SVG ({e})")
    return ids


def check_json(ids):
    copies = set()
    for grade in ("iii", "iv"):
        for path in (CONTENT / grade).glob("*.html"):
            head = path.read_text(encoding="utf-8").split("-->")[0]
            if "kopija:" in head:
                copies.add(re.search(r"id:\s*(\w+)", head).group(1))
    for fname, kind in (("testai.json", "test"), ("atvirieji.json", "open")):
        path = CONTENT / fname
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            err(f"{fname}: netaisyklingas JSON – {e}")
            continue
        for tid, items in data.items():
            if tid not in ids:
                err(f"{fname}: tema „{tid}“ neegzistuoja content/vbe/ aplanke")
            for n, q in enumerate(items, 1):
                where = f"{fname} → {tid} → {n} klausimas"
                if kind == "test":
                    for key in ("klausimas", "variantai", "teisingas", "paaiskinimas", "lygis"):
                        if key not in q:
                            err(f"{where}: trūksta lauko „{key}“")
                    v = q.get("variantai", [])
                    if len(v) < 2:
                        err(f"{where}: reikia bent 2 atsakymo variantų")
                    if not isinstance(q.get("teisingas"), int) or not 0 <= q.get("teisingas", -1) < len(v):
                        err(f"{where}: „teisingas“ turi būti varianto numeris nuo 0 iki {len(v) - 1}")
                    if len(set(v)) != len(v):
                        err(f"{where}: kartojasi atsakymo variantai")
                    if q.get("lygis") not in ("pagrindinis", "aukstesnysis"):
                        err(f"{where}: „lygis“ turi būti „pagrindinis“ arba „aukstesnysis“")
                else:
                    for key in ("klausimas", "taskai", "pavyzdinis", "vertinimas"):
                        if key not in q:
                            err(f"{where}: trūksta lauko „{key}“")
        for tid in ids:
            if tid not in data and tid not in copies:
                warn(f"{fname}: tema „{tid}“ neturi {'testo' if kind == 'test' else 'atvirųjų klausimų'}")


class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.hrefs = [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "a" and a.get("href"):
            self.hrefs.append(a["href"])


def check_built():
    page = DIST / "vbe" / "index.html"
    if not page.exists():
        err("dist/vbe/index.html nerastas – pirmiausia paleiskite python build.py")
        return []
    p = LinkCollector()
    p.feed(page.read_text(encoding="utf-8"))
    seen = set()
    for i in p.ids:
        if i in seen:
            err(f"dist/vbe/index.html: id „{i}“ kartojasi")
        seen.add(i)
    allowed = seen | {"iii", "iv", "egz"}
    for h in p.hrefs:
        if h.startswith("#") and h[1:] not in allowed:
            err(f"dist/vbe/index.html: nuoroda {h} veda į neegzistuojančią vietą")
    for f in ("index.html", "assets/css/site.css", "assets/js/vbe.js", "assets/js/bot.js", "vbe/data.js"):
        if not (DIST / f).exists():
            err(f"dist/{f} nerastas")
    return [h for h in p.hrefs if h.startswith("http")]


def check_external(urls):
    for url in sorted(set(urls)):
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "infopamokos-link-check"})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                if r.status >= 400:
                    err(f"Neveikia nuoroda ({r.status}): {url}")
        except urllib.error.HTTPError as e:
            if e.code in (403, 405, 429):  # kai kurios svetainės neleidžia HEAD ar robotų
                warn(f"Nepavyko patikrinti ({e.code}): {url}")
            else:
                err(f"Neveikia nuoroda ({e.code}): {url}")
        except Exception as e:
            warn(f"Nepavyko pasiekti: {url} ({e.__class__.__name__})")


def main():
    ids = topic_ids()
    check_json(ids)
    urls = []
    if "--built" in sys.argv or "--external" in sys.argv:
        urls = check_built()
    if "--external" in sys.argv:
        check_external(urls)
    for w in warnings:
        print("ĮSPĖJIMAS:", w)
    for e in errors:
        print("KLAIDA:", e)
    print(f"Patikrinta: {len(ids)} temos. Klaidų: {len(errors)}, įspėjimų: {len(warnings)}.")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
