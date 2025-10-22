// ===== Map init =====
const map = L.map('map', {
  zoomControl: false,
  maxZoom: 8,
  dragging: false,
  keyboard: false,
  worldCopyJump: false,
  maxBounds: [[-85, -180], [85, 180]],
  maxBoundsViscosity: 1.0,
  inertia: false,
  bounceAtZoomLimits: false
});
map.setView([20, 0], 2.5);
map.setMinZoom(map.getZoom());

// zoom control
L.control.zoom({ position: 'bottomleft' }).addTo(map);

// basemap + labels
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 13, noWrap: true, attribution: '&copy; Esri'
}).addTo(map);
L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels & boundaries © Esri'
}).addTo(map);

map.dragging.enable();
map.keyboard.enable();

// ===== Load world borders & click =====
fetch("./assets/maps/world.json")
  .then((res) => { if (!res.ok) throw new Error("Failed to load world.json"); return res.json(); })
  .then((geoData) => {
    const worldLayer = L.geoJSON(geoData, {
      style: { color: "#666", weight: 0.5, fillOpacity: 0.2 },
      onEachFeature: (feature, layer) => {
        const countryCode = feature.properties["ISO3166-1-Alpha-2"] || "UNKNOWN";
        const countryName = feature.properties.name || "Unknown";
        layer.on("click", () => {
          console.log(`Selected Country: ${countryName} (${countryCode})`);

          const bounds = layer.getBounds();
          if (bounds && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [20, 20], maxZoom:6 });
          }

          fetchCountryBundle(countryCode);
        });
      },
    });
    worldLayer.addTo(map);
  })
  .catch((err) => console.error("Error loading world map:", err));

// ===== /api/getCountries (name mapping) =====
let COUNTRY_NAME_BY_ISO2 = null;

async function getCountryNameByIso2(iso2, fallbackName = "Unknown") {
  if (!COUNTRY_NAME_BY_ISO2) {
    const res = await fetch("./api/getCountries.php");
    if (!res.ok) throw new Error("getCountries failed");
    const rows = await res.json(); // [{ iso2, name_en }]
    COUNTRY_NAME_BY_ISO2 = new Map(
      rows.map(r => [String(r.iso2).toUpperCase(), r.name_en])
    );
  }
  return COUNTRY_NAME_BY_ISO2.get(String(iso2).toUpperCase()) ?? fallbackName;
}

// ===== Main: country basics + official languages + dialects =====
async function fetchCountryBundle(countryCode) {
  const countryName = await getCountryNameByIso2(countryCode, "") || countryCode;

  let list = document.getElementById("info-list");
  if (!list) {
    const panel = document.getElementById("info-panel") || document.body;
    list = document.createElement("ul");
    list.id = "info-list";
    panel.appendChild(list);
  }

  list.innerHTML = `
    <li><strong>${countryName}</strong></li>
    <li id="country-basics">Loading country info…</li>
    <li id="country-languages">Loading languages…</li>
  `;

  // ---- REST Countries (flag / population / area / map) ----
  try {
    const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(countryCode)}?fields=flags,population,area,maps`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("REST Countries failed");
    const data = await res.json();
    const country = Array.isArray(data) ? data[0] : data;

    const flag = country?.flags?.svg || country?.flags?.png || "";
    const population = typeof country?.population === "number" ? country.population.toLocaleString() : "—";
    const area = typeof country?.area === "number" ? `${country.area.toLocaleString()} km²` : "—";
    const mapLink = country?.maps?.googleMaps || country?.maps?.openStreetMaps || null;

    document.getElementById("country-basics").innerHTML = `
      <div class="country-basics">
        ${flag ? `<img src="${flag}" alt="Flag" class="flag">` : ""}
        <div class="meta">
          <div>Population: ${population}</div>
          <div>Area: ${area}</div>
          ${mapLink ? `<div class="map-link"><a href="${mapLink}" target="_blank" rel="noopener">Detailed map</a></div>` : ""}
        </div>
      </div>
    `;
  } catch (e) {
    console.error(e);
    const el = document.getElementById("country-basics");
    if (el) el.textContent = "Failed to load country info.";
  }

  // ---- Your backend: official languages + dialects ----
  try {
    const res = await fetch(`./api/getCountryData.php?country=${encodeURIComponent(countryCode)}`);
    if (!res.ok) throw new Error("getCountryData failed");
    const rows = await res.json(); // row: { lang_code, language_name, status, dialect_code, dialect_en }

    const container = document.getElementById("country-languages");
    if (!Array.isArray(rows) || rows.length === 0) {
      container.innerHTML = `
        <div class="section">
          <h3 class="section-title">Official languages</h3>
          <div class="empty">No official language records</div>
          <h3 class="section-title">Dialects</h3>
          <div class="empty">No dialect records</div>
        </div>`;
      return;
    }

    // Official languages (status === 'official', dedupe)
    const officialSet = new Set();
    const officialLangs = [];
    for (const r of rows) {
      if (r.status === 'official' && r.lang_code) {
        const key = r.lang_code;
        if (!officialSet.has(key)) {
          officialSet.add(key);
          officialLangs.push({ code: r.lang_code, name: r.language_name || r.lang_code });
        }
      }
    }
    officialLangs.sort((a, b) => String(a.name).localeCompare(String(b.name)));

    // Dialects (dedupe, attach parent language text)
    const dialectMap = new Map(); // code -> {code,name,language}
    for (const r of rows) {
      if (r.dialect_code && r.dialect_en) {
        if (!dialectMap.has(r.dialect_code)) {
          dialectMap.set(r.dialect_code, {
            code: r.dialect_code,
            name: r.dialect_en,
            language: r.language_name || r.lang_code || ''
          });
        }
      }
    }
    const dialects = [...dialectMap.values()].sort((a, b) => String(a.name).localeCompare(String(b.name)));

    container.innerHTML = `
      <div class="section">
        <h3 class="section-title">Official languages</h3>
        ${
          officialLangs.length
            ? `<ul class="lang-list">
                 ${officialLangs.map(l => `<li class="lang-item"><strong>${l.name}</strong> <small>[${l.code}]</small></li>`).join('')}
               </ul>`
            : `<div class="empty">No official language records</div>`
        }
        <h3 class="section-title">Dialects</h3>
        ${
          dialects.length
            ? `<ul class="dialect-list">
                 ${dialects.map(d =>
                   `<li class="dialect-item">
                      ${d.name}
                      ${d.language ? `<small class="muted">(${d.language})</small>` : ''}
                    </li>`
                 ).join('')}
               </ul>`
            : `<div class="empty">No dialect records</div>`
        }
      </div>
    `;
  } catch (e) {
    console.error(e);
    const el = document.getElementById("country-languages");
    if (el) el.textContent = "Failed to load languages.";
  }
}
