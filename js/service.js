/* =========================================================
   VIMANA — About Page Interactions
   Vanilla JS: nav, reveal, counters, bars, burger, year
   ========================================================= */
(function () {
    "use strict";

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // -------- Year --------
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();

    // -------- Nav shadow on scroll --------
    const nav = $("#nav");
    const onScroll = () => {
        if (!nav) return;
        nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // -------- Mobile burger (simple toggle for nav links) --------
    const burger = $("#burger");
    const links = $(".nav__links");
    if (burger && links) {
        burger.addEventListener("click", () => {
            const open = links.classList.toggle("is-open");
            Object.assign(links.style, open
                ? {
                    display: "flex",
                    position: "fixed",
                    inset: "76px 0 auto 0",
                    background: "rgba(255,255,255,0.98)",
                    flexDirection: "column",
                    gap: "0",
                    padding: "10px 20px 20px",
                    borderBottom: "1px solid var(--line)",
                    boxShadow: "var(--shadow-md)",
                }
                : { display: "" });
        });
        // close on link click
        $$(".nav__links a").forEach((a) =>
            a.addEventListener("click", () => {
                if (links.classList.contains("is-open")) burger.click();
            })
        );
    }

    // -------- Reveal on scroll --------
    const revealEls = $$(".reveal");
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const delay = parseInt(el.dataset.delay || "0", 10);
                setTimeout(() => el.classList.add("is-visible"), delay);
                io.unobserve(el);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    // -------- Counters --------
    const counters = $$(".counter__num");
    const cio = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const target = parseInt(el.dataset.count || "0", 10);
                const duration = 1800;
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(target * eased).toLocaleString();
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = target.toLocaleString();
                };
                requestAnimationFrame(tick);
                cio.unobserve(el);
            });
        },
        { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));

    // -------- Progress bars --------
    const bars = $$(".bar__fill");
    const bio = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                const v = parseInt(el.dataset.fill || "0", 10);
                requestAnimationFrame(() => (el.style.width = v + "%"));
                // Sync label percentage
                const label = el.closest(".bar").querySelector(".bar__label b");
                if (label) {
                    const target = parseInt(label.dataset.value || "0", 10);
                    const start = performance.now();
                    const duration = 1600;
                    const tick = (now) => {
                        const p = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        label.textContent = Math.floor(target * eased) + "%";
                        if (p < 1) requestAnimationFrame(tick);
                        else label.textContent = target + "%";
                    };
                    requestAnimationFrame(tick);
                }
                bio.unobserve(el);
            });
        },
        { threshold: 0.3 }
    );
    bars.forEach((b) => bio.observe(b));
})();
