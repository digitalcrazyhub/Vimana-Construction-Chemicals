/* =========================================================
   VIMANA - Services Page
   ========================================================= */

(() => {

    "use strict";

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    /*=================================================
      Reveal Animation
    =================================================*/

    const animateItems = $$("[data-animate]");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("in-view");

                observer.unobserve(entry.target);

            });

        }, {

            threshold: 0.15,

            rootMargin: "0px 0px -80px 0px"

        });

        animateItems.forEach(item => observer.observe(item));

    } else {

        animateItems.forEach(item => {

            item.classList.add("in-view");

        });

    }

    /*=================================================
      Smooth Scroll
    =================================================*/

    $$('a[href^="#"]').forEach(link => {

        link.addEventListener("click", e => {

            const targetID = link.getAttribute("href");

            if (targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

    /*=================================================
      Button Ripple
    =================================================*/

    $$(".btn").forEach(button => {

        button.addEventListener("click", function (e) {

            const ripple = document.createElement("span");

            ripple.className = "ripple";

            const rect = this.getBoundingClientRect();

            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + "px";

            ripple.style.left =

                e.clientX - rect.left - size / 2 + "px";

            ripple.style.top =

                e.clientY - rect.top - size / 2 + "px";

            this.appendChild(ripple);

            ripple.addEventListener("animationend", () => {

                ripple.remove();

            });

        });

    });

    /*=================================================
      Floating Background Parallax
    =================================================*/

    const blobs = $$(".blob");

    window.addEventListener("mousemove", e => {

        const x = e.clientX / window.innerWidth;

        const y = e.clientY / window.innerHeight;

        blobs.forEach((blob, index) => {

            const speed = (index + 1) * 12;

            blob.style.transform =

                `translate(${x * speed}px, ${y * speed}px)`;

        });

    });

    /*=================================================
      Hero Floating Shapes
    =================================================*/

    const shapes = $$(".float-shape");

    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;

        shapes.forEach((shape, index) => {

            const speed = (index + 1) * 0.15;

            shape.style.transform =

                `translateY(${scroll * speed}px)`;

        });

    }, {

        passive: true

    });

    /*=================================================
      Card Hover Enhancement
    =================================================*/

    const cards = $$(".service-card");

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;

            card.style.setProperty("--x", x + "px");

            card.style.setProperty("--y", y + "px");

        });

    });

    /*=================================================
      Lazy Image Fade
    =================================================*/

    $$("img[loading='lazy']").forEach(img => {

        if (img.complete) {

            img.classList.add("loaded");

        } else {

            img.addEventListener("load", () => {

                img.classList.add("loaded");

            });

        }

    });

    /*=================================================
      Back to Top (optional)
    =================================================*/

    const topButton = document.createElement("button");

    topButton.className = "scroll-top";

    topButton.innerHTML = "↑";

    document.body.appendChild(topButton);

    window.addEventListener("scroll", () => {

        topButton.classList.toggle(

            "show",

            window.scrollY > 500

        );

    });

    topButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

})();