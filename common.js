// Common functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Update active nav link
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const cartBadge = document.querySelector('.fa-shopping-cart').nextElementSibling;
            const currentCount = parseInt(cartBadge.textContent);
            cartBadge.textContent = currentCount + 1;
            
            // Animation feedback
            button.textContent = 'Added to Cart!';
            button.style.background = '#4CAF50';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.background = '';
            }, 1500);
        });
    });

    // Wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const wishlistBadge = document.querySelector('.fa-heart').nextElementSibling;
            const icon = button.querySelector('i');
            
            if (icon.style.color === 'rgb(255, 0, 0)') {
                icon.style.color = '#666';
                wishlistBadge.textContent = parseInt(wishlistBadge.textContent) - 1;
            } else {
                icon.style.color = '#ff0000';
                wishlistBadge.textContent = parseInt(wishlistBadge.textContent) + 1;
            }
        });
    });

    // Filter functionality
    const filterInputs = document.querySelectorAll('.filter-option input');
    filterInputs.forEach(input => {
        input.addEventListener('change', updateFilters);
    });

    // Price range functionality
    const priceRange = document.querySelector('input[type="range"]');
    if (priceRange) {
        priceRange.addEventListener('input', updatePriceFilter);
    }
});

function updateFilters() {
    // Add filter logic here
    console.log('Filters updated');
}

function updatePriceFilter() {
    // Add price filter logic here
    console.log('Price filter updated');
}

// Add to existing common.js
document.addEventListener('DOMContentLoaded', () => {
    // Handle shop now buttons
    document.querySelectorAll('.shop-now').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.closest('article').querySelector('h3').textContent;
            if (category.toLowerCase().includes('electronics')) {
                window.location.href = 'gadgetmain.html';
            } else if (category.toLowerCase().includes('luxury')) {
                window.location.href = 'richmain.html';
            } else {
                window.location.href = 'product.html';
            }
        });
    });

    // Handle category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.currentTarget.querySelector('h3').textContent;
            window.location.href = 'product.html#' + category.toLowerCase();
        });
    });

    // Handle wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            icon.style.color = icon.style.color === 'red' ? '#666' : 'red';
            
            // Update wishlist count
            const wishlistBadge = document.querySelector('.fa-heart').nextElementSibling;
            const currentCount = parseInt(wishlistBadge.textContent);
            wishlistBadge.textContent = icon.style.color === 'red' ? 
                currentCount + 1 : currentCount - 1;
        });
    });
}); 