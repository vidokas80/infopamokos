#!/usr/bin/env python3
"""Sugeneruoja dekoratyvinę iliustraciją su DI ir įdeda ją į projektą.

Naudojimas (pavyzdys):
  python scripts/iliustracija.py "mokinys taisyklingai sėdi prie kompiuterio" \
      --pavadinimas ergonomika-darbo-vieta \
      --alt "Mokinys taisyklingai sėdi prie kompiuterio, ekranas akių lygyje"

Ką daro:
  1. Prie aprašymo prideda bendrą svetainės stilių (scripts/stilius.txt).
  2. Sugeneruoja paveikslėlį per pasirinktą paslaugą (OpenAI arba Google Gemini).
  3. Sumažina jį ir išsaugo WebP formatu: src/assets/img/iliustracijos/<pavadinimas>.webp
  4. Įrašo kilmę (aprašymą, paslaugą, modelį, datą) į src/assets/img/iliustracijos/kilme.json
  5. Atspausdina HTML fragmentą, kurį galima įklijuoti į temą.

API raktas imamas TIK iš aplinkos kintamojo – niekada nerašykite jo į failus:
  OpenAI:  OPENAI_API_KEY
  Google:  GEMINI_API_KEY
Paslaugą galima pasirinkti --paslauga arba aplinkos kintamuoju ILIUSTRACIJU_PASLAUGA.

Modelių pavadinimai keičiasi. Jei paslauga praneša, kad modelis nerastas,
pasitikrinkite dokumentaciją ir nurodykite naują: --modelis <pavadinimas>.

Reikia: Python 3.8+ ir Pillow (pip install Pillow) – paveikslėliui sumažinti ir paversti WebP.
"""
import argparse
import base64
import datetime
import io
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src" / "assets" / "img" / "iliustracijos"
STYLE_FILE = Path(__file__).resolve().parent / "stilius.txt"

DEFAULT_MODELS = {
    "openai": "gpt-image-1",
    "google": "gemini-2.5-flash-image",
}
MAX_BYTES = 150 * 1024  # tikslas – iki 150 KB


def fail(msg):
    sys.exit(f"KLAIDA: {msg}")


def slugify(text):
    table = str.maketrans("ąčęėįšųūž", "aceeisuuz")
    s = text.lower().translate(table)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:60] or "iliustracija"


def post_json(url, payload, headers):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:800]
        fail(f"paslauga grąžino klaidą {e.code}:\n{body}")
    except urllib.error.URLError as e:
        fail(f"nepavyko prisijungti prie paslaugos: {e.reason}")


def generate_openai(prompt, model, size):
    key = os.environ.get("OPENAI_API_KEY") or fail("nenustatytas aplinkos kintamasis OPENAI_API_KEY")
    data = post_json(
        "https://api.openai.com/v1/images/generations",
        {"model": model, "prompt": prompt, "size": size, "n": 1},
        {"Authorization": f"Bearer {key}"},
    )
    try:
        item = data["data"][0]
    except (KeyError, IndexError):
        fail(f"netikėtas OpenAI atsakymas: {str(data)[:500]}")
    if "b64_json" in item:
        return base64.b64decode(item["b64_json"])
    if "url" in item:
        with urllib.request.urlopen(item["url"], timeout=120) as r:
            return r.read()
    fail("OpenAI atsakyme nėra paveikslėlio")


