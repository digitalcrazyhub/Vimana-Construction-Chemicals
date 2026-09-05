 /* ==========================================
    Vimana Construction Chemicals
    script.js
 ========================================== */

const HERO_SLIDES = [
  {
    eyebrow: "Residential · Commercial · Industrial",
    title: "Protect Your Building From Water Damage",
    desc: "Premium waterproofing solutions engineered by certified experts. Trusted protection that lasts for decades — not seasons."
  },
  {
    eyebrow: "Advanced Construction Chemicals",
    title: "High-Performance Waterproofing Chemicals",
    desc: "Formulated for long-lasting protection. From liquid membranes to crystalline sealers — every product engineered for real-world performance."
  },
  {
    eyebrow: "End-to-End Protection",
    title: "Built Strong. Protected Forever.",
    desc: "Complete waterproofing solutions with expert application and premium construction chemicals — one accountable partner from inspection to warranty."
  }
];


/* ==========================================
   DOM Ready
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
      Lucide Icons
  ========================== */

  if (
    window.lucide &&
    typeof window.lucide.createIcons === "function"
  ) {
    window.lucide.createIcons();
  }


  /* ==========================
      Year
  ========================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* ==========================
      Scroll Progress
  ========================== */

  const scrollbar = document.getElementById("scrollbar");

  function updateScrollProgress() {

    if (!scrollbar) {
      return;
    }

    const scrollTop =
      window.scrollY || document.documentElement.scrollTop;

    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (documentHeight <= 0) {
      scrollbar.style.width = "0%";
      return;
    }

    const progress =
      Math.min(
        (scrollTop / documentHeight) * 100,
        100
      );

    scrollbar.style.width = `${progress}%`;
  }

  updateScrollProgress();

  window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateScrollProgress
  );


  /* ==========================
    Hero Slider
========================== */

const slideEls = document.querySelectorAll(".hero-slide");

const heroEyebrow = document.getElementById("heroEyebrow");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");

const slideNum = document.getElementById("slideNum");
const slideTotal = document.getElementById("slideTotal");

const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

const dotsEl = document.getElementById("heroDots");

let heroIndex = 0;
let heroTimer = null;


/* ==========================
    Create Dots
========================== */

if (dotsEl && HERO_SLIDES.length) {

  dotsEl.innerHTML = HERO_SLIDES.map((_, i) => `
    <button
      type="button"
      data-i="${i}"
      class="${i === 0 ? "active" : ""}"
      aria-label="Go to slide ${i + 1}">
    </button>
  `).join("");

}


/* ==========================
    Show Slide
========================== */

function showSlide(index) {

  if (!HERO_SLIDES.length || !slideEls.length) {
    return;
  }

  heroIndex =
    (index + HERO_SLIDES.length) %
    HERO_SLIDES.length;


  /* Change background slide */

  slideEls.forEach((slide, i) => {

    slide.classList.toggle(
      "active",
      i === heroIndex
    );

  });


  /* Change dots */

  if (dotsEl) {

    dotsEl
      .querySelectorAll("button")
      .forEach((button, i) => {

        button.classList.toggle(
          "active",
          i === heroIndex
        );

      });

  }


  /* Change content */

  const slide =
    HERO_SLIDES[heroIndex];

  if (heroEyebrow) {
    heroEyebrow.textContent =
      slide.eyebrow;
  }

  if (heroTitle) {
    heroTitle.textContent =
      slide.title;
  }

  if (heroDesc) {
    heroDesc.textContent =
      slide.desc;
  }


  /* Change counter */

  if (slideNum) {

    slideNum.textContent =
      String(heroIndex + 1)
        .padStart(2, "0");

  }

  if (slideTotal) {

    slideTotal.textContent =
      String(HERO_SLIDES.length)
        .padStart(2, "0");

  }

}


/* ==========================
    NEXT
========================== */

function nextSlide() {

  showSlide(heroIndex + 1);

}


/* ==========================
    PREVIOUS
========================== */

function previousSlide() {

  showSlide(heroIndex - 1);

}


/* ==========================
    AUTO SLIDER
========================== */

function startSlider() {

  clearInterval(heroTimer);

  heroTimer = setInterval(() => {

    nextSlide();

  }, 6500);

}


/* ==========================
    PREVIOUS BUTTON
========================== */

if (prevBtn) {

  prevBtn.addEventListener(
    "click",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      previousSlide();

      startSlider();

    }
  );

}


/* ==========================
    NEXT BUTTON
========================== */

if (nextBtn) {

  nextBtn.addEventListener(
    "click",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      nextSlide();

      startSlider();

    }
  );

}


/* ==========================
    DOTS
========================== */

if (dotsEl) {

  dotsEl.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest("button");

      if (!button) {
        return;
      }

      const index =
        Number(button.dataset.i);

      if (!Number.isInteger(index)) {
        return;
      }

      showSlide(index);

      startSlider();

    }
  );

}


/* ==========================
    INITIALIZE
========================== */

showSlide(0);
startSlider();


  /* ==========================
      Reveal Animation
  ========================== */

  const revealItems =
    document.querySelectorAll(".reveal");


  if (revealItems.length) {

    if (
      "IntersectionObserver" in window
    ) {

      const revealObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach(entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "in"
              );

              observer.unobserve(
                entry.target
              );

            });

          },
          {
            threshold: 0.12
          }
        );


      revealItems.forEach(item => {

        revealObserver.observe(item);

      });

    } else {

      /*
       * Fallback for browsers without
       * IntersectionObserver.
       */

      revealItems.forEach(item => {

        item.classList.add("in");

      });

    }

  }


  /* ==========================
      Counter
  ========================== */

  const counters =
    document.querySelectorAll(
      "[data-count]"
    );


  if (counters.length) {

    if (
      "IntersectionObserver" in window
    ) {

      const counterObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach(entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              const el =
                entry.target;

              const target =
                Number(
                  el.dataset.count
                );


              if (
                !Number.isFinite(target)
              ) {
                observer.unobserve(el);
                return;
              }


              const duration = 1600;

              const start =
                performance.now();


              function animate(now) {

                const progress =
                  Math.min(
                    (now - start) /
                    duration,
                    1
                  );


                const eased =
                  1 -
                  Math.pow(
                    1 - progress,
                    3
                  );


                el.textContent =
                  Math.floor(
                    target * eased
                  ).toLocaleString();


                if (progress < 1) {

                  requestAnimationFrame(
                    animate
                  );

                } else {

                  el.textContent =
                    target.toLocaleString();

                }

              }


              requestAnimationFrame(
                animate
              );


              observer.unobserve(el);

            });

          },
          {
            threshold: 0.4
          }
        );


      counters.forEach(counter => {

        counterObserver.observe(
          counter
        );

      });

    } else {

      /*
       * Fallback for browsers without
       * IntersectionObserver.
       */

      counters.forEach(counter => {

        const target =
          Number(
            counter.dataset.count
          );

        if (
          Number.isFinite(target)
        ) {

          counter.textContent =
            target.toLocaleString();

        }

      });

    }

  }

});
