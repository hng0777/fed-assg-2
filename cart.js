// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.initializeListeners();
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    }

    initializeListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const product = {
                    id: productCard.dataset.id,
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                    image: productCard.querySelector('img').src,
                    quantity: 1
                };
                this.addItem(product);
                this.showAddedFeedback(button);
            });
        });

        // Cart page specific listeners
        if (window.location.pathname.includes('cart.html')) {
            document.querySelector('.continue-shopping').addEventListener('click', () => {
                window.history.back();
            });

            document.querySelector('.checkout-btn').addEventListener('click', () => {
                this.proceedToCheckout();
            });

            document.querySelector('.apply-promo').addEventListener('click', () => {
                this.applyPromoCode();
            });
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }
        this.saveCart();
        this.updateCartCount();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
                if (window.location.pathname.includes('cart.html')) {
                    this.renderCart();
                }
            }
        }
    }

    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="quantity-controls">
                        <button onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="item-price">
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button onclick="cart.removeItem('${item.id}')" class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 10 : 0;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;

        document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.shipping').textContent = `$${shipping.toFixed(2)}`;
        document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
    }

    applyPromoCode() {
        const promoInput = document.querySelector('.promo-code input');
        const code = promoInput.value.trim().toUpperCase();
        
        if (code === 'SAVE10') {
            alert('Promo code applied! 10% discount added.');
            // Implement discount logic here
        } else {
            alert('Invalid promo code');
        }
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            alert('Your cart is empty');
            return;
        }
        // Redirect to checkout page or show checkout modal
        alert('Proceeding to checkout...');
        window.location.href = 'checkout.html';
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(badge => {
            badge.textContent = totalItems;
        });
    }

    showAddedFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added to Cart!';
        button.style.backgroundColor = '#4CAF50';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 1500);
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});

document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const basketContainer = document.getElementById("basket-items");
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    let subtotal = 0;
    const shippingFee = 50; // Flat shipping fee
    const taxRate = 0.07;   // 7% tax

    if (cart.length === 0) {
        basketContainer.innerHTML = "<p>Your basket is empty.</p>";
        return;
    }

    cart.forEach((item, index) => {
        subtotal += item.price;

        const itemElement = document.createElement("figure");
        itemElement.classList.add("basket-item");

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <figcaption>
                <p><strong>${item.name}</strong></p>
                <p>Price: S$${item.price.toFixed(2)}</p>
                <p>Quantity: 1</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </figcaption>
        `;

        basketContainer.appendChild(itemElement);
    });

    const tax = subtotal * taxRate;
    const total = subtotal + shippingFee + tax;

    subtotalElement.textContent = `S$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `S$${shippingFee.toFixed(2)}`;
    taxElement.textContent = `S$${tax.toFixed(2)}`;
    totalElement.textContent = `S$${total.toFixed(2)}`;
});

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Remove item at the given index
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload(); // Refresh to reflect changes
}

// Promo Code Logic
document.querySelector(".apply-button").addEventListener("click", (e) => {
    e.preventDefault();
    const promoCode = document.querySelector(".promo-code").value.trim().toUpperCase();
    let subtotal = parseFloat(document.getElementById("subtotal").textContent.replace("S$", ""));
    const shippingFee = parseFloat(document.getElementById("shipping").textContent.replace("S$", ""));
    const tax = parseFloat(document.getElementById("tax").textContent.replace("S$", ""));

    if (promoCode === "DISCOUNT10") {
        const discount = subtotal * 0.10; // 10% Discount
        subtotal -= discount;

        const total = subtotal + shippingFee + tax; // Recalculate the total
        document.getElementById("subtotal").textContent = `S$${subtotal.toFixed(2)}`;
        document.getElementById("total").textContent = `S$${total.toFixed(2)}`;

        alert("Promo code applied! You got 10% off.");
    } else {
        alert("Invalid promo code.");
    }
});


// Checkout Button Logic
document.getElementById("checkoutBtn").addEventListener("click", () => {
    alert("Thank you for your purchase!");
    localStorage.removeItem("cart"); // Clear the cart after checkout
    window.location.href = "confirmation.html"; // Redirect to confirmation page
});