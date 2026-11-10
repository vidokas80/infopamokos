# Projekto būsena ir istorija

Šis dokumentas – perdavimas iš pradinio darbo su Claude (claude.ai pokalbis, 2026 m. spalio 20–25 d.) į Claude Code. Jame surašyta, kas nuspręsta, kas padaryta ir kas liko. **Atnaujink jį, kai baigiamas didesnis darbas ar priimamas svarbus sprendimas.**

Paskutinį kartą atnaujinta: 2026-10-26.

## Savininkas ir tikslas

- Vidas – mokytojas (matematika, informatika), turi WordPress kūrimo patirties. Bendrauja lietuviškai.
- Tikslas – infopamokos.lt: informatikos mokymosi medžiaga Lietuvos mokiniams pagal atnaujintą Informatikos bendrąją programą (BP). Pradėta nuo VBE (III–IV gimnazijos klasės), vėliau – 5–6, 7–8, 9–10 klasės.
- BP tekstas buvo įkeltas į claude.ai projektą „12 klasės pamokos“ (failas „informatikos bendroji programa.docx“). Jei jo reikia, paprašyk Vido, kad įdėtų į `docs/`.

## Svarbiausi sprendimai (ir kodėl)

| Sprendimas | Priežastis |
|---|---|
| Svetainė apima egzamino teoriją **iš visų sričių, išskyrus duomenų tyrybą (skaičiuoklę) ir programavimą**. DI ir kriptografija (C3) įtraukti. | Vido užklausa: programavimui ir skaičiuoklei yra kitos medžiagos. Tai aiškiai parašyta VBE puslapio viršuje. |
| **Statinė svetainė** (HTML + Python generatorius), ne WordPress. | Interaktyvios dalys (testai, Bitukas, temų naršymas) yra JS, kurį WordPress redaktorius išmeta; mažiau priežiūros ir saugumo rizikos; Claude Code patogiau dirbti su failais ir Git. WordPress svarstytinas tik jei reikės mokinių paskyrų ar kitų redaktorių. |
| Talpinimas **GitHub Pages**, ne Hostinger serveris. | Nemokama, automatinis publikavimas. Hostinger naudojamas tik domenui (DNS). Saugykla vieša, nes nemokamas Pages veikia tik su viešomis. |
| Domenas **infopamokos.lt** (be „vbe“). | Planuojama medžiaga ir kitoms klasėms; VBE – skiltis `/vbe/`. Struktūra ateičiai: `/5-6/`, `/7-8/`, `/9-10/`. |
| Kiekviena tema: „Svarbiausia“ → turinys → „Giliau“ (suskleista) → „Pasitikrink“ → testas → atvirieji klausimai → šaltiniai. | Medžiaga skirta įvairaus pajėgumo mokiniams (ir besimokantiems informatikos 7–8 pažymiais). |
| Testų variantai **maišomi** kiekvieną kartą. | Savianalizė parodė, kad 42 iš 65 teisingų atsakymų buvo B variantas. |
| Atvirieji klausimai su pavyzdiniu atsakymu ir taškų kriterijais. | VBE II dalies teorijos klausimai yra atviri. |
| Egzaminų užduočių **tekstai nekopijuojami** – tik nuorodos į NŠA ir savi trumpi aprašai. | Teisės priklauso NŠA. |
| Mokomosios schemos – **tik SVG**; DI generuotos iliustracijos – tik dekoracijai. | DI generatoriai klysta schemose ir lietuviškame tekste. |
| Personažas **Bitukas** (robotas-monitorius) – apatiniame dešiniajame kampe, seka žymeklį, reaguoja į testų atsakymus, galima paslėpti. | Vido užklausa. Pastaba: vardas primena vadovėlių seriją „Bitas“ – Vidui apie tai pasakyta, sprendimo pervadinti nepriimta. |

## Kas padaryta

- **VBE skiltis** (`content/vbe/`):
  - III klasė (VBE 1 dalis), 9 temos: duomenų vizualizavimas, vektorinė grafika, licencijos (kopija iš IV), DI ir neuroniniai tinklai, kriptografija, kompiuterių tinklai, bendravimas ir bendradarbiavimas, ergonomika, poveikis aplinkai.
  - IV klasė (VBE 2 dalis), 8 temos: animacija, e. leidiniai (su RGB/CMYK, hipertekstu, struktūra, maketavimu), licencijos ir autorių teisės, asmens duomenys (BDAR), kibernetinis saugumas, e. parašas, šifravimas, dirbtinis intelektas.
  - 11 SVG schemų, 2 interaktyvūs demonstravimai (kamuolio animacija, SHA-256 santrauka).
  - 76 testo klausimai (su lygiais), 38 atvirieji klausimai.
  - Egzaminų skiltis: 2025 ir 2026 m. I ir II dalys (abi sesijos), 2026 bandomoji, 2024 pavyzdžiai; II dalies teorijos temų dažnumo suvestinė; 2025 m. I dalies NŠA analizės skaičiai.
