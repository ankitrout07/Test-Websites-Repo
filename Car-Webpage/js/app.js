// Main Application Entry Point
class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        console.log('Initializing DIORBILLION Automotive Application...');

        try {
            // Step 1: Initialize data and state
            this.initDataAndState();

            // Step 2: Initialize components
            this.initComponents();

            // Step 3: Initialize legacy functionality
            this.initLegacyFunctionality();

            // Step 4: Setup global functions
            this.setupGlobalFunctions();

            // Step 5: Initialize loading screen
            this.initLoadingScreen();

            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            Utils.error.handle(error, 'App.init');
        }
    }

    initDataAndState() {
        // Initialize data in state manager
        if (typeof DataManager !== 'undefined' && typeof stateManager !== 'undefined') {
            stateManager.setCars(DataManager.getAllCars());
        }
    }

    initComponents() {
        try {
            // Initialize new interactive components
            this.components.search = new SearchComponent();
            this.components.wishlist = new WishlistManager();
            this.components.comparison = new CarComparison();
            this.components.configurator = new CarConfigurator();
            this.components.gallery = new ImageGallery();

            // Make components globally accessible
            window.wishlistManager = this.components.wishlist;
            window.carComparison = this.components.comparison;
            window.carConfigurator = this.components.configurator;
            window.imageGallery = this.components.gallery;
        } catch (error) {
            console.error('Error initializing components:', error);
            Utils.error.handle(error, 'App.initComponents');
        }
    }

    initLegacyFunctionality() {
        try {
            // Call individual legacy functions in proper order
            if (typeof renderFleet === 'function') renderFleet();
            if (typeof initFilters === 'function') initFilters();
            if (typeof initModal === 'function') initModal();
            if (typeof initContactForm === 'function') initContactForm();
            if (typeof initMobileNav === 'function') initMobileNav();

            // Populate Select dropdown
            this.initSelectDropdown();

            // Calculator Listeners
            this.initCalculatorListeners();

            // Observe reveal animations
            this.initRevealAnimations();

            // Initialize EMI
            if (typeof updateEMI === 'function') updateEMI();
        } catch (error) {
            console.error('Error initializing legacy functionality:', error);
            Utils.error.handle(error, 'App.initLegacyFunctionality');
        }
    }

    initSelectDropdown() {
        const select = document.getElementById('car-select');
        if (!select) return;

        // Use DataManager if available, otherwise fall back to global carData
        const cars = typeof DataManager !== 'undefined' ? DataManager.getAllCars() : (typeof carData !== 'undefined' ? carData : []);
        
        select.innerHTML = cars.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        
        select.addEventListener('change', (e) => {
            const car = typeof DataManager !== 'undefined' ? DataManager.getCarById(cars.find(c => c.name === e.target.value)?.id) : cars.find(c => c.name === e.target.value);
            if (car) {
                const priceInput = document.getElementById('car-price');
                if (priceInput) {
                    priceInput.value = car.price;
                    if (typeof updateEMI === 'function') updateEMI();
                }
            }
        });
    }

    initCalculatorListeners() {
        ['car-price', 'down-payment', 'loan-term'].forEach(id => {
            const el = document.getElementById(id);
            if (el && typeof updateEMI === 'function') {
                el.addEventListener('input', updateEMI);
            }
        });
    }

    initRevealAnimations() {
        if (typeof observer !== 'undefined') {
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }
    }

    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const delay = typeof CONFIG !== 'undefined' ? CONFIG.UI.LOADING_DELAY : 2000;
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, delay);
        }
    }

    setupGlobalFunctions() {
        // Make key functions globally accessible for onclick handlers
        window.openCarModal = (carId) => {
            if (this.components.gallery) {
                this.components.gallery.renderCarGallery(carId);
            }
            if (typeof openCarModal === 'function') openCarModal(carId);
        };

        window.selectCarForFinance = (carId) => {
            if (typeof selectCarForFinance === 'function') selectCarForFinance(carId);
        };

        window.updateEMI = () => {
            if (typeof updateEMI === 'function') updateEMI();
        };

        // Error handling
        window.addEventListener('error', (event) => {
            if (typeof Utils !== 'undefined' && Utils.error.handle) {
                Utils.error.handle(event.error, 'Global Error');
            }
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (typeof Utils !== 'undefined' && Utils.error.handle) {
                Utils.error.handle(event.reason, 'Unhandled Promise Rejection');
            }
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}