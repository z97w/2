// script.js

// ========== PRODUCT DATA ==========
const products = [
  {
    id: 1,
    name: "20V Impact Drill",
    category: "power-tools",
    icon: "fas fa-drill",
    shortDesc: "Brushless motor, extreme torque for concrete & steel",
    specs: {
      "RPM": "0-2200 / 0-3200 RPM",
      "Battery": "20V Li-Ion 5.0Ah",
      "Torque": "1850 in-lbs",
      "Chuck Size": "1/2-inch metal ratchet"
    },
    fullName: "20V BRUSHLESS IMPACT DRILL"
  },
  {
    id: 2,
    name: "Mini Excavator X-15",
    category: "heavy-machinery",
    icon: "fas fa-tractor",
    shortDesc: "Compact yet powerful, ideal for urban construction",
    specs: {
      "Operating Weight": "3,850 lbs",
      "Engine Power": "24.8 HP Diesel",
      "Dig Depth": "9.2 ft",
      "Bucket Capacity": "0.07 cu yd"
    },
    fullName: "MINI EXCAVATOR X-15"
  },
  {
    id: 3,
    name: "Professional Leveler",
    category: "hand-tools",
    icon: "fas fa-ruler-combined",
    shortDesc: "Magnetic aluminum frame, accuracy 0.5mm/m",
    specs: {
      "Material": "Aluminum + rubber grips",
      "Length": "48 inches (120cm)",
      "Accuracy": "±0.5 mm/m",
      "Vials": "3 acrylic vials"
    },
    fullName: "PROFESSIONAL MAGNETIC LEVELER"
  },
  {
    id: 4,
    name: "Carbon-Fiber Hard Hat",
    category: "safety-gear",
    icon: "fas fa-hard-hat",
    shortDesc: "ANSI Z89.1, full brim with ventilation",
    specs: {
      "Material": "Carbon fiber composite",
      "Weight": "12.8 oz",
      "Standard": "Type 1, Class C",
      "Accessories": "Universal slot for earmuffs"
    },
    fullName: "TITAN CARBON HARD HAT"
  },
  {
    id: 5,
    name: "Heavy-Duty Winch 12k",
    category: "heavy-machinery",
    icon: "fas fa-cog",
    shortDesc: "12,000 lb synthetic rope winch, IP68 rated",
    specs: {
      "Pull Capacity": "12,000 lbs",
      "Motor": "6.6 HP series wound",
      "Line Speed": "28 ft/min",
      "Rope": "Synthetic 3/8'' x 85'"
    },
    fullName: "IRONWINCH 12K"
  },
  {
    id: 6,
    name: "Welding Gloves Premium",
    category: "safety-gear",
    icon: "fas fa-mitten",
    shortDesc: "Heat-resistant leather, reinforced stitching",
    specs: {
      "Material": "Cowhide + Kevlar",
      "Heat Rating": "662°F (350°C)",
      "Length": "14 inches",
      "Application": "Stick/TIG welding"
    },
    fullName: "PRO-WELD GLOVES"
  }
];

// Cart state
let cart = [];
let currentReviewIndex = 0;
let reviewsData = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartCounterSpan = document.getElementById('cartCounter');
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const categoryLinks = document.querySelectorAll('.nav-category');
const reviewsTrack = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('prevReviewBtn');
const nextBtn = document.getElementById('nextReviewBtn');
const dotsContainer = document.getElementById('sliderDots');
const shopNowBtn = document.getElementById('shopNowBtn');
const quoteBtn = document.getElementById('quoteBtn');

// ========== HELPER FUNCTIONS ==========
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounterSpan.innerText = totalItems;
  // subtle animation
  cartCounterSpan.style.transform = 'scale(1.2)';
  setTimeout(() => { cartCounterSpan.style.transform = 'scale(1)'; }, 200);
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCartUI();
  // optional toast style feedback
  showToast("Item added to cart");
}

