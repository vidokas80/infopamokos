#!/usr/bin/env python3
"""Sugeneruoja svetainę į aplanką dist/.

Naudojimas:  python build.py

Ką daro:
  1. Nukopijuoja src/ (pagrindinį puslapį, CSS, JS, paveikslus) į dist/.
  2. Iš content/vbe/ temų failų, testai.json ir atvirieji.json
     sudeda VBE skilties puslapį dist/vbe/index.html ir dist/vbe/data.js.
  3. Prie CSS ir JS nuorodų prideda versiją (?v=…), kad lankytojai po
     atnaujinimo negautų senos kopijos iš naršyklės talpyklos.

Reikia tik Python 3.8+, papildomų bibliotekų nereikia.
"""
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
CONTENT = ROOT / "content"
DIST = ROOT / "dist"

HEADER_RE = re.compile(r"^<!--(.*?)-->\s*", re.S)


def parse_header(text, path):
    """Temos failo pirmoji eilutė: <!-- id: ... | toc: ... | sritis: ... [| kopija: ...] -->"""
    m = HEADER_RE.match(text)
    if not m:
        sys.exit(f"KLAIDA: {path} neturi antraštės komentaro <!-- id: ... | toc: ... | sritis: ... -->")
    meta = {}
    for part in m.group(1).split("|"):
        if ":" in part:
            k, v = part.split(":", 1)
            meta[k.strip()] = v.strip()
    for key in ("id", "toc", "sritis"):
        if key not in meta:
            sys.exit(f"KLAIDA: {path} antraštėje trūksta lauko „{key}“")
    return meta, text[m.end():]


def load_topics(grade):
    """Grąžina klasės temų sąrašą: [(meta, html)], surikiuotą pagal failo pavadinimą."""
    topics = []
    for path in sorted((CONTENT / "vbe" / grade).glob("*.html")):
        meta, body = parse_header(path.read_text(encoding="utf-8"), path)
        if "kopija" in meta:
            # Tema, kuri kartojama kitoje klasėje: imamas originalo turinys, pakeičiamas id.
            orig_path = CONTENT / "vbe" / meta["kopija"]
            orig_meta, orig_body = parse_header(orig_path.read_text(encoding="utf-8"), orig_path)
            body = orig_body.replace(f'id="{orig_meta["id"]}"', f'id="{meta["id"]}"', 1)
            meta["kopija_id"] = orig_meta["id"]
        topics.append((meta, body.strip()))
    return topics


def toc_html(grade, topics):
    items = "\n".join(
        f'    <li><a href="#{m["id"]}"><span class="code">{m["sritis"]}</span>{m["toc"]}</a></li>'
        for m, _ in topics
    )
    return f'  <ol data-grade="{grade}">\n{items}\n  </ol>'


def data_js(topics_all):
    """Paverčia JSON į formatą, kurio tikisi assets/js/vbe.js."""
    quiz = json.loads((CONTENT / "vbe" / "testai.json").read_text(encoding="utf-8"))
    opn = json.loads((CONTENT / "vbe" / "atvirieji.json").read_text(encoding="utf-8"))
    Q, ADV, O = {}, {}, {}
    for tid, items in quiz.items():
        Q[tid] = [[q["klausimas"], q["variantai"], q["teisingas"], q["paaiskinimas"]] for q in items]
        ADV[tid] = [i for i, q in enumerate(items) if q.get("lygis") == "aukstesnysis"]
    for tid, items in opn.items():
        O[tid] = [[q["klausimas"], q["taskai"], q["pavyzdinis"], q["vertinimas"]] for q in items]
    # Temų kopijos naudoja originalo klausimus
    for meta, _ in topics_all:
        if "kopija_id" in meta:
            for d in (Q, ADV, O):
                if meta["kopija_id"] in d:
                    d[meta["id"]] = d[meta["kopija_id"]]
    dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    return (
        "/* Sugeneruota build.py – neredaguokite. Šaltiniai: content/vbe/testai.json ir atvirieji.json */\n"
        f"var ADV={dump(ADV)};\nvar QUIZ={dump(Q)};\nvar OPEN={dump(O)};\n"
    )


def add_versions(html_path):
    """Prie vietinių CSS ir JS nuorodų prideda ?v=<turinio santrauka>.
    Pakeitus failą, pasikeičia adresas, todėl naršyklė neima senos kopijos iš talpyklos."""
    html = html_path.read_text(encoding="utf-8")

    def repl(m):
        target = (html_path.parent / m.group(2)).resolve()
        if not target.is_file():
            return m.group(0)
        v = hashlib.sha256(target.read_bytes()).hexdigest()[:10]
        return f'{m.group(1)}{m.group(2)}?v={v}"'

    html = re.sub(r'((?:href|src)=")(?!https?:|//)([^"?#]+\.(?:css|js))"', repl, html)
    html_path.write_text(html, encoding="utf-8")


def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(SRC, DIST, ignore=shutil.ignore_patterns("_*"))

    iii, iv = load_topics("iii"), load_topics("iv")
    template = (SRC / "vbe" / "_sablonas.html").read_text(encoding="utf-8")
    egz = (CONTENT / "vbe" / "egzaminai.html").read_text(encoding="utf-8")
    page = (
        template.replace("{{TOC_III}}", toc_html("iii", iii))
        .replace("{{TOC_IV}}", toc_html("iv", iv))
        .replace("{{TEMOS_III}}", "\n\n".join(b for _, b in iii))
        .replace("{{TEMOS_IV}}", "\n\n".join(b for _, b in iv))
        .replace("{{EGZAMINAI}}", egz.strip())
    )
    leftover = re.findall(r"\{\{[A-Z_]+\}\}", page)
    if leftover:
        sys.exit(f"KLAIDA: šablone liko neužpildytų vietų: {leftover}")
    (DIST / "vbe").mkdir(exist_ok=True)
    (DIST / "vbe" / "index.html").write_text(page, encoding="utf-8")
    (DIST / "vbe" / "data.js").write_text(data_js(iii + iv), encoding="utf-8")
    for html_path in DIST.rglob("*.html"):
        add_versions(html_path)
    print(f"Sugeneruota: dist/ (III klasė – {len(iii)} temos, IV klasė – {len(iv)} temos)")


if __name__ == "__main__":
    build()
