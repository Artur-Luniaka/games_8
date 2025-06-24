// Categories Renderer Module - GameVault
// Renders game categories on the homepage

class CategoriesRenderer {
  constructor() {
    this.categoriesContainer = document.getElementById("categories-grid");
    this.categories = [
      {
        id: "action",
        name: "Action",
        icon: "⚔️",
        description: "Fast-paced combat and adventure",
        color: "#FF6B6B",
      },
      {
        id: "rpg",
        name: "RPG",
        icon: "🗡️",
        description: "Role-playing and character development",
        color: "#4ECDC4",
      },
      {
        id: "strategy",
        name: "Strategy",
        icon: "🏰",
        description: "Tactical thinking and planning",
        color: "#45B7D1",
      },
      {
        id: "sports",
        name: "Sports",
        icon: "⚽",
        description: "Competitive athletic games",
        color: "#96CEB4",
      },
      {
        id: "racing",
        name: "Racing",
        icon: "🏎️",
        description: "High-speed vehicle competition",
        color: "#FFEAA7",
      },
      {
        id: "adventure",
        name: "Adventure",
        icon: "🗺️",
        description: "Exploration and discovery",
        color: "#DDA0DD",
      },
    ];
    this.init();
  }

  init() {
    this.renderCategories();
    this.setupEventListeners();
  }

  renderCategories() {
    if (!this.categoriesContainer) return;

    const categoriesHTML = this.categories
      .map((category) => this.createCategoryCard(category))
      .join("");

    this.categoriesContainer.innerHTML = categoriesHTML;
  }

  createCategoryCard(category) {
    return `
      <div class="category-card" data-category="${category.id}">
        <div class="category-icon" style="background: ${category.color}">
          <span class="category-emoji">${category.icon}</span>
        </div>
        <div class="category-content">
          <h3 class="category-name">${category.name}</h3>
          <p class="category-description">${category.description}</p>
          <button class="category-btn" data-category="${category.id}">
            Explore ${category.name}
          </button>
        </div>
        <div class="category-overlay"></div>
      </div>
    `;
  }

  setupEventListeners() {
    if (!this.categoriesContainer) return;

    this.categoriesContainer.addEventListener("click", (event) => {
      const categoryCard = event.target.closest(".category-card");
      const categoryBtn = event.target.closest(".category-btn");

      if (categoryCard || categoryBtn) {
        const categoryId = (categoryCard || categoryBtn).dataset.category;
        this.handleCategoryClick(categoryId);
      }
    });

    // Add hover effects
    this.categoriesContainer.addEventListener("mouseenter", (event) => {
      const categoryCard = event.target.closest(".category-card");
      if (categoryCard) {
        categoryCard.classList.add("hovered");
      }
    });

    this.categoriesContainer.addEventListener("mouseleave", (event) => {
      const categoryCard = event.target.closest(".category-card");
      if (categoryCard) {
        categoryCard.classList.remove("hovered");
      }
    });
  }

  handleCategoryClick(categoryId) {
    const base = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/") + 1
    );
    window.location.href = base + "gameVault.html?category=" + categoryId;
  }
}

// Initialize categories renderer
const categoriesRenderer = new CategoriesRenderer();

// Export for use in other modules
export { categoriesRenderer };
