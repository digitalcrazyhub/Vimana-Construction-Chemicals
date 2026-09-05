/* =========================================================
   VIMANA — GOOGLE REVIEW CAROUSEL
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const track =
    document.getElementById("vimanaReviewsTrack");

  const prevButton =
    document.getElementById("vimanaReviewPrev");

  const nextButton =
    document.getElementById("vimanaReviewNext");

  const dotsContainer =
    document.getElementById("vimanaReviewDots");


  if (!track || !prevButton || !nextButton) {
    return;
  }


  /* =======================================================
     REVIEW DATA
     ======================================================= */

  const vimanaReviews = [

    {
      name: "Devendran Muthaiyan",
      rating: 5,
      review:
        "This is one of the best waterproofing chemical shops in Chennai. we purchase waterproofing chemicals in this shop for my uncle home, the product and services are too good."
    },

    {
      name: "Dinesh Kumar",
      rating: 5,
      review:
        "VIMANA Construction Chemicals provides excellent quality products at very competitive prices. The performance and durability of the materials are impressive. Compared to other stores, their pricing is more affordable. I would definitely recommend them for construction chemical needs."
    },

    {
      name: "CHANDRU R",
      rating: 5,
      review:
        "Best place to buy waterproofing chemicals and repair compounds. I found everything I needed in one shop. The quality is reliable and works as promised. Recommended for civil contractors and building maintenance work."
    },

    {
      name: "Harsha Murugesh",
      rating: 5,
      review:
        "Best place to buy your construction chemicals. This team guides us well and assure us with top quality products and best supports"
    },

    {
      name: "Anbazhagan A",
      rating: 5,
      review:
        "All branded waterproofing chemicals available. Recently bought fosroc conplast with best price & also with MTC certificate 👏 thanks to mr.perumal sir for suggestions."
    },

    {
      name: "Mani Saravanan",
      rating: 5,
      review:
        "All color shades of myk sp 100 epoxy filler powders available at this shop. Also they technically helping us during the application process."
    },

    {
      name: "Vijai Aadhithya",
      rating: 5,
      review:
        "Recently purchased bostik elastocoat material from this shop. Thanks for the recommendation of this quality product, which we applied at our home terrace in padappai."
    },

    {
      name: "Stalin mlmrma",
      rating: 5,
      review:
        "Chemical all are good in quality... Bought bostik boscolastic for my site and had a proper explanations about the chemical uses satisfied with their service from the manager laxman 👍🏻"
    },

    {
      name: "Sabir sabir",
      rating: 5,
      review:
        "Thanks for suggesting the chemical apt for the issue I've addressed. Also received the bostik boscolastic waterproofing material with best price & timely delivery."
    },

    {
      name: "Mani Sanjana",
      rating: 5,
      review:
        "All products are of excellent quality and offered at the best prices in the market."
    }

  ];


  let currentIndex = 0;


  /* =======================================================
     GET VISIBLE CARDS
     ======================================================= */

  function getVisibleCards() {

    if (window.innerWidth <= 600) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;

  }


  /* =======================================================
     GET MAX INDEX
     ======================================================= */

  function getMaxIndex() {

    return Math.max(
      0,
      vimanaReviews.length - getVisibleCards()
    );

  }


  /* =======================================================
     CREATE STARS
     ======================================================= */

  function createStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

      stars +=
        i <= rating
          ? "★"
          : "☆";

    }

    return stars;

  }


  /* =======================================================
     GET INITIAL
     ======================================================= */

  function getInitial(name) {

    return name
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  /* =======================================================
     CREATE REVIEW CARD
     ======================================================= */

  function createReviewCard(review) {

    const card =
      document.createElement("article");

    card.className =
      "vimana-review-card";

    card.innerHTML = `

      <div class="vimana-review-header">

        <div class="vimana-review-avatar">
          ${getInitial(review.name)}
        </div>

        <div class="vimana-review-user">

          <h3 class="vimana-review-name">
            ${review.name}
          </h3>

          <span class="vimana-review-source">
            Google Review
          </span>

        </div>

      </div>


      <div
        class="vimana-review-stars"
        aria-label="${review.rating} out of 5 stars"
      >
        ${createStars(review.rating)}
      </div>


      <p class="vimana-review-text">
        ${review.review}
      </p>


      <div class="vimana-review-google-badge">
        Google
      </div>

    `;

    return card;

  }


  /* =======================================================
     RENDER REVIEWS
     ======================================================= */

  function renderReviews() {

    track.innerHTML = "";

    vimanaReviews.forEach(function (review) {

      track.appendChild(
        createReviewCard(review)
      );

    });

  }


  /* =======================================================
     CREATE DOTS
     ======================================================= */

  function createDots() {

    dotsContainer.innerHTML = "";

    const maxIndex = getMaxIndex();

    for (let i = 0; i <= maxIndex; i++) {

      const dot =
        document.createElement("button");

      dot.type = "button";

      dot.className =
        "vimana-review-dot";

      dot.setAttribute(
        "aria-label",
        `Go to review ${i + 1}`
      );

      dot.addEventListener(
        "click",
        function () {

          currentIndex = i;

          updateCarousel();

        }
      );

      dotsContainer.appendChild(dot);

    }

  }


  /* =======================================================
     UPDATE CAROUSEL
     ======================================================= */

  function updateCarousel() {

    const cards =
      track.querySelectorAll(
        ".vimana-review-card"
      );

    if (!cards.length) {
      return;
    }


    const firstCard =
      cards[0];

    const cardWidth =
      firstCard.getBoundingClientRect().width;


    const trackStyle =
      window.getComputedStyle(track);

    const gap =
      parseFloat(trackStyle.gap) || 0;


    const moveAmount =
      cardWidth + gap;


    track.style.transform =
      `translateX(-${currentIndex * moveAmount}px)`;


    const maxIndex =
      getMaxIndex();


    prevButton.disabled =
      currentIndex <= 0;


    nextButton.disabled =
      currentIndex >= maxIndex;


    /* Update dots */

    const dots =
      dotsContainer.querySelectorAll(
        ".vimana-review-dot"
      );


    dots.forEach(function (dot, index) {

      dot.classList.toggle(
        "active",
        index === currentIndex
      );

    });

  }


  /* =======================================================
     NEXT
     ======================================================= */

  function nextReview() {

    const maxIndex =
      getMaxIndex();

    if (currentIndex < maxIndex) {

      currentIndex++;

      updateCarousel();

    }

  }


  /* =======================================================
     PREVIOUS
     ======================================================= */

  function previousReview() {

    if (currentIndex > 0) {

      currentIndex--;

      updateCarousel();

    }

  }


  /* =======================================================
     BUTTON EVENTS
     ======================================================= */

  nextButton.addEventListener(
    "click",
    nextReview
  );

  prevButton.addEventListener(
    "click",
    previousReview
  );


  /* =======================================================
     TOUCH SWIPE
     ======================================================= */

  let touchStartX = 0;
  let touchEndX = 0;


  track.addEventListener(
    "touchstart",
    function (event) {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  track.addEventListener(
    "touchend",
    function (event) {

      touchEndX =
        event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;


      if (Math.abs(difference) < 50) {
        return;
      }


      if (difference > 0) {

        nextReview();

      } else {

        previousReview();

      }

    },
    { passive: true }
  );


  /* =======================================================
     RESIZE
     ======================================================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    function () {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(
        function () {

          const maxIndex =
            getMaxIndex();

          if (currentIndex > maxIndex) {

            currentIndex = maxIndex;

          }

          createDots();

          updateCarousel();

        },
        150
      );

    }
  );


  /* =======================================================
     INITIALIZE
     ======================================================= */

  renderReviews();

  createDots();

  updateCarousel();

});