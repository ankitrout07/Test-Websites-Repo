// Wishlist Component
class WishlistManager {
    constructor() {
        this.wishlistModal = null;
        this.init();
    }

    init() {
        this.createWishlistModal();
        this.setupWishlistButton();
        this.updateWishlistButtons();
    }

    createWishlistModal() {
        const modalHTML = `
            <div id="wishlist-modal" class="modal wishlist-modal">
                <div class="modal-content wishlist-content">
                    <button class="modal-close" aria-label="Close wishlist">&times;</button>
                    <div class="wishlist-header">
                        <h2>Saved Vehicles</h2>
                        <span class="wishlist-count">0 vehicles</span>
                    </div>
                    <div class="wishlist-body">
                        <div id="wishlist-grid" class="wishlist-grid"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.wishlistModal = document.getElementById('wishlist-modal');
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = this.wishlistModal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => this.closeWishlist());
        
        this.wishlistModal.addEventListener('click', (e) => {
            if (e.target === this.wishlistModal) this.closeWishlist();
        });

        // Subscribe to state changes
        stateManager.subscribe((state) => {
            this.updateWishlistCount();
            this.updateWishlistButtons();
        });
    }

    setupWishlistButton() {
        // Add wishlist button to nav
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            const wishlistBtn = document.createElement('button');
            wishlistBtn.className = 'wishlist-toggle';
            wishlistBtn.innerHTML = `<span class="wishlist-icon">❤️</span><span class="wishlist-count">0</span>`;
            wishlistBtn.setAttribute('aria-label', 'View wishlist');
            wishlistBtn.addEventListener('click', () => this.openWishlist());
            navRight.insertBefore(wishlistBtn, navRight.firstChild);
        }
    }

    openWishlist() {
        this.renderWishlist();
        this.wishlistModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeWishlist() {
        this.wishlistModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleWishlist(carId) {
        stateManager.toggleWishlist(carId);
        this.showNotification(stateManager.getState().wishlist.includes(carId) ? 'Added to wishlist' : 'Removed from wishlist');
    }

    removeFromWishlist(carId) {
        stateManager.toggleWishlist(carId);
        this.renderWishlist();
    }

    updateWishlistCount() {
        const state = stateManager.getState();
        const countEl = document.querySelector('.wishlist-count');
        if (countEl) {
            countEl.textContent = state.wishlist.length;
            const toggleBtn = document.querySelector('.wishlist-toggle');
            if (toggleBtn) {
                toggleBtn.classList.toggle('has-items', state.wishlist.length > 0);
            }
        }
        const headerCount = this.wishlistModal?.querySelector('.wishlist-count');
        if (headerCount) {
            headerCount.textContent = `${state.wishlist.length} vehicle${state.wishlist.length !== 1 ? 's' : ''}`;
        }
    }

    updateWishlistButtons() {
        const state = stateManager.getState();
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const carId = parseInt(btn.dataset.carId);
            const isInWishlist = state.wishlist.includes(carId);
            btn.classList.toggle('active', isInWishlist);
            btn.innerHTML = isInWishlist ? '❤️' : '🤍';
        });
    }

    renderWishlist() {
        const state = stateManager.getState();
        const grid = document.getElementById('wishlist-grid');
        
        if (state.wishlist.length === 0) {
            grid.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-icon">❤️</div>
                    <p>Your wishlist is empty</p>
                    <button class="nav-cta" onclick="document.querySelector('#wishlist-modal').classList.remove('active'); document.body.style.overflow = ''; document.getElementById('fleet').scrollIntoView({behavior: 'smooth'})">
                        Browse Collection
                    </button>
                </div>
            `;
            return;
        }

        const cars = state.wishlist.map(id => DataManager.getCarById(id)).filter(Boolean);
        
        grid.innerHTML = cars.map(car => `
            <div class="wishlist-item">
                <img src="${car.img}" alt="${car.name}" class="wishlist-item-img">
                <div class="wishlist-item-details">
                    <h3>${car.name}</h3>
                    <p class="wishlist-item-price">${Utils.formatCurrency(car.price)}</p>
                    <div class="wishlist-item-actions">
                        <button class="nav-cta small" onclick="window.openCarModal(${car.id})">View Details</button>
                        <button class="remove-wishlist" data-id="${car.id}" aria-label="Remove from wishlist">×</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners for remove buttons
        grid.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFromWishlist(parseInt(btn.dataset.id));
            });
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}