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



document.addEventListener("DOMContentLoaded", function () {
    const videos = [
        {
            url: "https://www.youtube.com/embed/gQc0yYHR988",
            title: "Subway Rats",
            description: "An up-close look at subway rats navigating the MTA system."
        },
        {
            url: "https://www.youtube.com/embed/1_5MNeXUKf4",
            title: "Rat Returns",
            description: "Rats scamper out from under homeless man’s blanket on NYC subway platform, horrifying video shows"
        },
        {
            url: "https://www.youtube.com/embed/u5k5SNy_M1k",
            title: "Flood Rat",
            description: "Video Of Rat Hiding From NYC Subway Flooding Goes Viral."
        }
    ];

    const container = document.getElementById("videoContainer");

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

        container.appendChild(wrapper);
    });
});


document.getElementById("videoUpload").addEventListener("change", function (event) {
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

        document.getElementById("videoContainer").prepend(wrapper);
    } else {
        alert("Please upload a valid video file.");
    }
});

