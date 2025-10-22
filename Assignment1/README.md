# Language Atlas
A multilingual map project built with**HTML5 / CSS3 / JavaScript (ES6)**,**PHP+MySQL**;  
Click on a country to view its official languages;  
for China, you can view the distribution of regional dialects.  
**Architecture**  
Frontend (Leaflet + JS)  
↓  
Backend (PHP APIs)  
↓  
Database (MySQL)  

---

## 1. Run with Docker Compose
1. Prerequisites
- [Docker Desktop](https://www.docker.com/) or Docker Engine  
- [Docker Compose](https://docs.docker.com/compose/)
2. Setup
```bash
cp .env.example .env
docker-compose up --build
```
3. Access
- Web App: http://localhost:8000
Interactive world map showing country info, official languages, and dialects.
- Database (phpMyAdmin): http://localhost:8080
4. Manage
```bash
docker-compose down       # Stop containers
docker-compose logs -f    # View logs
```

---

## 2. Frontend Overview
The frontend provides an interactive world map that lets users:
- Click a country to view its languages and dialects.  
- Expand a language (e.g., Chinese) to see related dialects.  
- Select a dialect to highlight the regions where it is spoken.

### User Interaction Flow
| Step | User Action | System Response |
|------|--------------|-----------------|
| 1️⃣ | Click a country | Map zooms in; sidebar shows “Loading languages…” |
| 2️⃣ | Call `/api/getLanguages.php?country=CN` | Fetch and display country’s languages |
| 3️⃣ | Expand a language | Fetch dialects from `/api/getDialects.php` |
| 4️⃣ | Click a dialect | Call `/api/getRegions.php?dialect_id=...` and highlight matching regions |
| 5️⃣ | Click “Back” | Zoom out to the full world map view |

### Key Interaction Logic (Simplified)
```plaintext
Click country
   ↓
Fetch languages
   ↓
Render sidebar
   ↓
Expand language → Fetch dialects
   ↓
Click dialect → Fetch & highlight regions
   ↓
Zoom / Reset as needed
```

## 3. Backend Logic Overview
Build a lightweight PHP API layer that allows the frontend (the interactive map) to fetch real data from the MySQL database.  
The backend is **read-only** — it only handles data retrieval, not create/update/delete operations.

### Core Backend Logic Flow
1. The frontend sends a request (e.g., `/api/getLanguages.php?country=CN`)
2. The API file connects to the database via `db.php`
3. Executes the corresponding SQL query
4. Returns data in JSON format to the frontend

### Key File Overview
| File Path | Purpose |
|------------|----------|
| `src/config/db.php` | Establishes the PDO database connection and manages connection errors |
| `public/api/getCountries.php` | Returns a JSON list of all countries (`iso2`, `name_en`) from the `countries` table |
| `public/api/getLanguages.php` | Retrieves all languages and their statuses (`official`, `regional`, etc.) for a given country |
| `public/api/getDialects.php` | Fetches dialects belonging to a specific language (optionally filtered by country) |
| `public/api/getRegions.php` | Lists all regions or provinces where a specific dialect is spoken |
| `public/api/getCountryData.php` | Combined endpoint — returns both languages and dialects for a given country in a single response |

---

## 4. Data & Naming Rules
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
