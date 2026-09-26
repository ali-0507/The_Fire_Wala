
const hamburger = document.getElementById("hamburger");
const navlinks = document.getElementById("navlinks");

hamburger.addEventListener("click", function () {

    // Toggle the mobile menu
    navlinks.classList.toggle("show");

    // Toggle hamburger animation
    hamburger.classList.toggle("active");

    // Update accessibility state
    const isOpen = navlinks.classList.contains("show");

    hamburger.setAttribute("aria-expanded", isOpen);

    hamburger.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

// Close menu after clicking a navigation link
navlinks.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

        navlinks.classList.remove("show");
        hamburger.classList.remove("active");

        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    });

});

// Close menu when clicking Book a service
navlinks.querySelector(".mobile-book").addEventListener(
    "click",
    function () {

        navlinks.classList.remove("show");
        hamburger.classList.remove("active");

        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    }
);

function openModal() {
  const modal = document.getElementById("modal");
  const formBox = document.getElementById("formBox");
  const success = document.getElementById("success");

  if (!modal) {
    console.error("Modal container not found!");
    return;
  }

  // Show form again whenever modal opens
  if (formBox) formBox.style.display = "block";
  if (success) success.style.display = "none";

  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.classList.remove("show");
  }
}

// Close modal when clicking outside the form box
const modal = document.getElementById("modal");

if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}
/* =========================================
   FORM SUBMISSION
========================================= */

// LOCAL BACKEND
const API_URL =
   "https://the-fire-wala.onrender.com/api/service-requests";


