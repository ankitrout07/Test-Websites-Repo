// Configuration File
const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://api.diorbillion.com',
        TIMEOUT: 10000,
        ENDPOINTS: {
            CARS: '/cars',
            INQUIRY: '/inquiry',
            WISHLIST: '/wishlist'
        }
    },

    // UI Configuration
    UI: {
        ANIMATION_DURATION: 600,
        SCROLL_BEHAVIOR: 'smooth',
        DEBOUNCE_DELAY: 300,
        LOADING_DELAY: 2000
    },

    // Filter Configuration
    FILTERS: {
        ALL: 'all',
        ELECTRIC: 'electric',
        GAS: 'gas',
        HYBRID: 'hybrid'
    },

    // Storage Keys
    STORAGE: {
        WISHLIST: 'diorbillion_wishlist',
        PREFERENCES: 'diorbillion_preferences',
        RECENTLY_VIEWED: 'diorbillion_recent'
    },

    // Validation Rules
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 50,
        MIN_MESSAGE_LENGTH: 10,
        MAX_MESSAGE_LENGTH: 1000
    },

    // Currency Formatting
    CURRENCY: {
        LOCALE: 'en-US',
        CURRENCY: 'USD'
    },

    // Animation Timing
    ANIMATIONS: {
        FADE_IN: 300,
        SLIDE_UP: 400,
        STAGGER_DELAY: 100
    }
};

// Freeze configuration to prevent modifications
Object.freeze(CONFIG);