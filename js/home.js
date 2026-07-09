document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('featured-products');
    if (!grid || typeof products === 'undefined') return;

    const featured = products.filter(p => ['p1', 'p2', 'p5', 'p10'].includes(p.id));

    featured.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card animate-up';
        card.style.animationDelay = `${index * 0.1}s`;

        const originalPriceHtml = product.originalPrice
            ? `<span class="original-price">$${product.originalPrice}</span>`
            : '';

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
                <a href="product.html?id=${product.id}" class="quick-view-btn">View Details</a>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.replace('-', ' ')}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price} ${originalPriceHtml}</div>
                <div class="product-rating">${getStarsHtml(product.rating)} <span>(${product.reviews})</span></div>
            </div>
        `;

        grid.appendChild(card);
    });

    function getStarsHtml(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) stars += '<i class="ri-star-fill"></i>';
        if (hasHalfStar) stars += '<i class="ri-star-half-fill"></i>';
        for (let i = 0; i < 5 - Math.ceil(rating); i++) stars += '<i class="ri-star-line"></i>';
        return stars;
    }

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(18, 18, 26, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });
});
