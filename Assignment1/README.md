# Language Atlas
A multilingual map project built with **PHP + MySQL**.  
Click on a country to view its official languages;  
for China, you can view the distribution of regional dialects.

---

## 1. Data & Naming Rules
**Hierarchy:**  
Country → Language → Dialect  
Dialects are linked to provinces/states (ISO 3166-2).

### Country Codes
- Use ISO 3166-1 two-letter country codes.  
  Examples:
  - CN — China  
  - CA — Canada  
  - JP — Japan  
  - FR — France  

### Province/State Codes
- Follow the ISO 3166-2 standard.  
  Examples:
  - CN-GD — Guangdong Province  
  - CN-ZJ — Zhejiang Province  
  - HK — Hong Kong SAR  
  - MO — Macao SAR  

### Language Codes
- Use ISO 639-1 two-letter language codes.  
  Examples:
  - zh — Chinese  
  - en — English  
  - fr — French  
  - es — Spanish  

### Data Sources
This project integrates multiple open datasets for world and regional language visualization.
| Purpose | Source | Request / File | Returned / Description |
|----------|---------|----------------|-------------------------|
| **All countries (full metadata)** | [REST Countries API](https://restcountries.com/v3.1/all) | `https://restcountries.com/v3.1/all` | Returns full JSON data for all countries (population, area, flags, languages, etc.) |
| **Country–Language mapping** | REST Countries API | `https://restcountries.com/v3.1/all?fields=cca2,languages` | Returns ISO-3166-1 2-letter country code and its official language list |
| **Global language list** | REST Countries API | `https://restcountries.com/v3.1/all?fields=languages` | Returns all official languages across countries (used for `languages.csv`) |
| **National flags** | REST Countries API | `https://restcountries.com/v3.1/alpha/{code}?fields=flags` | Returns SVG and PNG flag URLs for a given country |
| **World map boundaries** | [geo-countries dataset (GitHub)](https://github.com/datasets/geo-countries) | `data/world.geojson` | GeoJSON boundaries for all recognized countries (used in map rendering) |
| **China provincial boundaries** | [SimpleMaps China GeoJSON](https://simplemaps.com/resources/svg-china) | `data/china_admin1.geojson` | Province-level boundaries (with `id` and `name` fields for mapping dialect regions) |
> All data sources are **open and free for non-commercial educational use**.  
> REST Countries © [apilayer](https://apilayer.com) — dataset maintained under open license.  
> GeoJSON boundaries © [SimpleMaps](https://simplemaps.com) and [DataHub.io](https://datahub.io/core/geo-countries).

---

### Database Structure (Data Tables)
| Table Name | Description |
|-------------|--------------|
| **countries** | Stores basic country information (code, name). |
| **regions** | Lists provinces/states of all countries, distinguished by `country_code`. |
| **languages** | Master list of languages (uses ISO 639-1 language codes). |
| **dialects** | List of dialects under each language, linked to a `country_code`. |
| **country_languages** | Defines which languages are spoken in each country and their status (`official` / `regional` / `minority`). |
| **dialect_regions** | Maps dialects to the regions where they are spoken — used for map highlighting. |
| **special_regions** | Stores non-standard or disputed areas (e.g. territories, unrecognized states, or overseas bases) with fields like `region_type` and `parent_iso2`. |