def generate_google(prompt, model, size):
    key = os.environ.get("GEMINI_API_KEY") or fail("nenustatytas aplinkos kintamasis GEMINI_API_KEY")
    w, h = (int(x) for x in size.lower().split("x"))
    ratio = "16:9" if w / h > 1.5 else "4:3" if w / h > 1.1 else "1:1" if w / h > 0.9 else "3:4"
    data = post_json(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        {
            "contents": [{"parts": [{"text": f"{prompt}\nKraštinių santykis: {ratio}."}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]},
        },
        {"x-goog-api-key": key},
    )
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                return base64.b64decode(inline["data"])
    fail(f"Google atsakyme nėra paveikslėlio: {str(data)[:500]}")


def to_webp(raw, max_width):
    """Sumažina paveikslėlį ir suspaudžia WebP formatu, kol telpa į MAX_BYTES."""
    try:
        from PIL import Image
    except ImportError:
        fail("reikia Pillow bibliotekos: pip install Pillow")
    img = Image.open(io.BytesIO(raw))
    img = img.convert("RGBA") if img.mode in ("RGBA", "LA", "P") else img.convert("RGB")
    if img.width > max_width:
        img = img.resize((max_width, round(img.height * max_width / img.width)), Image.LANCZOS)
    quality = 82
    while True:
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=quality, method=6)
        if buf.tell() <= MAX_BYTES or quality <= 40:
            return buf.getvalue(), img.size
        quality -= 8


def main():
    p = argparse.ArgumentParser(description="Sugeneruoja dekoratyvinę iliustraciją svetainei.")
    p.add_argument("aprasymas", help="Ką pavaizduoti (lietuviškai arba angliškai)")
    p.add_argument("--alt", required=True, help="Alternatyvusis tekstas – ką mato paveikslėlyje neregintis mokinys")
    p.add_argument("--pavadinimas", help="Failo pavadinimas be plėtinio (pagal nutylėjimą – iš aprašymo)")
    p.add_argument("--paslauga", choices=["openai", "google"], default=os.environ.get("ILIUSTRACIJU_PASLAUGA", "openai"))
    p.add_argument("--modelis", help="Modelio pavadinimas (pagal nutylėjimą – " + ", ".join(f"{k}: {v}" for k, v in DEFAULT_MODELS.items()) + ")")
    p.add_argument("--dydis", default="1536x1024", help="Generuojamo vaizdo dydis, pvz., 1536x1024 arba 1024x1024")
    p.add_argument("--plotis", type=int, default=1200, help="Didžiausias išsaugoto paveikslėlio plotis pikseliais")
    p.add_argument("--be-stiliaus", action="store_true", help="Nepridėti bendro stiliaus aprašymo")
    p.add_argument("--perrasyti", action="store_true", help="Perrašyti, jei toks failas jau yra")
    a = p.parse_args()

    name = slugify(a.pavadinimas or a.aprasymas)
    out = OUT_DIR / f"{name}.webp"
    if out.exists() and not a.perrasyti:
        fail(f"{out.relative_to(ROOT)} jau yra. Pasirinkite kitą --pavadinimas arba pridėkite --perrasyti")

    style = "" if a.be_stiliaus or not STYLE_FILE.exists() else STYLE_FILE.read_text(encoding="utf-8").strip()
    prompt = f"{a.aprasymas}\n\n{style}".strip()
    model = a.modelis or DEFAULT_MODELS[a.paslauga]
    print(f"Generuojama per {a.paslauga} ({model})…")
    raw = generate_openai(prompt, model, a.dydis) if a.paslauga == "openai" else generate_google(prompt, model, a.dydis)

    webp, (w, h) = to_webp(raw, a.plotis)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out.write_bytes(webp)

    log = OUT_DIR / "kilme.json"
    records = json.loads(log.read_text(encoding="utf-8")) if log.exists() else {}
    records[out.name] = {
        "aprasymas": a.aprasymas,
        "alt": a.alt,
        "paslauga": a.paslauga,
        "modelis": model,
        "data": datetime.date.today().isoformat(),
    }
    log.write_text(json.dumps(records, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    alt = a.alt.replace('"', "&quot;")
    print(f"Išsaugota: {out.relative_to(ROOT)} ({w}×{h}, {len(webp) // 1024} KB)\n")
    print("Įklijuokite į temą:\n")
    print(
        f'<figure class="ill"><img src="../assets/img/iliustracijos/{out.name}" alt="{alt}" '
        f'width="{w}" height="{h}" loading="lazy"><figcaption>Iliustracija sukurta su DI</figcaption></figure>'
    )


if __name__ == "__main__":
    main()
