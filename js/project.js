/* =====================================================================
   VIMANA CONSTRUCTION CHEMICALS — PROJECTS SECTION
   Vanilla JS (ES6). No dependencies.

   Responsibilities:
   1. Scroll reveal for the header and each project card (IntersectionObserver)
   2. Lazy image fade-in once each image has finished loading
   3. Respect prefers-reduced-motion — skip animated reveal, show content immediately
   ===================================================================== */

(() => {
  "use strict";

  const SECTION_SELECTOR = ".vmprj-section";
  const REVEAL_SELECTOR = "[data-vmprj-reveal]";
  const IMAGE_SELECTOR = ".vmprj-image";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /**
   * Scoped init — only runs against the single Projects section on the page,
   * so this script never touches markup outside its own namespace.
   */
  const init = () => {
    const section = document.querySelector(SECTION_SELECTOR);
    if (!section) return;

    setupScrollReveal(section);
    setupLazyImages(section);
  };

  /* ---------------------------------------------------------------
     Scroll reveal: fade + rise for header and cards
     --------------------------------------------------------------- */
  const setupScrollReveal = (section) => {
    const revealTargets = Array.from(
      section.querySelectorAll(REVEAL_SELECTOR)
    );

    if (revealTargets.length === 0) return;

    if (prefersReducedMotion) {
      revealTargets.forEach((el) => el.classList.add("vmprj-in-view"));
      return;
    }

    // Stagger the cards slightly for a premium, orchestrated feel.
    let cardIndex = 0;
    revealTargets.forEach((el) => {
      if (el.classList.contains("vmprj-card")) {
        const delay = Math.min(cardIndex * 60, 360); // ms, capped
        el.style.setProperty("--vmprj-delay", `${delay}ms`);
        cardIndex += 1;
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vmprj-in-view");
            obs.unobserve(entry.target); // reveal once, no re-triggering, no leaks
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.15,
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  };

  /* ---------------------------------------------------------------
     Lazy image fade-in: once the browser reports the image loaded,
     add the class that transitions it to full opacity.
     --------------------------------------------------------------- */
  const setupLazyImages = (section) => {
    const images = Array.from(section.querySelectorAll(IMAGE_SELECTOR));
    if (images.length === 0) return;

    const markLoaded = (img) => {
      img.classList.add("vmprj-loaded");
    };

    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        // Already loaded from cache before JS ran.
        markLoaded(img);
        return;
      }

      const onLoad = () => {
        markLoaded(img);
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };

      const onError = () => {
        // Even on error, drop the skeleton state so layout doesn't hang.
        markLoaded(img);
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };

      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onError, { once: true });
    });
  };

  /* ---------------------------------------------------------------
     Bootstrap — DOM may already be ready if script has `defer`.
     --------------------------------------------------------------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();