// Common function: send form data to backend
async function sendServiceRequest(form) {
  const formData = new FormData(form);

  const quantityValue = formData.get("quantity");

  const requestData = {
    client_name: formData.get("clientName")?.trim(),
    phone: formData.get("phone")?.trim(),
    email: formData.get("email")?.trim(),
    company_name: formData.get("company")?.trim() || null,
    service_type: formData.get("serviceType"),
    additional_details:
      formData.get("additional_details")?.trim() || null,
    extinguisher_quantity:
      quantityValue === "" || quantityValue === null
        ? null
        : Number(quantityValue)
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  });

  const responseText = await response.text();

  console.log("HTTP status:", response.status);
  console.log("Backend response:", responseText);

  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Backend returned a non-JSON response. HTTP ${response.status}`
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `Request failed: HTTP ${response.status}`
    );
  }

  return result;
}


// =========================================
// 1. HERO FORM
// =========================================

const heroForm = document.getElementById("quoteForm");

if (heroForm) {
  heroForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = heroForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await sendServiceRequest(heroForm);

      alert(
        "Your quote request has been submitted successfully!"
      );

      heroForm.reset();

    } catch (error) {
      console.error("Hero form error:", error);

      alert(
        error.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Quote Request";
      }
    }
  });
}


// =========================================
// 2. MODAL FORM
// =========================================

const modalForm = document.getElementById("modalQuoteForm");

if (modalForm) {
  modalForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = modalForm.querySelector(
      'button[type="submit"]'
    );

    const formBox = document.getElementById("formBox");
    const success = document.getElementById("success");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await sendServiceRequest(modalForm);

      if (formBox) formBox.style.display = "none";
      if (success) success.style.display = "block";

      modalForm.reset();

    } catch (error) {
      console.error("Modal form error:", error);

      alert(
        error.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Request";
      }
    }
  });
}

/*RISK SELECTOR*/

function risk(el) {

    if (!el) {
        return;
    }

    const risks = document.querySelectorAll('.risk');

    risks.forEach(function (item) {
        item.classList.remove('active');
    });

    el.classList.add('active');
}


/*FAQ ACCORDION*/

const faqQuestions = document.querySelectorAll('.faq-q');

faqQuestions.forEach(function (question) {

    question.addEventListener('click', function () {

        const parent = question.parentElement;

        if (parent) {
            parent.classList.toggle('open');
        }

    });

});

const quantityInput = document.getElementById("quantity");

quantityInput.addEventListener("input", function () {
    const quantity = Number(this.value);

    if (this.value === "") {
        this.setCustomValidity("");
    } else if (!Number.isInteger(quantity)) {
        this.setCustomValidity(
            "Please enter a whole number."
        );
    } else if (quantity < 1) {
        this.setCustomValidity(
            "Minimum quantity should be 1."
        );
    } else if (quantity > 100) {
        this.setCustomValidity(
            "Maximum quantity allowed is 100."
        );
    } else {
        this.setCustomValidity("");
    }
});


/*OUR CLIENTS CAROUSEL*/

document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(".clients-track");
    const cards = document.querySelectorAll(".client-card");
    const prevButton = document.querySelector(".client-prev");
    const nextButton = document.querySelector(".client-next");
    const dotsContainer = document.querySelector(".client-dots");

    if (
        !track ||
        !cards.length ||
        !prevButton ||
        !nextButton ||
        !dotsContainer
    ) {
        return;
    }
    let currentPage = 0;
    let autoSlide;


    /*CARDS PER VIEW*/

    function getCardsPerView() {
        if (window.innerWidth <= 700) {
            return 1;
        }
        if (window.innerWidth <= 1100) {
            return 3;
        }
        return 5;
    }


    /*TOTAL PAGES*/
    function getTotalPages() {
        const cardsPerView = getCardsPerView();
        return Math.ceil(
            cards.length / cardsPerView
        );
    }


    /*CREATE DOTS*/

    function createDots() {
        dotsContainer.innerHTML = "";
        const totalPages = getTotalPages();
        for (let i = 0; i < totalPages; i++) {
            const dot =
                document.createElement("button");
            dot.className = "client-dot";
            dot.type = "button";
            dot.setAttribute(
                "aria-label",
                `Show client group ${i + 1}`
            );
            dot.addEventListener(
                "click",
                function () {
                    currentPage = i;
                    updateCarousel();
                    restartAutoSlide();
                }
            );
            dotsContainer.appendChild(dot);
        }
    }


    /*UPDATE CAROUSEL*/

    function updateCarousel() {
        const cardsPerView = getCardsPerView();
        const totalPages = getTotalPages();
        if (currentPage >= totalPages) {
            currentPage = 0;
        }
        if (currentPage < 0) {
            currentPage = totalPages - 1;
        }
        const cardWidth =
            cards[0].offsetWidth;
        const gap =
            parseFloat(
                getComputedStyle(track).gap
            ) || 0;
        const moveAmount =
            currentPage *
            cardsPerView *
            (cardWidth + gap);
        track.style.transform =
            `translateX(-${moveAmount}px)`;
        /* Update dots */
        const dots =
            dotsContainer.querySelectorAll(
                ".client-dot"
            );
        dots.forEach(function (dot, index) {
            dot.classList.toggle(
                "active",
                index === currentPage
            );
        });
    }


    /*NEXT*/

    nextButton.addEventListener(
        "click",
        function () {
            currentPage++;
            if (
                currentPage >=
                getTotalPages()
            ) {
                currentPage = 0;
            }
            updateCarousel();
            restartAutoSlide();
        });

   /*PREVIOUS*/

    prevButton.addEventListener(
        "click",
        function () {
            currentPage--;
            if (currentPage < 0) {
                currentPage =
                    getTotalPages() - 1;
            }
            updateCarousel();
            restartAutoSlide();
        });


    /* =========================================
       AUTO SLIDE
    ========================================= */

    function startAutoSlide() {

        autoSlide = setInterval(
            function () {

                currentPage++;

                if (
                    currentPage >=
                    getTotalPages()
                ) {
                    currentPage = 0;
                }

                updateCarousel();

            },
            6000
        );

    }


    function restartAutoSlide() {

        clearInterval(autoSlide);

        startAutoSlide();

    }


    /*PAUSE ON HOVER*/

    const carousel =
        document.querySelector(
            ".clients-carousel"
        );

    if (carousel) {

        carousel.addEventListener(
            "mouseenter",
            function () {

                clearInterval(autoSlide);

            }
        );


        carousel.addEventListener(
            "mouseleave",
            function () {

                startAutoSlide();

            }
        );

    }


    /*RESPONSIVE*/

    window.addEventListener(
        "resize",
        function () {

            currentPage = 0;

            createDots();

            updateCarousel();

            restartAutoSlide();

        }
    );

    /*INITIALIZE*/

    createDots();

    updateCarousel();

    startAutoSlide();

});