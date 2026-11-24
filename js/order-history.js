document.addEventListener("DOMContentLoaded", function() {
    const orderHistoryList = document.querySelector("#order-history-list");

    //GET SAVED ORDERS
    const orders = JSON.parse(localStorage.getItem("cozyCupOrders")) || [];

    //FORMAT CURRENCY
    function formatCurrency(amount) {
        return Number(amount).toLocaleString("en-KE");

    }

    //DISPLAY EMPTY MESSAGE
    if (orders.length === 0) {

        const message = document.createElement("p");
        message.textContent = "You haven't placed any orders yet.";

        orderHistoryList.appendChild(message);
        return;
    }

    //DISPLAY EACH ORDER
    orders.forEach(function(order) {
        const orderCard = document.createElement("div");
        orderCard.classList.add("history-order-card");

        const heading = document.createElement("h3");
        heading.textContent = "Order #" + order.reference;

        orderCard.appendChild(heading);

        const date = document.createElement("p");
        date.textContent = "Date: " + order.date;

        orderCard.appendChild(date);

        const customer = document.createElement("p");
        customer.textContent = "Customer: " + order.name;

        orderCard.appendChild(customer);

        const method = document.createElement("p");
        method.textContent = "Order Method: " + order.method;

        orderCard.appendChild(method);

        const payment = document.createElement("p");
        payment.textContent = "Payment Method: " + order.payment;

        orderCard.appendChild(payment);

        if (order.method === "delivery") {
            const address = document.createElement("p");
            address.textContent = "Delivery Address: " + order.address;

            orderCard.appendChild(address);
        }

        const itemsHeading = document.createElement("h4");
        itemsHeading.textContent = "Items Ordered";

        orderCard.appendChild(itemsHeading);

        order.items.forEach(function(item) {
            const itemDetails = document.createElement("p");
            itemDetails.textContent = item.name + " x " + item.quantity + " - KSh " + formatCurrency(item.price * item.quantity);

            orderCard.appendChild(itemDetails);
        });

        const total = document.createElement("h3");
        total.textContent = "Total: KSh " + formatCurrency(order.total);

        orderCard.appendChild(total);

        orderHistoryList.appendChild(orderCard);
    });


});