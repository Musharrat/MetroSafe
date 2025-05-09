document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("stationCards");
    const searchInput = document.getElementById("stationSearch");
    let stationData = [];
  
    function renderCards(data) {
      container.innerHTML = "";
      data.forEach((station) => {
        const card = document.createElement("div");
        card.className = "station-card";
        card.innerHTML = `
          <h3>${station.station}</h3>
          <ul>
            <li>🧹 Cleanliness: ${station.cleanliness}</li>
            <li>🛗 Elevator: ${station.elevator}</li>
            <li>💡 Lighting: ${station.lighting}</li>
            <li>🛠️ Maintenance: ${station.maintenance}</li>
          </ul>
        `;
        container.appendChild(card);
      });
    }
  
    function getRandomSubset(array, count) {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  
    fetch("stations.json")
      .then((response) => response.json())
      .then((data) => {
        stationData = data;
        renderCards(getRandomSubset(stationData, 9));
  
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.trim().toLowerCase();
          if (query === "") {
            renderCards(getRandomSubset(stationData, 3));
          } else {
            const filtered = stationData.filter((s) =>
              s.station.toLowerCase().includes(query)
            );
            renderCards(filtered);
          }
        });
      })
      .catch((error) => {
        console.error("Failed to load stations.json:", error);
      });
  });
  