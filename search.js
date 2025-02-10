document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const quickFilters = document.querySelectorAll('.quick-filter');
    const trendTags = document.querySelectorAll('.trend-tag');
    
    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });
    
    // Clear search input
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        searchInput.focus();
    });
    
    // Quick filters functionality
    quickFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            quickFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            // Add filter logic here
        });
    });
    
    // Trending searches functionality
    trendTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.textContent.trim();
            searchInput.value = searchTerm;
            clearButton.style.display = 'block';
            // Trigger search with the term
        });
    });
    
    // Example search function
    function performSearch(query) {
        // Add search logic here
        console.log('Searching for:', query);
    }
    
    // Debounce search input
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
});

document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    searchProducts(query);
});

document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length > 2) {
        searchProducts(query);
    } else {
        document.getElementById("searchResults").innerHTML = "";
    }
});

async function searchProducts(query) {
    const API_URL = "https://hnggg-15bd.restdb.io/rest/items?max=2";
    const API_KEY = "679587742e4264831ed2397c";

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY,
            }
        });

        const products = await response.json();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        displayResults(filteredProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("searchResults").innerHTML = "<p>Error loading search results.</p>";
    }
}

function displayResults(products) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Clear previous results

    if (products.length === 0) {
        resultsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product['product image'] || 'images/placeholder.jpg'}" alt="${product.name}" width="150">
            <p>Price: S$${product.price.toFixed(2)}</p>
            <p>Category: ${product.category}</p>
            <a href="product_page.html?id=${product._id}">View Product</a>
        `;

        resultsContainer.appendChild(productElement);
    });
}