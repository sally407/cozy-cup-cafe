// MOBILE NAVIGATION //

// Get the menu checkbox
const menuToggle = document.querySelector('#menu-toggle');

//Get the backgrouond overlay
const menuOverlay = document.querySelector(".sidebar-overlay");

//Close the menu when the overlay is clicked
if (menuOverlay && menuToggle) {
    menuOverlay.addEventListener("click", function () {
        menuToggle.checked = false;
    });
}

//Close the menu when Escape is pressed
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle) {
        menuToggle.checked = false;
    }
});