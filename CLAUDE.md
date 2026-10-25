# CLAUDE.md – darbo su šiuo projektu taisyklės

## Kas tai

infopamokos.lt – statinė informatikos mokymosi svetainė Lietuvos mokiniams pagal atnaujintą Informatikos bendrąją programą (BP). Savininkas – mokytojas Vidas. Šiuo metu paruošta VBE skiltis (III–IV gimnazijos klasės); planuojamos 5–6, 7–8, 9–10 klasių skiltys.

Svetainė talpinama GitHub Pages, domenas infopamokos.lt. Publikuojama automatiškai per `.github/workflows/publikuoti.yml` po kiekvieno įkėlimo į `main`.

**Pradėdamas naują darbą, perskaityk `docs/PROJEKTO-BUSENA.md`** – ten priimti sprendimai, kas padaryta, kas liko ir ką stebėti. Baigęs didesnį darbą ar priėmęs svarbų sprendimą, jį atnaujink.

## Kalba

- Visas turinys, sąsaja, komentarai faile, commit pranešimai ir atsakymai savininkui – **lietuvių kalba**.
- Rašyti paprastai ir aiškiai: trumpi sakiniai, terminai paaiškinami. Svetainė skirta įvairaus pajėgumo mokiniams (nuo silpnesnių iki stiprių).

## Sandara

- `content/vbe/iii/`, `content/vbe/iv/` – temos, po vieną HTML fragmentą. Failo pirma eilutė – antraštė `<!-- id: X | toc: Pavadinimas meniu | sritis: A..F -->`. Failų pavadinimų numeriai nustato eilės tvarką.
- Tema, kuri kartojama kitoje klasėje, aprašoma antrašte su `kopija: iv/03-licencijos.html` – turinys imamas iš originalo, pakeičiamas tik id.
- `content/vbe/testai.json`, `atvirieji.json` – klausimai pagal temos id. `teisingas` skaičiuojamas nuo 0.
- `content/vbe/egzaminai.html` – egzaminų skiltis (`<article class="exam" data-part="i|ii|pvz">`).
- `src/` – šablonai, CSS, JS. `src/vbe/_sablonas.html` turi vietas `{{TOC_III}}`, `{{TEMOS_III}}` ir pan.
- `build.py` generuoja `dist/`. `dist/` neredaguoti ir nekelti į git.

## Kiekvienos temos sandara (laikytis visada)

1. `<div class="topic-head">` su BP pasiekimo kodu (pvz., `F3`) ir sritimi.
2. `<h2>` pavadinimas.
3. `<div class="key">` – „Svarbiausia“: 4–5 paprasti sakiniai su kasdieniais palyginimais.
4. Pagrindinis turinys: `<h3>` skyriai, lentelės `<div class="tbl"><table>`, sąvokos `<dl class="terms">`, schemos `<figure class="fig">` su inline SVG.
5. Sudėtingesnės dalys – `<details class="deep"><summary><span class="deep-label">Giliau</span> …</summary><div>…</div></details>`.
6. `<div class="check">` – „Pasitikrink“ su `<details>` klausimais.
7. `<aside class="sources">` – šaltiniai. **Privaloma.**
Testai ir atvirieji klausimai prijungiami automatiškai iš JSON.

## Faktai ir šaltiniai (svarbiausia taisyklė)

- Kiekvienas teiginys apie teisės aktus, datas, institucijas, egzaminus turi būti patikrintas pagal šaltinį ir šaltinis įrašytas temos `<aside class="sources">`.
- Teisės aktus tikrinti pagal galiojančią redakciją (e-tar.lt, infolex.lt, eur-lex.europa.eu). BP sąvokos gali būti iš senesnės įstatymo redakcijos – tada nurodyti abu pavadinimus.
- Egzaminų informaciją imti tik iš NŠA (nsa.smsm.lt). Užduočių tekstų nekopijuoti – tik nuorodos ir trumpi savi aprašai.
- Jei faktas nepatvirtintas – jo nerašyti arba aiškiai pažymėti ir pasakyti savininkui.
- Teminė apimtis: BP III–IV klasių turinys. VBE 1 dalis tikrina III klasės turinį, 2 dalis – IV klasės (be D ir E sričių).

