/**
 * service.js
 * Handles scroll-triggered reveal animations for the VIMANA
 * Waterproofing Services page.
 *
 * Targets:
 *  - .vmn-reveal        (hero heading/subheading, supports [data-delay])
 *  - [data-animate]     (section head + service cards: "fade-up" | "zoom-in")
 */

(function () {
    "use strict";

    // FIX: this must match the class the CSS actually looks for.
    // service.css shows revealed content via `.in-view` (see
    // `[data-animate].in-view` and `.vmn-reveal.in-view`). This was
    // previously "is-visible", a class nothing in the stylesheet
    // matched — so cards and the hero text never became visible via
    // scroll/observer and relied only on being unstyled by accident.
    const REVEAL_CLASS = "in-view";
    const OBSERVER_OPTIONS = {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
    };

    /**
     * Applies any data-delay (ms) as an inline transition-delay
     * so staggered reveals work without extra CSS classes.
     */
    function applyDelay(el) {
        const delay = el.getAttribute("data-delay");
        if (delay !== null) {
            const ms = parseInt(delay, 10);
            if (!Number.isNaN(ms)) {
                el.style.transitionDelay = `${ms}ms`;
            }
        }
    }

    /**
     * Reveals an element and stops observing it (one-shot animation).
     */
    function revealElement(el, observer) {
        el.classList.add(REVEAL_CLASS);
        if (observer) observer.unobserve(el);
    }

    function initScrollReveal() {
        const revealTargets = document.querySelectorAll(
            ".vmn-reveal, [data-animate]"
        );

        if (!revealTargets.length) return;

        // Respect users who prefer reduced motion: show everything immediately.
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        revealTargets.forEach(applyDelay);

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealTargets.forEach((el) => revealElement(el, null));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealElement(entry.target, obs);
                }
            });
        }, OBSERVER_OPTIONS);

        // Hero content is above the fold on load — reveal it right away
        // instead of waiting on a scroll/intersection event. (Also
        // avoids double-observing: elements revealed here are never
        // added to the observer below.)
        const heroReveals = new Set(
            document.querySelectorAll(".vmn-hero .vmn-reveal")
        );

        heroReveals.forEach((el) => {
            requestAnimationFrame(() => revealElement(el, null));
        });

        revealTargets.forEach((el) => {
            if (!heroReveals.has(el)) observer.observe(el);
        });
    }

    /**
     * Marks lazy-loaded card images as "loaded" once their bytes are in,
     * so card-media img.loaded can fade them in via CSS. Without this,
     * .card-media img (opacity: 0 by default) never receives the
     * .loaded class and every card thumbnail stays invisible.
     */
    function initImageLoadedState() {
        document.querySelectorAll(".card-media img").forEach((img) => {
            const markLoaded = () => img.classList.add("loaded");

            if (img.complete && img.naturalWidth > 0) {
                markLoaded();
            } else {
                img.addEventListener("load", markLoaded, { once: true });
                img.addEventListener("error", markLoaded, { once: true });
            }
        });
    }

    /**
     * Smooth scroll for the in-page "Learn More" anchor links
     * (#terrace, #basement, #bathroom, #pool, #walls, #industrial).
     *
     * NOTE: these anchor targets do not currently exist as elements
     * on the page (no id="terrace", id="basement", etc.). Until those
     * sections/pages are added, this handler intentionally falls back
     * to default link behavior (`return` below) rather than doing
     * nothing silently or throwing.
     */
    function initSmoothAnchorScroll() {
        const STICKY_OFFSET = 80;

        document.querySelectorAll('.card-link[href^="#"]').forEach((link) => {
            link.addEventListener("click", (e) => {
                const targetId = link.getAttribute("href").slice(1);
                const targetEl = document.getElementById(targetId);

                if (!targetEl) return; // no matching section yet — let default happen

                e.preventDefault();
                const top =
                    targetEl.getBoundingClientRect().top +
                    window.pageYOffset -
                    STICKY_OFFSET;

                window.scrollTo({ top, behavior: "smooth" });
            });
        });
    }

    /**
     * Adds a subtle parallax-style shift to the decorative background
     * shapes (droplet / shield / ring) as the user scrolls, purely
     * cosmetic and cheap (rAF-throttled).
     *
     * FIX: previously wrote `el.style.transform` directly, which
     * fought with the CSS `floatShape` keyframe animation also
     * running on these elements (both declarations target
     * `transform`, and the running animation wins every frame,
     * effectively cancelling the parallax offset). Now the scroll
     * offset is written to a custom property, `--vmn-parallax`, which
     * the keyframes compose with via calc().
     */
    function initDecoParallax() {
        const decos = document.querySelectorAll(".services .deco");
        if (!decos.length) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        let ticking = false;

        function update() {
            const scrollY = window.scrollY;
            decos.forEach((el, i) => {
                const speed = 0.03 + i * 0.015;
                el.style.setProperty("--vmn-parallax", `${scrollY * speed}px`);
            });
            ticking = false;
        }

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    requestAnimationFrame(update);
                    ticking = true;
                }
            },
            { passive: true }
        );
    }

    document.addEventListener("DOMContentLoaded", () => {
        initScrollReveal();
        initImageLoadedState();
        initSmoothAnchorScroll();
        initDecoParallax();
    });
})();