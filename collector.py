"""JobRadar — periodic public ATS feeds and optional job search APIs.
No login scraping, no personal CV data, no automatic applications.
"""
import concurrent.futures, datetime as dt, hashlib, html, json, os, re, urllib.parse, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "site" / "data" / "jobs.json"
NOW = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
UA = "JobRadar/1.0 (public careers API; personal job search)"
BOARDS = [
    ("Bosch", "smart", "BoschGroup"),
    ("Continental", "smart", "Continental"),
    ("Endava", "smart", "Endava"),
    ("Nordeus", "greenhouse", "nordeus"),
    ("Wolt", "greenhouse", "wolt"),
    ("Tide", "greenhouse", "tide"),
    ("Aleph", "lever", "aleph"),
    ("Florence Healthcare", "greenhouse", "florenceeu"),
    ("DeepIntent", "greenhouse", "deepintent"),
]
ROLE_GROUPS = {
    "Quality & Engineering": ["quality", "fmea", "assurance", "continuous improvement", "root cause", "validation", "reliability", "customer excellence"],
    "Operations & Projects": ["operations", "project coordinator", "project manager", "project specialist", "program manager", "project analyst", "operational excellence", "process coordinator", "performance manager"],
    "Supply Chain & Logistics": ["supply chain", "logistics", "procurement", "buyer", "material", "inventory", "planning", "supplier management", "demand planner", "production planner"],
    "Business Analysis & BI": ["business analyst", "business intelligence", "power bi", "data analyst", "reporting", "performance analyst", "business process", "analytics", "kpi analyst"],
    "Innovation & Transformation": ["innovation", "transformation", "pmo", "process improvement", "continuous improvement", "change manager", "process excellence", "digitalization"],
}
SKILLS = ["sap", "power bi", "sql", "excel", "fmea", "8d", "root cause", "apqp", "ppap", "risk management", "kpi", "reporting", "quality", "process improvement", "operations", "logistics", "procurement", "supply chain", "project management", "stakeholder", "six sigma", "iso 9001", "validation", "supplier"]
EXCLUDE = ["intern", "internship", "graduate trainee", "senior software", "frontend", "backend", "full stack", "devops", "staff engineer", "sales representative", "registered nurse", "physician", "truck driver", "warehouse picker", "mechanic"]
EU = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"]
COUNTRY_MAP = {"DE":"Germany","AT":"Austria","SI":"Slovenia","HU":"Hungary","HR":"Croatia","IT":"Italy","ES":"Spain","FR":"France","NL":"Netherlands","PL":"Poland","CZ":"Czechia","SK":"Slovakia","RO":"Romania","BE":"Belgium","PT":"Portugal","IE":"Ireland","SE":"Sweden","DK":"Denmark","FI":"Finland","EE":"Estonia","LT":"Lithuania","LV":"Latvia","BG":"Bulgaria","GR":"Greece","CY":"Cyprus","MT":"Malta","LU":"Luxembourg"}
ERRORS = []
SOURCES = []

def fetch(url, payload=None):
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"User-Agent":UA, "Accept":"application/json", **({"Content-Type":"application/json"} if data else {})})
    with urllib.request.urlopen(req, timeout=18) as r:
        return json.loads(r.read().decode("utf-8"))

def plain(v):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]*>", " ", str(v or "")))).strip()

def locate(raw):
    loc = plain(raw).strip()
    lowered = loc.lower()
    if "novi sad" in lowered:
        return "Novi Sad"
    if "belgrade" in lowered or "beograd" in lowered:
        return "Belgrade"
    for name in EU:
        if re.search(r"\b"+re.escape(name.lower())+r"\b", lowered):
            return "EU"
    parts = re.split(r"[^A-Za-z]+", loc)
    if any(p.upper() in COUNTRY_MAP for p in parts if len(p) == 2):
        return "EU"
    if "remote" in lowered or "worldwide" in lowered or "anywhere" in lowered:
        return "Remote"
    return "Other"

