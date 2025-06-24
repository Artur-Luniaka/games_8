// Game Vault Manager - PixelVault
// Handles game catalog functionality, filtering, search, and display

class GameVaultManager {
  constructor() {
    this.games = [];
    this.currentPage = 1;
    this.gamesPerPage = 6;
    this.init();
  }

  async init() {
    await this.loadGames();
    this.setupEventListeners();
    this.renderGames();
    this.updateLoadMoreButton();
  }

  async loadGames() {
    try {
      const response = await fetch("/assets/data/games.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.games = data.games;
    } catch (error) {
      console.error("Failed to load games:", error);
      this.showErrorState();
    }
  }

  setupEventListeners() {
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMoreGames();
      });
    }
  }

  renderGames() {
    const container = document.getElementById("games-container");
    if (!container) return;
    const startIndex = 0;
    const endIndex = this.currentPage * this.gamesPerPage;
    const gamesToShow = this.games.slice(startIndex, endIndex);
    if (gamesToShow.length === 0) {
      this.showEmptyState(container);
      return;
    }
    const gamesHTML = gamesToShow
      .map((game) => this.createGameCard(game))
      .join("");
    container.innerHTML = gamesHTML;
    this.setupGameCardListeners();
    this.updateLoadMoreButton();
  }

  loadMoreGames() {
    this.currentPage += 1;
    this.renderGames();
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (!loadMoreBtn) return;
    const totalShown = this.currentPage * this.gamesPerPage;
    if (totalShown >= this.games.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
    }
  }

  createGameCard(game) {
    const discountHTML =
      game.discount > 0
        ? `<span class="catalog-discount-badge">-${game.discount}%</span>`
        : "";
    const originalPriceHTML =
      game.originalPrice > game.price
        ? `<span class="catalog-original-price">$${game.originalPrice.toFixed(
            2
          )}</span>`
        : "";
    const starsHTML = this.generateStars(game.rating);
    return `
      <div class="game-card catalog-card" data-game-id="${game.id}">
        <div class="catalog-card-image-wrap">
          <img src="${game.image}" alt="${
      game.title
    }" class="catalog-card-image" loading="lazy" />
          ${discountHTML}
        </div>
        <div class="catalog-card-content">
          <h3 class="catalog-card-title">${game.title}</h3>
          <div class="catalog-card-genre">${game.genre}</div>
          <div class="catalog-card-rating">
            <span class="stars">${starsHTML}</span>
            <span class="rating-text">${game.rating}/5</span>
          </div>
          <div class="catalog-card-price">
            <span class="catalog-current-price">$${game.price.toFixed(2)}</span>
            ${originalPriceHTML}
          </div>
          <button class="catalog-add-to-cart-btn" data-game-id="${
            game.id
          }">Add to Cart</button>
        </div>
      </div>
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

  setupGameCardListeners() {
    // Game card click (navigate to game page)
    const gameCards = document.querySelectorAll(".game-card");
    gameCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        // Don't navigate if clicking on buttons
        if (event.target.closest(".add-to-cart-btn, .wishlist-btn")) {
          return;
        }

        const gameId = card.dataset.gameId;
        window.location.href = `/gameDetails.html?id=${gameId}`;
      });
    });

    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll(".catalog-add-to-cart-btn");
    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.addToCart(gameId);
      });
    });

    // Wishlist buttons
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.toggleWishlist(gameId, btn);
      });
    });
  }

  addToCart(gameId) {
    const game = this.games.find((g) => g.id === gameId);
    if (!game) return;

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("pixelVaultCart")) || {
      items: [],
    };

    // Check if game is already in cart
    const existingItem = cart.items.find((item) => item.id === gameId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        id: gameId,
        title: game.title,
        price: game.price,
        image: game.image,
        quantity: 1,
      });
    }

    // Save updated cart
    localStorage.setItem("pixelVaultCart", JSON.stringify(cart));

    // Update header cart count
    if (window.headerManager) {
      window.headerManager.refreshCartCount();
    }

    // Show success modal notification
    if (window.cartManager) {
      window.cartManager.showCartModal(
        `${game.title} added to cart!`,
        "success"
      );
    }
  }

  toggleWishlist(gameId, button) {
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem("pixelVaultWishlist")) || [];

    const isInWishlist = wishlist.includes(gameId);

    if (isInWishlist) {
      wishlist = wishlist.filter((id) => id !== gameId);
      button.textContent = "♡";
      button.style.color = "var(--neutral-gray)";
    } else {
      wishlist.push(gameId);
      button.textContent = "♥";
      button.style.color = "var(--accent-coral)";
    }

    localStorage.setItem("pixelVaultWishlist", JSON.stringify(wishlist));

    const game = this.games.find((g) => g.id === gameId);
    const message = isInWishlist
      ? `${game.title} removed from wishlist`
      : `${game.title} added to wishlist`;

    // Show modal notification
    if (window.cartManager) {
      window.cartManager.showCartModal(message, "info");
    }
  }

  showEmptyState(container) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎮</div>
                <h3 class="empty-state-title">No games found</h3>
                <p class="empty-state-text">
                    Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button class="clear-filters-btn" onclick="window.gameVaultManager.clearFilters()">
                    Clear All Filters
                </button>
            </div>
        `;
  }

  showErrorState() {
    const container = document.getElementById("games-container");
    if (container) {
      container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3 class="empty-state-title">Failed to load games</h3>
                    <p class="empty-state-text">
                        Something went wrong while loading the games. Please try refreshing the page.
                    </p>
                    <button class="load-more-btn" onclick="window.location.reload()">
                        Refresh Page
                    </button>
                </div>
            `;
    }
  }
}

// Initialize game vault manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const gameVaultManager = new GameVaultManager();

  // Make game vault manager globally accessible
  window.gameVaultManager = gameVaultManager;
});

// Export for module usage
export default GameVaultManager;
