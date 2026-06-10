document.addEventListener('DOMContentLoaded', () => {
    const detailContainer = document.getElementById('product-detail-container');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Find product
    const product = products.find(p => p.id === productId);

    if (!product) {
        detailContainer.innerHTML = `
            <div style="text-align: center; padding: 100px;">
                <h2>Product Not Found</h2>
                <p style="color: var(--text-secondary); margin-top: 20px;">The product you are looking for does not exist.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 30px;">Return to Shop</a>
            </div>
        `;
        return;
    }

    // Generate HTML
    const originalPriceHtml = product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : '';
    
    let featuresHtml = '';
    product.features.forEach(feature => {
        featuresHtml += `<li><i class="ri-check-double-line"></i> ${feature}</li>`;
    });

    let colorsHtml = '';
    product.colors.forEach((color, index) => {
        colorsHtml += `<div class="color-swatch ${index === 0 ? 'active' : ''}" style="background-color: ${color};" data-color="${color}"></div>`;
    });

    detailContainer.innerHTML = `
        <div class="product-container animate-up">
            <!-- Left: Gallery -->
            <div class="product-gallery">
                <div class="main-image">
                    <img id="main-product-image" src="${product.image}" alt="${product.name}">
                </div>
                <div class="thumbnail-strip">
                    <div class="thumbnail active">
                        <img src="${product.image}" alt="Thumbnail 1">
                    </div>
                    <!-- Mock additional thumbnails -->
                    <div class="thumbnail">
                        <img src="${product.image}" style="transform: scaleX(-1);" alt="Thumbnail 2">
                    </div>
                </div>
            </div>

            <!-- Right: Info -->
            <div class="product-info-panel">
                <div style="color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; margin-bottom: 10px;">
                    ${product.category.replace('-', ' ')}
                </div>
                <h1>${product.name}</h1>
                
                <div class="rating-reviews">
                    ${getStarsHtml(product.rating)}
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>

                <div class="price-block">
                    $${product.price}
                    ${originalPriceHtml}
                </div>

                <p class="description">${product.description}</p>

                <ul class="features-list">
                    ${featuresHtml}
                </ul>

                <div class="selector-group">
                    <h4>Choose Color</h4>
                    <div class="color-options" id="color-selector">
                        ${colorsHtml}
                    </div>
                </div>

                <div class="action-group">
                    <div class="quantity-selector">
                        <button class="quantity-btn" id="qty-minus">-</button>
                        <input type="number" class="quantity-input" id="qty-input" value="1" min="1" max="10">
                        <button class="quantity-btn" id="qty-plus">+</button>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" id="add-to-cart-btn">
                        <i class="ri-shopping-cart-2-line" style="margin-right: 10px;"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    // Setup interactive elements
    setupInteractions();

    function getStarsHtml(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="ri-star-fill"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="ri-star-half-fill"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="ri-star-line"></i>';
        }
        return stars;
    }

    function setupInteractions() {
        // Thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-product-image');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                // Simple animation effect on swap
                mainImage.style.opacity = 0;
                setTimeout(() => {
                    mainImage.src = this.querySelector('img').src;
                    mainImage.style.transform = this.querySelector('img').style.transform;
                    mainImage.style.opacity = 1;
                }, 200);
            });
        });

        // Colors
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                colorSwatches.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Quantity
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const qtyInput = document.getElementById('qty-input');

        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });

        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val < 10) qtyInput.value = val + 1;
        });

        // Add to Cart logic
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            const activeColorSwatch = document.querySelector('.color-swatch.active');
            const color = activeColorSwatch ? activeColorSwatch.dataset.color : null;
            
            if (typeof addToCart === 'function') {
                addToCart(product, qty, color);
            }
        });
    }
});