- **Pagrindinis puslapis** su klasių kortelėmis (VBE „Paruošta“, 7–8 ir 9–10 klasės „Nauja pamoka“).
- **7–8 puslapyje skirtukai** „7 klasė“ / „8 klasė“ (2026-11-10): mygtukai `.switch[data-tabs]`, skydeliai `[data-tab]`, logika `pamokos.js`; adresai `#7`, `#8`, nuoroda į vietą skydelyje atidaro jį.
- **Excel pradžiamokslis (7 klasė)**: pamokos atskiruose aplankuose `src/7-8/excel-N/` su `img/`; bendras stilius `src/assets/css/excel.css` (pamokos kintamieji `.xl{--green…}` susieti su svetainės; `table.sheet` ir `.fbar` – pastovios Excel spalvos abiejose temose). Antraštė – svetainės `header.top`, turinys `<main class="xl">`; pamokos JS lieka puslapyje nepakeistas. 1 pamoka: `/7-8/excel-1/` (SUM, AVERAGE, MIN, MAX, COUNT). Naujai pamokai: nukopijuoti `excel-1/index.html` šabloną, pakeisti turinį, pridėti kortelę 7 klasės skirtuke.
- **9–10 klasių skiltis** (`src/9-10/index.html`, adresas `/9-10/`, 2026-11-10): pamokų sąrašas kortelėmis (`.cards`). Pamokos – atskiri puslapiai savo aplanke su `img/`: `/9-10/python-1/` – „1 pamoka. Pirmoji programa su Python“ (Vido parengta; tekstas, kodas, paveikslėliai ir skyrių id nekeisti). Pamokos `<style>` bloke tik tai, ko nėra `site.css` (kodas, langeliai, užduotys, kbd ir kt.), spalvos per svetainės kintamuosius. Kodo kopijavimo apsauga: `user-select:none` + `copy` įvykio skriptas puslapio gale. Naujas kintamasis `--ok-soft`.
- **7–8 klasių skiltis** (`src/7-8/index.html`, adresas `/7-8/`, 2026-11-08): rankiniu būdu parašytas statinis puslapis (build.py jo negeneruoja, tik nukopijuoja). 8 klasė, pamoka 2.1 „Kompiuterio aparatinės įrangos sandara“ su tikslais ir įterptu žaidimu „Kompiuterio vidus“ (`src/7-8/kompiuterio-vidus/` – Vido pateiktas savarankiškas žaidimas, failų nekeisti; adresas `/7-8/kompiuterio-vidus/`). Iframe aukštį pagal turinį nustato `assets/js/pamokos.js`. Toliau pamokoje: teorija su dalių kortelėmis ir schema, antras žaidimas „Kompiuterių daktaras“ (`src/7-8/kompiuteriu-daktaras/`, irgi Vido, nekeisti; paveikslėliai savo `img/`, 7 iš 8 sutampa su „Kompiuterio vidaus“), testas „Pasitikrink žinias“ (12 klausimų JSON bloke puslapyje, variklis `pamokos.js`).
- **build.py**, **check.py**, GitHub Actions publikavimas ir mėnesinis nuorodų tikrinimas.
- **scripts/iliustracija.py** – DI iliustracijų generavimas (OpenAI arba Google Gemini), dar nenaudotas: Vidas dar neturi API rakto.

## Faktų patikra – kas patikrinta ir kas svarbu žinoti

- Kibernetinio saugumo įstatymo sąvokos sutikrintos su redakcija, galiojančia **nuo 2026-07-04** (infolex.lt, 2 str.). BP sąvokos iš senesnės redakcijos; kai kurios pervadintos („tinklų ir informacinė sistema“, „kibernetinio saugumo rizika“), „ypatingos svarbos informacinė infrastruktūra“ ir „kibernetinio saugumo krizė“ dabartiniame 2 str. nebėra. Tai pažymėta temoje.
- DI aktas: didelės rizikos sistemų reikalavimai nukelti į **2027-12-02** (skaitmeninis omnibusas, įsigaliojo 2026-07-27). Priežiūra Lietuvoje – RRT.
- Vaiko sutikimo amžius Lietuvoje – **14 m.** (patikrinta).
- E. parašas: kvalifikuoto parašo teisinė galia pagal eIDAS; išdavėjai – elektroninisparasas.lt.
- Ergonomika: HN 21:2017 pavadinimas patikrintas; „50–70 cm“ pateikta kaip įprasta rekomendacija (konkretaus teisės akto skaičiaus nerasta).
- 2026-10-25 pataisyta pagal išorinę (ChatGPT) peržiūrą: diagramos pavyzdys 102/108 (atrodo 4 kartus, ne trigubai); e. parašas – „sukuriamas privačiuoju, tikrinamas viešuoju“, o ne „šifruojamas“ (schema, kriptografijos tema, testas); BDAR 33 str. 72 val. – su sąlyga ir išimtimi; atvirieji ≠ viešai pasiekiami duomenys; ekrane svarbu matmenys pikseliais, ne ppi.
- VBE II dalies taškai pagal NŠA 2024–2025 m. m. aprašą (Informatikos-VBE.pdf): klausimai 8–12, duomenų tyryba 16–20, programavimas 30–35 tšk. Naujesnio aprašo nerasta. „Iki šiol 8–10 / 20 / 30–32“ – iš ankstesnės versijos, su konkrečiomis užduotimis iš naujo nesutikrinta.

