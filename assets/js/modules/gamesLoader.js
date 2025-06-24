// Games Loader Module - GameVault
// Loads and displays featured games and hot deals on the homepage

class GamesLoader {
  constructor() {
    this.gamesData = [];
    this.hotDealsContainer = document.getElementById("hot-deals-grid");
    this.featuredGamesContainer = document.getElementById(
      "featured-games-grid"
    );
    this.init();
  }

  async init() {
    try {
      await this.loadGamesData();
      this.renderHotDeals();
      this.renderFeaturedGames();
      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to load games:", error);
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

  renderHotDeals() {
    if (!this.hotDealsContainer) return;

    // Get games with discounts (hot deals)
    const hotDeals = this.gamesData
      .filter((game) => game.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 6);

    const dealsHTML = hotDeals
      .map((game) => this.createHotDealCard(game))
      .join("");

    this.hotDealsContainer.innerHTML = dealsHTML;
  }

  renderFeaturedGames() {
    if (!this.featuredGamesContainer) return;

    // Get featured games (first 6 games)
    const featuredGames = this.gamesData.slice(0, 6);

    const gamesHTML = featuredGames
      .map((game) => this.createFeaturedGameCard(game))
      .join("");

    this.featuredGamesContainer.innerHTML = gamesHTML;
  }

  createHotDealCard(game) {
    const price = game.price || 59.99;
    const discount = game.discount || 0;
    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

    return `
      <article class="hot-deal-card" data-game-id="${game.id}">
        <div class="deal-image">
          <img src="${game.image}" alt="${game.title}" loading="lazy" />
          <div class="deal-overlay">
            <button class="quick-view-btn" data-game-id="${game.id}">
              Quick View
            </button>
            <button class="add-to-cart-btn" data-game-id="${game.id}">
              Add to Cart
            </button>
          </div>
        </div>
        <div class="deal-content">
          <h3 class="deal-title">${game.title}</h3>
          <p class="deal-genre">${game.genre}</p>
          <div class="deal-rating">
            <span class="stars">
              ${this.generateStars(game.rating || 4.5)}
            </span>
            <span class="rating-text">${game.rating || 4.5}/5</span>
          </div>
          <div class="deal-price">
            <span class="original-price">$${price.toFixed(2)}</span>
            <span class="final-price">$${finalPrice.toFixed(2)}</span>
          </div>
          <div class="deal-timer">
            <span class="timer-text">Limited Time!</span>
          </div>
        </div>
      </article>
    `;
  }

  createFeaturedGameCard(game) {
    const price = game.price || 59.99;
    const discount = game.discount || 0;
    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

    return `
      <article class="featured-game-card" data-game-id="${game.id}">
        <div class="game-card-image">
          <img src="${game.image}" alt="${game.title}" loading="lazy" />
          ${
            discount > 0
              ? `<span class="discount-badge">-${discount}%</span>`
              : ""
          }
          <div class="game-card-overlay">
            <button class="quick-view-btn" data-game-id="${game.id}">
              Quick View
            </button>
            <button class="add-to-cart-btn" data-game-id="${game.id}">
              Add to Cart
            </button>
          </div>
        </div>
        <div class="game-card-content">
          <h3 class="game-title">${game.title}</h3>
          <p class="game-genre">${game.genre}</p>
          <div class="game-rating">
            <span class="stars">
              ${this.generateStars(game.rating || 4.5)}
            </span>
            <span class="rating-text">${game.rating || 4.5}/5</span>
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
      </article>
    `;
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
    // Hot deals event listeners
    if (this.hotDealsContainer) {
      this.hotDealsContainer.addEventListener("click", (event) => {
        const quickViewBtn = event.target.closest(".quick-view-btn");
        const addToCartBtn = event.target.closest(".add-to-cart-btn");
        const dealCard = event.target.closest(".hot-deal-card");

        if (quickViewBtn) {
          const gameId = quickViewBtn.dataset.gameId;
          this.handleQuickView(gameId);
        } else if (addToCartBtn) {
          const gameId = addToCartBtn.dataset.gameId;
          this.handleAddToCart(gameId);
        } else if (dealCard) {
          const gameId = dealCard.dataset.gameId;
          this.handleGameClick(gameId);
        }
      });
    }

    // Featured games event listeners
    if (this.featuredGamesContainer) {
      this.featuredGamesContainer.addEventListener("click", (event) => {
        const quickViewBtn = event.target.closest(".quick-view-btn");
        const addToCartBtn = event.target.closest(".add-to-cart-btn");
        const gameCard = event.target.closest(".featured-game-card");

        if (quickViewBtn) {
          const gameId = quickViewBtn.dataset.gameId;
          this.handleQuickView(gameId);
        } else if (addToCartBtn) {
          const gameId = addToCartBtn.dataset.gameId;
          this.handleAddToCart(gameId);
        } else if (gameCard) {
          const gameId = gameCard.dataset.gameId;
          this.handleGameClick(gameId);
        }
      });
    }
  }

  handleQuickView(gameId) {
    const base = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
    window.location.href = base + "gameDetails.html?id=" + gameId;
  }

  handleAddToCart(gameId) {
    const game = this.gamesData.find((g) => g.id === gameId);
    if (!game) return;

    // Get current cart
    let cartObj = JSON.parse(
      localStorage.getItem("pixelVaultCart") || '{"items":[]}'
    );
    if (!cartObj.items) cartObj = { items: [] };

    // Check if game is already in cart
    const existingItem = cartObj.items.find((item) => item.id === gameId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartObj.items.push({
        id: gameId,
        title: game.title,
        price: game.price || 59.99,
        image: game.image,
        quantity: 1,
      });
    }

    // Save to localStorage
    localStorage.setItem("pixelVaultCart", JSON.stringify(cartObj));

    // Show modal notification
    if (window.cartManager) {
      window.cartManager.showCartModal("Game added to cart!", "success");
    }

    // Update cart count in header if available
    if (window.headerManager) {
      window.headerManager.refreshCartCount();
    }
  }

  handleGameClick(gameId) {
    const base = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
    window.location.href = base + "gameDetails.html?id=" + gameId;
  }

  showFallbackContent() {
    const fallbackHTML = `
      <div class="fallback-content">
        <h3>Games Loading...</h3>
        <p>Please wait while we load the latest games for you.</p>
      </div>
    `;

    if (this.hotDealsContainer) {
      this.hotDealsContainer.innerHTML = fallbackHTML;
    }
    if (this.featuredGamesContainer) {
      this.featuredGamesContainer.innerHTML = fallbackHTML;
    }
  }
}

// Initialize the module
const gamesLoader = new GamesLoader();
export default gamesLoader;
