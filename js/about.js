/**
 * =========================================================
 * VIMANA CONSTRUCTION CHEMICALS
 * ABOUT PAGE JAVASCRIPT
 *
 * Features:
 * - Dynamic footer year
 * - Scroll reveal animations
 * - Animated statistics counters
 * - Skill progress animations
 * - Infinite brand logo carousel
 * - Carousel hover/focus/touch pause
 * =========================================================
 */

(function () {

    "use strict";


    /* =========================================================
       DOM HELPERS
    ========================================================= */

    const select = (selector, context = document) => {
        return context.querySelector(selector);
    };


    const selectAll = (selector, context = document) => {
        return Array.from(
            context.querySelectorAll(selector)
        );
    };


    /* =========================================================
       ABOUT PAGE INITIALIZATION
    ========================================================= */

    function initAboutPage() {


        /* =====================================================
           DYNAMIC YEAR
        ===================================================== */

        const yearEl = select("#vmYear");

        if (yearEl) {

            yearEl.textContent =
                new Date()
                    .getFullYear()
                    .toString();

        }


        /* =====================================================
           SCROLL REVEAL
        ===================================================== */

        const revealElements =
            selectAll(".vmn-reveal");

        const prefersReducedMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            revealElements.forEach((element) => element.classList.add("vmn-is-visible"));
            selectAll("[data-count]").forEach((element) => {
                const value = Number(element.dataset.count);
                if (Number.isFinite(value)) element.textContent = value.toLocaleString();
            });
            return;
        }


        if (!revealElements.length) {
            return;
        }


        /* -----------------------------------------------
           IntersectionObserver supported
        ----------------------------------------------- */

        if ("IntersectionObserver" in window) {

            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) {
                                return;
                            }


                            const element =
                                entry.target;


                            const delay =
                                parseInt(
                                    element.dataset.delay ||
                                    "0",
                                    10
                                );


                            setTimeout(() => {

                                element.classList.add(
                                    "vmn-is-visible"
                                );

                            }, delay);


                            observer.unobserve(
                                element
                            );

                        });

                    },
                    {
                        threshold: 0.12,

                        rootMargin:
                            "0px 0px -30px 0px"
                    }
                );


            revealElements.forEach((element) => {

                revealObserver.observe(
                    element
                );

            });

        } else {

            /* -------------------------------------------
               Fallback
            ------------------------------------------- */

            revealElements.forEach((element) => {

                element.classList.add(
                    "vmn-is-visible"
                );

            });

        }


        /* =====================================================
           STAT COUNTERS
        ===================================================== */

        const counterElements =
            selectAll(
                ".vmn-stat-card__val"
            );


        if (
            !counterElements.length ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }


        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const element =
                            entry.target;


                        const targetCount =
                            parseInt(
                                element.dataset.count ||
                                "0",
                                10
                            );


                        if (
                            Number.isNaN(
                                targetCount
                            )
                        ) {

                            observer.unobserve(
                                element
                            );

                            return;

                        }


                        const duration = 1800;

                        const startTime =
                            performance.now();


                        function updateCount(
                            currentTime
                        ) {

                            const elapsed =
                                currentTime -
                                startTime;


                            const progress =
                                Math.min(
                                    elapsed /
                                    duration,
                                    1
                                );


                            const easedProgress =
                                1 -
                                Math.pow(
                                    1 -
                                    progress,
                                    3
                                );


                            const currentValue =
                                Math.floor(
                                    targetCount *
                                    easedProgress
                                );


                            element.textContent =
                                currentValue
                                    .toLocaleString();


                            if (
                                progress < 1
                            ) {

                                requestAnimationFrame(
                                    updateCount
                                );

                            } else {

                                element.textContent =
                                    targetCount
                                        .toLocaleString();

                            }

                        }


                        requestAnimationFrame(
                            updateCount
                        );


                        observer.unobserve(
                            element
                        );

                    });

                },
                {
                    threshold: 0.4
                }
            );


        counterElements.forEach(
            (counter) => {

                counterObserver.observe(
                    counter
                );

            }
        );

    }


    /* =========================================================
       BRAND LOGO CAROUSEL
    ========================================================= */

    function initBrandCarousel(root) {


        const track =
            root.querySelector(
                "[data-bc-track]"
            );


        if (!track) {
            return;
        }


        /* Prevent duplicate initialization */

        if (
            track.dataset.bcDuplicated ===
            "true"
        ) {
            return;
        }


        /* -----------------------------------------------
           Get original items
        ----------------------------------------------- */

        const originalItems =
            Array.from(
                track.querySelectorAll(
                    ".bc-brand-item"
                )
            );


        if (!originalItems.length) {
            return;
        }


        /* -----------------------------------------------
           Duplicate items
        ----------------------------------------------- */

        const fragment =
            document.createDocumentFragment();


        originalItems.forEach((item) => {


            const clone =
                item.cloneNode(true);


            /* Decorative duplicate */

            clone.setAttribute(
                "aria-hidden",
                "true"
            );


            /* Remove duplicated alt text */

            const image =
                clone.querySelector("img");


            if (image) {

                image.setAttribute(
                    "alt",
                    ""
                );

            }


            fragment.appendChild(
                clone
            );

        });


        track.appendChild(
            fragment
        );


        track.dataset.bcDuplicated =
            "true";


        /* -----------------------------------------------
           Pause
        ----------------------------------------------- */

        const pauseCarousel = () => {

            root.setAttribute(
                "data-bc-paused",
                "true"
            );

        };


        /* -----------------------------------------------
           Resume
        ----------------------------------------------- */

        const resumeCarousel = () => {

            root.setAttribute(
                "data-bc-paused",
                "false"
            );

        };


        /* -----------------------------------------------
           Mouse
        ----------------------------------------------- */

        root.addEventListener(
            "mouseenter",
            pauseCarousel
        );


        root.addEventListener(
            "mouseleave",
            resumeCarousel
        );


        /* -----------------------------------------------
           Keyboard focus
        ----------------------------------------------- */

        root.addEventListener(
            "focusin",
            pauseCarousel
        );


        root.addEventListener(
            "focusout",
            resumeCarousel
        );


        /* -----------------------------------------------
           Touch
        ----------------------------------------------- */

        root.addEventListener(
            "touchstart",
            pauseCarousel,
            {
                passive: true
            }
        );


        root.addEventListener(
            "touchend",
            resumeCarousel,
            {
                passive: true
            }
        );


        root.addEventListener(
            "touchcancel",
            resumeCarousel,
            {
                passive: true
            }
        );

    }


    /* =========================================================
       START ALL BRAND CAROUSELS
    ========================================================= */

    function startBrandCarousels() {


        const carousels =
            document.querySelectorAll(
                "[data-bc-carousel]"
            );


        carousels.forEach(
            (carousel) => {

                initBrandCarousel(
                    carousel
                );

            }
        );

    }


    /* =========================================================
       INITIALIZE EVERYTHING
    ========================================================= */

    function init() {


        /* About page */

        initAboutPage();


        /* Brand carousel */

        startBrandCarousels();


        /* Lucide icons */

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
            "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* =========================================================
       DOM READY
    ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }

})();
