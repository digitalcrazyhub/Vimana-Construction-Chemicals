/* =========================================================
   VIMANA — About Page Interactions
   ========================================================= */

(() => {
    "use strict";

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    /*====================================
      Footer Year
    ====================================*/

    const year = $("#year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /*====================================
      Navbar Scroll
    ====================================*/

    const navbar =
        $(".vmn-navbar") ||
        $("#nav") ||
        document.querySelector("header nav");

    function handleNavbar() {
        if (!navbar) return;

        navbar.classList.toggle("is-scrolled", window.scrollY > 20);
    }

    window.addEventListener("scroll", handleNavbar, {
        passive: true
    });

    handleNavbar();

    /*====================================
      Mobile Menu
    ====================================*/

    const burger =
        $("#burger") ||
        $(".vmn-menu-toggle");

    const navLinks =
        $(".nav__links") ||
        $(".vmn-nav__links");

    if (burger && navLinks) {

        burger.addEventListener("click", () => {

            navLinks.classList.toggle("is-open");

            burger.classList.toggle("is-active");

        });

        $$("a", navLinks).forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("is-open");

                burger.classList.remove("is-active");

            });

        });

    }

    /*====================================
      Reveal Animation
    ====================================*/

    const revealItems = $$(".vmn-reveal");

    if (revealItems.length) {

        const revealObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const delay = parseInt(
                    entry.target.dataset.delay || 0,
                    10
                );

                setTimeout(() => {
                    entry.target.classList.add("vmn-is-visible");
                }, delay);
                revealObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -80px 0px"
        });
        revealItems.forEach(item => revealObserver.observe(item));
    }
    /*====================================
      Animated Counters
    ====================================*/
    const counters = $$(".vmn-stat-card__val");
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const counter = entry.target;
                const target = parseInt(
                    counter.dataset.count || 0,
                    10
                );
                const duration = 1800;
                const start = performance.now();
                function update(now) {
                    const progress = Math.min(
                        (now - start) / duration,
                        1
                    );
                    const eased =
                        1 - Math.pow(1 - progress, 3);  
                    counter.textContent =
                        Math.floor(target * eased).toLocaleString();

                    if (progress < 1) {

                        requestAnimationFrame(update);

                    } else {

                        counter.textContent =
                            target.toLocaleString();

                    }

                }

                requestAnimationFrame(update);

                counterObserver.unobserve(counter);

            });

        }, {

            threshold: 0.4

        });

        counters.forEach(counter =>
            counterObserver.observe(counter)
        );

    }

    /*====================================
      Skill Bars
    ====================================*/

    const skillBars = $$(".vmn-skill-item__fill");

    if (skillBars.length) {

        const barObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const bar = entry.target;

                const value = parseInt(
                    bar.dataset.fill || 0,
                    10
                );

                requestAnimationFrame(() => {

                    bar.style.width = value + "%";

                });

                const parent =
                    bar.closest(".vmn-skill-item");

                if (parent) {

                    const label =
                        parent.querySelector(".vmn-skill-item__label b");

                    if (label) {

                        const target = parseInt(
                            label.dataset.value || 0,
                            10
                        );

                        const duration = 1500;

                        const start = performance.now();

                        function animate(now) {

                            const progress = Math.min(
                                (now - start) / duration,
                                1
                            );

                            const eased =
                                1 - Math.pow(1 - progress, 3);

                            label.textContent =
                                Math.floor(target * eased) + "%";

                            if (progress < 1) {

                                requestAnimationFrame(animate);

                            } else {

                                label.textContent =
                                    target + "%";

                            }

                        }

                        requestAnimationFrame(animate);

                    }

                }

                barObserver.unobserve(bar);

            });

        }, {

            threshold: 0.3

        });

        skillBars.forEach(bar =>
            barObserver.observe(bar)
        );

    }

})();