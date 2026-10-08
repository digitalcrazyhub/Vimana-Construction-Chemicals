(() => {
  "use strict";

  const init = () => {
    const header = document.getElementById("vmHeader");
    const menuButton = document.getElementById("vmMenuBtn");
    const mobileMenu = document.getElementById("vmMobileMenu");
    const year = document.getElementById("vmYear") || document.getElementById("year");
    const toTop = document.getElementById("toTop");
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (year) year.textContent = String(new Date().getFullYear());
    if (window.lucide?.createIcons) window.lucide.createIcons();

    let lastMenuFocus = null;

    const setSubmenus = (open) => {
      mobileMenu?.querySelectorAll(".vm-mobile-dropdown").forEach((item) => {
        item.classList.toggle("vm-open-sub", open && item === open);
        item.querySelector(".vm-mobile-toggle")?.setAttribute("aria-expanded", String(open && item === open));
      });
    };

    const closeMenu = ({ returnFocus = false } = {}) => {
      if (!mobileMenu || !menuButton) return;
      mobileMenu.classList.remove("vm-open");
      mobileMenu.setAttribute("aria-hidden", "true");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      document.body.classList.remove("vm-menu-open");
      setSubmenus(null);
      if (returnFocus) (lastMenuFocus || menuButton).focus();
      lastMenuFocus = null;
    };

    const openMenu = () => {
      if (!mobileMenu || !menuButton) return;
      lastMenuFocus = document.activeElement;
      mobileMenu.classList.add("vm-open");
      mobileMenu.setAttribute("aria-hidden", "false");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation");
      document.body.classList.add("vm-menu-open");
      mobileMenu.querySelector("a, button")?.focus();
    };

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        if (mobileMenu.classList.contains("vm-open")) closeMenu({ returnFocus: true });
        else openMenu();
      });

      mobileMenu.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) closeMenu();

        const toggle = event.target.closest(".vm-mobile-toggle");
        if (toggle) {
          const parent = toggle.closest(".vm-mobile-dropdown");
          if (!parent) return;
          setSubmenus(parent.classList.contains("vm-open-sub") ? null : parent);
        }
      });

      document.addEventListener("click", (event) => {
        if (mobileMenu.classList.contains("vm-open") && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
          closeMenu();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (!mobileMenu.classList.contains("vm-open")) return;
        if (event.key === "Escape") {
          event.preventDefault();
          closeMenu({ returnFocus: true });
          return;
        }
        if (event.key !== "Tab") return;
        const focusable = [...mobileMenu.querySelectorAll("a, button")].filter((el) => !el.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 992) closeMenu();
      }, { passive: true });
    }

    if (header) {
      const updateHeader = () => header.classList.toggle("vm-scrolled", window.scrollY > 24);
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });
    }

    if (toTop) {
      const updateTopButton = () => toTop.classList.toggle("show", window.scrollY > 320);
      updateTopButton();
      window.addEventListener("scroll", updateTopButton, { passive: true });
      toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
