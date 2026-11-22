#!/usr/bin/env python3
"""MasterRadar public-source monitor and Erasmus Mundus candidate finder.

This job NEVER invents deadlines or financial awards. It checks known public URLs
and discovers potential leads in the EU's official catalogue. Newly discovered
leads have unknown scholarship, unknown deadlines, and require human validation.
No CV, identity or application-status data is processed server-side.
"""
from __future__ import annotations
import concurrent.futures
import datetime as dt
import hashlib
import html
from html.parser import HTMLParser
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
ROOT_DATA = ROOT / "site" / "masterradar" / "data"
BASE = "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en"
HEADERS = {"User-Agent": "MasterRadar/1.0 (public-source review; educational project)", "Accept": "text/html,application/xhtml+xml"}
KEYS = {"management": 92, "leadership": 88, "innovation": 86,
        "entrepreneur": 85, "industrial": 88, "manufactur": 87,
        "logistic": 94, "supply chain": 94, "quality": 92, "operations": 90,
        "business": 80, "public policy": 79, "policy": 77, "governance": 78,
        "analytics": 85, "data": 76, "digital": 79, "economics": 74,
        "humanitarian": 82, "sustainab": 71, "marketing": 72,
        "project": 83, "mobility": 70, "transport": 76, "global": 72,
        "intercultural": 80, "development": 70, "migration": 65,
        "finance": 66, "work": 70, "systems": 74}
STOP = ("cookie", "privacy", "contact", "language", "facebook", "linkedin", "youtube",
        "accessibility", "newsletter", "european commission", "erasmus mundus catalogue")
TODAY = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")

class AnchorParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.anchors, self.active = [], None
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.active = {"href": dict(attrs).get("href", ""), "text": []}
    def handle_data(self, data):
        if self.active is not None:
            self.active["text"].append(data)
    def handle_endtag(self, tag):
        if tag == "a" and self.active is not None:
            self.anchors.append((self.active["href"], " ".join(" ".join(self.active["text"]).split())))
            self.active = None

def fetch(url: str) -> tuple[int, str]:
    request = Request(url, headers=HEADERS)
    with urlopen(request, timeout=18) as resp:
        return resp.status, resp.read(1_600_000).decode("utf-8", "replace")

def read_json(name: str, fallback: dict) -> dict:
    try:
        return json.loads((ROOT_DATA / name).read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        return fallback

def write_json(name: str, data: dict):
    ROOT_DATA.mkdir(parents=True, exist_ok=True)
    (ROOT_DATA / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

def meaningful_digest(body: str) -> str:
    s = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", body, flags=re.I | re.S)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    s = " ".join(s.split())
    patterns = re.finditer(r"(deadline|closing date|scholarship|application period|funding|admission)", s, re.I)
    snippets = []
    for match in patterns:
        snippets.append(s[max(0, match.start()-70): match.end()+150])
        if len(snippets) >= 35: break
    data = " ".join(snippets) if snippets else s[:3500]
    return hashlib.sha256(data.encode("utf-8", "replace")).hexdigest()[:20]

def monitor_one(p: dict, prev: dict) -> tuple[str, dict]:
    k = p["id"]; url = p.get("url", "")
    old = prev.get(k, {})
    result = {"checkedAt": TODAY, "url": url, "reachable": None,
              "lastChangedAt": old.get("lastChangedAt"), "fingerprint": old.get("fingerprint")}
    if not url.startswith("https://"): return k, result
    try:
        status, body = fetch(url)
        result["reachable"] = status == 200
        if result["reachable"]:
            fp = meaningful_digest(body)
            if old.get("fingerprint") and old["fingerprint"] != fp:
                result["lastChangedAt"] = TODAY
            result["fingerprint"] = fp
    except Exception as exc:
        result["error"] = type(exc).__name__
    return k, result

def discover(known: list[dict]) -> dict:
    old = read_json("discovered.json", {"programs": []})
    entries = {}
    visited = 0
    known_hosts = {urlsplit(p.get("url", "")).hostname or "" for p in known}
    try:
        for page in range(10):
            url = BASE if page == 0 else BASE + "?page=" + str(page)
            status, body = fetch(url)
            if status != 200: continue
            visited += 1
            parser = AnchorParser(); parser.feed(body)
            for href, title in parser.anchors:
                full = urljoin(url, href)
                host = (urlsplit(full).hostname or "").lower()
                if (not host or "europa.eu" in host or host in known_hosts or
                    not full.startswith("https://") or len(title) < 22 or len(title) > 180 or
                    any(z in title.lower() for z in STOP)):
                    continue
                q = title.lower()
                matches = [score for word, score in KEYS.items() if word in q]
                if not matches: continue
                score = max(matches)
                if score < 65: continue
                slug = hashlib.sha1((host + title.lower()).encode()).hexdigest()[:12]
                entries[slug] = {
                    "id": "eu-" + slug, "title": title, "university": "Erasmus Mundus katalog — proveriti konzorcijum",
                    "country": "EU / Erasmus Mundus", "region": "Evropa",
                    "area": ("Inženjering & kvalitet" if any(k in q for k in ["industrial", "manufactur", "quality", "transport"])
                             else "Menadžment & operacije" if any(k in q for k in ["management", "business", "entrepreneur", "innovation"])
                             else "Javne politike & NGO"),
                    "deadline": None, "deadlineNote": "nepotvrđeno — proveri zvanični sajt",
                    "funding": "unknown", "fit": score, "why": "Nov kandidat pronađen u zvaničnom katalogu Erasmus Mundus. Tematska srodnost je automatski procenjena.",
                    "money": "NEPROVERENO: katalog ne garantuje stipendiju za 2027. godinu.",
                    "url": full, "documents": ["CV", "Diploma i transkript", "Jezik", "Motivaciono pismo", "Preporuke"],
                    "caution": "Automatski otkriveno, NIJE potvrđena dostupnost programa za 2027, stipendija, školarina, rok, pravo na drugi master ili prijava za državljane Srbije.",
                    "sourceType": "automatski pronađeno u zvaničnom Erasmus katalogu",
                    "candidate": True, "tuitionEuro": None,
                }
            time.sleep(.3)
    except Exception as exc:
        print("Catalogue scan incomplete:", type(exc).__name__, str(exc)[:180])
    if not visited:
        print("Catalogue not reachable; preserving previous discoveries")
        return old
    found = sorted(entries.values(), key=lambda x: (-x["fit"], x["title"].lower()))[:65]
    return {"generatedAt": TODAY, "source": BASE,
            "description": "Automatski otkriveni kandidati, bez potvrđenih stipendija i rokova.",
            "pagesScanned": visited, "programs": found}

def main():
    source = read_json("programs.json", {"programs": []})
    prev = read_json("health.json", {}).get("sources", {})
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(monitor_one, p, prev) for p in source["programs"]]
        for f in concurrent.futures.as_completed(futures):
            key, state = f.result()
            results[key] = state
    write_json("health.json", {"generatedAt": TODAY, "info": "Tehnicka provera zvaničnih web stranica. NE potvrđuje rok niti finansiranje.", "sources": results})
    discoveries = discover(source["programs"])
    write_json("discovered.json", discoveries)
    print(f"Checked {len(results)} official links. Catalogue pages: {discoveries.get('pagesScanned', 0)}. New candidate list: {len(discoveries.get('programs', []))}.")

if __name__ == "__main__":
    main()
