(() => {
  "use strict";

  const slides = [
    {
      eyebrow: "Residential · Commercial · Industrial",
      title: "Protect Your Building From Water Damage",
      desc: "Premium waterproofing solutions engineered by certified experts. Trusted protection that lasts for decades — not seasons."
    },
    {
      eyebrow: "Advanced Construction Chemicals",
      title: "High-Performance Waterproofing Chemicals",
      desc: "Formulated for long-lasting protection. From liquid membranes to crystalline sealers — every product is engineered for real-world performance."
    },
    {
      eyebrow: "End-to-End Protection",
      title: "Built Strong. Protected For Longer.",
      desc: "Complete waterproofing solutions with expert application and premium construction chemicals — one accountable partner from inspection to warranty."
    }
  ];

  const ready = (callback) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  };

  const initScrollProgress = () => {
    const bar = document.getElementById("scrollbar");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? (Math.min(window.scrollY / max, 1) * 100) + "%" : "0%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  };

  const initHero = () => {
    const slideElements = [...document.querySelectorAll(".hero-slide")];
    if (!slideElements.length) return;

    const dots = document.getElementById("heroDots");
    const previous = document.getElementById("prevSlide");
    const next = document.getElementById("nextSlide");
    const eyebrow = document.getElementById("heroEyebrow");
    const title = document.getElementById("heroTitle");
    const description = document.getElementById("heroDesc");
    const number = document.getElementById("slideNum");
    const total = document.getElementById("slideTotal");
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let timer = 0;
    let paused = reducedMotion;

    if (dots) {
      dots.replaceChildren(...slides.map((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.index = String(index);
        button.setAttribute("aria-label", "Show slide " + (index + 1));
        return button;
      }));
    }

    const render = (index) => {
      current = (index + slides.length) % slides.length;
      slideElements.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots?.querySelectorAll("button").forEach((button, i) => {
        const active = i === current;
        button.classList.toggle("active", active);
        button.setAttribute("aria-current", active ? "true" : "false");
      });
      const slide = slides[current];
      if (eyebrow) eyebrow.textContent = slide.eyebrow;
      if (title) title.textContent = slide.title;
      if (description) description.textContent = slide.desc;
      if (number) number.textContent = String(current + 1).padStart(2, "0");
      if (total) total.textContent = String(slides.length).padStart(2, "0");
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    const start = () => {
      stop();
      if (paused || slides.length < 2) return;
      timer = window.setInterval(() => render(current + 1), 6500);
    };

    const move = (step) => {
      render(current + step);
      start();
    };

    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    dots?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (button) {
        render(Number(button.dataset.index));
        start();
      }
    });

    const hero = document.querySelector(".hero");
    hero?.addEventListener("mouseenter", () => { paused = true; stop(); });
    hero?.addEventListener("mouseleave", () => { paused = reducedMotion; start(); });
    hero?.addEventListener("focusin", () => { paused = true; stop(); });
    hero?.addEventListener("focusout", (event) => {
      if (!hero.contains(event.relatedTarget)) {
        paused = reducedMotion;
        start();
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    hero?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });

    render(0);
    start();
  };

  const initReveal = () => {
    const items = [...document.querySelectorAll(".reveal")];
    if (!items.length) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  };

  const initCounters = () => {
    const counters = [...document.querySelectorAll("[data-count]")];
    if (!counters.length) return;
    const setFinal = (element) => {
      const value = Number(element.dataset.count);
      if (Number.isFinite(value)) element.textContent = value.toLocaleString();
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      counters.forEach(setFinal);
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const startTime = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - startTime) / 1200, 1);
          element.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
          if (progress < 1) requestAnimationFrame(animate);
          else setFinal(element);
        };
        if (Number.isFinite(target)) requestAnimationFrame(animate);
        instance.unobserve(element);
      });
    }, { threshold: 0.4 });
    counters.forEach((counter) => observer.observe(counter));
  };

  ready(() => {
    if (window.lucide?.createIcons) window.lucide.createIcons();
    initScrollProgress();
    initHero();
    initReveal();
    initCounters();
  });
})();