def score(title, desc, location):
    title = plain(title).lower()
    desc = plain(desc).lower()[:10000]
    if any(re.search(r"\b"+re.escape(x)+r"\b", title) for x in EXCLUDE):
        return None
    ranking = [(name, sum(1 for term in words if term in title)) for name, words in ROLE_GROUPS.items()]
    category, hits = max(ranking, key=lambda it: it[1])
    # Only positions whose title fits an area, not arbitrary technical vacancies.
    if not hits: return None
    matching = [x for x in SKILLS if x in desc or x in title]
    points = min(96, 43 + 12*min(hits,3) + 3*min(len(matching),5))
    region = locate(location)
    if region == "Other": return None
    if region in ("Belgrade", "Novi Sad"): points += 6
    elif region == "EU": points += 3
    visa = bool(re.search(r"(visa sponsorship|sponsor (your |a )?visa|relocation support|work permit sponsorship)", desc))
    reason = "Oblast: " + category + ". " + ("Veštine: "+", ".join(matching[:4])+"." if matching else "Naziv pozicije odgovara iskustvu.")
    return category, min(99, points), region, visa, reason

def parse_board(board):
    company, kind, slug = board
    jobs = []
    if kind == "smart":
        # SmartRecruiters publicly exposes paginated job advertisements.
        for offset in range(0, 600, 100):
            q = urllib.parse.urlencode({"limit":100, "offset":offset})
            d = fetch("https://api.smartrecruiters.com/v1/companies/"+slug+"/postings?"+q)
            items = d.get("content", [])
            for x in items:
                l = x.get("location") or {}
                if not isinstance(l,dict):l={}
                jid = x.get("id")
                if not jid:continue
                parts = [l.get("city"), l.get("region"), l.get("country")]
                loc = ", ".join(str(a) for a in parts if a)
                jobs.append({"company":company, "title":x.get("name"),"location":loc,"url":"https://jobs.smartrecruiters.com/"+slug+"/"+str(jid),"description":x.get("description") or x.get("jobAd",{}).get("sections",{}).get("jobDescription",""),"posted_at":x.get("releasedDate"),"source":company})
            if len(items)<100:break
    elif kind == "greenhouse":
        d = fetch("https://boards-api.greenhouse.io/v1/boards/"+slug+"/jobs?content=true")
        for x in d.get("jobs",[]):
            jobs.append({"company":company,"title":x.get("title"),"location":(x.get("location") or {}).get("name",""),"url":x.get("absolute_url"),"description":x.get("content",""),"posted_at":x.get("updated_at"),"source":company})
    elif kind == "lever":
        d = fetch("https://api.lever.co/v0/postings/"+slug+"?mode=json")
        for x in d:
            c=x.get("categories") or {}
            jobs.append({"company":company,"title":x.get("text"),"location":c.get("location",""),"url":x.get("hostedUrl"),"description":x.get("descriptionPlain") or x.get("description",""),"posted_at":None,"source":company})
    return company, jobs

def remotive():
    d=fetch("https://remotive.com/api/remote-jobs?limit=300")
    jobs=[]
    for x in d.get("jobs",[]):
        loc=x.get("candidate_required_location") or "Remote"
        jobs.append({"company":x.get("company_name"),"title":x.get("title"),"location":"Remote - "+loc,"url":x.get("url"),"description":x.get("description"),"posted_at":x.get("publication_date"),"source":"Remotive"})
    return "Remotive",jobs

def jooble():
    key=os.getenv("JOOBLE_RS_KEY")
    if not key:return "Jooble RS",[]
    all_jobs=[]
    for city in ["Beograd","Novi Sad"]:
        for q in ["quality engineer","operations analyst","project coordinator","supply chain analyst","business analyst","Power BI"]:
            try:
                d=fetch("https://jooble.org/api/"+urllib.parse.quote(key),{"keywords":q,"location":city,"page":1})
                for x in d.get("jobs",[]):
                    all_jobs.append({"company":x.get("company"),"title":x.get("title"),"location":x.get("location",city),"url":x.get("link"),"description":x.get("snippet",""),"posted_at":x.get("updated"),"source":"Jooble RS"})
            except Exception:pass
    return "Jooble RS",all_jobs

