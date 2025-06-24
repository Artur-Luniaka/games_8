/**
 * Privacy Policy Page Manager
 * Handles interactive features and animations for the privacy policy page
 */

class PrivacyPolicyManager {
  constructor() {
    this.currentSection = null;
    this.sections = [];
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupScrollSpy();
    this.setupAnimations();
    this.setupResponsiveBehavior();
  }

  setupSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  setupScrollSpy() {
    // Get all sections
    this.sections = Array.from(document.querySelectorAll(".policy-section"));

    // Create intersection observer for scroll spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.currentSection = entry.target;
            this.updateActiveSection();
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    // Observe all sections
    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  updateActiveSection() {
    // Remove active class from all sections
    this.sections.forEach((section) => {
      section.classList.remove("active");
    });

    // Add active class to current section
    if (this.currentSection) {
      this.currentSection.classList.add("active");
    }
  }

  setupAnimations() {
    // Add entrance animations to sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Observe all sections for animations
    this.sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(section);
    });
  }

  setupResponsiveBehavior() {
    // Handle responsive behavior
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        document.body.classList.add("mobile");
      } else {
        document.body.classList.remove("mobile");
      }
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PrivacyPolicyManager();
});

// Add styles for components
const styles = `
  .print-btn {
    background: linear-gradient(135deg, #00fff7, #ff007b);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    display: inline-block;
  }

  .print-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 247, 0.3);
  }

  .policy-section.active {
    border-left: 3px solid #00fff7;
    padding-left: 1rem;
  }

  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 255, 247, 0.9);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  }

  .notification-error {
    background: rgba(255, 0, 123, 0.9);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .print-btn {
      width: 100%;
      margin-top: 1rem;
    }
  }

  @media print {
    .print-btn {
      display: none;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
