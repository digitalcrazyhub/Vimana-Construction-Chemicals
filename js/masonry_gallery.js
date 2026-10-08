/* =========================================================
   VIMANA — MASONRY GALLERY JAVASCRIPT
   Fully scoped / no global class conflicts
========================================================= */

(function () {

    "use strict";

    const gallery = document.getElementById("vimanaProjectGallery");

    if (!gallery) return;


    /* -----------------------------------------------------
       Elements
    ----------------------------------------------------- */

    const items = Array.from(
        gallery.querySelectorAll(".vpg-item")
    );

    const lightbox = gallery.querySelector("#vpgLightbox");

    const lightboxImage =
        gallery.querySelector("#vpgLightboxImage");

    const lightboxTitle =
        gallery.querySelector("#vpgLightboxTitle");

    const lightboxCategory =
        gallery.querySelector("#vpgLightboxCategory");

    const currentNumber =
        gallery.querySelector("#vpgCurrentNumber");

    const totalNumber =
        gallery.querySelector("#vpgTotalNumber");

    const closeButton =
        gallery.querySelector("#vpgLightboxClose");

    const previousButton =
        gallery.querySelector("#vpgLightboxPrev");

    const nextButton =
        gallery.querySelector("#vpgLightboxNext");

    const imageWrap =
        gallery.querySelector(".vpg-lightbox-image-wrap");

    const countElement =
        gallery.querySelector("#vpgProjectCount");

    if (!lightbox || !lightboxImage || !lightboxTitle ||
        !lightboxCategory || !currentNumber || !closeButton ||
        !previousButton || !nextButton || !imageWrap) {
        return;
    }


    /* -----------------------------------------------------
       Project Data
    ----------------------------------------------------- */

    const projects = items.map((item) => {

        const thumbnail = item.querySelector("img");
        const image = item.dataset.image || (thumbnail && thumbnail.currentSrc) || (thumbnail && thumbnail.src) || "";

        const title = item.dataset.title || (thumbnail && thumbnail.alt) || "";

        const category = item.dataset.category || "";

        return {
            image,
            title,
            category
        };

    });


    let currentIndex = 0;

    let previousBodyOverflow = "";

    let touchStartX = 0;

    let touchStartY = 0;


    /* -----------------------------------------------------
       Total Count
    ----------------------------------------------------- */

    if (countElement) {

        countElement.textContent =
            String(projects.length).padStart(2, "0");

    }

    if (totalNumber) {

        totalNumber.textContent =
            String(projects.length).padStart(2, "0");

    }


    /* -----------------------------------------------------
       Open Lightbox
    ----------------------------------------------------- */

    function openLightbox(index) {

        if (!projects.length) return;

        currentIndex = normalizeIndex(index);

        updateLightbox();

        previousBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        lightbox.classList.add("is-open");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        closeButton.focus();

    }


    /* -----------------------------------------------------
       Close Lightbox
    ----------------------------------------------------- */

    function closeLightbox() {

        lightbox.classList.remove("is-open");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            previousBodyOverflow;

        /*
         * Clear image after transition.
         * This prevents old image flashes.
         */
        window.setTimeout(function () {

            if (!lightbox.classList.contains("is-open")) {

                lightboxImage.src = "";

            }

        }, 350);

    }


    /* -----------------------------------------------------
       Normalize Index
    ----------------------------------------------------- */

    function normalizeIndex(index) {

        if (index < 0) {

            return projects.length - 1;

        }

        if (index >= projects.length) {

            return 0;

        }

        return index;

    }


    /* -----------------------------------------------------
       Update Lightbox
    ----------------------------------------------------- */

    function updateLightbox() {

        const project = projects[currentIndex];

        if (!project) return;


        /*
         * Reset loading state
         */

        imageWrap.classList.add("is-loading");

        lightboxImage.style.opacity = "0";


        /*
         * Fade old image slightly
         */

        lightboxImage.style.transform =
            "scale(.97)";


        /*
         * Create a new image.
         * This gives smoother navigation.
         */

        const preload = new Image();

        preload.onload = function () {

            lightboxImage.src = project.image;

            lightboxImage.alt = project.title;

            imageWrap.classList.remove(
                "is-loading"
            );

            requestAnimationFrame(function () {

                lightboxImage.style.opacity = "1";

                lightboxImage.style.transform =
                    "scale(1)";

            });

        };


        preload.onerror = function () {

            imageWrap.classList.remove(
                "is-loading"
            );

            lightboxImage.style.opacity = "1";

        };


        preload.src = project.image;


        /*
         * Text
         */

        lightboxTitle.textContent =
            project.title;

        lightboxCategory.textContent =
            project.category.toUpperCase();


        /*
         * Counter
         */

        currentNumber.textContent =
            String(currentIndex + 1).padStart(2, "0");

    }


    /* -----------------------------------------------------
       Next Image
    ----------------------------------------------------- */

    function showNext() {

        currentIndex =
            normalizeIndex(currentIndex + 1);

        updateLightbox();

    }


    /* -----------------------------------------------------
       Previous Image
    ----------------------------------------------------- */

    function showPrevious() {

        currentIndex =
            normalizeIndex(currentIndex - 1);

        updateLightbox();

    }


    /* -----------------------------------------------------
       Gallery Click
    ----------------------------------------------------- */

    items.forEach(function (item, index) {

        item.addEventListener(
            "click",
            function () {

                openLightbox(index);

            }
        );

    });


    /* -----------------------------------------------------
       Controls
    ----------------------------------------------------- */

    closeButton.addEventListener(
        "click",
        closeLightbox
    );

    nextButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            showNext();

        }
    );

    previousButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            showPrevious();

        }
    );


    /* -----------------------------------------------------
       Click Outside Image
    ----------------------------------------------------- */

    lightbox.addEventListener(
        "click",
        function (event) {

            /*
             * Only close when clicking the backdrop.
             */

            if (
                event.target === lightbox ||
                event.target.classList.contains(
                    "vpg-lightbox-backdrop"
                )
            ) {

                closeLightbox();

            }

        }
    );


    /* -----------------------------------------------------
       Keyboard Controls
    ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        function (event) {

            if (!lightbox.classList.contains("is-open")) {
                return;
            }


            if (event.key === "Escape") {

                closeLightbox();

            }


            if (event.key === "ArrowRight") {

                event.preventDefault();

                showNext();

            }


            if (event.key === "ArrowLeft") {

                event.preventDefault();

                showPrevious();

            }

        }
    );


    /* -----------------------------------------------------
       Touch / Swipe
    ----------------------------------------------------- */

    lightbox.addEventListener(
        "touchstart",
        function (event) {

            if (!event.changedTouches.length) {
                return;
            }

            touchStartX =
                event.changedTouches[0].screenX;

            touchStartY =
                event.changedTouches[0].screenY;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        function (event) {

            if (!event.changedTouches.length) {
                return;
            }

            const touchEndX =
                event.changedTouches[0].screenX;

            const touchEndY =
                event.changedTouches[0].screenY;

            const differenceX =
                touchEndX - touchStartX;

            const differenceY =
                touchEndY - touchStartY;


            /*
             * Ignore mostly vertical gestures.
             */

            if (
                Math.abs(differenceX) >
                Math.abs(differenceY)
            ) {

                /*
                 * Minimum swipe distance
                 */

                if (Math.abs(differenceX) < 50) {
                    return;
                }


                if (differenceX < 0) {

                    showNext();

                } else {

                    showPrevious();

                }

            }

        },
        {
            passive: true
        }
    );


    /* -----------------------------------------------------
       Preload Neighbor Images
    ----------------------------------------------------- */

    function preloadNeighbors() {

        if (!projects.length) return;

        const nextIndex =
            normalizeIndex(currentIndex + 1);

        const previousIndex =
            normalizeIndex(currentIndex - 1);


        [nextIndex, previousIndex].forEach(
            function (index) {

                const img = new Image();

                img.src = projects[index].image;

            }
        );

    }


    /*
     * Extend update function to preload neighbors.
     */

    const originalUpdate = updateLightbox;

    updateLightbox = function () {

        originalUpdate();

        window.setTimeout(
            preloadNeighbors,
            150
        );

    };


})();
