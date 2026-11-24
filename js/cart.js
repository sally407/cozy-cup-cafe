
// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartItemsContainer = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const shoppingCart = document.querySelector("#shopping-cart");

// =====================================
// 2. LOAD SAVED CART
// =====================================

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("cozyCupCart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(function(item) {
            return item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Number.isFinite(item.price) &&
                Number.isInteger(item.quantity) &&
                item.price >= 0 &&
                item.quantity > 0;
        });
    }
} catch (error) {
    cart = [];
}

// Save cart whenever it changes
function saveCart() {
    localStorage.setItem("cozyCupCart", JSON.stringify(cart));
}

// =====================================
// 3. SUCCESS NOTIFICATION
// =====================================

let toastTimeout;

function showNotification(productName) {

    let notification = document.querySelector("#cart-notification");

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "cart-notification";
        notification.setAttribute("role", "status");
        notification.setAttribute("aria-live", "polite");
        document.body.appendChild(notification);
    }

    notification.textContent =
        "✓ " + productName + " added successfully to your cart!";

    notification.classList.add("cart-toast-visible");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function() {
        notification.classList.remove("cart-toast-visible");
    }, 3000);
}

// =====================================
// 4. ADD PRODUCTS TO CART
// =====================================

addToCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const card = button.closest(".product-card");
        const size = card.querySelector(".drink-size");
        const milk = card.querySelector(".drink-milk");
        const syrup = card.querySelector(".drink-syrup");
        const sizeOption = size && size.selectedOptions[0];
        const milkOption = milk && milk.selectedOptions[0];
        const syrupOption = syrup && syrup.selectedOptions[0];
        const sizeLabel = sizeOption ? sizeOption.value.charAt(0).toUpperCase() + sizeOption.value.slice(1) : "";
        const choices = [sizeLabel, milkOption && milkOption.textContent.split(" (+")[0], syrupOption && syrupOption.value !== "No syrup" ? syrupOption.textContent.split(" (+")[0] : ""]
            .filter(Boolean);
        const name = button.dataset.name + (choices.length ? " (" + choices.join(", ") + ")" : "");
        const id = button.dataset.id + "-" + choices.join("-").toLowerCase().replace(/[^a-z0-9-]/g, "");
        const basePrice = sizeOption ? Number(sizeOption.dataset.price) : Number(button.dataset.price);
        const price = basePrice + Number(milkOption && milkOption.dataset.extra || 0) + Number(syrupOption && syrupOption.dataset.extra || 0);

        const existingProduct = cart.find(function(item) {
            return item.id === id;
        });

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();
        displayCart();
        showNotification(name);

        shoppingCart.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

// =====================================
// 5. DISPLAY CART PRODUCTS
// =====================================

function displayCart() {

    cartItemsContainer.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="empty-cart">Your cart is currently empty.</p>';
    }

    cart.forEach(function(item) {

        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        const itemContainer = document.createElement("div");
        itemContainer.classList.add("cart-item");

        const details = document.createElement("div");
        details.classList.add("cart-item-details");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            "KSh " + item.price.toLocaleString("en-KE");

        details.appendChild(name);
        details.appendChild(price);

        const controls = document.createElement("div");
        controls.classList.add("quantity-controls");

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "−";
        decreaseButton.type = "button";
        decreaseButton.classList.add("quantity-btn");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.type = "button";
        increaseButton.classList.add("quantity-btn");

        decreaseButton.addEventListener("click", function() {

            item.quantity--;

            if (item.quantity === 0) {
                cart = cart.filter(function(product) {
                    return product.id !== item.id;
                });
            }

            saveCart();
            displayCart();
        });

        increaseButton.addEventListener("click", function() {
            item.quantity++;
            saveCart();
            displayCart();
        });

        controls.appendChild(decreaseButton);
        controls.appendChild(quantity);
        controls.appendChild(increaseButton);

        const subtotal = document.createElement("p");
        subtotal.classList.add("cart-item-subtotal");
        subtotal.textContent =
            "KSh " + (item.price * item.quantity).toLocaleString("en-KE");

        itemContainer.appendChild(details);
        itemContainer.appendChild(controls);
        itemContainer.appendChild(subtotal);

        cartItemsContainer.appendChild(itemContainer);
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toLocaleString("en-KE");
}

// =====================================
// 6. CLEAR CART
// =====================================

clearCartButton.addEventListener("click", function() {

    cart = [];

    saveCart();
    displayCart();
});

// =====================================
// 7. INITIAL DISPLAY
// =====================================

displayCart();
