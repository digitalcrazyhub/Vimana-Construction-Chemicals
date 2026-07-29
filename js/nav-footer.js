document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("vmHeader");
    const menuBtn = document.getElementById("vmMenuBtn");
    const mobileMenu = document.getElementById("vmMobileMenu");
    const yearSpan = document.getElementById("vmYear");

    // FIX: <i data-lucide="..."> icons never rendered because
    // lucide.createIcons() was never called.
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }

    // Dynamic Year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar Scroll Effect
    window.addEventListener("scroll", () => {
        if (navbar) {
            navbar.classList.toggle("vm-scrolled", window.scrollY > 40);
        }
    }, { passive: true });

    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove("vm-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
        // also collapse any open accordion sections so the menu
        // always reopens in a clean, collapsed state
        mobileMenu.querySelectorAll(".vm-mobile-dropdown.vm-open-sub").forEach((el) => {
            el.classList.remove("vm-open-sub");
            const toggle = el.querySelector(".vm-mobile-toggle");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
    }

    // Mobile Menu Toggle
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("vm-open");
            menuBtn.setAttribute("aria-expanded", String(isOpen));
        });

        // Close when a real navigation link (not an accordion toggle) is clicked
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!mobileMenu.classList.contains("vm-open")) return;
            const clickedInsideMenu = mobileMenu.contains(e.target);
            const clickedToggleBtn = menuBtn.contains(e.target);
            if (!clickedInsideMenu && !clickedToggleBtn) {
                closeMobileMenu();
            }
        });

        // Close on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileMenu.classList.contains("vm-open")) {
                closeMobileMenu();
                menuBtn.focus();
            }
        });

        // Avoid a stuck-open mobile menu if the viewport is resized
        // past the desktop breakpoint while it's open
        window.addEventListener("resize", () => {
            if (window.innerWidth > 991 && mobileMenu.classList.contains("vm-open")) {
                closeMobileMenu();
            }
        });
    }

    // FIX: mobile "About Us" / "Projects" accordions had no JS at all —
    // the toggle buttons did nothing and .vm-mobile-submenu never opened.
    document.querySelectorAll(".vm-mobile-toggle").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");

        btn.addEventListener("click", () => {
            const parent = btn.closest(".vm-mobile-dropdown");
            if (!parent) return;

            const isOpen = parent.classList.contains("vm-open-sub");

            // accordion behavior: collapse any other open section first
            document.querySelectorAll(".vm-mobile-dropdown.vm-open-sub").forEach((openParent) => {
                if (openParent !== parent) {
                    openParent.classList.remove("vm-open-sub");
                    const otherToggle = openParent.querySelector(".vm-mobile-toggle");
                    if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
                }
            });

            parent.classList.toggle("vm-open-sub", !isOpen);
            btn.setAttribute("aria-expanded", String(!isOpen));
        });
    });
});