// Use DataManager as single source of truth for car data
// Legacy compatibility wrapper
const carData = typeof DataManager !== 'undefined' ? DataManager.getAllCars() : [];

// --- 1. Fleet Rendering ---
function renderFleet(filter = 'all') {
    const grid = document.getElementById('car-grid');
    if (!grid) return;

    let filteredCars = filter === 'all' ? [...carData] : carData.filter(car => car.fuel === filter);

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        if (sortValue === 'price-asc') {
            filteredCars.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filteredCars.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'name-asc') {
            filteredCars.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'name-desc') {
            filteredCars.sort((a, b) => b.name.localeCompare(a.name));
        }
    }

    grid.innerHTML = filteredCars.map((car, index) => `
        <div class="car-card reveal" data-fuel="${car.fuel}" data-car-id="${car.id}" style="transition-delay: ${index * 0.1}s">
            <button class="wishlist-btn" data-car-id="${car.id}" aria-label="Add to wishlist">🤍</button>
            <div class="car-image" style="background-image: url('${car.img}')"></div>
            <div class="car-body">
                <span class="car-type">${car.fuel} MASTERPIECE</span>
                <h3 class="car-name">${car.name}</h3>
                <div class="car-price">$${car.price.toLocaleString()}</div>
                <div class="card-actions">
                    <button class="card-btn" onclick="window.openCarModal(${car.id})">Details</button>
                    <button class="card-btn secondary" onclick="window.carComparison && window.carComparison.addToCompare(${car.id})">Compare</button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-observe new elements
    requestAnimationFrame(() => {
        document.querySelectorAll('.car-card.reveal').forEach(el => observer.observe(el));
        
        // Add wishlist button handlers with safety check
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            // Remove existing listeners to prevent duplicates
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const carId = parseInt(newBtn.dataset.carId);
                if (window.wishlistManager) {
                    window.wishlistManager.toggleWishlist(carId);
                } else {
                    console.warn('Wishlist manager not available');
                }
            });
        });
    });
    
    // Update wishlist button states after rendering
    if (window.wishlistManager) {
        window.wishlistManager.updateWishlistButtons();
    }
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            renderFleet(btn.dataset.filter);
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const activeFilter = document.querySelector('.filter-btn.active');
            renderFleet(activeFilter ? activeFilter.dataset.filter : 'all');
        });
    }
}

// --- 2. Modal Functions ---
function openCarModal(id) {
    const car = typeof DataManager !== 'undefined' ? DataManager.getCarById(id) : carData.find(c => c.id === id);
    if (!car) return;

    const modal = document.getElementById('car-modal');
    const modalImg = document.getElementById('modal-car-img');
    const modalType = document.getElementById('modal-car-type');
    const modalName = document.getElementById('modal-car-name');
    const modalPrice = document.getElementById('modal-car-price');
    const modalDesc = document.getElementById('modal-car-description');
    const modalSpec0_60 = document.getElementById('modal-spec-0-60');
    const modalSpecTopSpeed = document.getElementById('modal-spec-top-speed');
    const modalSpecRange = document.getElementById('modal-spec-range');
    const modalSpecHP = document.getElementById('modal-spec-hp');
    const modalFinanceBtn = document.getElementById('modal-finance-btn');

    if (modalImg) modalImg.src = car.img;
    if (modalImg) modalImg.alt = car.name;
    if (modalType) modalType.textContent = `${car.fuel} MASTERPIECE`;
    if (modalName) modalName.textContent = car.name;
    if (modalPrice) modalPrice.textContent = `$${car.price.toLocaleString()}`;
    if (modalDesc) modalDesc.textContent = car.description;
    if (modalSpec0_60) modalSpec0_60.textContent = car.specs["0-60"];
    if (modalSpecTopSpeed) modalSpecTopSpeed.textContent = car.specs.topSpeed;
    if (modalSpecRange) modalSpecRange.textContent = car.specs.range;
    if (modalSpecHP) modalSpecHP.textContent = car.specs.horsepower;

    if (modalFinanceBtn) {
        modalFinanceBtn.onclick = () => {
            closeModal();
            selectCarForFinance(id);
        };
    }

    // Add to recently viewed if stateManager is available
    if (typeof stateManager !== 'undefined' && stateManager.addToRecentlyViewed) {
        stateManager.addToRecentlyViewed(id);
    }

    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize gallery if component is available
    if (window.imageGallery) {
        window.imageGallery.renderCarGallery(id);
    }

    // Setup configurator button
    const configBtn = document.getElementById('modal-config-btn');
    if (configBtn && window.carConfigurator) {
        // Remove existing listeners
        const newConfigBtn = configBtn.cloneNode(true);
        configBtn.parentNode.replaceChild(newConfigBtn, configBtn);
        
        newConfigBtn.onclick = () => {
            closeModal();
            window.carConfigurator.openConfigurator(id);
        };
    }
}

function closeModal() {
    const modal = document.getElementById('car-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function initModal() {
    const modal = document.getElementById('car-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// --- 3. Finance Logic ---
function updateEMI() {
    const priceInput = document.getElementById('car-price');
    const downPaymentInput = document.getElementById('down-payment');
    const loanTermInput = document.getElementById('loan-term');
    const emiDisplay = document.getElementById('emi-display');

    const price = priceInput ? parseFloat(priceInput.value) || 0 : 0;
    const down = downPaymentInput ? parseFloat(downPaymentInput.value) || 0 : 0;
    const term = loanTermInput ? parseInt(loanTermInput.value) || 12 : 12;

    const principal = price - down;

    // We assume 0% interest for Tier 1 Clients as per the redesign theme
    let monthly = principal > 0 ? (principal / term) : 0;

    if (emiDisplay) {
        emiDisplay.innerText = monthly.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

function selectCarForFinance(id) {
    const car = typeof DataManager !== 'undefined' ? DataManager.getCarById(id) : carData.find(c => c.id === id);
    if (!car) return;

    const select = document.getElementById('car-select');
    const priceInput = document.getElementById('car-price');
    
    if (select) select.value = car.name;
    if (priceInput) priceInput.value = car.price;
    updateEMI();
    
    const financeSection = document.getElementById('finance');
    if (financeSection) financeSection.scrollIntoView({ behavior: 'smooth' });
}

// --- 3. Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once revealed to improve performance
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '50px' });

// --- 4. Form Validation ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.firstName.trim() || !data.lastName.trim()) {
            alert('Please enter your full name.');
            return;
        }

        if (!data.email.trim() || !isValidEmail(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!data.message.trim()) {
            alert('Please include a message with your inquiry.');
            return;
        }

        // Simulate form submission
        alert('Thank you for your inquiry. Our concierge team will contact you within 24 hours.');
        form.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// --- 5. Mobile Navigation ---
let mobileNavClickHandler = null;

function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        // Remove existing handler if present
        if (mobileNavClickHandler) {
            document.removeEventListener('click', mobileNavClickHandler);
        }

        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside - store handler for cleanup
        mobileNavClickHandler = (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        };
        document.addEventListener('click', mobileNavClickHandler);
    }
}

// Legacy functions are now called from app.js initLegacyFunctionality()