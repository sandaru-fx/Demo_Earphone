// Cart state management using localStorage
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

// Inject toast container into the body if it doesn't exist
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    updateCartBadge();
});

function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product, quantity = 1, color = null) {
    // Check if item already exists with same color
    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.color === color);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity,
            color: color || (product.colors && product.colors.length > 0 ? product.colors[0] : null)
        });
    }
    
    saveCart();
    showToast('Added to Cart', `${product.name} has been added to your cart.`);
}

function removeFromCart(index) {
    if (index > -1 && index < cart.length) {
        const item = cart[index];
        cart.splice(index, 1);
        saveCart();
        showToast('Removed from Cart', `${item.name} has been removed.`);
        
        // If we are on the cart page, trigger a re-render
        if (typeof renderCartItems === 'function') {
            renderCartItems();
        }
    }
}

function updateQuantity(index, newQuantity) {
    if (index > -1 && index < cart.length) {
        if (newQuantity <= 0) {
            removeFromCart(index);
        } else {
            cart[index].quantity = newQuantity;
            saveCart();
            
            // If we are on the cart page, trigger a re-render
            if (typeof renderCartItems === 'function') {
                renderCartItems();
            }
        }
    }
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    badges.forEach(badge => {
        badge.textContent = totalItems;
        // Simple pop animation
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    });
}

function showToast(title, message) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    toast.innerHTML = `
        <i class="ri-checkbox-circle-fill"></i>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
