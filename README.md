# JobRadar — tvoj lični radar poslova

Web aplikacija za pronalaženje i rangiranje poslova prema iskustvu u kvalitetu, operacijama, projektima, logistici i Power BI/KPI analitici.

**Prioritet:** Beograd i Novi Sad, zatim zemlje EU i remote oglasi. Rezultati nisu prijave, niti garantuju da poslodavac podržava radnu dozvolu.

## Otvori JobRadar bez podešavanja Pages-a

**[OTVORI JOBRADAR](https://raw.githack.com/toodorka/jobradar/main/site/index.html)**

Ovaj prikaz radi preko javnog GitHack posrednika za GitHub HTML fajlove, bez naloga ili podešavanja. Prvi put servis može prikazati jednu potvrdu pre otvaranja HTML-a. U pitanju je rešenje za ličnu upotrebu / testiranje, ne garantovani produkcioni hosting. Podaci o poslovima se osvežavaju iz ovog javnog repozitorijuma, uz kratko keširanje.

Na iPhone-u: otvori link u Safari-ju; po želji Share → Add to Home Screen. Ne unosi osetljive lične podatke u beleške na ovakvom javnom posredničkom hostingu.

## Ažuriranje

Workflow `.github/workflows/jobradar.yml` pokreće se četiri puta dnevno, u 01:17, 07:17, 13:17 i 19:17 UTC (GitHub može kasniti). Podaci se upisuju u `site/data/jobs.json`, a stranica se može otvoriti preko javnog GitHack pregledača HTML-a (bez GitHub Pages aktivacije). Možeš i ručno kliknuti **Run workflow**.

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
- `.github/workflows/jobradar.yml`: zakazivanje i čuvanje ažuriranih podataka

**Napomena:** Prikazana ocena 'CV match' nije procenat šanse da dobiješ posao. EU/remote oglasi ne podrazumevaju automatski pravo rada ili sponzorstvo za vizu.
