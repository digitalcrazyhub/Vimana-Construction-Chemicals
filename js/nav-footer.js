document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.getElementById("vmHeader");
    const menuBtn = document.getElementById("vmMenuBtn");
    const mobileMenu = document.getElementById("vmMobileMenu");
    const yearSpan = document.getElementById("vmYear") || document.getElementById("year");
    const toTop = document.getElementById("toTop");


    /* ============================================================
       LUCIDE ICONS
    ============================================================ */

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
    ) {
        window.lucide.createIcons();
    }


    /* ============================================================
       DYNAMIC YEAR
    ============================================================ */

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (toTop) {
        const updateToTop = () => {
            toTop.classList.toggle("show", window.scrollY > 320);
        };
        updateToTop();
        window.addEventListener("scroll", updateToTop, { passive: true });
        toTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* ============================================================
       NAVBAR SCROLL EFFECT
    ============================================================ */

    function updateNavbar() {

        if (!navbar) {
            return;
        }

        navbar.classList.toggle(
            "vm-scrolled",
            window.scrollY > 40
        );
    }

    updateNavbar();

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );

    /* ============================================================
       CLOSE MOBILE MENU
    ============================================================ */

    function closeMobileMenu() {

        if (!mobileMenu) {
            return;
        }

        mobileMenu.classList.remove("vm-open");

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        if (menuBtn) {
            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            menuBtn.setAttribute(
                "aria-label",
                "Toggle Navigation"
            );
        }

        /*
         * Collapse all mobile dropdown sections.
         */
        mobileMenu
            .querySelectorAll(
                ".vm-mobile-dropdown.vm-open-sub"
            )
            .forEach((element) => {

                element.classList.remove(
                    "vm-open-sub"
                );

                const toggle =
                    element.querySelector(
                        ".vm-mobile-toggle"
                    );

                if (toggle) {
                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            });

        /*
         * Allow page scrolling again.
         */
        document.body.classList.remove(
            "vm-menu-open"
        );
    }


    /* ============================================================
       OPEN / CLOSE MOBILE MENU
    ============================================================ */

    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileMenu.classList.toggle(
                        "vm-open"
                    );

                menuBtn.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                mobileMenu.setAttribute(
                    "aria-hidden",
                    String(!isOpen)
                );

                menuBtn.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close Navigation"
                        : "Toggle Navigation"
                );

                document.body.classList.toggle(
                    "vm-menu-open",
                    isOpen
                );
            }
        );


        /* ========================================================
           CLOSE AFTER NAVIGATION LINK CLICK
        ======================================================== */

        mobileMenu
            .querySelectorAll(
                "a:not(.vm-mobile-toggle)"
            )
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {
                        closeMobileMenu();
                    }
                );
            });


        /* ========================================================
           CLOSE ON OUTSIDE CLICK
        ======================================================== */

        document.addEventListener(
            "click",
            (event) => {

                if (
                    !mobileMenu.classList.contains(
                        "vm-open"
                    )
                ) {
                    return;
                }

                const clickedInsideMenu =
                    mobileMenu.contains(
                        event.target
                    );

                const clickedMenuButton =
                    menuBtn.contains(
                        event.target
                    );

                if (
                    !clickedInsideMenu &&
                    !clickedMenuButton
                ) {
                    closeMobileMenu();
                }
            }
        );


        /* ========================================================
           CLOSE ON ESCAPE
        ======================================================== */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    mobileMenu.classList.contains(
                        "vm-open"
                    )
                ) {

                    closeMobileMenu();

                    menuBtn.focus();
                }
            }
        );


        /* ========================================================
           CLOSE WHEN RESIZED TO DESKTOP
        ======================================================== */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 991 &&
                    mobileMenu.classList.contains(
                        "vm-open"
                    )
                ) {
                    closeMobileMenu();
                }
            }
        );
    }


    /* ============================================================
       MOBILE DROPDOWNS / ACCORDIONS
    ============================================================ */

    document
        .querySelectorAll(".vm-mobile-toggle")
        .forEach((button) => {

            button.setAttribute(
                "aria-expanded",
                "false"
            );


            button.addEventListener(
                "click",
                () => {

                    const parent =
                        button.closest(
                            ".vm-mobile-dropdown"
                        );

                    if (!parent) {
                        return;
                    }

                    const isOpen =
                        parent.classList.contains(
                            "vm-open-sub"
                        );


                    /*
                     * Close other accordion sections.
                     */
                    document
                        .querySelectorAll(
                            ".vm-mobile-dropdown.vm-open-sub"
                        )
                        .forEach((openParent) => {

                            if (
                                openParent !== parent
                            ) {

                                openParent.classList.remove(
                                    "vm-open-sub"
                                );

                                const otherToggle =
                                    openParent.querySelector(
                                        ".vm-mobile-toggle"
                                    );

                                if (otherToggle) {

                                    otherToggle.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );
                                }
                            }
                        });


                    /*
                     * Toggle current accordion.
                     */
                    parent.classList.toggle(
                        "vm-open-sub",
                        !isOpen
                    );

                    button.setAttribute(
                        "aria-expanded",
                        String(!isOpen)
                    );
                }
            );
        });


    /* ============================================================
       CLOSE MOBILE MENU WHEN MOBILE SUBMENU LINK IS CLICKED
    ============================================================ */

    document
        .querySelectorAll(
            ".vm-mobile-submenu a"
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {
                    closeMobileMenu();
                }
            );
        });

});
