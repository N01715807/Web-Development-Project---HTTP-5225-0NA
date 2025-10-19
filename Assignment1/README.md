# 🌍 Language Atlas
A multilingual map project built with **PHP + MySQL**.  
Click on a country to view its official languages;  
for China, you can view the distribution of regional dialects.

---

## 🧭 1. Data & Naming Rules
**Hierarchy:**  
Country → Language → Dialect  
Dialects are linked to provinces/states (ISO 3166-2).

### 📌 Country Codes
- Use ISO 3166-1 two-letter country codes.  
  Examples:
  - CN — China  
  - CA — Canada  
  - JP — Japan  
  - FR — France  

### 📌 Province/State Codes
- Follow the ISO 3166-2 standard.  
  Examples:
  - CN-GD — Guangdong Province  
  - CN-ZJ — Zhejiang Province  
  - HK — Hong Kong SAR  
  - MO — Macao SAR  

### 📌 Language Codes
- Use ISO 639-1 two-letter language codes.  
  Examples:
  - zh — Chinese  
  - en — English  
  - fr — French  
  - es — Spanish  

### 📌 Data Sources
- Initially include data for 20 countries manually;  
- Expand gradually based on ongoing research and verified datasets.
