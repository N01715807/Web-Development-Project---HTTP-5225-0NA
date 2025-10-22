// === Initialize map ===
// Disable default zoom control (will add later)
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

// Add zoom control at bottom left
L.control.zoom({ position: 'bottomleft' }).addTo(map);

// Satellite basemap
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 13,
  noWrap: true,
  attribution: '&copy; Esri'
}).addTo(map);

// Label layer (city name, country name)
L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels & boundaries © Esri'
}).addTo(map);

// === dragging ===
map.dragging.enable();
map.keyboard.enable();

// Load world map data
fetch("./assets/maps/world.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load world.json");
    return res.json();
  })
  .then((geoData) => {
    const worldLayer = L.geoJSON(geoData, {
      style: {
        color: "#666",
        weight: 1,
        fillOpacity: 0.6,
      },
      onEachFeature: (feature, layer) => {
        const countryCode = feature.properties.ISO_A2 || "UNKNOWN";
        const countryName = feature.properties.ADMIN || "Unknown";

        layer.bindTooltip(countryName);

        // On click: fetch languages from backend
        layer.on("click", () => {
          console.clear();
          console.log(`Selected Country: ${countryName} (${countryCode})`);
          fetchCountryData(countryCode, countryName);
        });
      },
    });

    worldLayer.addTo(map);
  })
  .catch((err) => {
    console.error("Error loading world map:", err);
  });

// Fetch country data (languages & dialects)
function fetchCountryData(countryCode, countryName) {
  const infoList = document.getElementById("info-list");
  infoList.innerHTML = `<li><strong>${countryName}</strong> — Loading languages...</li>`;

  fetch(`./api/getCountryData.php?country=${countryCode}`)
    .then((res) => {
      if (!res.ok) throw new Error("API request failed");
      return res.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        infoList.innerHTML = `<li><strong>${countryName}</strong></li><li>No language data available.</li>`;
        return;
      }

      // Display languages and dialects
      const items = data.map(
        (item) =>
          `<li><b>${item.language_name}</b> (${item.status}) ${
            item.dialect_en ? `— ${item.dialect_en}` : ""
          }</li>`
      );
      infoList.innerHTML = [`<li><strong>${countryName}</strong></li>`, ...items].join("");
    })
    .catch((err) => {
      infoList.innerHTML = `<li>Error loading data: ${err.message}</li>`;
    });
}
