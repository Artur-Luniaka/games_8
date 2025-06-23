// Checkout Manager - PixelVault
// Handles checkout process with validation and payment simulation

class CheckoutManager {
  constructor() {
    this.cart = null;
    this.taxRate = 0.08; // 8% tax rate
    this.init();
  }

  init() {
    this.loadCartData();
    this.setupEventListeners();
    this.renderOrderSummary();
    this.setupFormValidation();
  }

  loadCartData() {
    const savedCart = sessionStorage.getItem("checkoutCart");
    if (!savedCart) {
      this.showErrorState("No cart data found");
      return;
    }

    try {
      this.cart = JSON.parse(savedCart);
    } catch (error) {
      console.error("Failed to parse cart data:", error);
      this.showErrorState("Invalid cart data");
    }
  }

  setupEventListeners() {
    // Back to cart button
    const backToCartBtn = document.getElementById("back-to-cart-btn");
    if (backToCartBtn) {
      backToCartBtn.addEventListener("click", () => {
        window.location.href = "/shoppingCart.html";
      });
    }

    // Payment method toggle
    const paymentRadios = document.querySelectorAll(".payment-radio");
    paymentRadios.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        this.togglePaymentMethod(event.target.value);
      });
    });

    // Form submission
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleFormSubmission();
      });
    }

    // Input formatting
    this.setupInputFormatting();
  }

  setupInputFormatting() {
    // Card number formatting
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", (event) => {
        this.formatCardNumber(event.target);
      });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", (event) => {
        this.formatExpiryDate(event.target);
      });
    }

    // CVV formatting
    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", (event) => {
        this.formatCVV(event.target);
      });
    }
  }

  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = value;
  }

  formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    input.value = value;
  }

  formatCVV(input) {
    let value = input.value.replace(/\D/g, "");
    input.value = value;
  }

  togglePaymentMethod(method) {
    const cardDetails = document.getElementById("card-details");
    if (cardDetails) {
      if (method === "card") {
        cardDetails.style.display = "block";
      } else {
        cardDetails.style.display = "none";
      }
    }
  }

  renderOrderSummary() {
    if (!this.cart) return;

    const orderItemsContainer = document.getElementById("order-items");
    const subtotalElement = document.getElementById("order-subtotal");
    const taxElement = document.getElementById("order-tax");
    const totalElement = document.getElementById("order-total");

    if (orderItemsContainer) {
      const itemsHTML = this.cart.items
        .map(
          (item) => `
                <div class="order-item">
                    <img src="${item.image}" alt="${
            item.title
          }" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-title">${item.title}</div>
                        <div class="order-item-quantity">Quantity: ${
                          item.quantity
                        }</div>
                    </div>
                    <div class="order-item-price">$${(
                      item.price * item.quantity
                    ).toFixed(2)}</div>
                </div>
            `
        )
        .join("");
      orderItemsContainer.innerHTML = itemsHTML;
    }

    const subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * this.taxRate;
    const total = subtotal + tax;

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }

  setupFormValidation() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const inputs = form.querySelectorAll("input[required]");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });
      input.addEventListener("input", () => {
        this.clearFieldError(input);
      });
    });
  }

  validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "email":
        if (!value) {
          errorMessage = "Email is required";
          isValid = false;
        } else if (!this.isValidEmail(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "cardNumber":
        if (document.getElementById("card").checked) {
          const cardNumber = value.replace(/\s/g, "");
          if (!cardNumber) {
            errorMessage = "Card number is required";
            isValid = false;
          } else if (!this.isValidCardNumber(cardNumber)) {
            errorMessage = "Please enter a valid card number";
            isValid = false;
          }
        }
        break;

      case "expiry":
        if (document.getElementById("card").checked) {
          if (!value) {
            errorMessage = "Expiry date is required";
            isValid = false;
          } else if (!this.isValidExpiryDate(value)) {
            errorMessage = "Please enter a valid expiry date (MM/YY)";
            isValid = false;
          }
        }
        break;

      case "cvv":
        if (document.getElementById("card").checked) {
          if (!value) {
            errorMessage = "CVV is required";
            isValid = false;
          } else if (!this.isValidCVV(value)) {
            errorMessage = "Please enter a valid CVV";
            isValid = false;
          }
        }
        break;

      case "cardName":
        if (document.getElementById("card").checked) {
          if (!value) {
            errorMessage = "Name on card is required";
            isValid = false;
          }
        }
        break;

      case "firstName":
      case "lastName":
      case "address":
      case "city":
      case "state":
      case "zipCode":
        if (!value) {
          errorMessage = `${this.getFieldLabel(fieldName)} is required`;
          isValid = false;
        }
        break;

      case "terms":
        if (!field.checked) {
          errorMessage = "You must agree to the terms and conditions";
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidCardNumber(cardNumber) {
    // Luhn algorithm for card validation
    if (!/^\d{13,19}$/.test(cardNumber)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  isValidExpiryDate(expiry) {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiry)) return false;

    const [, month, year] = expiry.match(regex);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
  }

  isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }

  getFieldLabel(fieldName) {
    const labels = {
      firstName: "First Name",
      lastName: "Last Name",
      address: "Address",
      city: "City",
      state: "State",
      zipCode: "ZIP Code",
    };
    return labels[fieldName] || fieldName;
  }

  showFieldError(field, message) {
    field.classList.add("error");
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  validateForm() {
    const form = document.getElementById("checkout-form");
    if (!form) return false;

    const requiredFields = form.querySelectorAll("input[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Additional validation for card details if card payment is selected
    if (document.getElementById("card").checked) {
      const cardFields = ["cardNumber", "expiry", "cvv", "cardName"];
      cardFields.forEach((fieldName) => {
        const field = document.getElementById(fieldName);
        if (field && !this.validateField(field)) {
          isValid = false;
        }
      });
    }

    return isValid;
  }

  async handleFormSubmission() {
    if (!this.validateForm()) {
      this.showNotification("Please fix the errors in the form", "error");
      return;
    }

    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Processing...";
    }

    try {
      // Simulate payment processing
      await this.simulatePaymentProcessing();

      // Show success state
      this.showSuccessState();

      // Clear cart
      if (window.cartManager) {
        window.cartManager.clearCart();
      }

      // Clear session storage
      sessionStorage.removeItem("checkoutCart");
    } catch (error) {
      console.error("Payment processing failed:", error);
      this.showNotification(
        "Payment processing failed. Please try again.",
        "error"
      );

      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Place Order";
      }
    }
  }

  async simulatePaymentProcessing() {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error("Payment declined"));
        }
      }, 2000);
    });
  }

  showSuccessState() {
    const checkoutContent = document.querySelector(".checkout-content");
    if (!checkoutContent) return;

    checkoutContent.innerHTML = `
            <div class="checkout-success">
                <div class="success-icon">✅</div>
                <h2 class="success-title">Order Successful!</h2>
                <p class="success-text">
                    Thank you for your purchase! Your games are ready for download. 
                    You will receive a confirmation email shortly.
                </p>
                <div class="success-actions">
                    <a href="/gameVault.html" class="download-btn">
                        Continue Shopping
                    </a>
                    <a href="/index.html" class="download-btn" style="background: var(--neutral-gray);">
                        Back to Home
                    </a>
                </div>
            </div>
        `;
  }

  showErrorState(message) {
    const checkoutContent = document.querySelector(".checkout-content");
    if (!checkoutContent) return;

    checkoutContent.innerHTML = `
            <div class="checkout-loading">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                    <h2 style="margin-bottom: 1rem; color: var(--black);">${message}</h2>
                    <p style="margin-bottom: 2rem; color: var(--neutral-gray);">
                        Please return to your cart and try again.
                    </p>
                    <a href="/shoppingCart.html" style="
                        background: var(--primary-orange);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 600;
                    ">Back to Cart</a>
                </div>
            </div>
        `;
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

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.remove();
      });
    }
  }
}

// Initialize checkout manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const checkoutManager = new CheckoutManager();

  // Make checkout manager globally accessible
  window.checkoutManager = checkoutManager;
});

// Export for module usage
export default CheckoutManager;
