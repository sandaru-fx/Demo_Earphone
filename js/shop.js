document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const productCount = document.getElementById('product-count');

    let currentCategory = 'all';
    let currentSort = 'featured';

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No products found.</p>';
            return;
        }

        productsToRender.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate-up';
            card.style.animationDelay = `${index * 0.1}s`;

            const originalPriceHtml = product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : '';
            
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="quick-view-btn" onclick="window.location.href='product.html?id=${product.id}'">View Details</button>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category.replace('-', ' ')}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">
                        $${product.price}
                        ${originalPriceHtml}
                    </div>
                    <div class="product-rating">
                        ${getStarsHtml(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                </div>
            `;
            
            productGrid.appendChild(card);
        });

        productCount.textContent = `Showing ${productsToRender.length} product${productsToRender.length !== 1 ? 's' : ''}`;
    }

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

    function filterAndSortProducts() {
        let filtered = [...products];

        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        // Sort
        switch (currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default: // featured - keep original order
                break;
        }

        renderProducts(filtered);
    }

    // Event Listeners for Filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentCategory = e.target.dataset.category;
            filterAndSortProducts();
        });
    });

    // Event Listener for Sorting
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndSortProducts();
    });

    // Initial render
    renderProducts(products);
});
