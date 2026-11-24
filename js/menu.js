
// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const searchInput = document.querySelector("#menuSearch");

const filterButtons = document.querySelectorAll(".filter-btn");

const productCards = document.querySelectorAll(".product-card");

const noResults = document.querySelector("#noMenuResults");


// =====================================
// 2. SELECTED CATEGORY
// =====================================

let selectedCategory = "all";


// =====================================
// 3. FILTER MENU PRODUCTS
// =====================================

function filterMenu() {

    // Get search text
    const searchText = searchInput.value.toLowerCase().trim();

    // Count visible products
    let visibleProducts = 0;

    // Loop through all product cards
    productCards.forEach(function(card) {

        // Get product details
        const productName = card.querySelector("h3").textContent.toLowerCase();

        const productDescription = card.textContent.toLowerCase();

        const productCategory = card.dataset.category;

        // Check search match
        const matchesSearch =
            productName.includes(searchText) ||
            productDescription.includes(searchText);

        // Check category match
        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        // Display matching products
        if (matchesSearch && matchesCategory) {

            card.style.display = "";

            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });


    // Display no-results message when necessary
    noResults.hidden = visibleProducts > 0;

}


// =====================================
// 4. SEARCH EVENT
// =====================================

searchInput.addEventListener("input", function() {

    filterMenu();

});


// =====================================
// 5. CATEGORY FILTER EVENTS
// =====================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get selected category
        selectedCategory = button.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        // Highlight selected button
        button.classList.add("active");

        // Filter products
        filterMenu();

    });

});
