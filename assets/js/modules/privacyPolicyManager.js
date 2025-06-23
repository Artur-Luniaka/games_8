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
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupScrollEffects();
    this.setupPrintFunctionality();
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
    const contactLinks = document.querySelectorAll(".contact-info a");
    contactLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.href.startsWith("mailto:") || link.href.startsWith("tel:")) {
          this.handleContactClick(e, link);
        }
      });
    });

    // Copy contact info functionality
    this.setupCopyFunctionality();
  }

  initializeAnimations() {
    // Stagger section animations
    const sections = document.querySelectorAll(".policy-section");
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
    });

    // Animate contact info on scroll
    const contactInfo = document.querySelector(".contact-info");
    if (contactInfo) {
      this.observeElement(contactInfo, () => {
        contactInfo.style.animation = "slideInRight 0.6s ease-out";
      });
    }
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

  setupPrintFunctionality() {
    // Add print button functionality
    const printButton = document.createElement("button");
    printButton.className = "print-button";
    printButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 6,2 18,2 18,9"></polyline>
                <path d="M6,18H4a2,2 0 0,1 -2,-2V11a2,2 0 0,1 2,-2H20a2,2 0 0,1 2,2v5a2,2 0 0,1 -2,2H18"></path>
                <polyline points="6,14 6,22 18,22 18,14"></polyline>
            </svg>
            Print Policy
        `;

    printButton.addEventListener("click", () => {
      window.print();
    });

    const privacyHeader = document.querySelector(".privacy-header");
    if (privacyHeader) {
      privacyHeader.appendChild(printButton);
    }
  }

  setupCopyFunctionality() {
    const contactInfo = document.querySelector(".contact-info");
    if (contactInfo) {
      const copyButton = document.createElement("button");
      copyButton.className = "copy-contact-btn";
      copyButton.textContent = "Copy Contact Info";
      copyButton.addEventListener("click", () => {
        this.copyContactInfo();
      });
      contactInfo.appendChild(copyButton);
    }
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

  copyContactInfo() {
    const contactInfo = document.querySelector(".contact-info");
    const textToCopy = contactInfo.textContent
      .replace("Copy Contact Info", "")
      .trim();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.showNotification(
          "Contact information copied to clipboard!",
          "success"
        );
      })
      .catch(() => {
        this.showNotification("Failed to copy contact information", "error");
      });
  }

  highlightSection(section) {
    if (this.currentSection === section) return;

    this.currentSection = section;
    section.style.transform = "translateX(10px)";
    section.style.borderLeft = "4px solid var(--accent-color)";
    section.style.paddingLeft = "1rem";
    section.style.transition = "all 0.3s ease";
  }

  unhighlightSection(section) {
    section.style.transform = "";
    section.style.borderLeft = "";
    section.style.paddingLeft = "";
  }

  handleParallax() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector(".privacy-header");
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
  new PrivacyPolicyManager();
});

// Add CSS animations
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
            background-color: rgba(99, 102, 241, 0.1);
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

    .copy-contact-btn {
        background: var(--accent-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-top: 1rem;
        transition: all 0.3s ease;
    }

    .copy-contact-btn:hover {
        background: var(--accent-hover);
        transform: translateY(-1px);
    }

    @media print {
        .print-button,
        .copy-contact-btn {
            display: none;
        }
    }
`;
document.head.appendChild(style);
