// Header Loader Module - GameVault
// Dynamically loads and initializes the site header

class HeaderManager {
  constructor() {
    this.headerContainer = document.getElementById("header-container");
    this.headerContent = null;
    this.isLoaded = false;
    this.scrollThreshold = 100;
    this.init();
  }

  async init() {
    try {
      await this.loadHeaderContent();
      this.refreshCartCount();
      this.setupEventListeners();
      this.initializeScrollEffects();
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to initialize header:", error);
      this.showFallbackHeader();
    }
  }

  async loadHeaderContent() {
    const response = await fetch("components/header.html");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.headerContent = await response.text();
    this.headerContainer.innerHTML = this.headerContent;

    // Add header styles if not already loaded
    if (!document.querySelector('link[href*="header.css"]')) {
      const headerStyles = document.createElement("link");
      headerStyles.rel = "stylesheet";
      headerStyles.href = "assets/styles/header.css";
      document.head.appendChild(headerStyles);
    }
  }

  setupEventListeners() {
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const cartButton = document.getElementById("cart-button");

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", () => {
        this.toggleMobileMenu(mobileToggle, mobileMenu);
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (event) => {
        if (
          !mobileToggle.contains(event.target) &&
          !mobileMenu.contains(event.target)
        ) {
          this.closeMobileMenu(mobileToggle, mobileMenu);
        }
      });

      // Close mobile menu on escape key
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this.closeMobileMenu(mobileToggle, mobileMenu);
        }
      });
    }

    if (cartButton) {
      cartButton.addEventListener("click", () => {
        this.handleCartClick();
      });
    }

    // Handle navigation link clicks
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (
          link.getAttribute("href") === "index.html#hot-deals" ||
          link.getAttribute("href") === "#hot-deals"
        ) {
          event.preventDefault();
          // Закрыть мобильное меню, если оно открыто
          const mobileToggle = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");
          if (
            mobileToggle &&
            mobileMenu &&
            mobileMenu.classList.contains("active")
          ) {
            this.closeMobileMenu(mobileToggle, mobileMenu);
          }
          if (
            window.location.pathname.endsWith("index.html") ||
            window.location.pathname === "/" ||
            window.location.pathname === ""
          ) {
            // Уже на главной — плавно скроллим
            const hotDeals = document.getElementById("hot-deals");
            if (hotDeals) {
              const header = document.querySelector(".site-header");
              const headerHeight = header ? header.offsetHeight : 0;
              const y =
                hotDeals.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                12;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          } else {
            // Не на главной — переходим на главную с якорем
            window.location.href = "index.html#hot-deals";
          }
          return;
        }
        this.handleNavigationClick(event, link);
      });
    });
  }

  toggleMobileMenu(toggle, menu) {
    const isActive = toggle.classList.contains("active");

    if (isActive) {
      this.closeMobileMenu(toggle, menu);
    } else {
      this.openMobileMenu(toggle, menu);
    }
  }

  openMobileMenu(toggle, menu) {
    toggle.classList.add("active");
    menu.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Animate menu items
    const menuItems = menu.querySelectorAll(".mobile-nav-item");
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add("slide-in");
    });
  }

  closeMobileMenu(toggle, menu) {
    toggle.classList.remove("active");
    menu.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");

    // Restore body scroll
    document.body.style.overflow = "";

    // Remove animation classes
    const menuItems = menu.querySelectorAll(".mobile-nav-item");
    menuItems.forEach((item) => {
      item.classList.remove("slide-in");
    });
  }

  initializeScrollEffects() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      // Add scrolled class for styling
      if (currentScrollY > this.scrollThreshold) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Hide/show header on scroll (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
  }

  handleCartClick() {
    // Navigate to cart page
    window.location.href = "shoppingCart.html";
  }

  handleNavigationClick(event, link) {
    const href = link.getAttribute("href");

    // Close mobile menu if open
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    if (
      mobileToggle &&
      mobileMenu &&
      mobileToggle.classList.contains("active")
    ) {
      this.closeMobileMenu(mobileToggle, mobileMenu);
    }

    // Add active state to current page
    this.updateActiveNavigation(href);
  }

  updateActiveNavigation(currentPath) {
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  }

  updateCartCount(count) {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? "block" : "none";
    }
  }

  showFallbackHeader() {
    this.headerContainer.innerHTML = `
      <header class="site-header">
        <div class="header-container">
          <div class="header-left">
            <a href="index.html" class="logo-link">
              <span class="logo-text">GameVault</span>
            </a>
          </div>
          <nav class="main-navigation">
            <ul class="nav-list">
              <li><a href="index.html" class="nav-link">Home</a></li>
              <li><a href="gameVault.html" class="nav-link">Games</a></li>
              <li><a href="contactUs.html" class="nav-link">Contact</a></li>
              <li><a href="shoppingCart.html" class="nav-link">Cart</a></li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  refreshCartCount() {
    // Get cart count from localStorage
    const cartObj = JSON.parse(
      localStorage.getItem("pixelVaultCart") || '{"items":[]}'
    );
    const count = Array.isArray(cartObj)
      ? cartObj.length
      : cartObj.items
      ? cartObj.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
    this.updateCartCount(count);
  }

  // Public method to refresh header
  refreshHeader() {
    if (this.isLoaded) {
      this.refreshCartCount();
    }
  }
}

// Initialize header manager
const headerManager = new HeaderManager();

// Make headerManager globally accessible
window.headerManager = headerManager;

// Export for use in other modules
export { headerManager };

// Плавная прокрутка к hot-deals при загрузке index.html с якорем
if (
  window.location.hash === "#hot-deals" &&
  (window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "")
) {
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      const hotDeals = document.getElementById("hot-deals");
      if (hotDeals) {
        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.offsetHeight : 0;
        const y =
          hotDeals.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          12;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  });
}
