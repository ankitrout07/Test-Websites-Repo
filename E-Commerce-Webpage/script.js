/* project-wide script */

const products = [
    { id: 1, name: 'Quantum Pro Laptop', price: 1499.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500' },
    { id: 2, name: 'Aero Noise-Cancelling Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500' },
    { id: 3, name: 'Nebula Smartwatch', price: 399.99, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500' },
    { id: 4, name: 'Zenith Mechanical Keyboard', price: 149.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500' },
    { id: 5, name: 'Orbit Drone 4K', price: 899.99, image: 'https://images.unsplash.com/photo-1507580461415-9705dc8ceeb8?auto=format&fit=crop&w=500' },
    { id: 6, name: 'Lumina Wireless Mouse', price: 79.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500' }
];

const cart = [];
const cartLink = document.getElementById('cart-link');

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartLink) {
        cartLink.textContent = `Cart (${totalItems})`;
        cartLink.style.transform = 'scale(1.1)';
        setTimeout(() => cartLink.style.transform = 'none', 200);
    }
}

function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name: prod.name, price: prod.price, quantity: 1, image: prod.image });
    }
    updateCartCounter();
    saveCart();
    showToast(`${prod.name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
        const items = JSON.parse(stored);
        items.forEach(i => cart.push(i));
        updateCartCounter();
    }
}

function renderProducts(filter = '') {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';
    const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 1.2rem;">No products found matching "${filter}".</p>`;
        return;
    }

    filtered.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'product';
        div.setAttribute('data-id', p.id);
        div.style.animation = `slideIn 0.5s ease forwards ${i * 0.1}s`;
        div.style.opacity = '0'; // For animation
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button class="add-cart">Add to Cart</button>
        `;
        container.appendChild(div);
    });
    attachProductListeners();
}

function attachProductListeners() {
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', e => {
            const productEl = e.target.closest('.product');
            const id = parseInt(productEl.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

function setupSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', e => {
        renderProducts(e.target.value);
    });
}

function setupNavToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// cart page functions
function renderCartPage() {
    const tbody = document.getElementById('cart-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 4rem;">Your cart is empty. <br><br><a href="index.html" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Continue Shopping</a></td></tr>`;
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="display: flex; align-items: center; gap: 1.5rem; text-align: left;">
                <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                ${item.name}
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="qty-input"></td>
            <td style="color: var(--accent); font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-item" data-id="${item.id}">✕</button></td>
        `;
        tbody.appendChild(tr);
    });
    setupCartPageListeners();
    updateCartSummary();
}

function updateCartSummary() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const summary = document.getElementById('cart-total');
    if (summary) summary.textContent = `$${total.toFixed(2)}`;
}

function setupCartPageListeners() {
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', e => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const qty = parseInt(e.target.value);
            const item = cart.find(i => i.id === id);
            if (item && qty > 0) {
                item.quantity = qty;
                saveCart();
                renderCartPage();
            }
        });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const idx = cart.findIndex(i => i.id === id);
            if (idx > -1) {
                cart.splice(idx, 1);
                saveCart();
                renderCartPage();
                showToast('Item removed');
            }
        });
    });
    const checkout = document.getElementById('checkout-btn');
    if (checkout) {
        checkout.addEventListener('click', () => {
            if(cart.length === 0) return alert('Your cart is empty!');
            alert('Proceeding to secure checkout...');
        });
    }
}

// Global CSS for product animation
if (!document.getElementById('dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.innerHTML = \`
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    \`;
    document.head.appendChild(style);
}

// initialization
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupNavToggle();

    if (document.body.classList.contains('cart-page')) {
        renderCartPage();
    } else {
        renderProducts();
        setupSearch();
    }
});
