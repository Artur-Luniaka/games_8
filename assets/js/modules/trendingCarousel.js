// Trending Carousel Module - GameVault
// Displays trending games in a carousel on the homepage

class TrendingCarousel {
  constructor() {
    this.carouselContainer = document.getElementById("trending-games");
    this.gamesData = [];
    this.currentSlide = 0;
    this.slidesToShow = 3;
    this.init();
  }

  async init() {
    try {
      await this.loadGamesData();
      this.renderCarousel();
      this.setupEventListeners();
      this.startAutoPlay();
    } catch (error) {
      console.error("Failed to load trending games:", error);
      this.showFallbackContent();
    }
  }

  async loadGamesData() {
    const response = await fetch("./assets/data/games.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    this.gamesData = data.games || [];
  }

  renderCarousel() {
    if (!this.carouselContainer) return;

    // Get trending games (random selection for demo)
    const trendingGames = this.gamesData.slice(0, 9);

    const carouselHTML = `
      <div class="carousel-wrapper">
        <div class="carousel-track" id="carousel-track">
          ${trendingGames.map((game) => this.createSlide(game)).join("")}
        </div>
        <div class="carousel-controls">
          <button class="carousel-btn carousel-prev" id="carousel-prev" aria-label="Previous slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div class="carousel-dots" id="carousel-dots">
            ${this.createDots(
              Math.ceil(trendingGames.length / this.slidesToShow)
            )}
          </div>
          <button class="carousel-btn carousel-next" id="carousel-next" aria-label="Next slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.carouselContainer.innerHTML = carouselHTML;
  }

  createSlide(game) {
    const price = game.price || 59.99;
    const discount = game.discount || 0;
    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

    return `
      <div class="carousel-slide" data-game-id="${game.id}">
        <div class="trending-game-card">
          <div class="game-image">
            <img src="${game.image}" alt="${game.title}" loading="lazy" />
            ${
              discount > 0
                ? `<span class="trending-discount">-${discount}%</span>`
                : ""
            }
            <div class="trending-overlay">
              <button class="trending-quick-view" data-game-id="${game.id}">
                Quick View
              </button>
            </div>
          </div>
          <div class="game-info">
            <h4 class="game-title">${game.title}</h4>
            <p class="game-genre">${game.genre}</p>
            <div class="game-rating">
              <span class="stars">${this.generateStars(
                game.rating || 4.5
              )}</span>
              <span class="rating-value">${game.rating || 4.5}</span>
            </div>
            <div class="game-price">
              ${
                discount > 0
                  ? `<span class="original-price">$${price.toFixed(2)}</span>`
                  : ""
              }
              <span class="current-price">$${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createDots(count) {
    return Array.from(
      { length: count },
      (_, i) =>
        `<button class="carousel-dot ${
          i === 0 ? "active" : ""
        }" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join("");
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  }

  setupEventListeners() {
    if (!this.carouselContainer) return;

    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const dots = document.getElementById("carousel-dots");
    const track = document.getElementById("carousel-track");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.prevSlide());
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextSlide());
    }

    if (dots) {
      dots.addEventListener("click", (event) => {
        const dot = event.target.closest(".carousel-dot");
        if (dot) {
          const slideIndex = parseInt(dot.dataset.slide);
          this.goToSlide(slideIndex);
        }
      });
    }

    // Game card interactions
    this.carouselContainer.addEventListener("click", (event) => {
      const quickViewBtn = event.target.closest(".trending-quick-view");
      const gameCard = event.target.closest(".trending-game-card");

      if (quickViewBtn) {
        const gameId = quickViewBtn.dataset.gameId;
        this.handleQuickView(gameId);
      } else if (gameCard) {
        const gameId = gameCard.closest(".carousel-slide").dataset.gameId;
        this.handleGameClick(gameId);
      }
    });

    // Pause auto-play on hover
    this.carouselContainer.addEventListener("mouseenter", () => {
      this.pauseAutoPlay();
    });

    this.carouselContainer.addEventListener("mouseleave", () => {
      this.resumeAutoPlay();
    });

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    this.carouselContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.carouselContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  prevSlide() {
    const totalSlides = Math.ceil(this.gamesData.length / this.slidesToShow);
    this.currentSlide =
      this.currentSlide > 0 ? this.currentSlide - 1 : totalSlides - 1;
    this.updateCarousel();
  }

  nextSlide() {
    const totalSlides = Math.ceil(this.gamesData.length / this.slidesToShow);
    this.currentSlide =
      this.currentSlide < totalSlides - 1 ? this.currentSlide + 1 : 0;
    this.updateCarousel();
  }

  goToSlide(slideIndex) {
    this.currentSlide = slideIndex;
    this.updateCarousel();
  }

  updateCarousel() {
    const track = document.getElementById("carousel-track");
    const dots = document.querySelectorAll(".carousel-dot");
    const slideWidth = 100 / this.slidesToShow;

    if (track) {
      track.style.transform = `translateX(-${this.currentSlide * slideWidth}%)`;
    }

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  resumeAutoPlay() {
    this.startAutoPlay();
  }

  handleQuickView(gameId) {
    const base = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
    window.location.href = base + "gameDetails.html?id=" + gameId;
  }

  handleGameClick(gameId) {
    const base = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
    window.location.href = base + "gameDetails.html?id=" + gameId;
  }

  showFallbackContent() {
    if (this.carouselContainer) {
      this.carouselContainer.innerHTML = `
        <div class="fallback-content">
          <p>Trending games are loading...</p>
          <button onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }
}

// Initialize trending carousel
const trendingCarousel = new TrendingCarousel();

// Export for use in other modules
export { trendingCarousel };
