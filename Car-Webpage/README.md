# DIORBILLION Automotive Website

A luxury automotive website featuring interactive vehicle browsing, comparison tools, and financing calculators.

## 🚗 Key Features

- **Interactive Fleet Display**: Browse luxury vehicles with filtering by fuel type
- **Car Detail Modal**: View detailed specifications and descriptions
- **Finance Calculator**: Calculate monthly payments for vehicle acquisition
- **Mobile Responsive**: Fully responsive design with mobile navigation
- **🔍 Search Functionality**: Real-time search across vehicles
- **❤️ Wishlist System**: Save favorite vehicles (persisted in localStorage)
- **⚖️ Car Comparison**: Compare up to 3 vehicles side-by-side
- **🎨 Car Configurator**: Customize vehicles with different colors and interiors
- **🖼️ Image Gallery**: Lightbox gallery for multiple vehicle images
- **📊 State Management**: Centralized state management with localStorage persistence

## 🏗️ Architecture

The project follows a clean, modular architecture with a single source of truth for data and unified initialization. For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

### Quick Overview
- **Single Data Source**: DataManager in js/data.js
- **Unified Initialization**: app.js orchestrates all components
- **State Management**: Centralized state in js/state.js
- **Component-Based**: Self-contained interactive components
- **Error Handling**: Comprehensive try-catch with graceful degradation

## 📁 Project Structure

```
Car-Webpage/
├── index.html              # Main HTML file
├── style.css              # Main stylesheet
├── script.js              # Legacy functions (unified with DataManager)
├── js/                    # Modular JavaScript structure
│   ├── config.js         # Configuration & constants
│   ├── utils.js          # Utility functions
│   ├── data.js           # Enhanced car data (SINGLE SOURCE OF TRUTH)
│   ├── state.js          # State management system
│   ├── app.js            # Main application entry point
│   └── components/       # Interactive components
│       ├── comparison.js  # Car comparison
│       ├── wishlist.js    # Wishlist management
│       ├── search.js      # Search functionality
│       ├── configurator.js # Car customization
│       └── gallery.js     # Image gallery/lightbox
├── ARCHITECTURE.md        # Detailed architecture documentation
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Local web server (optional, but recommended)

### Installation

1. Clone the repository
2. Serve the project using a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. Open `http://localhost:8000` in your browser

### Docker Support

```bash
docker build -t diorbillion-automotive .
docker run -p 80:80 diorbillion-automotive
```

## 🎨 Customization

### Adding New Vehicles

Edit **js/data.js** only (this is the single source of truth):

```javascript
{
    id: 7,
    name: "New Model",
    fuel: "electric",
    price: 500000,
    img: "image-url.jpg",
    gallery: ["image1.jpg", "image2.jpg", "image3.jpg"],
    specs: {
        "0-60": "2.0s",
        topSpeed: "300 mph",
        range: "500 miles",
        horsepower: "2000 HP"
    },
    features: ["Feature 1", "Feature 2"],
    colors: [{ name: "Color Name", hex: "#hex", price: 0 }],
    interiors: [{ name: "Interior Name", price: 0 }],
    description: "Vehicle description",
    category: "hypercar",
    year: 2026,
    stock: 1,
    featured: true
}
```

### Configuration

Edit **js/config.js** to modify application settings:

```javascript
const CONFIG = {
    UI: {
        ANIMATION_DURATION: 600,
        LOADING_DELAY: 2000
    },
    // ... more config options
};
```

## 🔧 Component Usage

### Car Comparison
```javascript
window.carComparison.addToCompare(carId);
window.carComparison.openComparison();
```

### Wishlist
```javascript
window.wishlistManager.toggleWishlist(carId);
window.wishlistManager.openWishlist();
```

### Car Configurator
```javascript
window.carConfigurator.openConfigurator(carId);
```

### Search
```javascript
stateManager.setSearchQuery('search term');
```

## 🐛 Error Handling

The application has comprehensive error handling:
- All component initialization wrapped in try-catch
- Safe component availability checks throughout
- Global error handlers for unhandled exceptions
- Graceful degradation when components fail

## 📱 Responsive Design

Responsive breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1023px  
- Mobile: < 768px

All interactive features are fully responsive.

## 🔒 Security & Performance

- No external dependencies except CDN images
- localStorage for user preferences
- Optimized image loading
- Memory leak prevention
- XSS prevention through safe DOM manipulation

## 🚀 Performance

- Lazy loading of images
- Debounced search
- Optimized animations
- Efficient state updates
- Minimal blocking operations

## 📝 Architecture Details

For comprehensive architecture documentation including:
- Dependency graphs
- Data flow diagrams
- Component integration details
- Error recovery strategies
- Maintenance guidelines

See [ARCHITECTURE.md](ARCHITECTURE.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Add all data to DataManager (js/data.js) only
3. Use existing components and utilities
4. Add error handling to new functions
5. Test across browsers and devices

## 📄 License

© 2026 DIORBILLION AUTOMOTIVE. ALL RIGHTS RESERVED.

## 🎨 Design Philosophy

The DIORBILLION brand embodies:
- **Luxury**: Premium feel with attention to detail
- **Performance**: Fast, responsive interactions  
- **Innovation**: Cutting-edge features and technology
- **Exclusivity**: High-end, personalized experience

The unified architecture ensures these values are delivered through a robust, maintainable codebase.