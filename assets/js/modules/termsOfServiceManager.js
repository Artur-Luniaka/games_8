/**
 * Terms of Service Page Manager
 * Handles interactive features and navigation for the terms of service page
 */

class TermsOfServiceManager {
  constructor() {
    this.currentSection = null;
    this.sections = [];
    this.toc = null;
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupScrollSpy();
    this.setupAnimations();
    this.setupResponsiveBehavior();
    this.createTableOfContents();
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

  createTableOfContents() {
    const sections = document.querySelectorAll(".terms-section");
    if (sections.length === 0) return;

    const toc = document.createElement("div");
    toc.className = "terms-toc";
    toc.innerHTML = `
            <h3>Table of Contents</h3>
            <ul class="toc-list"></ul>
        `;

    const tocList = toc.querySelector(".toc-list");

    sections.forEach((section, index) => {
      const heading = section.querySelector("h2");
      if (!heading) return;

      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = heading.textContent;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.smoothScrollTo(section);
      });

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    // Insert TOC after breadcrumb
    const breadcrumb = document.querySelector(".breadcrumb-nav");
    if (breadcrumb) {
      breadcrumb.parentNode.insertBefore(toc, breadcrumb.nextSibling);
    }

    this.toc = toc;
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

  highlightSection(section) {
    if (this.currentSection === section) return;

    this.currentSection = section;
    section.style.transform = "translateX(10px)";
    section.style.borderLeft = "4px solid var(--accent-color)";
    section.style.paddingLeft = "1rem";
    section.style.transition = "all 0.3s ease";
    section.style.backgroundColor = "rgba(99, 102, 241, 0.05)";
  }

  unhighlightSection(section) {
    section.style.transform = "";
    section.style.borderLeft = "";
    section.style.paddingLeft = "";
    section.style.backgroundColor = "";
  }

  updateTocHighlight(sectionId) {
    if (!this.toc) return;

    const tocLinks = this.toc.querySelectorAll("a");
    tocLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });
  }

  handleParallax() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector(".terms-header");
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
  new TermsOfServiceManager();
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
document.head.appendChild(style);
