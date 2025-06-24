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
                            <p class="cart-item-subtitle">Digital Edition</p>
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

    // Show modal notification
    this.showCartModal("Item removed from cart", "info");
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
                <div class="empty-cart-icon"><img src=\"assets/images/cart-icon.png\" alt=\"Cart\" style=\"width: 64px; height: 64px; filter: drop-shadow(0 0 12px #00fff7);\"></div>
                <h2 class="empty-cart-title">Your cart is empty</h2>
                <p class="empty-cart-text">
                    Looks like you haven't picked any games yet. Dive into the vault and discover your next masterpiece!
                </p>
                <div class="empty-cart-actions">
                    <a href="/gameVault.html" class="browse-games-btn">Browse Games</a>
                    <a href="./" class="browse-games-btn" style="background: var(--neutral-gray);">Back to Home</a>
                </div>
            </div>
        `;
  }

  proceedToCheckout() {
    if (this.cart.items.length === 0) {
      this.showCartModal("Your cart is empty", "error");
      return;
    }

    // Store cart data for checkout page
    sessionStorage.setItem("checkoutCart", JSON.stringify(this.cart));

    // Navigate to checkout
    window.location.href = "/orderCheckout.html";
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
    this.showCartModal("Added to cart", "success");
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

  // Модальное уведомление для корзины
  showCartModal(message, type = "info") {
    // Удалить предыдущую модалку, если есть
    const existingModal = document.querySelector(".cart-modal-notification");
    if (existingModal) existingModal.remove();
    const existingOverlay = document.querySelector(".cart-modal-overlay");
    if (existingOverlay) existingOverlay.remove();

    // Затемнение фона
    const overlay = document.createElement("div");
    overlay.className = "cart-modal-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(20, 22, 40, 0.55);
      z-index: 9998;
      animation: fadeInOverlay 0.3s;
    `;
    document.body.appendChild(overlay);

    // Модалка
    const modal = document.createElement("div");
    modal.className = "cart-modal-notification";
    modal.innerHTML = `
      <div class="cart-modal-icon" style="font-size:2.2rem; margin-bottom: 0.5rem;">
        ${type === "success" ? "🛒" : type === "error" ? "⚠️" : "ℹ️"}
      </div>
      <div class="cart-modal-message" style="font-size:1.2rem; font-weight:600;">${message}</div>
    `;
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(1);
      background: linear-gradient(135deg, #23243a 70%, #181a2b 100%);
      color: #fff;
      border-radius: 20px;
      box-shadow: 0 0 40px #00fff7cc, 0 0 0 3px #00fff7;
      border: 2.5px solid #00fff7;
      padding: 2.2rem 2.5rem 1.5rem 2.5rem;
      z-index: 9999;
      text-align: center;
      min-width: 220px;
      max-width: 90vw;
      animation: cartModalAppear 0.25s cubic-bezier(.4,2,.6,1) both;
    `;
    document.body.appendChild(modal);

    // Анимация исчезновения
    setTimeout(() => {
      modal.style.animation = "cartModalDisappear 0.3s forwards";
      overlay.style.animation = "fadeOutOverlay 0.3s forwards";
      setTimeout(() => {
        modal.remove();
        overlay.remove();
      }, 320);
    }, 1700);
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

// Анимации для модалки
const style = document.createElement("style");
style.textContent = `
@keyframes cartModalAppear {
  from { opacity: 0; transform: translate(-50%, -60%) scale(0.95); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes cartModalDisappear {
  to { opacity: 0; transform: translate(-50%, -40%) scale(0.95); }
}
@keyframes fadeInOverlay {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes fadeOutOverlay {
  to { opacity: 0; }
}`;
document.head.appendChild(style);
