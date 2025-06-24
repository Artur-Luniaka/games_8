// Game Details Manager - PixelVault
// Handles game details page functionality

class GameDetailsManager {
  constructor() {
    this.game = null;
    this.gameId = null;
    this.init();
  }

  async init() {
    this.gameId = this.getGameIdFromUrl();
    if (!this.gameId) {
      this.showErrorState("Game ID not found");
      return;
    }

    await this.loadGameDetails();
    this.setupEventListeners();
  }

  getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  async loadGameDetails() {
    try {
      const response = await fetch("/assets/data/games.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.game = data.games.find((game) => game.id === this.gameId);

      if (!this.game) {
        this.showErrorState("Game not found");
        return;
      }

      this.renderGameDetails();
      this.updatePageTitle();
    } catch (error) {
      console.error("Failed to load game details:", error);
      this.showErrorState("Failed to load game details");
    }
  }

  renderGameDetails() {
    const container = document.getElementById("game-details-container");
    if (!container) return;

    container.innerHTML = `
            <div class="game-details-layout">
                <div class="game-content">
                    ${this.createGameHeader()}
                    ${this.createGameInfo()}
                    ${this.createGameFeatures()}
                    ${this.createGameGallery()}
                    ${this.createSystemRequirements()}
                </div>
                ${this.createPurchaseSection()}
            </div>
        `;

    // Setup gallery functionality
    this.setupGallery();
  }

  createGameHeader() {
    const starsHTML = this.generateStars(this.game.rating);

    return `
            <div class="game-header">
                <div class="game-hero">
                    <img src="${this.game.image}" alt="${this.game.title}" class="game-hero-image">
                    <div class="game-hero-overlay">
                        <div class="game-hero-content">
                            <h1 class="game-title">${this.game.title}</h1>
                            <p class="game-subtitle">${this.game.subtitle}</p>
                            <div class="game-rating">
                                <span class="stars">${starsHTML}</span>
                                <span class="rating-text">${this.game.rating}/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  createGameInfo() {
    const discountHTML =
      this.game.discount > 0
        ? `
            <span class="discount-badge">-${this.game.discount}%</span>
        `
        : "";

    const originalPriceHTML =
      this.game.originalPrice > this.game.price
        ? `
            <span class="original-price">$${this.game.originalPrice.toFixed(
              2
            )}</span>
        `
        : "";

    const tagsHTML = this.game.tags
      .map(
        (tag) => `
            <span class="tag">${tag}</span>
        `
      )
      .join("");

    return `
            <div class="game-info">
                <div class="game-meta">
                    <div class="meta-item">
                        <span class="meta-label">Genre</span>
                        <span class="meta-value">${this.game.genre}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Platform</span>
                        <span class="meta-value">${this.game.platforms.join(
                          ", "
                        )}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Release Date</span>
                        <span class="meta-value">${new Date(
                          this.game.releaseDate
                        ).toLocaleDateString()}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Developer</span>
                        <span class="meta-value">${this.game.developer}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Publisher</span>
                        <span class="meta-value">${this.game.publisher}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Price</span>
                        <span class="meta-value">
                            $${this.game.price.toFixed(2)}
                            ${originalPriceHTML}
                            ${discountHTML}
                        </span>
                    </div>
                </div>
                
                <div class="game-tags">
                    ${tagsHTML}
                </div>
                
                <p class="game-description">${this.game.description}</p>
            </div>
        `;
  }

  createGameFeatures() {
    const featuresHTML = this.game.features
      .map(
        (feature) => `
            <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="feature-text">${feature}</span>
            </div>
        `
      )
      .join("");

    return `
            <div class="game-features">
                <h2 class="features-title">Key Features</h2>
                <div class="features-grid">
                    ${featuresHTML}
                </div>
            </div>
        `;
  }

  createGameGallery() {
    if (!this.game.screenshots || this.game.screenshots.length === 0) {
      return "";
    }

    const screenshotsHTML = this.game.screenshots
      .map(
        (screenshot, index) => `
            <div class="gallery-item" data-index="${index}">
                <img src="${screenshot}" alt="Screenshot ${
          index + 1
        }" class="gallery-image">
            </div>
        `
      )
      .join("");

    return `
            <div class="game-gallery">
                <h2 class="gallery-title">Screenshots</h2>
                <div class="gallery-grid">
                    ${screenshotsHTML}
                </div>
            </div>
        `;
  }

  createSystemRequirements() {
    if (!this.game.systemRequirements) {
      return "";
    }

    const requirements = this.game.systemRequirements;

    const createRequirementsSection = (title, reqs) => {
      if (!reqs) return "";

      const itemsHTML = Object.entries(reqs)
        .map(
          ([key, value]) => `
                <div class="requirement-item">
                    <span class="requirement-label">${this.formatRequirementLabel(
                      key
                    )}</span>
                    <span class="requirement-value">${value}</span>
                </div>
            `
        )
        .join("");

      return `
                <div class="requirements-section">
                    <h3 class="section-title">${title}</h3>
                    ${itemsHTML}
                </div>
            `;
    };

    const minimumHTML = createRequirementsSection(
      "Minimum Requirements",
      requirements.minimum
    );
    const recommendedHTML = createRequirementsSection(
      "Recommended Requirements",
      requirements.recommended
    );

    return `
            <div class="system-requirements">
                <h2 class="requirements-title">System Requirements</h2>
                <div class="requirements-grid">
                    ${minimumHTML}
                    ${recommendedHTML}
                </div>
            </div>
        `;
  }

  createPurchaseSection() {
    const discountHTML =
      this.game.discount > 0
        ? `
            <span class="discount-badge">-${this.game.discount}%</span>
        `
        : "";

    const originalPriceHTML =
      this.game.originalPrice > this.game.price
        ? `
            <span class="original-price">$${this.game.originalPrice.toFixed(
              2
            )}</span>
        `
        : "";

    const isInWishlist = this.checkWishlistStatus();
    const wishlistBtnText = isInWishlist ? "♥" : "♡";
    const wishlistBtnClass = isInWishlist
      ? "wishlist-btn active"
      : "wishlist-btn";

    return `
            <div class="purchase-section">
                <div class="purchase-header">
                    <div class="purchase-price">
                        <span class="current-price">$${this.game.price.toFixed(
                          2
                        )}</span>
                        ${originalPriceHTML}
                        ${discountHTML}
                    </div>
                </div>
                
                <div class="purchase-actions">
                    <button class="add-to-cart-btn" data-game-id="${
                      this.game.id
                    }">
                        Add to Cart
                    </button>
                    <button class="${wishlistBtnClass}" data-game-id="${
      this.game.id
    }">
                        ${wishlistBtnText}
                    </button>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    // Add to cart button
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        this.addToCart();
      });
    }

    // Wishlist button
    const wishlistBtn = document.querySelector(".wishlist-btn");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        this.toggleWishlist(wishlistBtn);
      });
    }
  }

  setupGallery() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const index = parseInt(item.dataset.index);
        this.openGalleryModal(index);
      });
    });
  }

  openGalleryModal(initialIndex) {
    if (!this.game.screenshots) return;

    const modal = document.createElement("div");
    modal.className = "gallery-modal";
    modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <button class="modal-prev">&lt;</button>
                    <button class="modal-next">&gt;</button>
                    <div class="modal-image-container">
                        <img src="${
                          this.game.screenshots[initialIndex]
                        }" alt="Screenshot" class="modal-image">
                    </div>
                    <div class="modal-counter">${initialIndex + 1} / ${
      this.game.screenshots.length
    }</div>
                </div>
            </div>
        `;

    // Add modal styles
    const style = document.createElement("style");
    style.textContent = `
            .gallery-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            }
            
            .modal-content {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .modal-image-container {
                max-width: 100%;
                max-height: 80vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }
            
            .modal-close,
            .modal-prev,
            .modal-next {
                position: absolute;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                padding: 12px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                transition: background 0.3s ease;
            }
            
            .modal-close {
                top: -50px;
                right: 0;
            }
            
            .modal-prev {
                left: -60px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .modal-next {
                right: -60px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .modal-close:hover,
            .modal-prev:hover,
            .modal-next:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .modal-counter {
                color: white;
                margin-top: 16px;
                font-size: 14px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    let currentIndex = initialIndex;

    // Navigation functionality
    const prevBtn = modal.querySelector(".modal-prev");
    const nextBtn = modal.querySelector(".modal-next");
    const closeBtn = modal.querySelector(".modal-close");
    const image = modal.querySelector(".modal-image");
    const counter = modal.querySelector(".modal-counter");

    const updateImage = (index) => {
      image.src = this.game.screenshots[index];
      counter.textContent = `${index + 1} / ${this.game.screenshots.length}`;
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex =
          (currentIndex - 1 + this.game.screenshots.length) %
          this.game.screenshots.length;
        updateImage(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % this.game.screenshots.length;
        updateImage(currentIndex);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.remove();
      });
    }

    // Close on overlay click
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (event) => {
      if (!modal.parentNode) return;

      switch (event.key) {
        case "Escape":
          modal.remove();
          break;
        case "ArrowLeft":
          currentIndex =
            (currentIndex - 1 + this.game.screenshots.length) %
            this.game.screenshots.length;
          updateImage(currentIndex);
          break;
        case "ArrowRight":
          currentIndex = (currentIndex + 1) % this.game.screenshots.length;
          updateImage(currentIndex);
          break;
      }
    });
  }

  addToCart() {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("pixelVaultCart")) || {
      items: [],
    };

    // Check if game is already in cart
    const existingItem = cart.items.find((item) => item.id === this.game.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        id: this.game.id,
        title: this.game.title,
        price: this.game.price,
        image: this.game.image,
        quantity: 1,
      });
    }

    // Save updated cart
    localStorage.setItem("pixelVaultCart", JSON.stringify(cart));

    // Update header cart count
    if (window.headerManager) {
      window.headerManager.refreshCartCount();
    }

    // Show success notification
    this.showNotification(`${this.game.title} added to cart!`, "success");
  }

  toggleWishlist(button) {
    // Get current wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem("pixelVaultWishlist")) || [];

    const isInWishlist = wishlist.includes(this.game.id);

    if (isInWishlist) {
      wishlist = wishlist.filter((id) => id !== this.game.id);
      button.textContent = "♡";
      button.classList.remove("active");
    } else {
      wishlist.push(this.game.id);
      button.textContent = "♥";
      button.classList.add("active");
    }

    localStorage.setItem("pixelVaultWishlist", JSON.stringify(wishlist));

    const message = isInWishlist
      ? `${this.game.title} removed from wishlist`
      : `${this.game.title} added to wishlist`;

    this.showNotification(message, "info");
  }

  checkWishlistStatus() {
    const wishlist =
      JSON.parse(localStorage.getItem("pixelVaultWishlist")) || [];
    return wishlist.includes(this.game.id);
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  }

  formatRequirementLabel(key) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  updatePageTitle() {
    if (this.game) {
      document.title = `${this.game.title} | PixelVault`;
    }
  }

  showErrorState(message) {
    const container = document.getElementById("game-details-container");
    if (container) {
      container.innerHTML = `
                <div class="loading-state">
                    <div style="text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                        <h2 style="margin-bottom: 1rem; color: var(--black);">${message}</h2>
                        <p style="margin-bottom: 2rem; color: var(--neutral-gray);">
                            The game you're looking for might not exist or has been removed.
                        </p>
                        <a href="/gameVault.html" style="
                            background: var(--primary-orange);
                            color: white;
                            padding: 12px 24px;
                            border-radius: 8px;
                            text-decoration: none;
                            font-weight: 600;
                        ">Browse All Games</a>
                    </div>
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

// Initialize game details manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const gameDetailsManager = new GameDetailsManager();

  // Make game details manager globally accessible
  window.gameDetailsManager = gameDetailsManager;
});

// Export for module usage
export default GameDetailsManager;