## Laukia (stebėti)

- **Seimo sprendimai** (antras svarstymas planuotas 2026-12-10): ar žurnalistų etikos inspektorius pervadinamas medijų ombudsmenu; ar sutikimo amžius keliamas iš 14 į 16 m. (Vyriausybė nepritaria). Priėmus – atnaujinti `content/vbe/iv/04-duomenys.html`.
- Naujos NŠA užduotys ar vertinimo instrukcijos (tikrųjų egzaminų vertinimo instrukcijos dar nepaskelbtos) – papildyti `content/vbe/egzaminai.html`.

## Liko padaryti

1. ~~**Domenas**~~ – **atlikta 2026-10-26**: infopamokos.lt veikia. DNS Hostinger'yje: 4 × A (185.199.108–111.153), 4 × AAAA (2606:50c0:8000–8003::153), CNAME www → vidokas80.github.io, TXT _github-pages-challenge-vidokas80 (domeno patvirtinimas GitHub paskyroje). Hostinger prieglobos plano nenaudojame – tik domeno registraciją ir DNS.
2. **Medžiagos licencija**: Vidas dar nepasirinko (siūlyta CC BY-NC-SA). Įrašyti į README ir svetainės poraštę.
3. **Programavimo praktika naršyklėje** (didžiausias galimas patobulinimas): Pyodide, uždaviniai egzamino stiliumi (`Duomenys.txt` → `Rezultatai.txt`), automatiniai testai.
4. **Skaičiuoklės praktika**: atsisiunčiami užduočių failai su pasitikrinimo lapu.
5. **Kitos klasės**: 9–10, 7–8 (pradėta), 5–6 – ta pati sandara (sritys A–F, temos, „Svarbiausia“, testai). Reikės išplėsti `build.py` (dabar jis žino tik `vbe`).
6. **DI iliustracijos**: OpenAI raktas jau yra (Windows naudotojo aplinkos kintamasis), modelis `gpt-image-2`. Pirmoji – `ergonomika-darbo-vieta.webp` ergonomikos temoje su SVG užrašų sluoksniu (`ill-annot`). Generatorius du kartus piešė ekraną aukščiau akių (~25 px virš akių linijos) – tai pažymėta `alt` ir `kilme.json`. 2026-10-25 visoms 17 temų (licencijoms viena) sugeneruotos `tema-<id>.webp` (medium) – rodomos temų kortelėse ir temų pradžioje, laukas `paveikslelis:` temos antraštėje. Generavimo aprašymai – `kilme.json`. Telefone kortelės gulsčios (miniatiūra kairėje).
7. Galimi: spausdinamos užduočių lapų versijos (PDF), mokinio pažangos suvestinė naršyklėje (localStorage). Mokinių rezultatų saugojimas serveryje – tik apsvarsčius BDAR.

## Žinomi niuansai

- `content/vbe/iii/03-licencijos3.html` – tik nuoroda į IV klasės temą (`kopija:`). Taisyti reikia `content/vbe/iv/03-licencijos.html`.
- Temų naršymas veikia per `#` adresus (`/vbe/#tinklai`), nes svetainė viename puslapyje. Klasės: `#iii`, `#iv`, egzaminai `#egz`.
- `src/assets/js/vbe.js` tikisi duomenų formato `QUIZ[id] = [[klausimas, variantai, teisingas, paaiškinimas], …]`, `ADV[id] = [aukštesniojo lygio indeksai]`, `OPEN[id] = [[klausimas, taškai, pavyzdinis, vertinimas], …]` – jį sugeneruoja `build.py` iš JSON.
- Ankstesnėse versijose (artefaktas claude.ai) svetainė buvo vienas HTML failas; dabartinis projektas iš jo išskaidytas 2026-10-25.
