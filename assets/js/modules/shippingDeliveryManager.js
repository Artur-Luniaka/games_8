/**
 * Shipping & Delivery Page Manager
 * Handles interactive features and animations for the shipping and delivery page
 */

class ShippingDeliveryManager {
  constructor() {
    this.currentSection = null;
    this.sections = [];
    this.shippingOptions = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupScrollEffects();
    this.setupShippingCalculator();
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

    // Shipping option interactions
    const shippingOptions = document.querySelectorAll(".shipping-option");
    shippingOptions.forEach((option) => {
      option.addEventListener("click", () => {
        this.handleShippingOptionClick(option);
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

    // Animate shipping options
    const shippingOptions = document.querySelectorAll(".shipping-option");
    shippingOptions.forEach((option, index) => {
      option.style.animationDelay = `${index * 0.3}s`;
    });

    // Animate timeline steps
    const timelineSteps = document.querySelectorAll(".timeline-step");
    timelineSteps.forEach((step, index) => {
      step.style.animationDelay = `${index * 0.4}s`;
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

  setupShippingCalculator() {
    // Add shipping calculator functionality
    const calculator = document.createElement("div");
    calculator.className = "shipping-calculator";
    calculator.innerHTML = `
            <h3>🚚 Shipping Calculator</h3>
            <div class="calculator-form">
                <div class="form-group">
                    <label for="zipCode">ZIP Code:</label>
                    <input type="text" id="zipCode" placeholder="Enter ZIP code" maxlength="10">
                </div>
                <div class="form-group">
                    <label for="orderValue">Order Value:</label>
                    <input type="number" id="orderValue" placeholder="Enter order value" min="0" step="0.01">
                </div>
                <button type="button" class="calculate-btn">Calculate Shipping</button>
            </div>
            <div class="calculator-results" style="display: none;">
                <h4>Shipping Options:</h4>
                <div class="results-list"></div>
            </div>
        `;

    // Insert calculator after shipping options section
    const shippingOptionsSection = document.querySelector("#shipping-options");
    if (shippingOptionsSection) {
      const policyContent =
        shippingOptionsSection.querySelector(".policy-content");
      if (policyContent) {
        policyContent.appendChild(calculator);
      }
    }

    // Add calculator event listeners
    const calculateBtn = calculator.querySelector(".calculate-btn");
    const zipCodeInput = calculator.querySelector("#zipCode");
    const orderValueInput = calculator.querySelector("#orderValue");

    calculateBtn.addEventListener("click", () => {
      this.calculateShipping(zipCodeInput.value, orderValueInput.value);
    });

    // Allow Enter key to trigger calculation
    [zipCodeInput, orderValueInput].forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.calculateShipping(zipCodeInput.value, orderValueInput.value);
        }
      });
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

    const shippingDeliveryHeader = document.querySelector(
      ".shipping-delivery-header"
    );
    if (shippingDeliveryHeader) {
      shippingDeliveryHeader.appendChild(printButton);
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

  handleOverviewCardClick(card) {
    // Add click animation
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 150);

    // Get card info
    const title = card.querySelector("h3").textContent;
    const description = card.querySelector("p").textContent;

    // Show detailed info modal
    this.showCardDetails(title, description);
  }

  handleShippingOptionClick(option) {
    // Add click animation
    option.style.transform = "scale(0.98)";
    setTimeout(() => {
      option.style.transform = "";
    }, 150);

    // Get option info
    const title = option.querySelector("h3").textContent;
    const price = option.querySelector(".price").textContent;

    // Show option details
    this.showShippingOptionDetails(title, price);
  }

  calculateShipping(zipCode, orderValue) {
    if (!zipCode || !orderValue) {
      this.showNotification(
        "Please enter both ZIP code and order value",
        "error"
      );
      return;
    }

    const zip = zipCode.trim();
    const value = parseFloat(orderValue);

    if (isNaN(value) || value < 0) {
      this.showNotification("Please enter a valid order value", "error");
      return;
    }

    // Simulate shipping calculation
    const results = this.getShippingRates(zip, value);
    this.displayShippingResults(results);
  }

  getShippingRates(zipCode, orderValue) {
    // Simulate different rates based on ZIP code and order value
    const isFreeShipping = orderValue >= 50;
    const isRemote = zipCode.startsWith("9") || zipCode.startsWith("0");

    return [
      {
        name: "Standard Shipping",
        price: isFreeShipping ? "FREE" : "$4.99",
        time: isRemote ? "7-10 business days" : "5-7 business days",
        originalPrice: 4.99,
      },
      {
        name: "Express Shipping",
        price: isFreeShipping ? "$5.00" : "$9.99",
        time: isRemote ? "4-6 business days" : "2-3 business days",
        originalPrice: 9.99,
      },
      {
        name: "Overnight Shipping",
        price: isRemote ? "$24.99" : "$19.99",
        time: isRemote ? "2-3 business days" : "Next business day",
        originalPrice: isRemote ? 24.99 : 19.99,
      },
    ];
  }

  displayShippingResults(results) {
    const resultsContainer = document.querySelector(".calculator-results");
    const resultsList = resultsContainer.querySelector(".results-list");

    resultsList.innerHTML = results
      .map(
        (result) => `
            <div class="result-item">
                <div class="result-header">
                    <h5>${result.name}</h5>
                    <span class="result-price">${result.price}</span>
                </div>
                <p class="result-time">${result.time}</p>
            </div>
        `
      )
      .join("");

    resultsContainer.style.display = "block";
    resultsContainer.style.animation = "slideInUp 0.6s ease-out";
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

  showShippingOptionDetails(title, price) {
    const modal = document.createElement("div");
    modal.className = "shipping-details-modal";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="shipping-detail">
                        <h4>Price: ${price}</h4>
                        <p>This shipping option includes full tracking, insurance, and signature confirmation for orders over $100.</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary">Select This Option</button>
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
    section.style.backgroundColor = "rgba(39, 174, 96, 0.05)";
  }

  unhighlightSection(section) {
    section.style.transform = "";
    section.style.borderLeft = "";
    section.style.paddingLeft = "";
    section.style.backgroundColor = "";
  }

  handleParallax() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector(".shipping-delivery-header");
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
  new ShippingDeliveryManager();
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
            background-color: rgba(39, 174, 96, 0.1);
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

    .shipping-calculator {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 2rem;
        border-radius: 12px;
        margin: 2rem 0;
        border: 1px solid #e9ecef;
    }

    .shipping-calculator h3 {
        margin: 0 0 1.5rem;
        color: var(--text-primary);
        text-align: center;
    }

    .calculator-form {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group label {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .form-group input {
        padding: 0.75rem;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .form-group input:focus {
        outline: none;
        border-color: var(--accent-color);
    }

    .calculate-btn {
        background: var(--accent-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        align-self: end;
    }

    .calculate-btn:hover {
        background: var(--accent-hover);
        transform: translateY(-1px);
    }

    .calculator-results {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .calculator-results h4 {
        margin: 0 0 1rem;
        color: var(--text-primary);
    }

    .result-item {
        padding: 1rem;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
    }

    .result-item:hover {
        border-color: var(--accent-color);
        background: #f8f9fa;
    }

    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .result-header h5 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1rem;
    }

    .result-price {
        background: var(--accent-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .result-time {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .card-details-modal,
    .shipping-details-modal {
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

    .shipping-detail {
        margin-bottom: 1.5rem;
    }

    .shipping-detail h4 {
        color: var(--accent-color);
        margin: 0 0 0.5rem;
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
        .card-details-modal,
        .shipping-details-modal,
        .shipping-calculator {
            display: none;
        }
    }

    @media (max-width: 768px) {
        .calculator-form {
            grid-template-columns: 1fr;
        }
        
        .calculate-btn {
            align-self: stretch;
        }
    }
`;
document.head.appendChild(style);
