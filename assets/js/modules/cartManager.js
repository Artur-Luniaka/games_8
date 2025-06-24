// Cart Manager - PixelVault
// Handles shopping cart functionality

class CartManager {
  constructor() {
    this.cart = { items: [] };
    this.taxRate = 0.08; // 8% tax rate
    this.init();
  }

  init() {
    this.loadCart();
    this.setupEventListeners();
    this.renderCart();
    this.updateSummary();
  }

  loadCart() {
    const savedCart = localStorage.getItem("pixelVaultCart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  saveCart() {
    localStorage.setItem("pixelVaultCart", JSON.stringify(this.cart));

    // Update header cart count
    if (window.headerManager) {
      window.headerManager.refreshCartCount();
    }
  }

  setupEventListeners() {
    // Continue shopping button
    const continueShoppingBtn = document.getElementById(
      "continue-shopping-btn"
    );
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener("click", () => {
        window.location.href = "/gameVault.html";
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        this.proceedToCheckout();
      });
    }
  }

  renderCart() {
    const container = document.getElementById("cart-items-container");
    if (!container) return;

    if (this.cart.items.length === 0) {
      this.showEmptyCart(container);
      return;
    }

    const itemsHTML = this.cart.items
      .map((item) => this.createCartItemHTML(item))
      .join("");
    container.innerHTML = itemsHTML;

    // Setup event listeners for cart items
    this.setupCartItemListeners();
  }

  createCartItemHTML(item) {
    const totalPrice = (item.price * item.quantity).toFixed(2);

    return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${
      item.title
    }" class="cart-item-image">
                <div class="cart-item-content">
                    <div class="cart-item-header">
                        <div>
                            <h3 class="cart-item-title">${item.title}</h3>
                            <p class="cart-item-subtitle">Digital Download</p>
                        </div>
                        <span class="cart-item-price">$${totalPrice}</span>
                    </div>
                    
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrease" data-item-id="${
                              item.id
                            }" ${item.quantity <= 1 ? "disabled" : ""}>
                                -
                            </button>
                            <span class="quantity-display">${
                              item.quantity
                            }</span>
                            <button class="quantity-btn" data-action="increase" data-item-id="${
                              item.id
                            }">
                                +
                            </button>
                        </div>
                        <button class="remove-item-btn" data-item-id="${
                          item.id
                        }">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  setupCartItemListeners() {
    // Quantity buttons
    const quantityBtns = document.querySelectorAll(".quantity-btn");
    quantityBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const action = btn.dataset.action;
        const itemId = btn.dataset.itemId;
        this.updateQuantity(itemId, action);
      });
    });

    // Remove buttons
    const removeBtns = document.querySelectorAll(".remove-item-btn");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const itemId = btn.dataset.itemId;
        this.removeItem(itemId);
      });
    });
  }

  updateQuantity(itemId, action) {
    const item = this.cart.items.find((item) => item.id === itemId);
    if (!item) return;

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    this.saveCart();
    this.renderCart();
    this.updateSummary();
  }

  removeItem(itemId) {
    this.cart.items = this.cart.items.filter((item) => item.id !== itemId);
    this.saveCart();
    this.renderCart();
    this.updateSummary();

    // Show notification
    this.showNotification("Item removed from cart", "info");
  }

  updateSummary() {
    const subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * this.taxRate;
    const total = subtotal + tax;

    // Update summary display
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    // Enable/disable checkout button
    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.items.length === 0;
    }
  }

  showEmptyCart(container) {
    container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2 class="empty-cart-title">Your cart is empty</h2>
                <p class="empty-cart-text">
                    Looks like you haven't added any games to your cart yet. 
                    Start exploring our collection and find your next adventure!
                </p>
                <div class="empty-cart-actions">
                    <a href="/gameVault.html" class="browse-games-btn">
                        Browse Games
                    </a>
                    <a href="/index.html" class="browse-games-btn" style="background: var(--neutral-gray);">
                        Back to Home
                    </a>
                </div>
            </div>
        `;
  }

  proceedToCheckout() {
    if (this.cart.items.length === 0) {
      this.showNotification("Your cart is empty", "error");
      return;
    }

    // Store cart data for checkout page
    sessionStorage.setItem("checkoutCart", JSON.stringify(this.cart));

    // Navigate to checkout
    window.location.href = "/orderCheckout.html";
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
              type === "success"
                ? "var(--soft-green)"
                : type === "error"
                ? "var(--accent-coral)"
                : "var(--primary-orange)"
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

  // Public method to add item to cart (used by other modules)
  addItem(gameData) {
    const existingItem = this.cart.items.find(
      (item) => item.id === gameData.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.items.push({
        id: gameData.id,
        title: gameData.title,
        price: gameData.price,
        image: gameData.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.renderCart();
    this.updateSummary();
  }

  // Public method to get cart count (used by header)
  getCartCount() {
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Public method to get cart total (used by checkout)
  getCartTotal() {
    const subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * this.taxRate;
    return {
      subtotal: subtotal,
      tax: tax,
      total: subtotal + tax,
    };
  }

  // Public method to clear cart (used after successful checkout)
  clearCart() {
    this.cart = { items: [] };
    this.saveCart();
    this.renderCart();
    this.updateSummary();
  }
}

// Initialize cart manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const cartManager = new CartManager();

  // Make cart manager globally accessible
  window.cartManager = cartManager;
});

// Export for module usage
export default CartManager;
