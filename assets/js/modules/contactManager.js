// Contact Manager - PixelVault
// Handles contact form functionality and validation

class ContactManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFormValidation();
    this.initializeAnimations();
  }

  setupEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleFormSubmission();
      });
    }

    // Directions button
    const directionsBtn = document.querySelector(".directions-btn");
    if (directionsBtn) {
      directionsBtn.addEventListener("click", (event) => {
        // Let the link work naturally - it opens in new tab
        this.showNotification("Opening directions in Google Maps...", "info");
      });
    }

    // Method cards hover effects
    const methodCards = document.querySelectorAll(".method-card");
    methodCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.animateCardHover(card, true);
      });
      card.addEventListener("mouseleave", () => {
        this.animateCardHover(card, false);
      });
    });

    // Category cards hover effects
    const categoryCards = document.querySelectorAll(".category-card");
    categoryCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.animateCardHover(card, true);
      });
      card.addEventListener("mouseleave", () => {
        this.animateCardHover(card, false);
      });
    });

    // FAQ items hover effects
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        this.animateCardHover(item, true);
      });
      item.addEventListener("mouseleave", () => {
        this.animateCardHover(item, false);
      });
    });
  }

  setupFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const inputs = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
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
      case "firstName":
      case "lastName":
        if (!value) {
          errorMessage = `${this.getFieldLabel(fieldName)} is required`;
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = `${this.getFieldLabel(
            fieldName
          )} must be at least 2 characters`;
          isValid = false;
        }
        break;

      case "email":
        if (!value) {
          errorMessage = "Email is required";
          isValid = false;
        } else if (!this.isValidEmail(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "subject":
        if (!value) {
          errorMessage = "Please select a subject";
          isValid = false;
        }
        break;

      case "message":
        if (!value) {
          errorMessage = "Message is required";
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = "Message must be at least 10 characters";
          isValid = false;
        } else if (value.length > 1000) {
          errorMessage = "Message must be less than 1000 characters";
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

  getFieldLabel(fieldName) {
    const labels = {
      firstName: "First Name",
      lastName: "Last Name",
    };
    return labels[fieldName] || fieldName;
  }

  showFieldError(field, message) {
    field.classList.add("error");
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.color = "#ff5252";
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
    const form = document.getElementById("contact-form");
    if (!form) return false;

    const requiredFields = form.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleFormSubmission() {
    if (!this.validateForm()) {
      this.showNotification("Please fix the errors in the form", "error");
      return;
    }

    const submitBtn = document.querySelector(".submit-btn");
    const btnText = submitBtn?.querySelector(".btn-text");
    const btnIcon = submitBtn?.querySelector(".btn-icon");

    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = "Sending...";
      if (btnIcon) btnIcon.textContent = "⏳";
    }

    try {
      // Simulate form submission
      await this.simulateFormSubmission();

      // Show success state
      this.showSuccessState();
    } catch (error) {
      console.error("Form submission failed:", error);
      this.showNotification(
        "Failed to send message. Please try again.",
        "error"
      );

      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = "Send Message";
        if (btnIcon) btnIcon.textContent = "→";
      }
    }
  }

  async simulateFormSubmission() {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error("Network error"));
        }
      }, 2000);
    });
  }

  showSuccessState() {
    const formContent = document.querySelector(".form-content");
    if (!formContent) return;

    const formData = this.getFormData();

    formContent.innerHTML = `
      <div class="contact-success" style="max-width: 420px; margin: 60px auto 0 auto; background: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange)); border-radius: 20px; box-shadow: 0 8px 32px rgba(255,107,53,0.28); padding: 2.5rem 2rem 2rem 2rem; text-align: left;">
        <div class="success-icon" style="font-size: 2.5rem; margin-bottom: 1.2rem; text-align: center;">🎮</div>
        <h2 class="success-title" style="font-size: 2rem; font-weight: 700; margin-bottom: 1.2rem; color: var(--white); text-align: left;">Message Sent Successfully!</h2>
        <p class="success-text" style="color: var(--white); margin-bottom: 1.5rem;">
          Thank you for reaching out, <b>${
            formData.firstName
          }</b>!<br>We've received your message and our gaming experts will get back to you within <b>2-4 hours</b>.
        </p>
        <div class="success-details" style="text-align: left; margin: 0 auto 1.5rem auto; max-width: 320px; color: var(--white);">
          <div style="margin-bottom: 0.5rem;"><b>Subject:</b> ${
            formData.subject
          }</div>
          <div style="margin-bottom: 0.5rem;"><b>Response Time:</b> 2-4 hours</div>
          <div><b>Reference ID:</b> ${this.generateReferenceId()}</div>
        </div>
        <div style="display: flex; justify-content: center;">
          <button class="btn btn-primary" style="margin-top: 1rem; width: auto; min-width: 180px; max-width: 320px; display: flex; justify-content: center; align-items: center; text-align: center; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600;" onclick="location.reload()">
            Send Another Message
          </button>
        </div>
      </div>
    `;
    // Плавная прокрутка к верху уведомления
    setTimeout(() => {
      const successBlock = document.querySelector(".contact-success");
      if (successBlock) {
        successBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }

  generateReferenceId() {
    return "PV-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".method-card, .category-card, .faq-item"
    );
    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  animateCardHover(card, isHovering) {
    if (!card) return;

    if (isHovering) {
      card.style.transform = "translateY(-8px) scale(1.02)";
      card.style.boxShadow = "0 20px 40px rgba(255, 107, 53, 0.3)";
    } else {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
    }
  }

  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 400px;
      backdrop-filter: blur(10px);
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = "translateX(400px)";
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    return icons[type] || icons.info;
  }

  getNotificationColor(type) {
    const colors = {
      success: "linear-gradient(135deg, #4CAF50, #45a049)",
      error: "linear-gradient(135deg, #f44336, #d32f2f)",
      warning: "linear-gradient(135deg, #ff9800, #f57c00)",
      info: "linear-gradient(135deg, #2196F3, #1976D2)",
    };
    return colors[type] || colors.info;
  }

  getFormData() {
    const form = document.getElementById("contact-form");
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  resetForm() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.reset();

      // Clear all error states
      const inputs = form.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        this.clearFieldError(input);
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactManager();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ContactManager;
}
