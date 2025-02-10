const API_KEY = "679587742e4264831ed2397c";  // Your RestDB.io API Key

let listingsData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchListings();
    fetchUserAccount();
    fetchOrders();
    fetchOffers();
    fetchCategories();
    fetchSubcategories();
    setupNavigationSwipe();
});

/*** FETCH USER ACCOUNT ***/
function fetchUserAccount() {
    let userId = localStorage.getItem("user_id");
    if (!userId) return;

    fetch(`${API_BASE_URL}/user-account/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("user-email").innerText = data.email;
        document.getElementById("user-gender").innerText = data.gender;
    })
    .catch(error => console.error("Error fetching user account:", error));
}

/*** FETCH LISTINGS FROM REST DB ***/
function fetchListings() {
    fetch(`${API_BASE_URL}/listings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        listingsData = data;
        displayListings();
    })
    .catch(error => console.error("Error fetching listings:", error));
}

/*** DISPLAY LISTINGS ON THE PAGE ***/
function displayListings() {
    const listingContainer = document.getElementById("listing-container");
    if (!listingContainer) return;

    listingContainer.innerHTML = "";
    listingsData.forEach(listing => {
        let listingElement = document.createElement("div");
        listingElement.classList.add("listing-item");
        listingElement.innerHTML = `
            <h3>${listing["listing name"]}</h3>
            <p>Price: $${listing.price}</p>
            <p>Condition: ${listing.condition}</p>
            <button onclick="addToWishlist('${listing._id}')">Add to Wishlist</button>
        `;
        listingContainer.appendChild(listingElement);
    });
}

/*** ADD TO WISHLIST ***/
function addToWishlist(listingId) {
    let userId = localStorage.getItem("user_id");
    if (!userId) {
        alert("Please log in to add items to your wishlist.");
        return;
    }

    let jsonData = {
        "user id": userId,
        "listing id": listingId,
        "wishlist date": new Date().toISOString()
    };

    fetch(`${API_BASE_URL}/wishlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(() => alert("Added to wishlist!"))
    .catch(error => console.error("Error adding to wishlist:", error));
}

/*** HANDLE PRODUCT LISTING FORM SUBMISSION ***/
document.getElementById("listing-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let listingData = {
        "listing name": document.getElementById("listing-name").value,
        "price": document.getElementById("listing-price").value,
        "condition": document.getElementById("listing-condition").value,
        "seller id": localStorage.getItem("user_id"),
        "list date": new Date().toISOString()
    };

    fetch(`${API_BASE_URL}/listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        },
        body: JSON.stringify(listingData)
    })
    .then(response => response.json())
    .then(() => {
        alert("Listing added successfully!");
        fetchListings();
    })
    .catch(error => console.error("Error adding listing:", error));
});

/*** HANDLE ORDER FORM SUBMISSION ***/
document.getElementById("order-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let orderData = {
        "buyer id": localStorage.getItem("user_id"),
        "listing id": document.getElementById("order-listing-id").value,
        "order price": document.getElementById("order-price").value,
        "payment method": document.getElementById("payment-method").value,
        "transaction date": new Date().toISOString()
    };

    fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(() => alert("Order placed successfully!"))
    .catch(error => console.error("Error placing order:", error));
});

/*** HANDLE OFFER FORM SUBMISSION ***/
document.getElementById("offer-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let offerData = {
        "buyer id": localStorage.getItem("user_id"),
        "listing id": document.getElementById("offer-listing-id").value,
        "offer prices": document.getElementById("offer-price").value,
        "offer status": "Pending"
    };

    fetch(`${API_BASE_URL}/offer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        },
        body: JSON.stringify(offerData)
    })
    .then(response => response.json())
    .then(() => alert("Offer submitted successfully!"))
    .catch(error => console.error("Error submitting offer:", error));
});

/*** SETUP NAVIGATION SWIPE ***/
function setupNavigationSwipe() {
    const navLinks = document.querySelectorAll(".nav-links li a");
    const scrollContainer = document.querySelector(".scroll-container");
    let currentIndex = 0;
    
    if (!scrollContainer) return;
    
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "hidden";
    scrollContainer.style.whiteSpace = "nowrap";
    scrollContainer.style.transition = "transform 0.5s ease-in-out";
    
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const category = this.textContent.trim();
            localStorage.setItem("selectedCategory", category);
            
            const targetIndex = [...document.querySelectorAll(".scroll-item")]
                .findIndex(item => item.getAttribute("data-category") === category);
            
            if (targetIndex !== -1) {
                scrollContainer.style.transform = `translateX(-${targetIndex * 100}%)`;
                currentIndex = targetIndex;
                event.preventDefault();
            } else {
                window.location.href = link.href;
            }
        });
    });

    // Restore last scrolled category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        setTimeout(() => {
            const targetIndex = [...document.querySelectorAll(".scroll-item")]
                .findIndex(item => item.getAttribute("data-category") === savedCategory);
            if (targetIndex !== -1) {
                scrollContainer.style.transform = `translateX(-${targetIndex * 100}%)`;
            }
        }, 300);

    }
}