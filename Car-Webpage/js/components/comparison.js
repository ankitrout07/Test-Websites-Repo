// Car Comparison Component
class CarComparison {
    constructor() {
        this.comparisonModal = null;
        this.init();
    }

    init() {
        this.createComparisonModal();
        this.setupComparisonButton();
    }

    createComparisonModal() {
        const modalHTML = `
            <div id="comparison-modal" class="modal comparison-modal">
                <div class="modal-content comparison-content">
                    <button class="modal-close" aria-label="Close comparison">&times;</button>
                    <div class="comparison-header">
                        <h2>Vehicle Comparison</h2>
                        <button class="nav-cta" id="compare-clear">Clear All</button>
                    </div>
                    <div class="comparison-body">
                        <div id="comparison-grid" class="comparison-grid"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.comparisonModal = document.getElementById('comparison-modal');
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = this.comparisonModal.querySelector('.modal-close');
        const clearBtn = document.getElementById('compare-clear');

        closeBtn.addEventListener('click', () => this.closeComparison());
        clearBtn.addEventListener('click', () => this.clearComparison());

        this.comparisonModal.addEventListener('click', (e) => {
            if (e.target === this.comparisonModal) this.closeComparison();
        });
    }

    setupComparisonButton() {
        // Add comparison button to nav
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            const compareBtn = document.createElement('button');
            compareBtn.className = 'compare-toggle';
            compareBtn.innerHTML = `<span class="compare-icon">⚖️</span><span class="compare-count">0</span>`;
            compareBtn.setAttribute('aria-label', 'View comparisons');
            compareBtn.addEventListener('click', () => this.openComparison());
            navRight.insertBefore(compareBtn, navRight.firstChild);
        }

        // Update comparison count when state changes
        stateManager.subscribe((state) => {
            const countEl = document.querySelector('.compare-count');
            if (countEl) {
                countEl.textContent = state.compareList.length;
                const toggleBtn = document.querySelector('.compare-toggle');
                if (toggleBtn) {
                    toggleBtn.classList.toggle('has-items', state.compareList.length > 0);
                }
            }
        });
    }

    openComparison() {
        const state = stateManager.getState();
        if (state.compareList.length === 0) {
            alert('Please add cars to comparison first');
            return;
        }
        this.renderComparison();
        this.comparisonModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeComparison() {
        this.comparisonModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    clearComparison() {
        stateManager.setState({ compareList: [] });
        this.renderComparison();
    }

    removeFromComparison(carId) {
        stateManager.removeFromCompare(carId);
        this.renderComparison();
    }

    renderComparison() {
        try {
            const state = stateManager.getState();
            const grid = document.getElementById('comparison-grid');
            
            if (state.compareList.length === 0) {
                grid.innerHTML = '<p class="empty-message">No cars selected for comparison</p>';
                return;
            }

            const cars = state.compareList.map(id => DataManager.getCarById(id)).filter(Boolean);
            
            if (cars.length === 0) {
                grid.innerHTML = '<p class="empty-message">Unable to load car data for comparison</p>';
                return;
            }
            
            const specKeys = Object.keys(cars[0].specs || {});
            
            let html = '<div class="comparison-table-wrapper"><table class="comparison-table">';
            
            // Header row with car images and names
            html += '<thead><tr><th>Specification</th>';
            cars.forEach(car => {
                html += `
                    <th>
                        <img src="${car.img}" alt="${car.name}" class="comparison-car-img">
                        <span class="comparison-car-name">${car.name}</span>
                        <button class="remove-compare" data-id="${car.id}" aria-label="Remove from comparison">×</button>
                    </th>
                `;
            });
            html += '</tr></thead>';

            // Spec rows
            html += '<tbody>';
            specKeys.forEach(key => {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                html += `<tr><td>${formattedKey}</td>`;
                cars.forEach(car => {
                    html += `<td>${car.specs[key] || 'N/A'}</td>`;
                });
                html += '</tr>';
            });

            // Price row
            html += `<tr><td>Price</td>`;
            cars.forEach(car => {
                html += `<td>${Utils.formatCurrency(car.price)}</td>`;
            });
            html += '</tr>';

            // Features row
            html += `<tr><td>Features</td>`;
            cars.forEach(car => {
                const features = car.features || [];
                html += `<td><ul class="comparison-features">${features.slice(0, 4).map(f => `<li>${f}</li>`).join('')}</ul></td>`;
            });
            html += '</tr>';

            html += '</tbody></table></div>';
            
            grid.innerHTML = html;

            // Add event listeners for remove buttons
            grid.querySelectorAll('.remove-compare').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeFromComparison(parseInt(btn.dataset.id));
                });
            });
        } catch (error) {
            Utils.error.handle(error, 'CarComparison.renderComparison');
            const grid = document.getElementById('comparison-grid');
            if (grid) {
                grid.innerHTML = '<p class="empty-message">Error loading comparison data</p>';
            }
        }
    }

    addToCompare(carId) {
        const success = stateManager.addToCompare(carId);
        if (success) {
            // Show notification
            this.showNotification('Added to comparison');
        }
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