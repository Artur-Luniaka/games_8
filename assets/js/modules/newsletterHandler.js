// Newsletter Handler Module - GameVault
// Handles newsletter subscription functionality

class NewsletterHandler {
  constructor() {
    this.newsletterForm = document.getElementById("newsletter-form");
    this.emailInput = document.getElementById("newsletter-email");
    this.submitButton = this.newsletterForm?.querySelector(".newsletter-btn");
    this.init();
  }

  init() {
    if (this.newsletterForm) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    if (!this.newsletterForm) return;

    this.newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });

    if (this.emailInput) {
      this.emailInput.addEventListener("input", () => {
        this.validateEmail();
      });

      this.emailInput.addEventListener("blur", () => {
        this.validateEmail();
      });
    }
  }

  validateEmail() {
    if (!this.emailInput) return false;

    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    // Remove existing validation classes
    this.emailInput.classList.remove("valid", "invalid");

    if (email === "") {
      this.emailInput.classList.add("invalid");
      this.showFieldError("Email is required");
      return false;
    } else if (!isValid) {
      this.emailInput.classList.add("invalid");
      this.showFieldError("Please enter a valid email address");
      return false;
    } else {
      this.emailInput.classList.add("valid");
      this.clearFieldError();
      return true;
    }
  }

  showFieldError(message) {
    this.clearFieldError();

    const errorElement = document.createElement("div");
    errorElement.className = "field-error";
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    `;

    this.emailInput.parentNode.appendChild(errorElement);
  }

  clearFieldError() {
    const existingError =
      this.emailInput.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  async handleSubmit() {
    if (!this.validateEmail()) {
      return;
    }

    const email = this.emailInput.value.trim();

    // Disable form during submission
    this.setFormState("submitting");

    try {
      // Simulate API call
      await this.subscribeToNewsletter(email);

      // Show success message
      this.showSuccessMessage();

      // Reset form
      this.resetForm();
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      this.showErrorMessage("Failed to subscribe. Please try again.");
    } finally {
      this.setFormState("idle");
    }
  }

  async subscribeToNewsletter(email) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate success (in real app, this would be an API call)
    const success = Math.random() > 0.1; // 90% success rate for demo

    if (!success) {
      throw new Error("Subscription failed");
    }

    // Store subscription in localStorage for demo
    const subscriptions = JSON.parse(
      localStorage.getItem("gameVaultNewsletter") || "[]"
    );
    if (!subscriptions.includes(email)) {
      subscriptions.push(email);
      localStorage.setItem(
        "gameVaultNewsletter",
        JSON.stringify(subscriptions)
      );
    }

    return { success: true };
  }

  setFormState(state) {
    if (!this.submitButton) return;

    switch (state) {
      case "submitting":
        this.submitButton.disabled = true;
        this.submitButton.textContent = "Subscribing...";
        this.emailInput.disabled = true;
        break;
      case "idle":
        this.submitButton.disabled = false;
        this.submitButton.textContent = "Subscribe";
        this.emailInput.disabled = false;
        break;
    }
  }

  showSuccessMessage() {
    const successMessage = document.createElement("div");
    successMessage.className = "newsletter-success";
    successMessage.innerHTML = `
      <div class="success-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        <span>Successfully subscribed! You'll receive gaming updates and exclusive deals.</span>
      </div>
    `;

    successMessage.style.cssText = `
      background: #4CAF50;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      animation: slideInUp 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    this.newsletterForm.parentNode.appendChild(successMessage);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  }

  showErrorMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "newsletter-error";
    errorMessage.innerHTML = `
      <div class="error-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>${message}</span>
      </div>
    `;

    errorMessage.style.cssText = `
      background: #e74c3c;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      animation: slideInUp 0.3s ease;
    `;

    this.newsletterForm.parentNode.appendChild(errorMessage);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.remove();
      }
    }, 5000);
  }

  resetForm() {
    if (this.newsletterForm) {
      this.newsletterForm.reset();
      this.emailInput.classList.remove("valid", "invalid");
      this.clearFieldError();
    }
  }

  // Public method to check if email is already subscribed
  isEmailSubscribed(email) {
    const subscriptions = JSON.parse(
      localStorage.getItem("gameVaultNewsletter") || "[]"
    );
    return subscriptions.includes(email);
  }

  // Public method to get all subscriptions (for admin purposes)
  getAllSubscriptions() {
    return JSON.parse(localStorage.getItem("gameVaultNewsletter") || "[]");
  }
}

// Initialize newsletter handler
const newsletterHandler = new NewsletterHandler();

// Export for use in other modules
export { newsletterHandler };
