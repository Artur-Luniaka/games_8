// Testimonials Loader Module - GameVault
// Loads and displays user testimonials on the homepage

class TestimonialsLoader {
  constructor() {
    this.testimonialsContainer = document.getElementById("testimonials-grid");
    this.testimonials = [
      {
        id: 1,
        name: "Alex Chen",
        avatar: "👨‍💻",
        rating: 5,
        text: "Amazing selection of games! The delivery was super fast and the customer service is top-notch. Highly recommend!",
        game: "Cyberpunk 2077",
        date: "2024-01-15",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        avatar: "👩‍🎮",
        rating: 5,
        text: "Best gaming store I've found online. Great prices, excellent game quality, and they always have the latest releases.",
        game: "Elden Ring",
        date: "2024-01-12",
      },
      {
        id: 3,
        name: "Mike Rodriguez",
        avatar: "👨‍🎯",
        rating: 4,
        text: "Solid gaming platform with competitive prices. The user interface is clean and easy to navigate. Will definitely shop here again!",
        game: "God of War",
        date: "2024-01-10",
      },
      {
        id: 4,
        name: "Emily Davis",
        avatar: "👩‍🏆",
        rating: 5,
        text: "Fantastic experience! The game arrived in perfect condition and the download process was seamless. Love this store!",
        game: "Red Dead Redemption 2",
        date: "2024-01-08",
      },
      {
        id: 5,
        name: "David Kim",
        avatar: "👨‍🚀",
        rating: 4,
        text: "Great selection of both PC and Xbox games. The search and filter features make it easy to find exactly what you're looking for.",
        game: "The Witcher 3",
        date: "2024-01-05",
      },
      {
        id: 6,
        name: "Lisa Thompson",
        avatar: "👩‍🎨",
        rating: 5,
        text: "Outstanding customer service and fast delivery. The game quality is excellent and the prices are unbeatable. My go-to gaming store!",
        game: "Assassin's Creed",
        date: "2024-01-03",
      },
    ];
    this.init();
  }

  init() {
    this.renderTestimonials();
    this.setupEventListeners();
  }

  renderTestimonials() {
    if (!this.testimonialsContainer) return;

    const testimonialsHTML = this.testimonials
      .map((testimonial) => this.createTestimonialCard(testimonial))
      .join("");

    this.testimonialsContainer.innerHTML = testimonialsHTML;
  }

  createTestimonialCard(testimonial) {
    const stars = this.generateStars(testimonial.rating);
    const formattedDate = this.formatDate(testimonial.date);

    return `
      <div class="testimonial-card" data-testimonial-id="${testimonial.id}">
        <div class="testimonial-header">
          <div class="testimonial-avatar">
            <span class="avatar-emoji">${testimonial.avatar}</span>
          </div>
          <div class="testimonial-info">
            <h4 class="testimonial-name">${testimonial.name}</h4>
            <div class="testimonial-rating">
              <span class="stars">${stars}</span>
              <span class="rating-value">${testimonial.rating}/5</span>
            </div>
            <p class="testimonial-game">Purchased: ${testimonial.game}</p>
            <span class="testimonial-date">${formattedDate}</span>
          </div>
        </div>
        <div class="testimonial-content">
          <blockquote class="testimonial-text">
            "${testimonial.text}"
          </blockquote>
        </div>
        <div class="testimonial-footer">
          <button class="testimonial-helpful-btn" data-testimonial-id="${testimonial.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
              <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
            </svg>
            Helpful
          </button>
          <button class="testimonial-share-btn" data-testimonial-id="${testimonial.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
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

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  setupEventListeners() {
    if (!this.testimonialsContainer) return;

    this.testimonialsContainer.addEventListener("click", (event) => {
      const helpfulBtn = event.target.closest(".testimonial-helpful-btn");
      const shareBtn = event.target.closest(".testimonial-share-btn");

      if (helpfulBtn) {
        const testimonialId = helpfulBtn.dataset.testimonialId;
        this.handleHelpfulClick(helpfulBtn, testimonialId);
      } else if (shareBtn) {
        const testimonialId = shareBtn.dataset.testimonialId;
        this.handleShareClick(shareBtn, testimonialId);
      }
    });

    // Add hover effects
    this.testimonialsContainer.addEventListener("mouseenter", (event) => {
      const testimonialCard = event.target.closest(".testimonial-card");
      if (testimonialCard) {
        testimonialCard.classList.add("hovered");
      }
    });

    this.testimonialsContainer.addEventListener("mouseleave", (event) => {
      const testimonialCard = event.target.closest(".testimonial-card");
      if (testimonialCard) {
        testimonialCard.classList.remove("hovered");
      }
    });
  }

  handleHelpfulClick(button, testimonialId) {
    // Toggle helpful state
    const isHelpful = button.classList.contains("helpful");

    if (isHelpful) {
      button.classList.remove("helpful");
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
          <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
        </svg>
        Helpful
      `;
    } else {
      button.classList.add("helpful");
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
          <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
        </svg>
        Helpful
      `;
    }

    // Store helpful state in localStorage
    const helpfulTestimonials = JSON.parse(
      localStorage.getItem("gameVaultHelpfulTestimonials") || "[]"
    );

    if (isHelpful) {
      const index = helpfulTestimonials.indexOf(testimonialId);
      if (index > -1) {
        helpfulTestimonials.splice(index, 1);
      }
    } else {
      helpfulTestimonials.push(testimonialId);
    }

    localStorage.setItem(
      "gameVaultHelpfulTestimonials",
      JSON.stringify(helpfulTestimonials)
    );

    // Show feedback
    this.showNotification(
      isHelpful ? "Removed from helpful" : "Marked as helpful",
      "info"
    );
  }

  handleShareClick(button, testimonialId) {
    const testimonial = this.testimonials.find((t) => t.id == testimonialId);
    if (!testimonial) return;

    const shareText = `"${testimonial.text}" - ${testimonial.name} on GameVault`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      // Use native sharing if available
      navigator
        .share({
          title: "GameVault Review",
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => {
          console.log("Error sharing:", error);
          this.fallbackShare(shareText, shareUrl);
        });
    } else {
      // Fallback to copy to clipboard
      this.fallbackShare(shareText, shareUrl);
    }
  }

  fallbackShare(shareText, shareUrl) {
    const fullText = `${shareText}\n\n${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(fullText)
        .then(() => {
          this.showNotification("Review copied to clipboard!", "success");
        })
        .catch(() => {
          this.showNotification("Failed to copy to clipboard", "error");
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        this.showNotification("Review copied to clipboard!", "success");
      } catch (err) {
        this.showNotification("Failed to copy to clipboard", "error");
      }

      document.body.removeChild(textArea);
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `testimonial-notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: ${
        type === "success"
          ? "#4CAF50"
          : type === "error"
          ? "#e74c3c"
          : "#2196F3"
      };
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideInUp 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
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

  // Public method to add a new testimonial
  addTestimonial(testimonial) {
    testimonial.id = this.testimonials.length + 1;
    testimonial.date = new Date().toISOString().split("T")[0];
    this.testimonials.unshift(testimonial);
    this.renderTestimonials();
  }

  // Public method to get testimonials
  getTestimonials() {
    return this.testimonials;
  }
}

// Initialize testimonials loader
const testimonialsLoader = new TestimonialsLoader();

// Export for use in other modules
export { testimonialsLoader };
