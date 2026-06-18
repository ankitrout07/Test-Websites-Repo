// Data Management
const DataManager = {
    // Enhanced car data with additional properties
    carData: [
        {
            id: 1,
            name: "Nebula X-GT",
            fuel: "electric",
            price: 345000,
            img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800",
            gallery: [
                "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800"
            ],
            specs: {
                "0-60": "2.1s",
                topSpeed: "250 mph",
                range: "400 miles",
                horsepower: "1,200 HP",
                torque: "1,100 lb-ft",
                weight: "4,200 lbs",
                length: "196 inches",
                width: "78 inches"
            },
            features: [
                "Quad-Motor Electric Powertrain",
                "Active Aerodynamics",
                "Carbon Fiber Construction",
                "Advanced Driver Assistance",
                "Premium Audio System",
                "Wireless Charging"
            ],
            colors: [
                { name: "Midnight Black", hex: "#1a1a1a", price: 0 },
                { name: "Platinum Silver", hex: "#c0c0c0", price: 2500 },
                { name: "Royal Gold", hex: "#d4af37", price: 5000 },
                { name: "Diamond White", hex: "#f8f8ff", price: 3500 }
            ],
            interiors: [
                { name: "Black Leather", price: 0 },
                { name: "Tan Leather", price: 4000 },
                { name: "White Alcantara", price: 6000 }
            ],
            description: "The Nebula X-GT represents the pinnacle of electric performance. With its revolutionary powertrain and aerospace-inspired design, it delivers unmatched acceleration and range for the discerning enthusiast.",
            category: "hypercar",
            year: 2026,
            stock: 3,
            featured: true
        },
        {
            id: 2,
            name: "Vanguard Overlord",
            fuel: "gas",
            price: 285000,
            img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800",
            gallery: [
                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800"
            ],
            specs: {
                "0-60": "3.2s",
                topSpeed: "220 mph",
                range: "350 miles",
                horsepower: "850 HP",
                torque: "750 lb-ft",
                weight: "4,500 lbs",
                length: "202 inches",
                width: "80 inches"
            },
            features: [
                "Twin-Turbo V12 Engine",
                "All-Wheel Drive",
                "Adaptive Suspension",
                "Premium Interior",
                "Advanced Safety Features",
                "Performance Brakes"
            ],
            colors: [
                { name: "Stealth Gray", hex: "#2f2f2f", price: 0 },
                { name: "Racing Red", hex: "#dc143c", price: 3000 },
                { name: "Navy Blue", hex: "#000080", price: 2000 }
            ],
            interiors: [
                { name: "Black Leather", price: 0 },
                { name: "Red Leather", price: 5000 }
            ],
            description: "A commanding presence on any road, the Vanguard Overlord combines raw power with refined luxury. Its twin-turbo V12 engine delivers exhilarating performance while the handcrafted interior ensures supreme comfort.",
            category: "supercar",
            year: 2026,
            stock: 5,
            featured: true
        },
        {
            id: 3,
            name: "Summit Zenith",
            fuel: "electric",
            price: 195000,
            img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800",
            gallery: [
                "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800"
            ],
            specs: {
                "0-60": "2.8s",
                topSpeed: "200 mph",
                range: "380 miles",
                horsepower: "750 HP",
                torque: "800 lb-ft",
                weight: "4,100 lbs",
                length: "192 inches",
                width: "76 inches"
            },
            features: [
                "Dual-Motor Setup",
                "Long-Range Battery",
                "Autopilot Ready",
                "Spacious Interior",
                "Premium Sound",
                "Fast Charging"
            ],
            colors: [
                { name: "Pearl White", hex: "#f5f5f5", price: 0 },
                { name: "Champagne", hex: "#f7e7ce", price: 2000 },
                { name: "Ocean Blue", hex: "#4169e1", price: 2500 }
            ],
            interiors: [
                { name: "Gray Fabric", price: 0 },
                { name: "White Leather", price: 3000 }
            ],
            description: "The Summit Zenith embodies sustainable luxury without compromise. Its advanced electric propulsion system delivers instant torque while the opulent interior creates a sanctuary of tranquility.",
            category: "luxury",
            year: 2026,
            stock: 8,
            featured: false
        },
        {
            id: 4,
            name: "Phantom Seraph",
            fuel: "electric",
            price: 420000,
            img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800",
            gallery: [
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800"
            ],
            specs: {
                "0-60": "1.9s",
                topSpeed: "280 mph",
                range: "420 miles",
                horsepower: "1,500 HP",
                torque: "1,300 lb-ft",
                weight: "3,800 lbs",
                length: "198 inches",
                width: "79 inches"
            },
            features: [
                "Quad-Motor System",
                "Active Aero Body",
                "Carbon Monocoque",
                "Race-Grade Brakes",
                "Track Mode",
                "Launch Control"
            ],
            colors: [
                { name: "Matte Black", hex: "#1a1a1a", price: 0 },
                { name: "Liquid Silver", hex: "#c0c0c0", price: 8000 },
                { name: "Volcano Orange", hex: "#ff4500", price: 6000 }
            ],
            interiors: [
                { name: "Black Alcantara", price: 0 },
                { name: "Carbon Fiber Trim", price: 10000 }
            ],
            description: "The Phantom Seraph is automotive artistry in motion. Every curve is sculpted for aerodynamic perfection, while the quad-motor powertrain redefines what's possible in electric performance.",
            category: "hypercar",
            year: 2026,
            stock: 2,
            featured: true
        },
        {
            id: 5,
            name: "Titan Monarch",
            fuel: "gas",
            price: 310000,
            img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800",
            gallery: [
                "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800"
            ],
            specs: {
                "0-60": "2.9s",
                topSpeed: "230 mph",
                range: "320 miles",
                horsepower: "950 HP",
                torque: "800 lb-ft",
                weight: "3,600 lbs",
                length: "188 inches",
                width: "77 inches"
            },
            features: [
                "Race-Bred V10",
                "Lightweight Chassis",
                "Track Suspension",
                "Aerodynamic Kit",
                "Performance Exhaust",
                "Driver-Focused Cockpit"
            ],
            colors: [
                { name: "British Racing Green", hex: "#004225", price: 0 },
                { name: "Rosso Corsa", hex: "#ff2800", price: 4000 },
                { name: "Grigio Silver", hex: "#a9a9a9", price: 2000 }
            ],
            interiors: [
                { name: "Tartan Fabric", price: 0 },
                { name: "Racing Seats", price: 5000 }
            ],
            description: "Born from racing heritage, the Titan Monarch dominates both track and street. Its lightweight carbon fiber construction and race-bred engine deliver an uncompromising driving experience.",
            category: "supercar",
            year: 2026,
            stock: 4,
            featured: true
        },
        {
            id: 6,
            name: "Aether Flux",
            fuel: "electric",
            price: 275000,
            img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800",
            gallery: [
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800"
            ],
            specs: {
                "0-60": "2.5s",
                topSpeed: "210 mph",
                range: "360 miles",
                horsepower: "900 HP",
                torque: "850 lb-ft",
                weight: "4,300 lbs",
                length: "200 inches",
                width: "81 inches"
            },
            features: [
                "Tri-Motor Platform",
                "Level 3 Autonomy",
                "AI-Powered Systems",
                "Gesture Control",
                "Augmented Display",
                "Smart Connectivity"
            ],
            colors: [
                { name: "Cosmic Blue", hex: "#191970", price: 0 },
                { name: "Nebula Purple", hex: "#8a2be2", price: 4000 },
                { name: "Sunset Gold", hex: "#daa520", price: 3000 }
            ],
            interiors: [
                { name: "Tech Gray", price: 0 },
                { name: "Smart Glass", price: 8000 }
            ],
            description: "The Aether Flux represents the perfect fusion of technology and luxury. Its autonomous-ready architecture and cutting-edge infotainment system make it the ultimate modern grand tourer.",
            category: "luxury",
            year: 2026,
            stock: 6,
            featured: false
        }
    ],

    // Get all cars
    getAllCars() {
        return this.carData;
    },

    // Get car by ID
    getCarById(id) {
        return this.carData.find(car => car.id === id);
    },

    // Get cars by filter
    getCarsByFilter(filter) {
        if (filter === CONFIG.FILTERS.ALL) return this.carData;
        return this.carData.filter(car => car.fuel === filter);
    },

    // Search cars
    searchCars(query) {
        const searchTerm = query.toLowerCase();
        return this.carData.filter(car => 
            car.name.toLowerCase().includes(searchTerm) ||
            car.fuel.toLowerCase().includes(searchTerm) ||
            car.category.toLowerCase().includes(searchTerm) ||
            car.description.toLowerCase().includes(searchTerm)
        );
    },

    // Get featured cars
    getFeaturedCars() {
        return this.carData.filter(car => car.featured);
    },

    // Get cars by category
    getCarsByCategory(category) {
        return this.carData.filter(car => car.category === category);
    },

    // Get available cars (in stock)
    getAvailableCars() {
        return this.carData.filter(car => car.stock > 0);
    },

    // Get car price range
    getPriceRange() {
        const prices = this.carData.map(car => car.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
};