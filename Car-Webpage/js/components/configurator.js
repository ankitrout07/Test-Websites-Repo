// Car Configurator Component
class CarConfigurator {
    constructor() {
        this.configuratorModal = null;
        this.currentCar = null;
        this.selectedOptions = {
            color: null,
            interior: null
        };
        this.init();
    }

    init() {
        this.createConfiguratorModal();
        this.setupConfiguratorButton();
    }

    createConfiguratorModal() {
        const modalHTML = `
            <div id="configurator-modal" class="modal configurator-modal">
                <div class="modal-content configurator-content">
                    <button class="modal-close" aria-label="Close configurator">&times;</button>
                    <div class="configurator-body">
                        <div class="configurator-preview">
                            <div class="configurator-image">
                                <img id="configurator-car-img" src="" alt="">
                                <div class="configurator-price-overlay">
                                    <span class="configurator-base-price">Base: $0</span>
                                    <span class="configurator-total-price">Total: $0</span>
                                </div>
                            </div>
                            <div class="configurator-summary">
                                <h3 id="configurator-car-name">Car Name</h3>
                                <p id="configurator-car-summary">Summary of selections</p>
                            </div>
                        </div>
                        <div class="configurator-options">
                            <div class="configurator-section">
                                <h4>Exterior Color</h4>
                                <div id="color-options" class="option-grid"></div>
                            </div>
                            <div class="configurator-section">
                                <h4>Interior</h4>
                                <div id="interior-options" class="option-grid"></div>
                            </div>
                            <div class="configurator-section">
                                <h4>Features</h4>
                                <div id="feature-options" class="feature-list"></div>
                            </div>
                            <div class="configurator-actions">
                                <button class="nav-cta" id="configurator-save">Save Configuration</button>
                                <button class="nav-cta secondary" id="configurator-finance">Proceed to Finance</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.configuratorModal = document.getElementById('configurator-modal');
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = this.configuratorModal.querySelector('.modal-close');
        const saveBtn = document.getElementById('configurator-save');
        const financeBtn = document.getElementById('configurator-finance');

        closeBtn.addEventListener('click', () => this.closeConfigurator());
        
        this.configuratorModal.addEventListener('click', (e) => {
            if (e.target === this.configuratorModal) this.closeConfigurator();
        });

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveConfiguration());
        }

        if (financeBtn) {
            financeBtn.addEventListener('click', () => this.proceedToFinance());
        }
    }

    setupConfiguratorButton() {
        // Configurator button is now in HTML, handled in openCarModal function
        // This method is kept for compatibility but does nothing
    }

    openConfigurator(carId) {
        try {
            this.currentCar = DataManager.getCarById(carId);
            if (!this.currentCar) {
                console.error('Car not found for configurator:', carId);
                alert('Unable to load car data for configurator');
                return;
            }

            this.selectedOptions = {
                color: this.currentCar.colors[0] || { name: 'Default', hex: '#000000', price: 0 },
                interior: this.currentCar.interiors[0] || { name: 'Default', price: 0 }
            };

            this.renderConfigurator();
            this.configuratorModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.openConfigurator');
            alert('Error opening configurator. Please try again.');
        }
    }

    closeConfigurator() {
        this.configuratorModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    renderConfigurator() {
        try {
            const car = this.currentCar;
            
            // Update preview
            const carImg = document.getElementById('configurator-car-img');
            const carName = document.getElementById('configurator-car-name');
            
            if (carImg) carImg.src = car.img || '';
            if (carImg) carImg.alt = car.name || 'Unknown Car';
            if (carName) carName.textContent = car.name || 'Unknown Car';
            
            this.updatePricing();
            this.updateSummary();
            this.renderColorOptions();
            this.renderInteriorOptions();
            this.renderFeatures();
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.renderConfigurator');
        }
    }

    renderColorOptions() {
        try {
            const container = document.getElementById('color-options');
            if (!container || !this.currentCar.colors) return;
            
            container.innerHTML = this.currentCar.colors.map((color, index) => `
                <div class="color-option ${this.selectedOptions.color.name === color.name ? 'selected' : ''}" 
                     data-color-index="${index}"
                     style="background-color: ${color.hex}">
                    <span class="color-name">${color.name}</span>
                    ${color.price > 0 ? `<span class="color-price">+${Utils.formatCurrency(color.price)}</span>` : ''}
                </div>
            `).join('');

            container.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', () => {
                    const colorIndex = parseInt(option.dataset.colorIndex);
                    this.selectedOptions.color = this.currentCar.colors[colorIndex];
                    this.renderConfigurator();
                });
            });
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.renderColorOptions');
        }
    }

    renderInteriorOptions() {
        try {
            const container = document.getElementById('interior-options');
            if (!container || !this.currentCar.interiors) return;
            
            container.innerHTML = this.currentCar.interiors.map((interior, index) => `
                <div class="interior-option ${this.selectedOptions.interior.name === interior.name ? 'selected' : ''}" 
                     data-interior-index="${index}">
                    <span class="interior-name">${interior.name}</span>
                    ${interior.price > 0 ? `<span class="interior-price">+${Utils.formatCurrency(interior.price)}</span>` : ''}
                </div>
            `).join('');

            container.querySelectorAll('.interior-option').forEach(option => {
                option.addEventListener('click', () => {
                    const interiorIndex = parseInt(option.dataset.interiorIndex);
                    this.selectedOptions.interior = this.currentCar.interiors[interiorIndex];
                    this.renderConfigurator();
                });
            });
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.renderInteriorOptions');
        }
    }

    renderFeatures() {
        try {
            const container = document.getElementById('feature-options');
            if (!container || !this.currentCar.features) return;
            
            container.innerHTML = this.currentCar.features.map(feature => `
                <div class="feature-item">
                    <span class="feature-name">✓ ${feature}</span>
                </div>
            `).join('');
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.renderFeatures');
        }
    }

    updatePricing() {
        try {
            const basePrice = this.currentCar.price || 0;
            const colorPrice = this.selectedOptions.color?.price || 0;
            const interiorPrice = this.selectedOptions.interior?.price || 0;
            const totalPrice = basePrice + colorPrice + interiorPrice;

            const basePriceEl = document.querySelector('.configurator-base-price');
            const totalPriceEl = document.querySelector('.configurator-total-price');
            
            if (basePriceEl) basePriceEl.textContent = `Base: ${Utils.formatCurrency(basePrice)}`;
            if (totalPriceEl) totalPriceEl.textContent = `Total: ${Utils.formatCurrency(totalPrice)}`;
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.updatePricing');
        }
    }

    updateSummary() {
        try {
            const colorName = this.selectedOptions.color?.name || 'Default';
            const interiorName = this.selectedOptions.interior?.name || 'Default';
            const summary = `${colorName} exterior with ${interiorName} interior`;
            
            const summaryEl = document.getElementById('configurator-car-summary');
            if (summaryEl) summaryEl.textContent = summary;
        } catch (error) {
            Utils.error.handle(error, 'CarConfigurator.updateSummary');
        }
    }

    saveConfiguration() {
        const configuration = {
            carId: this.currentCar.id,
            carName: this.currentCar.name,
            color: this.selectedOptions.color,
            interior: this.selectedOptions.interior,
            totalPrice: this.currentCar.price + this.selectedOptions.color.price + this.selectedOptions.interior.price,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        const configurations = Utils.storage.get('diorbillion_configurations') || [];
        configurations.push(configuration);
        Utils.storage.set('diorbillion_configurations', configurations);

        alert('Configuration saved successfully!');
        this.closeConfigurator();
    }

    proceedToFinance() {
        const totalPrice = this.currentCar.price + this.selectedOptions.color.price + this.selectedOptions.interior.price;
        this.closeConfigurator();
        
        // Update finance calculator with configured price
        document.getElementById('car-price').value = totalPrice;
        window.updateEMI();
        document.getElementById('finance').scrollIntoView({ behavior: 'smooth' });
    }
}