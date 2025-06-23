// Footer Loader Module - GameVault
// Dynamically loads and initializes the site footer

class FooterManager {
  constructor() {
    this.footerContainer = document.getElementById("footer-container");
    this.footerContent = null;
    this.isLoaded = false;
    this.init();
  }

  async init() {
    try {
      await this.loadFooterContent();
      this.setupEventListeners();
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to initialize footer:", error);
      this.showFallbackFooter();
    }
  }

  async loadFooterContent() {
    const response = await fetch("components/footer.html");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.footerContent = await response.text();
    this.footerContainer.innerHTML = this.footerContent;

    // Add footer styles if not already loaded
    if (!document.querySelector('link[href*="footer.css"]')) {
      const footerStyles = document.createElement("link");
      footerStyles.rel = "stylesheet";
      footerStyles.href = "assets/styles/footer.css";
      document.head.appendChild(footerStyles);
    }
  }

  setupEventListeners() {
    // Handle social media links
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        this.handleSocialLinkClick(event, link);
      });
    });

    // Handle footer navigation links
    const footerLinks = document.querySelectorAll(".footer-link");
    footerLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        this.handleFooterLinkClick(event, link);
      });
    });

    // Add smooth scroll for anchor links
    this.setupSmoothScroll();
  }

  handleSocialLinkClick(event, link) {
    event.preventDefault();

    const platform = link.getAttribute("aria-label")?.toLowerCase() || "social";
    const url = link.getAttribute("href");

    if (url && url !== "#") {
      // Open social media links in new tab
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Show placeholder message for demo
      this.showSocialPlaceholder(platform);
    }
  }

  handleFooterLinkClick(event, link) {
    const href = link.getAttribute("href");

    // Check if it's an external link
    if (href.startsWith("http")) {
      // Open external links in new tab
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    // For internal links, let them navigate normally
    // but add some analytics or tracking if needed
    this.trackFooterLinkClick(href);
  }

  setupSmoothScroll() {
    const footerLinks = document.querySelectorAll('.footer-link[href^="#"]');
    footerLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  showSocialPlaceholder(platform) {
    // Create a temporary notification
    const notification = document.createElement("div");
    notification.className = "social-notification";
    notification.innerHTML = `
            <div class="notification-content">
                <span>${platform} link would open here</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-orange);
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

  trackFooterLinkClick(href) {
    // Analytics tracking placeholder
    console.log(`Footer link clicked: ${href}`);

    // You can add actual analytics tracking here
    // Example: gtag('event', 'footer_link_click', { link_url: href });
  }

  updateFooterYear() {
    const yearElement = document.querySelector(".copyright");
    if (yearElement) {
      const currentYear = new Date().getFullYear();
      yearElement.innerHTML = yearElement.innerHTML.replace(
        /© \d{4}/,
        `© ${currentYear}`
      );
    }
  }

  showFallbackFooter() {
    this.footerContainer.innerHTML = `
            <footer class="site-footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>GameVault</h3>
                            <p>Your premier gaming destination</p>
                        </div>
                        <div class="footer-section">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="gameVault.html">Games</a></li>
                                <li><a href="contactUs.html">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>© ${new Date().getFullYear()} GameVault. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
  }

  refreshFooter() {
    if (this.isLoaded) {
      this.updateFooterYear();
    }
  }

  updateFooterContent(newContent) {
    if (this.footerContainer) {
      this.footerContainer.innerHTML = newContent;
    }
  }
}

// Initialize footer manager
const footerManager = new FooterManager();

// Export for use in other modules
export { footerManager };
