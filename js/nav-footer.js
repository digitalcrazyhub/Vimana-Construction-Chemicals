document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("vmHeader");
    const menuBtn = document.getElementById("vmMenuBtn");
    const mobileMenu = document.getElementById("vmMobileMenu");
    const yearSpan = document.getElementById("vmYear");

    // Dynamic Year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar Scroll Effect
    window.addEventListener("scroll", () => {
        if (navbar) {
            navbar.classList.toggle("vm-scrolled", window.scrollY > 40);
        }
    });

    // Mobile Menu Toggle
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("vm-open");
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("vm-open");
            });
        });
    }
});