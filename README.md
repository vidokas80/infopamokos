# infopamokos.lt

Informatikos mokymosi medžiaga mokiniams pagal atnaujintą Informatikos bendrąją programą.

Šiuo metu paruošta skiltis **VBE** (III–IV gimnazijos klasės): egzamino teorija iš visų sričių, išskyrus programavimą ir darbą su skaičiuokle, schemos, testai, atvirieji klausimai ir 2025–2026 m. egzaminų užduotys. Ateityje bus pridėtos 5–6, 7–8 ir 9–10 klasių skiltys.

Svetainė statinė: be duomenų bazės ir serverio programų. Ją talpina **GitHub Pages**, o domenas **infopamokos.lt** nukreiptas į GitHub.

## Projekto sandara

```
content/vbe/          ← TURINYS (čia daroma dauguma pakeitimų)
  iii/                  III klasės temos, po vieną failą (01-..., 02-... – eilės tvarka)
  iv/                   IV klasės temos
  egzaminai.html        egzaminų užduočių skiltis
  testai.json           pasirenkamojo atsakymo testai
  atvirieji.json        atvirieji klausimai su pavyzdiniais atsakymais
src/                  ← DIZAINAS IR LOGIKA
  index.html            pagrindinis puslapis (klasių pasirinkimas)
  vbe/_sablonas.html    VBE puslapio šablonas
  assets/css/site.css   visas svetainės stilius
  assets/js/vbe.js      testai, atvirieji klausimai, temų naršymas
  assets/js/bot.js      personažas Bitukas
  CNAME                 domenas infopamokos.lt
build.py              sugeneruoja svetainę į dist/
check.py              patikrina klaidas
.github/workflows/    automatinis publikavimas ir nuorodų tikrinimas
```

Aplankas `dist/` generuojamas automatiškai ir į GitHub nekeliamas.

## Kaip pakeisti turinį

**Pataisyti temą.** Atidarykite failą `content/vbe/iv/05-kibernetinis.html` (ar kitą) ir pataisykite tekstą. Pirmoji failo eilutė (`<!-- id: ... -->`) turi likti nepakeista.

**Pridėti testo klausimą.** `content/vbe/testai.json` prie reikiamos temos pridėkite:

```json
{
  "klausimas": "Klausimo tekstas?",
  "variantai": ["A variantas", "B variantas", "C variantas", "D variantas"],
  "teisingas": 1,
  "paaiskinimas": "Kodėl teisingas B.",
  "lygis": "pagrindinis"
}
```

`teisingas` – teisingo varianto numeris, **skaičiuojant nuo 0** (0 = pirmas). Svetainėje variantai vis tiek maišomi. `lygis` – `pagrindinis` arba `aukstesnysis`.

**Pridėti naują temą.** Sukurkite failą, pvz., `content/vbe/iii/10-nauja-tema.html`, kurio pirma eilutė:

```html
<!-- id: naujatema | toc: Trumpas pavadinimas | sritis: D -->
```

Toliau – `<section class="topic" id="naujatema">…</section>`, kaip kitose temose. Tema pati atsiras meniu ir kortelėse.

## Kaip patikrinti savo kompiuteryje

Reikia Python 3 (papildomų bibliotekų nereikia):

```
python check.py            # ar nėra klaidų turinyje
python build.py            # sugeneruoja dist/
python check.py --built    # ar nėra klaidų sugeneruotoje svetainėje
python -m http.server 8000 --directory dist
```

Tada naršyklėje atidarykite http://localhost:8000.

## Iliustracijos su DI

Mokomosios schemos svetainėje piešiamos SVG formatu ranka (tiksliai, su lietuvišku tekstu, prisitaiko prie tamsios temos). DI generatorius naudojamas tik dekoratyvinėms iliustracijoms.

**Vienkartinis paruošimas savo kompiuteryje:**

1. Gaukite API raktą: [OpenAI](https://platform.openai.com/api-keys) arba [Google AI Studio](https://aistudio.google.com/apikey). Generavimas mokamas pagal kiekį. **ChatGPT Plus/Pro prenumerata API neapima** – API apmokamas atskirai platform.openai.com.
   - OpenAI vaizdų modeliams reikia **patvirtinti organizaciją** (platform.openai.com → Settings → Organization → General → Verify Organization). Be to skriptas gaus klaidą 403.
   - Bandymams naudokite `--kokybe low` – pigiausia.
2. Įdiekite Pillow: `pip install Pillow`
3. Nustatykite raktą aplinkos kintamuoju (ne faile!):
   - Windows (PowerShell): `setx OPENAI_API_KEY "jūsų-raktas"` ir atidarykite terminalą iš naujo
   - macOS / Linux: į `~/.zshrc` arba `~/.bashrc` įrašykite `export OPENAI_API_KEY="jūsų-raktas"`
   - Google atveju – `GEMINI_API_KEY`, ir papildomai `ILIUSTRACIJU_PASLAUGA=google`

**Generavimas:**

```
python scripts/iliustracija.py "mokinys taisyklingai sėdi prie kompiuterio" --pavadinimas ergonomika --alt "Mokinys taisyklingai sėdi prie kompiuterio"
```

Paveikslėlis atsiras `src/assets/img/iliustracijos/`, o skriptas atspausdins HTML fragmentą, kurį reikia įklijuoti į temą. Bendras stilius aprašytas `scripts/stilius.txt` – pakeitus jį, keičiasi visų naujų iliustracijų stilius. Claude Code šį skriptą gali paleisti pats.

> **Svarbu:** API rakto niekada nerašykite į projekto failus – saugykla vieša, ir raktą galėtų panaudoti kiti jūsų sąskaita.

## Kaip publikuojama

Įkėlus pakeitimus į `main` šaką, GitHub Actions automatiškai paleidžia `check.py` ir `build.py` ir paskelbia svetainę. Jei rasta klaidų, publikavimas sustabdomas, o sena versija toliau veikia. Eigą matysite skiltyje **Actions**.

Kartą per mėnesį automatiškai tikrinama, ar veikia visos išorinės nuorodos (NŠA užduotys, teisės aktai). Jei kuri nors neveikia, GitHub praneš el. paštu.

## Vienkartinis nustatymas (jau padarytas ar dar reikia padaryti)

1. **GitHub Pages:** saugykloje **Settings → Pages → Build and deployment → Source** pasirinkite **GitHub Actions**.
2. **DNS (Hostinger):** hPanel → Domenai → infopamokos.lt → **DNS / Nameservers**:
   - ištrinkite esamus `A` įrašus vardui `@`;
   - pridėkite 4 `A` įrašus vardui `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   - pridėkite `CNAME` įrašą: vardas `www`, reikšmė `vidokas80.github.io`.
3. **Domenas GitHub'e:** **Settings → Pages → Custom domain** įrašykite `infopamokos.lt`, spauskite **Save**. Kai DNS patikrinimas praeis (gali užtrukti iki 24 val.), pažymėkite **Enforce HTTPS**.
4. **Domeno patvirtinimas (saugumui):** paskyros **Settings → Pages → Add a domain**, įrašykite `infopamokos.lt` ir Hostinger DNS pridėkite GitHub nurodytą `TXT` įrašą. Taip niekas kitas negalės prijungti šio domeno prie savo GitHub svetainės.

## Autorių teisės

Egzaminų užduotys ir jų teisės priklauso Nacionalinei švietimo agentūrai; svetainėje pateikiamos tik nuorodos ir trumpi aprašai. Medžiagos licencija bus nurodyta vėliau.
