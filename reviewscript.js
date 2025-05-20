let currentRating = 0;
let hovering = false;

document.addEventListener("DOMContentLoaded", () => 
{
  const starsContainer = document.getElementById("star-rating");

  // Create star elements
  for (let i = 0; i < 5; i++) 
  {
    const star = document.createElement("span");
    star.textContent = "★";
    star.dataset.index = i;
    starsContainer.appendChild(star);
  }

  starsContainer.addEventListener("click", (e) => 
  {
    if (e.target.tagName === "SPAN") 
    {
      currentRating = parseInt(e.target.dataset.index) + 1;
      updateStars(currentRating);
    }
  });

  starsContainer.addEventListener("mousemove", (e) => 
  {
    if (e.target.tagName === "SPAN") 
    {
      hovering = true;
      const hoverRating = parseInt(e.target.dataset.index) + 1;
      updateStars(hoverRating);
    }
  });

  starsContainer.addEventListener("mouseleave", () => 
  {
    hovering = false;
    updateStars(currentRating);
  });

  document.getElementById("submit-btn").addEventListener("click", submitReview);

  // ✅ Load saved reviews on page load
  loadReviews();
});

function updateStars(rating) 
{
  const stars = document.querySelectorAll("#star-rating span");
  stars.forEach((star, index) => 
  {
    if (index < rating) 
    {
      star.classList.add("filled");
    } 
    else 
    {
      star.classList.remove("filled");
    }
  });
}

function submitReview() 
{
  const nameInput = document.getElementById("name");
  const reviewInput = document.getElementById("review-text");
  const reviewsSection = document.getElementById("reviews-section");

  const name = nameInput.value.trim() || "Anonymous";
  const text = reviewInput.value.trim();

  if (!text) 
  {
    alert("Please enter a review and select a star rating.");
    return;
  }

  const reviewDiv = document.createElement("div");
  reviewDiv.className = "review";
  const now = new Date();
  const timestamp = now.toLocaleString(); // e.g., "5/8/2025, 3:30:15 PM"
  
  reviewDiv.innerHTML = `
    <div class="name">${name}</div>
    <div class="stars"> 
      ${'<span class="filled">★</span>'.repeat(currentRating)} 
      ${'<span>★</span>'.repeat(5 - currentRating)} 
    </div>
    <div class="text">${text}</div>
    <div class="timestamp">${timestamp}</div>`;
  reviewsSection.prepend(reviewDiv);

  saveReview({ name, text, rating: currentRating, timestamp });

  // Reset form
  nameInput.value = "";
  reviewInput.value = "";
  currentRating = 0;
  updateStars(document.getElementById("star-rating"), 0);
}

function saveReview(review) 
{
  const existing = JSON.parse(localStorage.getItem("reviews") || "[]");
  existing.unshift(review); 
  localStorage.setItem("reviews", JSON.stringify(existing));
}

function loadReviews() 
{
  const saved = JSON.parse(localStorage.getItem("reviews") || "[]");
  const reviewsSection = document.getElementById("reviews-section");
  saved.forEach(({ name, text, rating, timestamp }) => 
  {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    reviewDiv.innerHTML = `
      <div class="name">${name}</div>
      <div class="stars"> 
        ${'<span class="filled">★</span>'.repeat(rating)} 
        ${'<span>★</span>'.repeat(5 - rating)} 
      </div>
      <div class="text">${text}</div>
      <div class="timestamp">${timestamp}</div>`;
    reviewsSection.appendChild(reviewDiv);
  });
}