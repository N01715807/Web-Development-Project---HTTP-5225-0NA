// 🌍 Initialize the map
const map = L.map("map").setView([20, 0], 2);

// 🧱 Add tile layer (OpenStreetMap)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 5,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// 🗺️ Load world map data
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

        // 🖱️ On click: fetch languages from backend
        layer.on("click", () => {
          console.clear();
          console.log(`🗺️ Selected Country: ${countryName} (${countryCode})`);
          fetchCountryData(countryCode, countryName);
        });
      },
    });

    worldLayer.addTo(map);
  })
  .catch((err) => {
    console.error("❌ Error loading world map:", err);
  });

// 🌐 Fetch country data (languages & dialects)
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
