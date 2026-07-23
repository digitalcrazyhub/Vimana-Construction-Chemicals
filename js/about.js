/**
 * VIMANA — About Page Interactions & Animations
 * Features: Dynamic scroll reveals, counter increments, progress bar fills
 */
(function () {
    "use strict";

    // Utility DOM helpers
    const select = (selector, context = document) => context.querySelector(selector);
    const selectAll = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    // Dynamic Year Injection
    const yearEl = select("#vmn-current-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear().toString();
    }

    // Scroll Reveal Observer
    const revealElements = selectAll(".vmn-reveal");
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const element = entry.target;
                    const delay = parseInt(element.dataset.delay || "0", 10);
                    
                    setTimeout(() => {
                        element.classList.add("vmn-is-visible");
                    }, delay);

                    observer.unobserve(element);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    }

    // Counter Increment Observer
    const counterElements = selectAll(".vmn-stat-card__val");
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const element = entry.target;
                    const targetCount = parseInt(element.dataset.count || "0", 10);
                    const duration = 1800;
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Cubic ease-out
                        const easedProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(targetCount * easedProgress);

                        element.textContent = currentVal.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            element.textContent = targetCount.toLocaleString();
                        }
                    };

                    requestAnimationFrame(updateCount);
                    observer.unobserve(element);
                });
            },
            { threshold: 0.4 }
        );

        counterElements.forEach((counter) => counterObserver.observe(counter));
    }

    // Animated Skill Progress Bars Observer
    const fillElements = selectAll(".vmn-skill-item__fill");
    if (fillElements.length > 0) {
        const barObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const barFill = entry.target;
                    const fillValue = parseInt(barFill.dataset.fill || "0", 10);

                    requestAnimationFrame(() => {
                        barFill.style.width = `${fillValue}%`;
                    });

                    // Sync corresponding text label percentage
                    const parentContainer = barFill.closest(".vmn-skill-item");
                    if (parentContainer) {
                        const labelValue = parentContainer.querySelector(".vmn-skill-item__label b");
                        if (labelValue) {
                            const targetVal = parseInt(labelValue.dataset.value || "0", 10);
                            const startTime = performance.now();
                            const duration = 1600;

                            const updateLabel = (now) => {
                                const elapsed = now - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const easedProgress = 1 - Math.pow(1 - progress, 3);
                                const currentNumber = Math.floor(targetVal * easedProgress);

                                labelValue.textContent = `${currentNumber}%`;

                                if (progress < 1) {
                                    requestAnimationFrame(updateLabel);
                                } else {
                                    labelValue.textContent = `${targetVal}%`;
                                }
                            };

                            requestAnimationFrame(updateLabel);
                        }
                    }

                    observer.unobserve(barFill);
                });
            },
            { threshold: 0.3 }
        );

        fillElements.forEach((bar) => barObserver.observe(bar));
    }
})();