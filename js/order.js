
// ==========================================
// THE COZY CUP CAFE - ORDER.JS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // ======================================
    // 1. SELECT HTML ELEMENTS
    // ======================================

    const checkoutItems = document.querySelector("#checkout-items");
    const checkoutSubtotal = document.querySelector("#checkout-subtotal");
    const deliveryFeeElement = document.querySelector("#delivery-fee");
    const checkoutTotal = document.querySelector("#checkout-total");

    const orderForm = document.querySelector("#order-form");
    const orderMethod = document.querySelector("#order-method");
    const deliveryAddress = document.querySelector("#delivery-address");
    const addressGroup = document.querySelector("#address-group");

    const checkoutSection = document.querySelector("#checkout-section");
    const successSection = document.querySelector("#order-success");

    const confirmOrderButton = document.querySelector("#confirm-order");

    // ======================================
    // 2. LOAD SAVED CART
    // ======================================

    let cart = [];

    try {
        const savedCart = JSON.parse(
            localStorage.getItem("cozyCupCart")
        );

        if (Array.isArray(savedCart)) {
            cart = savedCart.filter(function(item) {
                return item &&
                    typeof item.name === "string" &&
                    Number.isFinite(Number(item.price)) &&
                    Number.isInteger(Number(item.quantity)) &&
                    Number(item.price) >= 0 &&
                    Number(item.quantity) > 0;
            }).map(function(item) {
                return {
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                    quantity: Number(item.quantity)
                };
            });
        }

    } catch (error) {
        console.error("Unable to load cart:", error);
        cart = [];
    }

    // ======================================
    // 3. FORMAT CURRENCY
    // ======================================

    function formatCurrency(amount) {
        return Number(amount).toLocaleString("en-KE");
    }

    // ======================================
    // 4. CALCULATE TOTAL
    // ======================================

    function updateTotal(subtotal) {

        const deliveryFee =
            orderMethod.value === "delivery" ? 200 : 0;

        const total = subtotal + deliveryFee;

        deliveryFeeElement.textContent =
            formatCurrency(deliveryFee);

        checkoutTotal.textContent =
            formatCurrency(total);
    }

    // ======================================
    // 5. DISPLAY ORDER SUMMARY
    // ======================================

    function displayOrder() {

        checkoutItems.innerHTML = "";

        if (cart.length === 0) {

            checkoutItems.innerHTML =
                `<p>Your cart is empty.
                <a href="menu.html">Explore our menu</a></p>`;

            confirmOrderButton.disabled = true;

            checkoutSubtotal.textContent = "0";
            deliveryFeeElement.textContent = "0";
            checkoutTotal.textContent = "0";

            return;
        }

        confirmOrderButton.disabled = false;

        let subtotal = 0;

        cart.forEach(function(item) {

            const itemSubtotal = item.price * item.quantity;

            subtotal += itemSubtotal;

            const itemElement = document.createElement("div");
            itemElement.classList.add("checkout-item");

            const details = document.createElement("div");
            details.classList.add("checkout-item-details");

            const name = document.createElement("h3");
            name.textContent = item.name;

            const quantity = document.createElement("p");
            quantity.textContent = "Quantity: " + item.quantity;

            const price = document.createElement("p");
            price.textContent =
                "KSh " + formatCurrency(itemSubtotal);

            details.appendChild(name);
            details.appendChild(quantity);

            itemElement.appendChild(details);
            itemElement.appendChild(price);

            checkoutItems.appendChild(itemElement);

        });

        checkoutSubtotal.textContent =
            formatCurrency(subtotal);

        updateTotal(subtotal);
    }

    // ======================================
    // 6. DELIVERY ADDRESS TOGGLE
    // ======================================

    function toggleDeliveryAddress() {

        if (orderMethod.value === "delivery") {

            addressGroup.hidden = false;
            deliveryAddress.required = true;

        } else {

            addressGroup.hidden = true;
            deliveryAddress.required = false;
            deliveryAddress.value = "";

        }
    }

    orderMethod.addEventListener("change", function() {
        toggleDeliveryAddress();
        displayOrder();
    });

    // ======================================
    // 7. SUBMIT ORDER
    // ======================================

    orderForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty. Please select products first.");
            return;
        }

        if (!orderForm.checkValidity()) {
            orderForm.reportValidity();
            return;
        }

        // GENERATE ORDER REFERENCE

        const orderReference =
            "CC" + Date.now().toString().slice(-6);

        document.querySelector("#order-reference").textContent =
            orderReference;

        // CAPTURE CUSTOMER DETAILS

        const customerName =
            document.querySelector("#customer-name").value;

        const customerPhone =
            document.querySelector("#customer-phone").value;

        const preferredTime =
            document.querySelector("#preferred-time").value;

        const paymentMethod =
            document.querySelector("#payment-method");

        const specialInstructions =
            document.querySelector("#special-instructions").value;

        // DISPLAY CUSTOMER DETAILS

        document.querySelector("#receipt-name").textContent =
            customerName;

        document.querySelector("#receipt-phone").textContent =
            customerPhone;

        document.querySelector("#receipt-method").textContent =
            orderMethod.options[orderMethod.selectedIndex].textContent;

        document.querySelector("#receipt-time").textContent =
            preferredTime || "Not specified";

        document.querySelector("#receipt-payment").textContent =
            paymentMethod.options[paymentMethod.selectedIndex].textContent;

        // DISPLAY DELIVERY ADDRESS

        const addressRow =
            document.querySelector("#receipt-address-row");

        addressRow.hidden =
            orderMethod.value !== "delivery";

        document.querySelector("#receipt-address").textContent =
            deliveryAddress.value;

        // DISPLAY ORDERED PRODUCTS

        const receiptItems =
            document.querySelector("#receipt-items");

        receiptItems.innerHTML = "";

        let subtotal = 0;

        cart.forEach(function(item) {

            const itemSubtotal = item.price * item.quantity;

            subtotal += itemSubtotal;

            const receiptItem = document.createElement("div");
            receiptItem.classList.add("receipt-item");

            const itemName = document.createElement("span");
            itemName.textContent =
                item.name + " × " + item.quantity;

            const itemPrice = document.createElement("strong");
            itemPrice.textContent =
                "KSh " + formatCurrency(itemSubtotal);

            receiptItem.appendChild(itemName);
            receiptItem.appendChild(itemPrice);

            receiptItems.appendChild(receiptItem);

        });

        // CALCULATE RECEIPT TOTALS

        const deliveryFee =
            orderMethod.value === "delivery" ? 200 : 0;

        const total = subtotal + deliveryFee;

        document.querySelector("#receipt-subtotal").textContent =
            "KSh " + formatCurrency(subtotal);

        document.querySelector("#receipt-delivery").textContent =
            "KSh " + formatCurrency(deliveryFee);

        document.querySelector("#receipt-total").textContent =
            "KSh " + formatCurrency(total);

        // SPECIAL INSTRUCTIONS

        document.querySelector("#receipt-instructions").textContent =
            specialInstructions
                ? "Special instructions: " + specialInstructions
                : "No special instructions provided.";

        // SAVE ORDER TO ORDER HISTORY
        
        const completedOrder = {
            reference: orderReference,
            date: new Date().toLocaleString("en-KE"),
            name: customerName,
            phone: customerPhone,
            method: orderMethod.value,
            address: deliveryAddress.value,
            time: preferredTime || "Not specified",
            payment: paymentMethod.options[paymentMethod.selectedIndex].textContent,
            instructions: specialInstructions,
            items: cart.map(function(item) {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                };
            }),
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total
        };

        // GET PRVIOUS ORDERS

        let previousOrders = [];

        try {
            previousOrders = JSON.parse(localStorage.getItem("cozyCupOrders") ) || [];

            if (!Array.isArray(previousOrders)) {
                previousOrders = [];
            } 

        } catch (error) {
            console.error("Unable to load previous orders:", error);
            previousOrders = [];
        }

        // ADD NEW ORDER
        previousOrders.push(completedOrder);

        // SAVE TO LOCAL STORAGE
        localStorage.setItem("cozyCupOrders", JSON.stringify(previousOrders));

        // CLEAR CART AFTER RECEIPT IS PREPARED

        cart = [];

        localStorage.removeItem("cozyCupCart");

        // SHOW ORDER CONFIRMATION

        checkoutSection.hidden = true;
        successSection.hidden = false;

        successSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

    // ======================================
    // 8. INITIALIZE CHECKOUT PAGE
    // ======================================

    toggleDeliveryAddress();
    displayOrder();

});