def adzuna():
    aid=os.getenv("ADZUNA_APP_ID");key=os.getenv("ADZUNA_APP_KEY")
    if not aid or not key:return "Adzuna",[]
    jobs=[]
    for country in ["de","at","it","es","nl","pl"]:
        for q in ["quality engineer","operations analyst","project coordinator","supply chain analyst","business analyst"]:
            p=urllib.parse.urlencode({"app_id":aid,"app_key":key,"results_per_page":30,"what":q,"content-type":"application/json"})
            try:
                d=fetch("https://api.adzuna.com/v1/api/jobs/"+country+"/search/1?"+p)
                for x in d.get("results",[]):
                    jobs.append({"company":(x.get("company") or {}).get("display_name",""),"title":x.get("title"),"location":(x.get("location") or {}).get("display_name","")+" "+COUNTRY_MAP.get(country.upper(),""),"url":x.get("redirect_url"),"description":x.get("description",""),"posted_at":x.get("created"),"source":"Adzuna"})
            except Exception:pass
    return "Adzuna",jobs

def process(name,records,old):
    result=[]
    for x in records:
        title=plain(x.get("title"))
        loc=plain(x.get("location"))
        rawurl=str(x.get("url") or "")
        if not title or not rawurl.startswith(("https://","http://")):continue
        matched=score(title,x.get("description",""),loc)
        if not matched:continue
        category,points,reg,visa,why=matched
        ident=hashlib.sha256(rawurl.encode()).hexdigest()[:16]
        first=old.get(ident,NOW)
        result.append({"id":ident,"title":title,"company":plain(x.get("company")),"location":loc,"region":reg,"category":category,"score":points,"why":why,"url":rawurl,"posted_at":x.get("posted_at"),"first_seen":first,"visa_mentioned":visa,"source":name})
    return result

def main():
    OUT.parent.mkdir(parents=True,exist_ok=True)
    try:previous=json.loads(OUT.read_text(encoding="utf-8"))
    except Exception:previous={}
    old={j["id"]:j.get("first_seen",NOW) for j in previous.get("jobs",[]) if "id" in j}
    todo=[lambda board=b:parse_board(board) for b in BOARDS]+[remotive]
    if os.getenv("JOOBLE_RS_KEY"):todo.append(jooble)
    if os.getenv("ADZUNA_APP_ID") and os.getenv("ADZUNA_APP_KEY"):todo.append(adzuna)
    jobs={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures=[pool.submit(func) for func in todo]
        for f in concurrent.futures.as_completed(futures):
            try:
                name,found=f.result()
                matched=process(name,found,old)
                for j in matched:
                    jobs[j["id"]]=j
                SOURCES.append({"name":name,"count":len(matched),"status":"ok"})
                print(name,":",len(matched),"relevant")
            except Exception as exc:
                # Avoid printing API request URLs / tokens.
                ERRORS.append({"name":"ATS / remote source","status":"failed"})
                print("Source temporarily unavailable:",type(exc).__name__)
    final=sorted(jobs.values(),key=lambda j:({"Belgrade":0,"Novi Sad":0,"EU":1,"Remote":2}.get(j["region"],3),-j["score"]))[:1600]
    status={"app":"JobRadar","generated_at":NOW,"job_count":len(final),"jobs":final,"sources":sorted(SOURCES,key=lambda x:x["name"]),"source_errors":ERRORS,"notice":"Podaci su indikativni, ne garantuju otvoren oglas niti radnu vizu."}
    OUT.write_text(json.dumps(status,ensure_ascii=False,indent=2),encoding="utf-8")
    print("Wrote",len(final),"jobs to",OUT)

if __name__=="__main__":
    main()