## Dizainas

- Spalvos tik per CSS kintamuosius `:root` (`--paper`, `--ink`, `--accent`, `--warm`…), su tamsiąja tema per `prefers-color-scheme`. Jokių spalvų tiesiai komponentuose.
- Šriftai: Commissioner (antraštės), Source Serif 4 (tekstas), JetBrains Mono (kodai, žymės).
- SVG schemose naudoti klases (`.box`, `.acc`, `.warm`, `.ln`, `.mut`…), ne spalvas – kad veiktų abi temos.
- Puslapis turi veikti 390 px pločio telefone be horizontalaus slinkimo.
- Be išorinių JS bibliotekų. Gerbti `prefers-reduced-motion`.

## Iliustracijos

- **Mokomosios schemos** (tinklai, šifravimas, neuroniniai tinklai, eigos, palyginimai) – **tik inline SVG**, rankiniu būdu, su temos klasėmis. DI generatoriams jų nepatikėti: jie daro faktinių klaidų ir blogai rašo tekstą, ypač lietuviškas raides.
- **DI iliustracijos** – tik dekoratyvinės ar situacijų (temų kortelės, pagrindinis puslapis, „mokinys prie kompiuterio“). Generuoti skriptu:
  ```
  python scripts/iliustracija.py "ką pavaizduoti" --pavadinimas trumpas-vardas --alt "ką mato neregintis mokinys"
  ```
  Skriptas prideda bendrą stilių iš `scripts/stilius.txt`, išsaugo WebP iki ~150 KB į `src/assets/img/iliustracijos/`, įrašo kilmę į `kilme.json` ir atspausdina HTML fragmentą.
- Iliustracija dedama kaip `<figure class="ill">` su prasmingu `alt` ir parašu „Iliustracija sukurta su DI“.
- **Užrašai ir matmenys ant DI iliustracijų dedami tik SVG sluoksniu, niekada neprašomi iš generatoriaus.** Komponentas `<figure class="ill ill-annot">`: `<div class="ill-wrap">` su `<img>` ir ant jo `<svg viewBox="0 0 PLOTIS AUKŠTIS">` (paveikslėlio matmenys pikseliais), stiliai `site.css`. Klasės `.ln`, `.dash`, `.acc`, `.arrowhead`, `.mut`; užrašai, kurie telefone (≤600 px) slepiami, žymimi `.opt` – telefone lieka tik matmenys. Matmenis įrašyti ir į `alt`. Pavyzdys – ergonomikos tema.
- Iliustracijoje neturi būti teksto, logotipų, prekių ženklų ar žinomų personažų. Bitukas – tik SVG (`src/assets/img/bitukas.svg`, `bot.js`), DI jo negeneruoja.
- Prieš naudojant peržiūrėti rezultatą: ar nėra klaidingų detalių (pvz., neteisinga sėdėsena ergonomikos temoje). Netinkamą generuoti iš naujo.
- **API raktai** (`OPENAI_API_KEY`, `GEMINI_API_KEY`) – tik aplinkos kintamuosiuose. Niekada nerašyti į failus, commit pranešimus ar kodą. Saugykla vieša.

## Prieš kiekvieną commit

```
python check.py && python build.py && python check.py --built
```

Turi būti 0 klaidų. Jei keitei JS ar išdėstymą – peržiūrėk `dist/` naršyklėje (`python -m http.server 8000 --directory dist`), taip pat telefono pločiu.

## Commit pranešimai

Lietuviškai, trumpai, kas pakeista: „Papildyta e. leidinių tema: maketavimo veiksmai“.
