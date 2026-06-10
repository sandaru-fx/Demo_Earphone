// Cart state management using localStorage
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

// Inject toast container and live chat widget into the body if they don't exist
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle logic
    const menuIcon = document.querySelector('.ri-menu-line');
    const navLinks = document.querySelector('.nav-links');
    if(menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuIcon.classList.toggle('ri-close-line');
            menuIcon.classList.toggle('ri-menu-line');
        });
    }

    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Inject Live Chat Widget
    if (!document.getElementById('live-chat-widget')) {
        const chatWidget = document.createElement('div');
        chatWidget.id = 'live-chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <h3><i class="ri-customer-service-2-fill"></i> Aura Support</h3>
                    <button class="chat-close" onclick="toggleChat()"><i class="ri-close-line"></i></button>
                </div>
                <div class="chat-body" id="chat-body">
                    <div class="chat-msg bot">Hi there! 👋 How can we help you today?</div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Type a message..." onkeypress="if(event.key === 'Enter') sendChatMessage()">
                    <button onclick="sendChatMessage()"><i class="ri-send-plane-fill"></i></button>
                </div>
            </div>
            <button class="chat-toggle-btn" onclick="toggleChat()">
                <i class="ri-chat-3-line"></i>
            </button>
        `;
        document.body.appendChild(chatWidget);
    }

    updateCartBadge();
});

// Live Chat Logic
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('open');
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (msg) {
        const chatBody = document.getElementById('chat-body');
        
        // Add User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.textContent = msg;
        chatBody.appendChild(userMsg);
        
        input.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Simulate Bot Reply
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot';
            botMsg.textContent = "Thanks for your message! One of our audio experts will be with you shortly. (Demo)";
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }
}

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
