  /**
     * Awards & Recognition Section - Scroll Animation & Interactive Observer
     * Uses native Intersection Observer API with zero external dependencies.
     */
    (function initAwardsSection() {
      'use strict';

      document.addEventListener('DOMContentLoaded', function () {
        const animatedElements = document.querySelectorAll('.award-animate');

        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
          const observerOptions = {
            root: null, // viewport
            rootMargin: '0px 0px -50px 0px', // trigger slightly before entering view
            threshold: 0.15 // 15% visibility required
          };

          const awardsObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve once animated to boost performance
                observer.unobserve(entry.target);
              }
            });
          }, observerOptions);

          animatedElements.forEach(function (el) {
            awardsObserver.observe(el);
          });
        } else {
          // Fallback for older browsers without IntersectionObserver
          animatedElements.forEach(function (el) {
            el.classList.add('is-visible');
          });
        }
      });
    })();