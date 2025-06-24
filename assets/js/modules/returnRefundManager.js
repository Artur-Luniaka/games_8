/**
 * Return & Refund Policy Page Manager
 * Handles interactive features and animations for the return and refund policy page
 */

class ReturnRefundManager {
  constructor() {
    this.currentSection = null;
    this.sections = [];
    this.timelineItems = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupScrollEffects();
    this.setupTimelineAnimations();
  }

  setupEventListeners() {
    // Smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          this.smoothScrollTo(targetElement);
        }
      }
    });

    // Contact info interactions
    const contactLinks = document.querySelectorAll(".contact-method a");
    contactLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.href.startsWith("mailto:") || link.href.startsWith("tel:")) {
          this.handleContactClick(e, link);
        }
      });
    });

    // Overview card interactions
    const overviewCards = document.querySelectorAll(".overview-card");
    overviewCards.forEach((card) => {
      card.addEventListener("click", () => {
        this.handleOverviewCardClick(card);
      });
    });
  }

  initializeAnimations() {
    // Stagger section animations
    const sections = document.querySelectorAll(".policy-section");
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
    });

    // Animate overview cards
    const overviewCards = document.querySelectorAll(".overview-card");
    overviewCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
      this.observeElement(card, () => {
        card.style.animation = "slideInUp 0.6s ease-out";
      });
    });

    // Animate timeline items
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.3}s`;
    });
  }

  setupScrollEffects() {
    // Highlight current section in view
    const sections = document.querySelectorAll(".policy-section");
    sections.forEach((section) => {
      this.observeElement(
        section,
        () => {
          this.highlightSection(section);
        },
        () => {
          this.unhighlightSection(section);
        }
      );
    });

    // Parallax effect for header
    window.addEventListener("scroll", () => {
      this.handleParallax();
    });
  }

  setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, index) => {
      this.observeElement(item, () => {
        this.animateTimelineItem(item, index);
      });
    });
  }

  smoothScrollTo(element) {
    const headerHeight = document.querySelector("header")?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Add highlight effect
    element.style.animation = "highlightSection 0.6s ease-out";
    setTimeout(() => {
      element.style.animation = "";
    }, 600);
  }

  handleContactClick(e, link) {
    // Add click feedback
    link.style.transform = "scale(0.95)";
    setTimeout(() => {
      link.style.transform = "";
    }, 150);

    // Track contact clicks
    this.trackContactClick(link.href);
  }

  handleOverviewCardClick(card) {
    // Add click animation
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 150);

    // Get card info
    const title = card.querySelector("h3").textContent;
    const description = card.querySelector("p").textContent;

    // Show detailed info modal or navigate to relevant section
    this.showCardDetails(title, description);
  }

  showCardDetails(title, description) {
    const modal = document.createElement("div");
    modal.className = "card-details-modal";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${description}</p>
                    <div class="modal-actions">
                        <button class="btn-primary">Learn More</button>
                        <button class="btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

    modal.addEventListener("click", (e) => {
      if (
        e.target === modal ||
        e.target.classList.contains("close-modal") ||
        e.target.classList.contains("btn-secondary")
      ) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }

  highlightSection(section) {
    if (this.currentSection === section) return;

    this.currentSection = section;
    section.style.transform = "translateX(10px)";
    section.style.borderLeft = "4px solid var(--accent-color)";
    section.style.paddingLeft = "1rem";
    section.style.transition = "all 0.3s ease";
    section.style.backgroundColor = "rgba(231, 76, 60, 0.05)";
  }

  unhighlightSection(section) {
    section.style.transform = "";
    section.style.borderLeft = "";
    section.style.paddingLeft = "";
    section.style.backgroundColor = "";
  }

  animateTimelineItem(item, index) {
    item.style.animation = `slideInRight 0.6s ease-out ${index * 0.2}s both`;

    // Add progress indicator
    const progressBar = document.createElement("div");
    progressBar.className = "timeline-progress";
    progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-color), #e74c3c);
            width: 0;
            transition: width 0.8s ease-out;
        `;

    item.appendChild(progressBar);

    setTimeout(() => {
      progressBar.style.width = "100%";
    }, 100);
  }

  handleParallax() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector(".return-refund-header");
    if (header) {
      const rate = scrolled * -0.5;
      header.style.transform = `translateY(${rate}px)`;
    }
  }

  observeElement(element, onEnter, onExit) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnter && onEnter();
          } else {
            onExit && onExit();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px",
      }
    );

    observer.observe(element);
  }

  trackContactClick(contactType) {
    // Analytics tracking (placeholder)
    console.log("Contact clicked:", contactType);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#4CAF50" : "#f44336"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ReturnRefundManager();
});

// Add CSS animations and styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }

    @keyframes highlightSection {
        0% {
            background-color: rgba(231, 76, 60, 0.1);
        }
        100% {
            background-color: transparent;
        }
    }

    .print-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .print-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }

    .card-details-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease-out;
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h3 {
        margin: 0;
        color: var(--text-primary);
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        background: #f8f9fa;
        color: var(--text-primary);
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: var(--accent-color);
        color: white;
    }

    .btn-primary:hover {
        background: var(--accent-hover);
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: #f8f9fa;
        color: var(--text-primary);
        border: 1px solid #e9ecef;
    }

    .btn-secondary:hover {
        background: #e9ecef;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media print {
        .print-button,
        .card-details-modal {
            display: none;
        }
    }
`;
document.head.appendChild(style);
