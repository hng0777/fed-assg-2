document.addEventListener("DOMContentLoaded", async function () {
    // Dynamically detect category based on the page title
    let category = "";
    if (document.title.includes("Clothing")) {
        category = "Clothing";
    } else if (document.title.includes("Electronics")) {
        category = "Electronics";
    } else if (document.title.includes("Luxury")) {
        category = "Luxury Items";
    } else if (document.title.includes("All Products")) {
        category = ""; // Fetch all products without filtering
    }

    console.log(`Fetching '${category || "All"}' products...`);

    const API_URL = "https://hnggg-15bd.restdb.io/rest/items?max=2";
    const API_KEY = "679587742e4264831ed2397c"; // Your RestDB API key

    // Adjust the query based on the category
    const query = category ? `?q=${encodeURIComponent(JSON.stringify({ category }))}` : "";
    const requestUrl = `${API_URL}${query}`;

    try {
        const response = await fetch(requestUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY,
            },
        });

        const products = await response.json();
        console.log(`Fetched '${category || "All"}' Products:`, products);

        displayProducts(products, "trending-products");
        displayProducts(products, "sale-products");
        displayProducts(products, "recent-products");

    } catch (error) {
        console.error(`Error fetching '${category || "All"}' products:`, error);
    }
});

function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // Clear existing products

    products.forEach(product => {
        const productElement = document.createElement("article");
        productElement.classList.add("product");

        productElement.innerHTML = `
            <p>Seller: Unknown</p>
            <p>Listed: Just now</p>
            <a href="product_page.html?id=${product._id}">
                <figure class="product-image">
                    <img src="${product['product image']}" alt="${product.name}" width="150" height="150">
                </figure>
            </a>
            <figcaption>
                <p><strong>${product.name}</strong></p>
                <p>Price: $${product.price}</p>
                <p>Condition: ${product.condition}</p>
            </figcaption>
        `;

        container.appendChild(productElement);
    });
}