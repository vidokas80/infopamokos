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
- **Pagrindinis puslapis** su klasių kortelėmis (tik VBE „Paruošta“).
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
5. **Kitos klasės**: 9–10, 7–8, 5–6 – ta pati sandara (sritys A–F, temos, „Svarbiausia“, testai). Reikės išplėsti `build.py` (dabar jis žino tik `vbe`).
6. **DI iliustracijos**: OpenAI raktas jau yra (Windows naudotojo aplinkos kintamasis), modelis `gpt-image-2`. Pirmoji – `ergonomika-darbo-vieta.webp` ergonomikos temoje su SVG užrašų sluoksniu (`ill-annot`). Generatorius du kartus piešė ekraną aukščiau akių (~25 px virš akių linijos) – tai pažymėta `alt` ir `kilme.json`. 2026-10-25 visoms 17 temų (licencijoms viena) sugeneruotos `tema-<id>.webp` (medium) – rodomos temų kortelėse ir temų pradžioje, laukas `paveikslelis:` temos antraštėje. Generavimo aprašymai – `kilme.json`. Telefone kortelės gulsčios (miniatiūra kairėje).
7. Galimi: spausdinamos užduočių lapų versijos (PDF), mokinio pažangos suvestinė naršyklėje (localStorage). Mokinių rezultatų saugojimas serveryje – tik apsvarsčius BDAR.

## Žinomi niuansai

- `content/vbe/iii/03-licencijos3.html` – tik nuoroda į IV klasės temą (`kopija:`). Taisyti reikia `content/vbe/iv/03-licencijos.html`.
- Temų naršymas veikia per `#` adresus (`/vbe/#tinklai`), nes svetainė viename puslapyje. Klasės: `#iii`, `#iv`, egzaminai `#egz`.
- `src/assets/js/vbe.js` tikisi duomenų formato `QUIZ[id] = [[klausimas, variantai, teisingas, paaiškinimas], …]`, `ADV[id] = [aukštesniojo lygio indeksai]`, `OPEN[id] = [[klausimas, taškai, pavyzdinis, vertinimas], …]` – jį sugeneruoja `build.py` iš JSON.
- Ankstesnėse versijose (artefaktas claude.ai) svetainė buvo vienas HTML failas; dabartinis projektas iš jo išskaidytas 2026-10-25.
