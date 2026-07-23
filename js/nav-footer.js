document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.getElementById("navbar");
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    window.addEventListener("scroll", () => {

        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        }

    });

    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener("click", () => {

            mobileMenu.classList.toggle("open");

        });

        mobileMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

            });

        });

    }

});