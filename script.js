document.addEventListener("DOMContentLoaded", () => {
  // ========== mmobile nav toggle ==========
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // ========== hero video section ==========
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight) heroVideo.pause();
      else heroVideo.play();
    });
  }

  // ========== stroy scroll reveal ==========
  const storyItems = document.querySelectorAll(".story-item");
  const storyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        storyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  storyItems.forEach(item => storyObserver.observe(item));

  // ========== typewritier effect ==========
  const lines = document.querySelectorAll(".reveal-line");
  const lineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("visible")) {
        entry.target.classList.add("visible", "typing");
      }
    });
  }, { threshold: 0.6 });
  lines.forEach(line => lineObserver.observe(line));

  // ========== station serach ==========
  const container = document.getElementById("stationCards");
  const searchInput = document.getElementById("stationSearch");
  let stationData = [];

  function renderCards(data) {
    if (!container) return;
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

      if (searchInput) {
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
      }
    })
    .catch((error) => {
      console.error("Failed to load stations.json:", error);
    });
});
