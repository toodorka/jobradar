# JobRadar — tvoj lični radar poslova

Web aplikacija za pronalaženje i rangiranje poslova prema iskustvu u kvalitetu, operacijama, projektima, logistici i Power BI/KPI analitici.

**Prioritet:** Beograd i Novi Sad, zatim zemlje EU i remote oglasi. Rezultati nisu prijave, niti garantuju da poslodavac podržava radnu dozvolu.

## Pokreni aplikaciju — prvi put

1. U ovom repozitorijumu otvori **Settings → Pages**.
2. U odeljku **Build and deployment**, izaberi **Source: GitHub Actions**.
3. Otvori **Actions → JobRadar - pretraga i objavljivanje → Run workflow → Run workflow**.
4. Kad workflow završi uspešno, stranica će biti na adresi: **https://toodorka.github.io/jobradar/**.
5. Na iPhone-u otvori tu adresu u Safari-ju, zatim **Share → Add to Home Screen**.

## Ažuriranje

Workflow `.github/workflows/jobradar.yml` pokreće se četiri puta dnevno, u 01:17, 07:17, 13:17 i 19:17 UTC (GitHub može kasniti). Podaci se upisuju u `site/data/jobs.json`, a stranica se objavljuje preko GitHub Pages. Možeš i ručno kliknuti **Run workflow**.

## Izvori poslova

Bez dodatnih ključeva: javni sistemi za zapošljavanje SmartRecruiters, Greenhouse i Lever odabrane firme, plus Remotive API. Primeri kompanija iz početne liste: Bosch, Continental, Endava, Nordeus, Wolt, Tide, Aleph, Florence Healthcare i DeepIntent. Svaki izvor može privremeno da ne radi, a podudaranje sa CV-om je procena bazirana na ključnim rečima.

Za širu pretragu Srbije možeš dodati `JOOBLE_RS_KEY` u **Settings → Secrets and variables → Actions → New repository secret**. Za više EU oglasa dodaj `ADZUNA_APP_ID` i `ADZUNA_APP_KEY`. Bez tih ključeva široka pretraga preko Jooble/Adzuna nije aktivna.

LinkedIn, Infostud i Indeed se **ne skrejpuju** automatski; u aplikaciji su linkovi za ručno otvaranje. Nije moguće garantovati proveru svih kompanija u Srbiji i EU.

## Privatnost

Javni GitHub repozitorijum ne sadrži tvoj kompletan CV ni lične kontakt podatke. Sačuvani oglasi, beleške i statusi prijava čuvaju se lokalno u Safari-ju (na uređaju), pa ih izvezi kao CSV pre čišćenja podataka pregledača. API ključevi idu samo u GitHub Secrets.

## Sadržaj repozitorijuma

- `site/index.html`: mobilna aplikacija
- `collector.py`: sakupljanje, deduplikacija i rangiranje oglasa
- `site/data/jobs.json`: podaci za dashboard
- `.github/workflows/jobradar.yml`: zakazivanje i GitHub Pages objavljivanje

**Napomena:** Prikazana ocena 'CV match' nije procenat šanse da dobiješ posao. EU/remote oglasi ne podrazumevaju automatski pravo rada ili sponzorstvo za vizu.
