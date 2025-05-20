// Helper: animate numeric count-up
function animateCount(el, end, duration = 800) {
  let start = 0, startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = ts - startTime;
    const value = Math.min(Math.floor((progress / duration) * end), end);
    el.innerText = value;
    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/–|—|-/g, '')              // remove all kinds of dashes
    .replace(/street/g, 'st')
    .replace(/avenue/g, 'av')
    .replace(/station/g, '')
    .replace(/\s+/g, '')               // remove all whitespace
    .replace(/[^a-z0-9]/g, '');        // strip punctuation
}



document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const stationParam = urlParams.get("station");
  let datasetMaxDate;

  fetch("metro_incidents_clean2.json")
    .then(res => res.json())
    .then(json => {
      // figure out the latest date across all entries
      datasetMaxDate = new Date(
        Math.max(...json.map(e => new Date(e.date)))
      );
      // now filter for this station and call populatePage
      const stationName = decodeURIComponent(stationParam);
      const filtered = json.filter(entry =>
        normalizeName(entry.station) === normalizeName(stationName)
      );
      populatePage(filtered, stationName);
    })
    .catch(/*…*/)


  if (stationParam) {
    fetch("metro_incidents_clean2.json")
      .then(res => res.json())
      .then(json => {
        const stationName = decodeURIComponent(stationParam);
        const filtered = json.filter(entry =>
          normalizeName(entry.station) === normalizeName(stationName)
        );
               

        if (filtered.length === 0) {
          alert("No data found for station: " + stationName);
          return;
        }

        populatePage(filtered, stationName);
      })
      .catch(err => {
        console.error("Failed to load JSON:", err);
        alert("Could not load station data.");
      });
  } else {
    // fallback: use sample data
    const sampleData = {
      totalIncidents: 15,
      lastMonthIncidents: 12,
      crimesByType: { Theft: 6, Assault: 4, Vandalism: 2, Harassment: 3 },
      recentIncidents: [
        { date: "Apr 21, 2025", type: "Theft", description: "Pickpocket incident reported." },
        { date: "Apr 18, 2025", type: "Assault", description: "Passenger punched on platform." },
        { date: "Apr 15, 2025", type: "Theft", description: "Smartphone snatched." },
        { date: "Apr 10, 2025", type: "Vandalism", description: "Graffiti on station walls." },
        { date: "Apr 05, 2025", type: "Harassment", description: "Aggressive panhandler reported." }
      ],
      safetyTips: [
        "Stay alert and aware of your surroundings.",
        "Secure your belongings to prevent pickpocketing.",
        "At night, stay near agent booths or well-lit areas.",
        "Use the Help Point intercom in emergncies."
      ]
    };
    populateSampleData(sampleData);
  }

  // Theme toggle
  const tog = document.getElementById("themeToggle");
  tog.checked = localStorage.theme === "light";
  document.body.classList.toggle("light-theme", tog.checked);
  tog.addEventListener("change", () => {
    document.body.classList.toggle("light-theme", tog.checked);
    localStorage.theme = tog.checked ? "light" : "dark";
  });

  // Scroll-triggered reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});

