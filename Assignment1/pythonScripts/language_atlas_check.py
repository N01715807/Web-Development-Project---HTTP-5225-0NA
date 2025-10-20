import pandas as pd

# === Load CSVs ===
countries = pd.read_csv("data/country_codes.csv")
languages = pd.read_csv("data/languages.csv")
regions = pd.read_csv("data/admin_codes_cn.csv")
dialects = pd.read_csv("data/dialects_cn.csv")
country_lang = pd.read_csv("data/country_languages.csv")
dialect_regions = pd.read_csv("data/dialect_regions.csv")

print("\n✅ Files loaded successfully\n")

# === Foreign key consistency checks ===

# 1️⃣ country_languages → countries
missing_country_fk = country_lang[~country_lang["iso2"].isin(countries["iso2"])]
print(f"❌ Missing countries referenced: {len(missing_country_fk)}")
print(missing_country_fk.head(), "\n")

# 2️⃣ country_languages → languages
missing_lang_fk = country_lang[~country_lang["lang_code"].isin(languages["lang_code"])]
print(f"❌ Missing languages referenced: {len(missing_lang_fk)}\n")

# 3️⃣ dialects → languages
missing_dialect_lang_fk = dialects[~dialects["language_code"].isin(languages["lang_code"])]
print(f"❌ Dialects with unknown language_code: {len(missing_dialect_lang_fk)}\n")

# 4️⃣ dialect_regions → dialects
missing_dialect_fk = dialect_regions[~dialect_regions["dialect_code"].isin(dialects["dialect_code"])]
print(f"❌ dialect_regions referencing missing dialects: {len(missing_dialect_fk)}\n")

# 5️⃣ dialect_regions → regions
missing_region_fk = dialect_regions[~dialect_regions["region_code"].isin(regions["iso_3166_2"])]
print(f"❌ dialect_regions referencing missing regions: {len(missing_region_fk)}\n")

print("✅ Validation completed\n")

# === Show missing ISO2 codes ===
if not missing_country_fk.empty:
    missing_iso2_list = sorted(missing_country_fk["iso2"].unique())
    print("🚨 The following country codes appear in country_languages.csv but not in country_codes.csv:")
    print(missing_iso2_list)
    print(f"Total missing: {len(missing_iso2_list)}\n")