function showToast(msg) {
  let toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#FFD700';
  toast.style.color = '#0a0a0a';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.fontWeight = 'bold';
  toast.style.zIndex = '9999';
  toast.style.fontFamily = 'Oswald, sans-serif';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Render products with filtering
function renderProducts(filterCategory = 'all') {
  let filtered = products;
  if (filterCategory !== 'all') {
    filtered = products.filter(p => p.category === filterCategory);
  }
  if (productsGrid) {
    productsGrid.innerHTML = '';
    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.id = product.id;
      // Generate specs table HTML
      const specsRows = Object.entries(product.specs).map(([key, val]) => `<tr><td>${key}</td><td>${val}</td></tr>`).join('');
      card.innerHTML = `
        <div class="product-img">
          <i class="${product.icon}"></i>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.fullName}</h3>
          <div class="product-category">${product.category.replace('-', ' ').toUpperCase()}</div>
          <p class="product-desc">${product.shortDesc}</p>
          <button class="specs-btn" data-id="${product.id}">📋 VIEW SPECS</button>
          <div class="specs-table" id="specs-${product.id}">
            <table>${specsRows}</table>
          </div>
          <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> ADD TO CART</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // Attach event listeners for specs toggle and add-to-cart
    document.querySelectorAll('.specs-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.getAttribute('data-id');
        const specDiv = document.getElementById(`specs-${prodId}`);
        if (specDiv) {
          specDiv.classList.toggle('show-specs');
        }
      });
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = parseInt(btn.getAttribute('data-id'));
        addToCart(prodId);
      });
    });
  }
}

// ========== REVIEWS SLIDER (cards) ==========
function initReviews() {
  reviewsData = [
    { name: "Marcus O’Brien", role: "Site Foreman", text: "The Mini Excavator X-15 is a beast on tight urban sites. Reliable and powerful, exceeded expectations. IronForge delivers industrial quality.", stars: 5 },
    { name: "Elena Vasquez", role: "Construction Manager", text: "20V Impact Drill has insane torque. Used daily for framing and metal work. Battery life is outstanding. Worth every penny.", stars: 5 },
    { name: "Dmitri Volkov", role: "Heavy Equipment Operator", text: "Safety gear and heavy machinery section is top-tier. Requested quote and got fast response. Professional leveler is accurate to 0.5mm.", stars: 5 }
  ];
  renderReviewsSlider();
}

function renderReviewsSlider() {
  if (!reviewsTrack) return;
  reviewsTrack.innerHTML = '';
  reviewsData.forEach((review, idx) => {
    const starsHtml = Array(5).fill().map((_, i) => `<i class="fas fa-star"></i>`).join('');
    const cardDiv = document.createElement('div');
    cardDiv.className = 'review-card';
    cardDiv.innerHTML = `
      <div class="review-stars">${starsHtml}</div>
      <p class="review-text">"${review.text}"</p>
      <div class="review-author">— ${review.name}, ${review.role}</div>
    `;
    reviewsTrack.appendChild(cardDiv);
  });
  updateReviewSliderPosition();
  createDots();
}

function updateReviewSliderPosition() {
  if (!reviewsTrack) return;
  const cardWidth = reviewsTrack.children[0]?.offsetWidth + 32; // gap 2rem = 32px
  if (cardWidth) {
    reviewsTrack.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
  } else {
    reviewsTrack.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
  }
  updateActiveDot();
}

function createDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  reviewsData.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === currentReviewIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentReviewIndex = idx;
      updateReviewSliderPosition();
      updateActiveDot();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateActiveDot() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    if (idx === currentReviewIndex) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

function nextReview() {
  if (reviewsData.length === 0) return;
  currentReviewIndex = (currentReviewIndex + 1) % reviewsData.length;
  updateReviewSliderPosition();
}

function prevReview() {
  if (reviewsData.length === 0) return;
  currentReviewIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
  updateReviewSliderPosition();
}

// ========== FILTERING & NAVIGATION ==========
let currentFilter = 'all';
function setActiveCategory(selectedCatId) {
  categoryLinks.forEach(link => {
    const catValue = link.getAttribute('data-category');
    if (catValue === selectedCatId) {
      link.classList.add('active-cat');
    } else {
      link.classList.remove('active-cat');
    }
  });
}

function handleCategoryClick(e) {
  e.preventDefault();
  const category = e.currentTarget.getAttribute('data-category');
  currentFilter = category;
  renderProducts(currentFilter);
  setActiveCategory(currentFilter);
  // Smooth scroll to products section
  const productsSection = document.getElementById('productsSection');
  if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========== CART ICON CLICK DEMO ==========
function showCartAlert() {
  if (cart.length === 0) {
    Toast("Your cart is empty. Add some heavy-duty gear!");
  } else {
    let itemsList = cart.map(item => {
      const prod = products.find(p => p.id === item.id);
      return `${prod?.fullName || 'Item'} x${item.quantity}`;
    }).join('\n');
    Toast(`🛒 CURRENT ORDER:\n${itemsList}\n\nTotal items: ${cart.reduce((s,i)=>s+i.quantity,0)}\nRequest final quote via "Request Quote" button.`);
  }
}

// ========== REQUEST QUOTE MODAL SIMULATION ==========
function requestQuoteAction() {
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  
  if (totalItems === 0) {
    // تم تغيير Toast إلى showToast
    showToast("📄 Request a quote: Please add products to your cart first.");
  } else {
    // تم تغيير Toast إلى showToast
    showToast(`✅ Quote request sent! Items selected: ${totalItems} units.`);
  }
}

// ========== RESIZE HANDLER FOR REVIEW SLIDER ==========
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateReviewSliderPosition();
  }, 150);
});

// ========== MOBILE MENU TOGGLE ==========
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// ========== SHOP NOW SCROLL ==========
function scrollToProducts() {
  const productsSection = document.getElementById('productsSection');
  if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
}

// ========== INITIALIZE APP ==========
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initReviews();

  // Event listeners for categories
  categoryLinks.forEach(link => {
    link.addEventListener('click', handleCategoryClick);
  });

  // Cart icon click
  const cartWrapper = document.querySelector('.cart-icon-wrapper');
  if (cartWrapper) cartWrapper.addEventListener('click', showCartAlert);

  // Hero buttons
  if (shopNowBtn) shopNowBtn.addEventListener('click', scrollToProducts);
  if (quoteBtn) quoteBtn.addEventListener('click', requestQuoteAction);

  // Slider controls
  if (prevBtn) prevBtn.addEventListener('click', prevReview);
  if (nextBtn) nextBtn.addEventListener('click', nextReview);

  // Set default active category
  setActiveCategory('all');

  // Add animation for review slider after render
  setTimeout(() => {
    if (reviewsTrack && reviewsTrack.children[0]) {
      updateReviewSliderPosition();
    }
  }, 100);
});