function populatePage(filtered, stationName, datasetMaxDate) {

  // 1) compute the station’s own latest incident date
  const latest = new Date(
    Math.max(...filtered.map(i => new Date(i.date)))
  );

  // 2) roll back 30 days from that date
  const cutoff = new Date(latest);
  cutoff.setDate(latest.getDate() - 30);

  // 3) count incidents in that 30-day window
  const last30 = filtered
    .filter(i => new Date(i.date) >= cutoff)
    .length;


  // 4) Show “Incidents this month” as last30
  animateCount(
    document.getElementById("total-crimes"),
    last30
  );

  // 5) Trend vs prior 30-day window
  const prevCutoff = new Date(cutoff);
  prevCutoff.setDate(cutoff.getDate() - 30);
  const prev30 = filtered.filter(i => {
    const d = new Date(i.date);
    return d >= prevCutoff && d < cutoff;
  }).length;

  const diff = last30 - prev30;
  const pct  = prev30 ? Math.round((Math.abs(diff) / prev30) * 100) : 0;
  document.getElementById("crime-trend").innerText =
    diff > 0 ? `Rising (+${pct}%)`
  : diff < 0 ? `Falling (${pct}%)`
  : "No change";

  // 6) Breakdown of that same last30 window
  const counts = {};
  filtered.forEach(i => {
    const d = new Date(i.date);
    if (d >= cutoff) counts[i.type] = (counts[i.type]||0) + 1;
  });
  const breakdown = document.getElementById("crime-breakdown");
  breakdown.innerHTML = "";
  for (const [type, count] of Object.entries(counts)) {
    const percent = last30
      ? Math.round((count / last30) * 100)
      : 0;
    const li = document.createElement("li");
    li.textContent = `${type}: ${count} (${percent}%)`;
    breakdown.appendChild(li);
  }

  // 7) Avg. incidents/day
  const avgEl = document.getElementById("avg-incidents");
  if (avgEl) {
    avgEl.innerText = (last30 / 30).toFixed(1);
  }

  

  const dates = filtered.map(i => new Date(i.date));
  const last = new Date(Math.max(...dates));
  const daysAgo = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));
  animateCount(document.getElementById("last-incident"), daysAgo);

  const container = document.getElementById("incidents-container");
  container.innerHTML = "";
  filtered.slice(0, 30).forEach(inc => {
    const card = document.createElement("div");
    card.className = "incident-card";
    card.dataset.type = inc.type;
    card.innerHTML = `
      <strong>Type of Crime: ${inc.type}</strong>
      <p>${inc.description}</p>
    `;
    container.appendChild(card);
  });
  


  document.querySelectorAll(".filter-checkbox").forEach(cb =>
    cb.addEventListener("change", () => {
      // 1) collect all checked filter values
      const active = Array.from(
        document.querySelectorAll(".filter-checkbox:checked")
      ).map(i => i.value);

      // 2) show cards whose data-type is in that array, hide the rest
      document.querySelectorAll(".incident-card").forEach(card => {
        const type = card.dataset.type; 
        card.style.display = active.includes(type) ? "" : "none";
      });
    })
  );

  // ── danger meter (using last30, not undefined total) ────────────────────
  const MONTHLY_THRESHOLD = 20; 
  const level = Math.min((last30 / MONTHLY_THRESHOLD) * 100, 100);
  const meter = document.getElementById("dangerMeterFill");
  const label = document.getElementById("dangerLevelValue");

  let txt = "Low", col = "#2ecc71", txtCol = "#fff";
  if (level >= 66)      { txt = "High";    col = "#e74c3c"; }
  else if (level >= 33) { txt = "Moderate";col = "#f1c40f"; txtCol = "#000"; }

  meter.style.width      = `${level}%`;
  meter.style.background = col;
  label.textContent      = txt;
  label.style.color      = txtCol;

}

function populateSampleData(data) {
  animateCount(document.getElementById("total-crimes"), data.totalIncidents);

  const trendEl = document.getElementById("crime-trend");
  const diff = data.totalIncidents - data.lastMonthIncidents;
  const pct = Math.round((diff / data.lastMonthIncidents) * 100);
  trendEl.innerText = diff > 0 ? `Rising (+${pct}%)` : diff < 0 ? `Falling (${pct}%)` : "No change";

  const breakdown = document.getElementById("crime-breakdown");
  for (let [k, v] of Object.entries(data.crimesByType)) {
    const li = document.createElement("li");
    li.textContent = `${k}: ${v} (${Math.round(v / data.totalIncidents * 100)}%)`;
    breakdown.appendChild(li);
  }

  const lastEl = document.getElementById("last-incident");
  const lastDate = new Date(data.recentIncidents[0].date);
  const daysAgo = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
  animateCount(lastEl, daysAgo);

  const container = document.getElementById("incidents-container");
  data.recentIncidents.forEach(inc => {
    const card = document.createElement("div");
    card.className = "incident-card";
    card.dataset.type = inc.type;
    card.innerHTML = `<strong>${inc.date} – ${inc.type}</strong><p>${inc.description}</p>`;
    container.appendChild(card);
  });

  const tips = document.getElementById("tips-list");
  data.safetyTips.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    tips.appendChild(li);
  });

  const level = Math.round(data.totalIncidents / 20 * 100);
  let txt = "Low", col = "#2ecc71", txtCol = "#FFF";
  if (level >= 66)    { txt = "High";    col = "#e74c3c"; }
  else if (level >= 33){ txt = "Moderate";col = "#f1c40f"; txtCol = "#000"; }

  const meter = document.getElementById("dangerMeterFill");
  const label = document.getElementById("dangerLevelValue");
  meter.style.width = `${level}%`;
  meter.style.background = col;
  label.textContent = txt;
  label.style.color = txtCol;
}
