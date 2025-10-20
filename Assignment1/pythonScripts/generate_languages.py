import requests
import csv
import os

API_URL = "https://restcountries.com/v3.1/all?fields=languages"
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
OUT_FILE = os.path.join(DATA_DIR, "languages.csv")

def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    print("Fetching countries and languages from REST Countries API...")

    resp = requests.get(API_URL)
    countries = resp.json()

    langs = {}
    for c in countries:
        if "languages" not in c:
            continue
        for code, name in c["languages"].items():
            langs[code.lower()] = name.strip()

    with open(OUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["lang_code", "name_en"])
        for code, name in sorted(langs.items()):
            writer.writerow([code, name])

    print(f"Generated {OUT_FILE} with {len(langs)} languages.")

if __name__ == "__main__":
    main()