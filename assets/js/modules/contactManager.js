// Contact Manager - PixelVault
// Handles contact form functionality and validation

class ContactManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFormValidation();
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

    // Map button
    const mapBtn = document.querySelector(".map-btn");
    if (mapBtn) {
      mapBtn.addEventListener("click", () => {
        this.openMap();
      });
    }

    // Social media links
    const socialIcons = document.querySelectorAll(".social-icon");
    socialIcons.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        event.preventDefault();
        this.handleSocialClick(icon.getAttribute("aria-label"));
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
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
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
        submitBtn.textContent = "Send Message";
      }
    }
  }

  async simulateFormSubmission() {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Network error"));
        }
      }, 1500);
    });
  }

  showSuccessState() {
    const contactContent = document.querySelector(".contact-content");
    if (!contactContent) return;

    contactContent.innerHTML = `
            <div class="contact-success">
                <div class="success-icon">✅</div>
                <h2 class="success-title">Message Sent Successfully!</h2>
                <p class="success-text">
                    Thank you for contacting us! We've received your message and will get back to you within 24 hours.
                </p>
                <div class="success-actions">
                    <a href="/index.html" class="submit-btn" style="text-decoration: none; display: inline-block;">
                        Back to Home
                    </a>
                </div>
            </div>
        `;
  }

  openMap() {
    const address = "123 Gaming Street, Digital City, DC 12345";
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapUrl, "_blank");
  }

  handleSocialClick(platform) {
    const socialUrls = {
      Facebook: "https://facebook.com/pixelvault",
      Twitter: "https://twitter.com/pixelvault",
      Instagram: "https://instagram.com/pixelvault",
      Discord: "https://discord.gg/pixelvault",
    };

    const url = socialUrls[platform];
    if (url) {
      window.open(url, "_blank");
    } else {
      this.showNotification(`${platform} link not available`, "info");
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

  // Public method to get form data (for potential API integration)
  getFormData() {
    const form = document.getElementById("contact-form");
    if (!form) return null;

    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  // Public method to reset form
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

// Initialize contact manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const contactManager = new ContactManager();

  // Make contact manager globally accessible
  window.contactManager = contactManager;
});

// Export for module usage
export default ContactManager;
