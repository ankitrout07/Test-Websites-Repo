// Utility Functions
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat(CONFIG.CURRENCY.LOCALE, {
            style: 'currency',
            currency: CONFIG.CURRENCY.CURRENCY
        }).format(amount);
    },

    // Format number with locale
    formatNumber(number) {
        return new Intl.NumberFormat(CONFIG.CURRENCY.LOCALE).format(number);
    },

    // Validate email
    validateEmail(email) {
        return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    },

    // Validate phone
    validatePhone(phone) {
        return CONFIG.VALIDATION.PHONE_REGEX.test(phone);
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Local storage helpers
    storage: {
        get(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return null;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error writing to localStorage:', error);
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },

    // DOM helpers
    dom: {
        $(selector) {
            return document.querySelector(selector);
        },
        $$(selector) {
            return document.querySelectorAll(selector);
        },
        createElement(tag, classes = [], attributes = {}) {
            const element = document.createElement(tag);
            classes.forEach(cls => element.classList.add(cls));
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        }
    },

    // Animation helpers
    animation: {
        fadeIn(element, duration = CONFIG.ANIMATIONS.FADE_IN) {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease`;
            setTimeout(() => element.style.opacity = '1', 10);
        },
        fadeOut(element, duration = CONFIG.ANIMATIONS.FADE_IN) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            setTimeout(() => element.style.display = 'none', duration);
        },
        slideUp(element, duration = CONFIG.ANIMATIONS.SLIDE_UP) {
            element.style.transform = 'translateY(20px)';
            element.style.opacity = '0';
            element.style.transition = `all ${duration}ms ease`;
            setTimeout(() => {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            }, 10);
        }
    },

    // Error handling
    error: {
        handle(error, context = 'Unknown') {
            console.error(`[${context}]`, error);
            // Here you could add error logging service
            // this.logToService(error, context);
        },
        logToService(error, context) {
            // Implement error logging to external service
            // Example: send to Sentry, LogRocket, etc.
        }
    },

    // Event helpers
    event: {
        on(element, event, handler, options = false) {
            element.addEventListener(event, handler, options);
            return () => element.removeEventListener(event, handler, options);
        },
        delegate(parent, selector, event, handler) {
            parent.addEventListener(event, (e) => {
                const target = e.target.closest(selector);
                if (target) handler.call(target, e);
            });
        }
    },

    // URL helpers
    url: {
        getParams() {
            return new URLSearchParams(window.location.search);
        },
        setParam(key, value) {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        },
        getParam(key) {
            return this.getParams().get(key);
        }
    },

    // Cookie helpers
    cookie: {
        set(name, value, days = 7) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
        },
        get(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        },
        remove(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        }
    }
};