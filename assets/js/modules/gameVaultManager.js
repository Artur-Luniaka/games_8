// Game Vault Manager - PixelVault
// Handles game catalog functionality, filtering, search, and display

class GameVaultManager {
  constructor() {
    this.games = [];
    this.filteredGames = [];
    this.currentPage = 1;
    this.gamesPerPage = 12;
    this.currentView = "grid";
    this.filters = {
      search: "",
      genre: "",
      platform: "",
      priceRange: "",
      sortBy: "featured",
    };

    this.init();
  }

  async init() {
    await this.loadGames();
    this.setupEventListeners();
    this.renderGames();
    this.updateResultsCount();
  }

  async loadGames() {
    try {
      const response = await fetch("/assets/data/games.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.games = data.games;
      this.filteredGames = [...this.games];
    } catch (error) {
      console.error("Failed to load games:", error);
      this.showErrorState();
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("game-search");
    const searchBtn = document.querySelector(".search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.filters.search = event.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.applyFilters();
      });
    }

    // Filter functionality
    const genreFilter = document.getElementById("genre-filter");
    const platformFilter = document.getElementById("platform-filter");
    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");

    if (genreFilter) {
      genreFilter.addEventListener("change", (event) => {
        this.filters.genre = event.target.value;
        this.applyFilters();
      });
    }

    if (platformFilter) {
      platformFilter.addEventListener("change", (event) => {
        this.filters.platform = event.target.value;
        this.applyFilters();
      });
    }

    if (priceFilter) {
      priceFilter.addEventListener("change", (event) => {
        this.filters.priceRange = event.target.value;
        this.applyFilters();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener("change", (event) => {
        this.filters.sortBy = event.target.value;
        this.applyFilters();
      });
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById("clear-filters");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.clearFilters();
      });
    }

    // View toggle
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        this.toggleView(event.target.dataset.view);
      });
    });

    // Load more
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMoreGames();
      });
    }
  }

  applyFilters() {
    this.filteredGames = this.games.filter((game) => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const matchesSearch =
          game.title.toLowerCase().includes(searchTerm) ||
          game.description.toLowerCase().includes(searchTerm) ||
          game.genre.toLowerCase().includes(searchTerm) ||
          game.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // Genre filter
      if (
        this.filters.genre &&
        game.genre.toLowerCase() !== this.filters.genre.toLowerCase()
      ) {
        return false;
      }

      // Platform filter
      if (
        this.filters.platform &&
        !game.platforms.some(
          (platform) =>
            platform.toLowerCase() === this.filters.platform.toLowerCase()
        )
      ) {
        return false;
      }

      // Price range filter
      if (this.filters.priceRange) {
        const [min, max] = this.filters.priceRange.split("-").map(Number);
        if (max && (game.price < min || game.price > max)) {
          return false;
        } else if (!max && game.price < min) {
          return false;
        }
      }

      return true;
    });

    // Sort games
    this.sortGames();

    // Reset pagination
    this.currentPage = 1;

    // Update display
    this.renderGames();
    this.updateResultsCount();
    this.updateLoadMoreButton();
  }

  sortGames() {
    switch (this.filters.sortBy) {
      case "newest":
        this.filteredGames.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        break;
      case "price-low":
        this.filteredGames.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        this.filteredGames.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        this.filteredGames.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        this.filteredGames.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }
  }

  clearFilters() {
    this.filters = {
      search: "",
      genre: "",
      platform: "",
      priceRange: "",
      sortBy: "featured",
    };

    // Reset form elements
    const searchInput = document.getElementById("game-search");
    const genreFilter = document.getElementById("genre-filter");
    const platformFilter = document.getElementById("platform-filter");
    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");

    if (searchInput) searchInput.value = "";
    if (genreFilter) genreFilter.value = "";
    if (platformFilter) platformFilter.value = "";
    if (priceFilter) priceFilter.value = "";
    if (sortFilter) sortFilter.value = "featured";

    this.applyFilters();
  }

  toggleView(view) {
    this.currentView = view;

    // Update view buttons
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });

    // Update container class
    const container = document.getElementById("games-container");
    if (container) {
      container.className = `games-container ${view}-view`;
    }

    // Re-render games with new view
    this.renderGames();
  }

  renderGames() {
    const container = document.getElementById("games-container");
    if (!container) return;

    const startIndex = (this.currentPage - 1) * this.gamesPerPage;
    const endIndex = startIndex + this.gamesPerPage;
    const gamesToShow = this.filteredGames.slice(startIndex, endIndex);

    if (gamesToShow.length === 0) {
      this.showEmptyState(container);
      return;
    }

    const gamesHTML = gamesToShow
      .map((game) => this.createGameCard(game))
      .join("");
    container.innerHTML = gamesHTML;

    // Add event listeners to new game cards
    this.setupGameCardListeners();
  }

  createGameCard(game) {
    const discountHTML =
      game.discount > 0
        ? `
            <span class="discount-badge">-${game.discount}%</span>
        `
        : "";

    const originalPriceHTML =
      game.originalPrice > game.price
        ? `
            <span class="original-price">$${game.originalPrice.toFixed(
              2
            )}</span>
        `
        : "";

    const starsHTML = this.generateStars(game.rating);

    return `
            <div class="game-card" data-game-id="${game.id}">
                <img src="${game.image}" alt="${
      game.title
    }" class="game-card-image">
                <div class="game-card-content">
                    <div class="game-card-header">
                        <div>
                            <h3 class="game-card-title">${game.title}</h3>
                            <p class="game-card-subtitle">${game.subtitle}</p>
                        </div>
                        <span class="game-card-genre">${game.genre}</span>
                    </div>
                    
                    <div class="game-card-rating">
                        <span class="stars">${starsHTML}</span>
                        <span class="rating-text">${game.rating}/5</span>
                    </div>
                    
                    <div class="game-card-price">
                        <span class="current-price">$${game.price.toFixed(
                          2
                        )}</span>
                        ${originalPriceHTML}
                        ${discountHTML}
                    </div>
                    
                    <div class="game-card-actions">
                        <button class="add-to-cart-btn" data-game-id="${
                          game.id
                        }">
                            Add to Cart
                        </button>
                        <button class="wishlist-btn" data-game-id="${
                          game.id
                        }" aria-label="Add to wishlist">
                            ♡
                        </button>
                    </div>
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
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
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
    if (window.pixelVaultHeader) {
      window.pixelVaultHeader.refreshCartCount();
    }

    // Show success notification
    this.showNotification(`${game.title} added to cart!`, "success");
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

    this.showNotification(message, "info");
  }

  loadMoreGames() {
    this.currentPage += 1;
    this.renderGames();
    this.updateLoadMoreButton();
  }

  updateResultsCount() {
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      const count = this.filteredGames.length;
      const text = count === 1 ? "1 game found" : `${count} games found`;
      resultsCount.textContent = text;
    }
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      const totalPages = Math.ceil(
        this.filteredGames.length / this.gamesPerPage
      );
      const hasMore = this.currentPage < totalPages;

      loadMoreBtn.disabled = !hasMore;
      loadMoreBtn.textContent = hasMore
        ? "Load More Games"
        : "All Games Loaded";
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

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${
              type === "success" ? "var(--soft-green)" : "var(--primary-orange)"
            };
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
        `;

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.remove();
      });
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
