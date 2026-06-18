// Search Component
class SearchComponent {
    constructor() {
        this.searchContainer = null;
        this.searchInput = null;
        this.searchResults = null;
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.setupEventListeners();
    }

    createSearchInterface() {
        const searchHTML = `
            <div class="search-container">
                <button class="search-toggle" aria-label="Open search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <div class="search-overlay">
                    <div class="search-modal">
                        <div class="search-header">
                            <div class="search-input-wrapper">
                                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                                <input type="text" class="search-input" placeholder="Search vehicles..." aria-label="Search vehicles">
                                <button class="search-close" aria-label="Close search">×</button>
                            </div>
                        </div>
                        <div class="search-results">
                            <div id="search-results-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const nav = document.querySelector('nav');
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            navRight.insertAdjacentHTML('beforebegin', searchHTML);
            this.searchContainer = document.querySelector('.search-container');
            this.searchInput = document.querySelector('.search-input');
            this.searchResults = document.querySelector('#search-results-container');
        }
    }

    setupEventListeners() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchClose = document.querySelector('.search-close');
        const searchOverlay = document.querySelector('.search-overlay');

        if (searchToggle) {
            searchToggle.addEventListener('click', () => this.openSearch());
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) this.closeSearch();
            });
        }

        if (this.searchInput) {
            // Debounced search
            const debouncedSearch = Utils.debounce((query) => this.performSearch(query), CONFIG.UI.DEBOUNCE_DELAY);
            this.searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });

            // Keyboard navigation
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeSearch();
            });
        }

        // Subscribe to state changes
        stateManager.subscribe((state) => {
            if (state.searchQuery) {
                this.performSearch(state.searchQuery);
            }
        });
    }

    openSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        searchOverlay.classList.add('active');
        this.searchInput.focus();
        document.body.style.overflow = 'hidden';
    }

    closeSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        searchOverlay.classList.remove('active');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
        document.body.style.overflow = '';
        stateManager.setSearchQuery('');
    }

    performSearch(query) {
        if (!query.trim()) {
            this.searchResults.innerHTML = '<p class="search-placeholder">Enter a search term to find vehicles</p>';
            return;
        }

        try {
            stateManager.setSearchQuery(query);
            const results = DataManager.searchCars(query);
            this.renderResults(results, query);
        } catch (error) {
            Utils.error.handle(error, 'SearchComponent.performSearch');
            this.searchResults.innerHTML = '<p class="no-results">Search failed. Please try again.</p>';
        }
    }

    renderResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No vehicles found for "${query}"</p>
                    <p class="no-results-suggestion">Try searching for car names, types, or features</p>
                </div>
            `;
            return;
        }

        const html = `
            <div class="search-results-header">
                <p>${results.length} result${results.length !== 1 ? 's' : ''} found</p>
            </div>
            <div class="search-results-list">
                ${results.map(car => `
                    <div class="search-result-item" data-car-id="${car.id}">
                        <img src="${car.img}" alt="${car.name}" class="search-result-img">
                        <div class="search-result-info">
                            <h3>${car.name}</h3>
                            <p class="search-result-category">${car.fuel} ${car.category}</p>
                            <p class="search-result-price">${Utils.formatCurrency(car.price)}</p>
                        </div>
                        <button class="search-result-view" aria-label="View ${car.name}">→</button>
                    </div>
                `).join('')}
            </div>
        `;

        this.searchResults.innerHTML = html;

        // Add click handlers
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const carId = parseInt(item.dataset.carId);
                this.closeSearch();
                window.openCarModal(carId);
            });
        });
    }
}