// State Management System
class StateManager {
    constructor() {
        this.state = {
            cars: [],
            filteredCars: [],
            currentFilter: CONFIG.FILTERS.ALL,
            wishlist: [],
            recentlyViewed: [],
            compareList: [],
            searchQuery: '',
            isLoading: false,
            modalOpen: false,
            mobileMenuOpen: false
        };
        this.listeners = [];
        this.loadFromStorage();
    }

    // Get current state
    getState() {
        return { ...this.state };
    }

    // Update state and notify listeners
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveToStorage();
        this.notifyListeners();
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Load state from localStorage
    loadFromStorage() {
        try {
            const wishlist = localStorage.getItem(CONFIG.STORAGE.WISHLIST);
            const preferences = localStorage.getItem(CONFIG.STORAGE.PREFERENCES);
            const recentlyViewed = localStorage.getItem(CONFIG.STORAGE.RECENTLY_VIEWED);

            if (wishlist) this.state.wishlist = JSON.parse(wishlist);
            if (recentlyViewed) this.state.recentlyViewed = JSON.parse(recentlyViewed);
            if (preferences) {
                const prefs = JSON.parse(preferences);
                this.state.compareList = prefs.compareList || [];
            }
        } catch (error) {
            console.error('Error loading state from storage:', error);
        }
    }

    // Save state to localStorage
    saveToStorage() {
        try {
            localStorage.setItem(CONFIG.STORAGE.WISHLIST, JSON.stringify(this.state.wishlist));
            localStorage.setItem(CONFIG.STORAGE.RECENTLY_VIEWED, JSON.stringify(this.state.recentlyViewed));
            localStorage.setItem(CONFIG.STORAGE.PREFERENCES, JSON.stringify({
                compareList: this.state.compareList
            }));
        } catch (error) {
            console.error('Error saving state to storage:', error);
        }
    }

    // Action creators
    setCars(cars) {
        this.setState({ cars, filteredCars: cars });
    }

    setFilter(filter) {
        const filteredCars = filter === CONFIG.FILTERS.ALL 
            ? this.state.cars 
            : this.state.cars.filter(car => car.fuel === filter);
        this.setState({ currentFilter: filter, filteredCars });
    }

    setSearchQuery(query) {
        this.setState({ searchQuery: query });
        this.filterCars();
    }

    filterCars() {
        let filtered = this.state.cars;

        // Apply filter
        if (this.state.currentFilter !== CONFIG.FILTERS.ALL) {
            filtered = filtered.filter(car => car.fuel === this.state.currentFilter);
        }

        // Apply search
        if (this.state.searchQuery) {
            const query = this.state.searchQuery.toLowerCase();
            filtered = filtered.filter(car => 
                car.name.toLowerCase().includes(query) ||
                car.fuel.toLowerCase().includes(query) ||
                car.description.toLowerCase().includes(query)
            );
        }

        this.setState({ filteredCars: filtered });
    }

    toggleWishlist(carId) {
        const wishlist = this.state.wishlist.includes(carId)
            ? this.state.wishlist.filter(id => id !== carId)
            : [...this.state.wishlist, carId];
        this.setState({ wishlist });
    }

    addToCompare(carId) {
        if (this.state.compareList.length >= 3) {
            alert('You can compare up to 3 cars at a time');
            return false;
        }
        if (this.state.compareList.includes(carId)) {
            alert('This car is already in comparison');
            return false;
        }
        this.setState({ compareList: [...this.state.compareList, carId] });
        return true;
    }

    removeFromCompare(carId) {
        this.setState({ compareList: this.state.compareList.filter(id => id !== carId) });
    }

    addToRecentlyViewed(carId) {
        const recentlyViewed = this.state.recentlyViewed.filter(id => id !== carId);
        recentlyViewed.unshift(carId);
        this.setState({ recentlyViewed: recentlyViewed.slice(0, 10) });
    }

    setModalOpen(open) {
        this.setState({ modalOpen: open });
    }

    setMobileMenuOpen(open) {
        this.setState({ mobileMenuOpen: open });
    }

    setLoading(loading) {
        this.setState({ isLoading: loading });
    }
}

// Create global state instance
const stateManager = new StateManager();