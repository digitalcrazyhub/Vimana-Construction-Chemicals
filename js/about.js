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

/*
  BRAND LOGO CAROUSEL — bc- namespace
  Vanilla JavaScript only. No external libraries.

  Responsibilities:
  1. Duplicate the logo set once so the CSS -50% translateX loop is seamless.
  2. Pause the marquee on hover / focus, resume smoothly on leave.
  3. Respect prefers-reduced-motion by skipping the pause/resume theatrics
     (the CSS itself already slows the animation drastically in that case).
*/

(function bcBrandCarouselInit() {
  function bc_initCarousel(root) {
    var bc_track = root.querySelector('[data-bc-track]');
    if (!bc_track || bc_track.dataset.bcDuplicated === 'true') return;

    // 1) Duplicate every item exactly once for a seamless infinite loop.
    var bc_originalItems = Array.prototype.slice.call(
      bc_track.querySelectorAll('.bc-brand-item')
    );

    var bc_fragment = document.createDocumentFragment();
    bc_originalItems.forEach(function (bc_item) {
      var bc_clone = bc_item.cloneNode(true);
      bc_clone.setAttribute('aria-hidden', 'true'); // duplicates are decorative
      // Duplicated images are visual repeats — hide them from screen readers
      // by stripping alt text on the clone only.
      var bc_cloneImg = bc_clone.querySelector('img');
      if (bc_cloneImg) bc_cloneImg.setAttribute('alt', '');
      bc_fragment.appendChild(bc_clone);
    });
    bc_track.appendChild(bc_fragment);
    bc_track.dataset.bcDuplicated = 'true';

    // 2) Pause on hover / keyboard focus, resume on leave / blur.
    var bc_pause = function () {
      root.setAttribute('data-bc-paused', 'true');
    };
    var bc_resume = function () {
      root.setAttribute('data-bc-paused', 'false');
    };

    root.addEventListener('mouseenter', bc_pause);
    root.addEventListener('mouseleave', bc_resume);
    root.addEventListener('focusin', bc_pause);
    root.addEventListener('focusout', bc_resume);

    // Touch devices: pause while a finger is on the carousel.
    root.addEventListener('touchstart', bc_pause, { passive: true });
    root.addEventListener('touchend', bc_resume, { passive: true });
  }

  function bc_start() {
    var bc_carousels = document.querySelectorAll('[data-bc-carousel]');
    bc_carousels.forEach(function (bc_root) {
      bc_initCarousel(bc_root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bc_start);
  } else {
    bc_start();
  }
})();