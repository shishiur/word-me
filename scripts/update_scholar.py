#!/usr/bin/env python3
"""Refresh public Google Scholar profile data through SerpApi.

The SerpApi key is read only from the SERPAPI_KEY environment variable.
No secret is written to the repository.
"""
from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

AUTHOR_ID = os.getenv("SCHOLAR_AUTHOR_ID", "TPRfbZ8AAAAJ")
OUTPUT = Path(os.getenv("SCHOLAR_OUTPUT", "data/scholar.json"))
API_KEY = os.getenv("SERPAPI_KEY")


def _as_int(value):
    if value is None or value == "":
        return None
    try:
        return int(str(value).replace(",", "").strip())
    except (TypeError, ValueError):
        return None


def _metric_from_table(table, key):
    for row in table or []:
        if key in row:
            value = row.get(key)
            if isinstance(value, dict):
                return _as_int(value.get("all"))
            return _as_int(value)
    return None


def fetch_profile():
    if not API_KEY:
        raise RuntimeError("SERPAPI_KEY is not configured")

    params = {
        "engine": "google_scholar_author",
        "author_id": AUTHOR_ID,
        "hl": "en",
        "num": 100,
        "api_key": API_KEY,
    }
    url = "https://serpapi.com/search.json?" + urlencode(params)
    request = Request(url, headers={"User-Agent": "ShishirPortfolioScholarUpdater/1.0"})
    with urlopen(request, timeout=45) as response:
        return json.load(response)


def normalize(raw):
    error = raw.get("error")
    if error:
        raise RuntimeError(f"SerpApi returned an error: {error}")

    author = raw.get("author") or {}
    articles_raw = raw.get("articles") or []
    cited_by = raw.get("cited_by") or {}
    table = cited_by.get("table") or []

    articles = []
    for item in articles_raw:
        cited = item.get("cited_by") or {}
        articles.append({
            "title": item.get("title"),
            "link": item.get("link"),
            "citation_id": item.get("citation_id"),
            "authors": item.get("authors"),
            "publication": item.get("publication"),
            "year": _as_int(item.get("year")),
            "citations": _as_int(cited.get("value")),
            "cited_by_link": cited.get("link"),
        })

    citations = _metric_from_table(table, "citations")
    h_index = _metric_from_table(table, "h_index")
    i10_index = _metric_from_table(table, "i10_index")

    # If the table shape changes, keep useful fallbacks instead of failing the sync.
    if citations is None:
        citations = _as_int(cited_by.get("total"))

    return {
        "source": "Google Scholar via SerpApi",
        "author_id": AUTHOR_ID,
        "status": "ok",
        "last_updated_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "profile": {
            "name": author.get("name"),
            "affiliations": author.get("affiliations"),
            "email": author.get("email"),
            "interests": author.get("interests") or [],
            "thumbnail": author.get("thumbnail"),
            "link": f"https://scholar.google.com/citations?user={AUTHOR_ID}&hl=en",
        },
        "metrics": {
            "works": len(articles),
            "citations": citations,
            "citations_display": str(citations) if citations is not None else None,
            "h_index": h_index,
            "i10_index": i10_index,
        },
        "articles": articles,
    }


def main():
    try:
        raw = fetch_profile()
        data = normalize(raw)
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Updated {OUTPUT} with {data['metrics']['works']} Scholar records")
    except Exception as exc:
        print(f"Scholar update failed: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
