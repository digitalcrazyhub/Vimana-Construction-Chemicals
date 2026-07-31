const productGallery = {
  product1: [
    "/assets/p1.jpg",
    "/assets/p2.jpg",
    "/assets/p3.jpg",
    "/assets/p4.jpg"
  ]
};

const pitvmxLightbox = document.getElementById("pitvmxLightbox");
const pitvmxLightboxImage = document.querySelector(".pitvmx-lightbox-image");
const closeBtn = document.querySelector(".pitvmx-lightbox-close");
const nextBtn = document.querySelector(".pitvmx-lightbox-next");
const prevBtn = document.querySelector(".pitvmx-lightbox-prev");

let pitvmxImages = [];
let pitvmxIndex = 0;

/*==========================
Open Gallery
==========================*/

document.querySelectorAll(".pitvmx-gallery-image").forEach(img => {

  img.addEventListener("click", () => {

    const product = img.dataset.product;

    if (!productGallery[product]) return;

    pitvmxImages = productGallery[product];

    pitvmxIndex = 0;

    updateImage();

    pitvmxLightbox.classList.add("pitvmx-open");

    document.body.style.overflow = "hidden";

  });

});

/*==========================
Update Image
==========================*/

function updateImage() {

  pitvmxLightboxImage.src = pitvmxImages[pitvmxIndex];

}

/*==========================
Next
==========================*/

function nextImage() {

  pitvmxIndex++;

  if (pitvmxIndex >= pitvmxImages.length) {

    pitvmxIndex = 0;

  }

  updateImage();

}

/*==========================
Previous
==========================*/

function prevImage() {

  pitvmxIndex--;

  if (pitvmxIndex < 0) {

    pitvmxIndex = pitvmxImages.length - 1;

  }

  updateImage();

}

/*==========================
Close
==========================*/

function closeGallery() {

  pitvmxLightbox.classList.remove("pitvmx-open");

  document.body.style.overflow = "";

}

nextBtn.addEventListener("click", nextImage);

prevBtn.addEventListener("click", prevImage);

closeBtn.addEventListener("click", closeGallery);

/*==========================
Keyboard
==========================*/

document.addEventListener("keydown", e => {

  if (!pitvmxLightbox.classList.contains("pitvmx-open")) return;

  if (e.key === "ArrowRight") {

    nextImage();

  }

  if (e.key === "ArrowLeft") {

    prevImage();

  }

  if (e.key === "Escape") {

    closeGallery();

  }

});

/*==========================
Click Outside
==========================*/

pitvmxLightbox.addEventListener("click", e => {

  if (e.target === pitvmxLightbox) {

    closeGallery();

  }

});