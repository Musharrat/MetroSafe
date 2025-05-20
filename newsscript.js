const articles = [
    {
      title: "NYC Subway Safety",
      description: "How we can make everyone safer in the subway",
      image: "imagesWD/safety.jpeg",
      link: "https://www.fastcompany.com/91333588/this-simple-change-could-make-nycs-subway-feel-safer"
    },
    {
      title: "Subway News",
      description: "Latest updates about NYC subways",
      image: "imagesWD/6train.jpeg",
      link: "https://www.cbsnews.com/newyork/tag/subway/"
    },
    {
      title: "Subway Dangers",
      description: "Checklist to help you stay safe",
      image: "imagesWD/turnstile.jpeg",
      link: "https://gothamist.com/news/feeling-anxious-about-riding-the-nyc-subway-heres-a-guide-for-staying-safe-underground"
    },
    {
      title: "Train Status",
      description: "Check any updates on train lines you need.",
      image: "imagesWD/status.jpeg",
      link: "https://subwaystats.com/#google_vignette"
    }
  ];
  
  const container = document.getElementById("news-container");
  
  articles.forEach(article => 
{
    const card = document.createElement("a");
    card.className = "news-card";
    card.href = article.link;
    card.target = "_blank"; // open in new tab
  
    card.innerHTML = `
      <img src="${article.image}" alt="${article.title}" />
      <div class="news-content">
        <div class="news-title">${article.title}</div>
        <div class="news-description">${article.description}</div>
      </div>
    `;
  
    container.appendChild(card);
});