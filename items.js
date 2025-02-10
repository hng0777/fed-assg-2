document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = "https://hnggg-15bd.restdb.io/rest/items?max=2";
    const API_KEY = "679587742e4264831ed2397c";
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    let product = {};  // ✅ Declare product variable here

    if (!productId) {
        document.querySelector('main').innerHTML = "<p>Product not found.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY,
            },
        });

        product = await response.json();  // ✅ Assign product inside try block

        document.getElementById('product-name').textContent = product.name || 'No Name Available';
        document.getElementById('product-price').textContent = `S$${product.price.toFixed(2)}` || 'Price Unavailable';

        document.getElementById('product-details').innerHTML = `
            <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
            <p><strong>Condition:</strong> ${product.condition || 'N/A'}</p>
            <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
        `;

        document.getElementById('product-description').innerHTML = `
            <h2>Description</h2>
            <p>${product.description || 'No description provided.'}</p>
        `;

        const dealMethods = Array.isArray(product['deal methods']) 
            ? product['deal methods'].join(', ') 
            : product['deal methods'] || 'Meet-up';

        document.getElementById('deal-methods').innerHTML = `
            <h2>Deal Methods</h2>
            <p>${dealMethods}</p>
        `;

        document.getElementById('seller-name').textContent = product.seller || 'Unknown Seller';

        const imageSlider = document.getElementById('image-slider');
        imageSlider.innerHTML = '';

        const images = Array.isArray(product['product image'])
            ? product['product image']
            : [product['product image']];

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image || 'images/placeholder-product.png';  // ✅ Check for placeholder
            imgElement.alt = product.name;
            imgElement.classList.add('main-image');
            imageSlider.appendChild(imgElement);
        });

    } catch (error) {
        console.error("Error fetching product:", error);
        document.querySelector('main').innerHTML = "<p>Error loading product details.</p>";
    }

    // ✅ Add-to-Cart Function (outside try, after product is defined)
    document.getElementById("buyButton").addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const productToAdd = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product["product image"] || 'images/placeholder-product.png'
        };

        cart.push(productToAdd);
        localStorage.setItem("cart", JSON.stringify(cart));

        console.log("Product added to cart:", productToAdd);  // ✅ Debug
        alert(`${product.name} has been added to your cart!`);
        window.location.href = "cart-page.html";
    });
});