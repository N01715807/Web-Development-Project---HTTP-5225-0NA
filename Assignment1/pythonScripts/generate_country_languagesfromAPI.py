import os, csv, json, sys, requests

API_URL = "https://restcountries.com/v3.1/all?fields=cca2,languages"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, os.pardir))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
OUT_FILE = os.path.join(DATA_DIR, "country_languages.csv")
RAW_FILE = os.path.join(DATA_DIR, "_restcountries_raw.json")

def main():
    os.makedirs(DATA_DIR, exist_ok=True)

    print(f"→ GET {API_URL}")
    try:
        resp = requests.get(API_URL, timeout=60)
    except Exception as e:
        print(f"Request failed: {e}")
        sys.exit(1)

    print("HTTP", resp.status_code)
    if resp.status_code != 200:
        with open(os.path.join(DATA_DIR, "_restcountries_raw.txt"), "wb") as f:
            f.write(resp.content)
        print("✗ Non-200 response. Raw content saved to data/_restcountries_raw.txt")
        sys.exit(1)

    try:
        data = resp.json()
    except Exception as e:
        with open(os.path.join(DATA_DIR, "_restcountries_raw.txt"), "wb") as f:
            f.write(resp.content)
        print("✗ JSON parsing failed. Raw content saved to data/_restcountries_raw.txt")
        print("Error:", e)
        sys.exit(1)

    with open(RAW_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    if not isinstance(data, list):
        print("✗ Response is not a list (likely an error message). Check data/_restcountries_raw.json.")
        sys.exit(1)

    total = len(data)
    with_lang = sum(1 for c in data if isinstance(c, dict) and c.get("languages"))
    print(f"Total countries: {total}, with languages: {with_lang}")

    rows = []
    for c in data:
        if not isinstance(c, dict):
            continue
        iso2 = (c.get("cca2") or "").upper().strip()
        langs = c.get("languages") or {}
        if not iso2 or not isinstance(langs, dict) or not langs:
            continue
        for code in langs.keys():
            lang_code = (code or "").lower().strip()
            if not lang_code:
                continue
            rows.append([iso2, lang_code, "official"])

    rows.sort(key=lambda r: (r[0], r[1]))

    with open(OUT_FILE, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["iso2", "lang_code", "status"])
        w.writerows(rows)

    print(f"✅ Wrote {len(rows)} rows (excluding header) to {OUT_FILE}")
    print(f"🧾 Raw JSON saved at: {RAW_FILE}")

if __name__ == "__main__":
    main()