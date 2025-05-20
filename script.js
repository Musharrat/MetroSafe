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

  // ========== station search ==========
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

  // ========== homepage station search redirect ==========
  const input = document.getElementById("stationInput");
  const datalist = document.getElementById("station-options");
  const goBtn = document.getElementById("goBtn");

  if (input && datalist && goBtn) {
    let stationsList = [];

    fetch("metro_incidents_clean2.json")
      .then(res => res.json())
      .then(data => {
        const stations = new Set();
        data.forEach(entry => {
          if (entry.station && entry.station.trim()) {
            stations.add(entry.station.trim());
          }
        });
        stationsList = [...stations].sort();
      });

    input.addEventListener("input", () => {
      if (input.value.length >= 2) {
        datalist.innerHTML = "";
        stationsList
          .filter(station =>
            station.toLowerCase().includes(input.value.toLowerCase())
          )
          .forEach(station => {
            const opt = document.createElement("option");
            opt.value = station;
            datalist.appendChild(opt);
          });
      } else {
        datalist.innerHTML = "";
      }
    });

    goBtn.addEventListener("click", () => {
      const station = input.value.trim();
      if (station) {
        const encoded = encodeURIComponent(station);
        window.location.href = `info.html?station=${encoded}`;
      }
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") goBtn.click();
    });
  }

  // ========== rat page ==========
  const videoContainer = document.getElementById("videoContainer");
  if (videoContainer) {
    const videos = [
      {
        url: "https://www.youtube.com/embed/gQc0yYHR988",
        title: "Subway Rats",
        description: "An up-close look at subway rats navigating the MTA system."
      },
      {
        url: "https://www.youtube.com/embed/1_5MNeXUKf4",
        title: "Rat Returns",
        description: "Rats scamper out from under homeless man’s blanket on NYC subway platform."
      },
      {
        url: "https://www.youtube.com/embed/u5k5SNy_M1k",
        title: "Flood Rat",
        description: "Video Of Rat Hiding From NYC Subway Flooding Goes Viral."
      }
    ];

    videos.forEach(video => {
      const wrapper = document.createElement("div");
      wrapper.className = "right-sidebar-content";
      wrapper.innerHTML = `
        <div class="rat-videos">
          <iframe width="100%" height="315"
              src="${video.url}"
              title="${video.title}" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
        </div>
        <div class="rat-video-detail">
            <h5>${video.title}</h5>
            <p>${video.description}</p>
        </div>
        <div class="clear-element"></div>
      `;
      videoContainer.appendChild(wrapper);
    });

    const upload = document.getElementById("videoUpload");
    if (upload) {
      upload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("video/")) {
          const videoURL = URL.createObjectURL(file);
          const wrapper = document.createElement("div");
          wrapper.className = "right-sidebar-content";
          wrapper.innerHTML = `
            <div class="rat-videos">
              <video width="100%" height="315" controls>
                <source src="${videoURL}" type="${file.type}">
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="rat-video-detail">
              <h5>Your Uploaded Video</h5>
              <p>This video was added by a visitor.</p>
            </div>
            <div class="clear-element"></div>
          `;
          videoContainer.prepend(wrapper);
        } else {
          alert("Please upload a valid video file.");
        }
      });
    }
  }

  // ========== crime tracker ==========
  const chartCanvas = document.getElementById('crimeChart');
  if (chartCanvas) {
    let stations = JSON.parse(localStorage.getItem('stations')) || ["Times Square", "Union Square", "Grand Central"];
    let crimeCounts = JSON.parse(localStorage.getItem('crimeCounts')) || [5, 3, 2];
    let incidentLogData = JSON.parse(localStorage.getItem('incidentLog')) || [];

    const ctx = chartCanvas.getContext('2d');
    const crimeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stations,
        datasets: [{
          label: 'Reported Incidents',
          data: crimeCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    const log = document.getElementById('incidentList');
    incidentLogData.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.station}: ${entry.incident}`;
      log.appendChild(li);
    });

    const form = document.getElementById('crimeForm');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const station = document.getElementById('stationSelect').value;
        const incident = document.getElementById('incidentText').value.trim();
        if (!station || !incident) return;

        const index = stations.indexOf(station);
        if (index !== -1) {
          crimeCounts[index]++;
        } else {
          stations.push(station);
          crimeCounts.push(1);
        }

        localStorage.setItem('stations', JSON.stringify(stations));
        localStorage.setItem('crimeCounts', JSON.stringify(crimeCounts));

        crimeChart.data.labels = stations;
        crimeChart.data.datasets[0].data = crimeCounts;
        crimeChart.update();

        const li = document.createElement('li');
        li.textContent = `${station}: ${incident}`;
        log.prepend(li);
        incidentLogData.unshift({ station, incident });
        localStorage.setItem('incidentLog', JSON.stringify(incidentLogData));

        form.reset();
      });
    }
  }
});
