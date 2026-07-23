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

  if (window.lucide) {
    lucide.createIcons();
  }

  /* ==========================
      Year
  ========================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ==========================
      Hero Slider
  ========================== */

  const slideEls = document.querySelectorAll(".hero-slide");

  const heroEyebrow = document.getElementById("heroEyebrow");
  const heroTitle = document.getElementById("heroTitle");
  const heroDesc = document.getElementById("heroDesc");
  const slideNum = document.getElementById("slideNum");

  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  const dotsEl = document.getElementById("heroDots");

  let heroIndex = 0;
  let heroTimer;

  if (dotsEl) {

    dotsEl.innerHTML = HERO_SLIDES.map((_, i) => `
        <button
            data-i="${i}"
            class="${i === 0 ? "active" : ""}"
            aria-label="Slide ${i + 1}">
        </button>
    `).join("");

  }

  function showSlide(index) {

    heroIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;

    slideEls.forEach((slide, i) => {
      slide.classList.toggle("active", i === heroIndex);
    });

    if (dotsEl) {
      dotsEl.querySelectorAll("button").forEach((btn, i) => {
        btn.classList.toggle("active", i === heroIndex);
      });
    }

    const slide = HERO_SLIDES[heroIndex];

    if (heroEyebrow) heroEyebrow.textContent = slide.eyebrow;
    if (heroTitle) heroTitle.textContent = slide.title;
    if (heroDesc) heroDesc.textContent = slide.desc;
    if (slideNum) slideNum.textContent = String(heroIndex + 1).padStart(2, "0");
  }

  function nextSlide() {
    showSlide(heroIndex + 1);
  }

  function startSlider() {

    clearInterval(heroTimer);

    heroTimer = setInterval(nextSlide, 6500);

  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(heroIndex - 1);
      startSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startSlider();
    });
  }

  if (dotsEl) {

    dotsEl.addEventListener("click", (e) => {

      const btn = e.target.closest("button");

      if (!btn) return;

      showSlide(Number(btn.dataset.i));

      startSlider();

    });

  }

  showSlide(0);
  startSlider();

  /* ==========================
      Scroll Progress
  ========================== 

  const navbar = document.getElementById("navbar");
  const scrollbar = document.getElementById("scrollbar");
  const toTop = document.getElementById("toTop");

  function handleScroll() {

    const doc = document.documentElement;

    const scrollTop = doc.scrollTop;

    const total = doc.scrollHeight - doc.clientHeight;

    const percent = total > 0 ? (scrollTop / total) * 100 : 0;

    if (scrollbar) {
      scrollbar.style.width = percent + "%";
    }

    if (navbar) {
      navbar.classList.toggle("scrolled", scrollTop > 40);
    }

    if (toTop) {
      toTop.classList.toggle("show", scrollTop > 400);
    }

  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  handleScroll();

  /* ==========================
      Back To Top
  ========================== */

  if (toTop) {

    toTop.addEventListener("click", () => {

      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    });

  }

  /* ==========================
      Mobile Menu
  ==========================

  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileToggle && mobileMenu) {

    mobileToggle.addEventListener("click", () => {

      mobileMenu.classList.toggle("open");

    });

    mobileMenu.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

      });

    });

  }

  /* ==========================
      Reveal Animation
  ========================== */

  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("in");

        observer.unobserve(entry.target);

      });

    }, {

      threshold: 0.12

    });

    revealItems.forEach(item => {

      revealObserver.observe(item);

    });

  }

  /* ==========================
      Counter
  ========================== */

  const counters = document.querySelectorAll("[data-count]");

  if (counters.length) {

    const counterObserver = new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const el = entry.target;

        const target = Number(el.dataset.count);

        if (isNaN(target)) return;

        const duration = 1600;

        const start = performance.now();

        function animate(now) {

          const progress = Math.min((now - start) / duration, 1);

          const eased = 1 - Math.pow(1 - progress, 3);

          el.textContent = Math.floor(target * eased).toLocaleString();

          if (progress < 1) {

            requestAnimationFrame(animate);

          } else {

            el.textContent = target.toLocaleString();

          }

        }

        requestAnimationFrame(animate);

        observer.unobserve(el);

      });

    }, {

      threshold: 0.4

    });

    counters.forEach(counter => {

      counterObserver.observe(counter);

    });

  }

});