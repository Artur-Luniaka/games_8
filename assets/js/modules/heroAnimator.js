// Hero Animator Module - PixelVault
// Handles all hero section animations and interactions

class HeroAnimator {
  constructor() {
    this.heroSection = document.getElementById("hero-section");
    this.heroButtons = document.querySelectorAll(".hero-btn");
    this.heroImages = document.querySelectorAll(".hero-image");
    this.isAnimating = false;
    this.parallaxEnabled = true;
    this.init();
  }

  init() {
    if (!this.heroSection) return;

    this.setupEventListeners();
    this.initializeParallax();
    this.setupIntersectionObserver();
    this.createParticleEffect();
  }

  setupEventListeners() {
    // Hero button interactions
    this.heroButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        this.handleHeroButtonClick(event, button);
      });

      button.addEventListener("mouseenter", () => {
        this.handleButtonHover(button);
      });

      button.addEventListener("mouseleave", () => {
        this.handleButtonLeave(button);
      });
    });

    // Hero image interactions
    this.heroImages.forEach((image) => {
      image.addEventListener("mouseenter", () => {
        this.handleImageHover(image);
      });

      image.addEventListener("mouseleave", () => {
        this.handleImageLeave(image);
      });
    });

    // Scroll-based animations
    window.addEventListener(
      "scroll",
      () => {
        this.handleScroll();
      },
      { passive: true }
    );

    // Resize handler
    window.addEventListener(
      "resize",
      () => {
        this.handleResize();
      },
      { passive: true }
    );
  }

  initializeParallax() {
    if (!this.parallaxEnabled) return;

    const parallaxElements = document.querySelectorAll(".hero-image");

    window.addEventListener(
      "scroll",
      () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach((element, index) => {
          const speed = 0.1 + index * 0.05;
          element.style.transform = `translateY(${rate * speed}px)`;
        });
      },
      { passive: true }
    );
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerHeroAnimations();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (this.heroSection) {
      observer.observe(this.heroSection);
    }
  }

  triggerHeroAnimations() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Staggered image animations
    this.heroImages.forEach((image, index) => {
      setTimeout(() => {
        image.style.animation = "fadeInScale 1.2s ease forwards";
      }, index * 150);
    });

    // Content animations
    const titleLines = document.querySelectorAll(".hero-title-line");
    titleLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.animation = "slideInLeft 0.8s ease forwards";
      }, 1000 + index * 200);
    });

    const description = document.querySelector(".hero-description");
    if (description) {
      setTimeout(() => {
        description.style.animation = "slideUpFade 0.8s ease forwards";
      }, 1400);
    }

    const actions = document.querySelector(".hero-actions");
    if (actions) {
      setTimeout(() => {
        actions.style.animation = "slideUpFade 0.8s ease forwards";
      }, 1600);
    }
  }

  handleHeroButtonClick(event, button) {
    event.preventDefault();

    const action = button.getAttribute("data-action");

    // Add click animation
    this.animateButtonClick(button);

    // Handle different actions
    switch (action) {
      case "explore":
        this.handleExploreAction();
        break;
      case "deals":
        this.handleDealsAction();
        break;
      default:
        console.log("Unknown hero button action:", action);
    }
  }

  animateButtonClick(button) {
    button.style.transform = "scale(0.95)";
    button.style.transition = "transform 0.1s ease";

    setTimeout(() => {
      button.style.transform = "";
      button.style.transition = "";
    }, 100);
  }

  handleExploreAction() {
    // Smooth scroll to featured games section
    const featuredSection = document.getElementById("featured-games");
    if (featuredSection) {
      featuredSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  handleDealsAction() {
    // Navigate to deals page or show deals modal
    window.location.href = "/deals.html";
  }

  handleButtonHover(button) {
    // Don't override CSS transform styles
    // button.style.transform = "translateY(-2px)";

    // Create ripple effect
    this.createRippleEffect(button);
  }

  handleButtonLeave(button) {
    // Don't reset transform to avoid overriding CSS styles
    // button.style.transform = "";
  }

  createRippleEffect(button) {
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  handleImageHover(image) {
    image.style.transform = "scale(1.1)";
    image.style.zIndex = "10";

    // Add glow effect
    image.style.filter = "brightness(1.2) contrast(1.1)";
  }

  handleImageLeave(image) {
    image.style.transform = "";
    image.style.zIndex = "";
    image.style.filter = "";
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const heroHeight = this.heroSection?.offsetHeight || 0;

    if (scrolled > heroHeight * 0.5) {
      this.parallaxEnabled = false;
    } else {
      this.parallaxEnabled = true;
    }
  }

  handleResize() {
    // Recalculate parallax positions on resize
    if (this.parallaxEnabled) {
      this.initializeParallax();
    }
  }

  createParticleEffect() {
    const particleContainer = document.createElement("div");
    particleContainer.className = "hero-particles";
    particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;

    this.heroSection.appendChild(particleContainer);

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      this.createParticle(particleContainer);
    }
  }

  createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "floating-particle";

    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
        `;

    container.appendChild(particle);
  }

  // Public method to trigger custom animations
  triggerCustomAnimation(animationType) {
    switch (animationType) {
      case "shake":
        this.animateShake();
        break;
      case "pulse":
        this.animatePulse();
        break;
      case "bounce":
        this.animateBounce();
        break;
      default:
        console.log("Unknown animation type:", animationType);
    }
  }

  animateShake() {
    this.heroSection.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      this.heroSection.style.animation = "";
    }, 500);
  }

  animatePulse() {
    this.heroSection.style.animation = "pulse 1s ease-in-out";
    setTimeout(() => {
      this.heroSection.style.animation = "";
    }, 1000);
  }

  animateBounce() {
    this.heroSection.style.animation = "bounce 0.6s ease-in-out";
    setTimeout(() => {
      this.heroSection.style.animation = "";
    }, 600);
  }

  // Method to disable/enable animations for accessibility
  toggleAnimations(enabled) {
    this.parallaxEnabled = enabled;

    if (!enabled) {
      this.heroSection.style.animation = "none";
      this.heroImages.forEach((img) => {
        img.style.animation = "none";
        img.style.transform = "none";
      });
    }
  }
}

// Add custom CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
        40%, 43% { transform: translateY(-10px); }
        70% { transform: translateY(-5px); }
        90% { transform: translateY(-2px); }
    }
`;
document.head.appendChild(style);

// Initialize hero animator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const heroAnimator = new HeroAnimator();

  // Make hero animator globally accessible
  window.pixelVaultHero = heroAnimator;

  // Check for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroAnimator.toggleAnimations(false);
  }
});

// Export for module usage
export default HeroAnimator;
