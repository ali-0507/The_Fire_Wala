
function openModal() {
    const modal = document.getElementById('modal');

    if (modal) {
        modal.classList.add('show');
    }
}


function closeModal() {
    const modal = document.getElementById('modal');

    if (modal) {
        modal.classList.remove('show');
    }
}


/* Close modal when clicking outside the modal box */

const modal = document.getElementById('modal');

if (modal) {
    modal.addEventListener('click', function (e) {

        if (e.target.id === 'modal') {
            closeModal();
        }

    });
}


/* =========================================
   FORM SUBMISSION
   ========================================= */

function submitForm(e) {

    e.preventDefault();

    const formBox = document.getElementById('formBox');
    const success = document.getElementById('success');

    if (formBox) {
        formBox.style.display = 'none';
    }

    if (success) {
        success.style.display = 'block';
    }
}


/* =========================================
   RISK SELECTOR
   ========================================= */

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


/* =========================================
   FAQ ACCORDION
   ========================================= */

const faqQuestions = document.querySelectorAll('.faq-q');

faqQuestions.forEach(function (question) {

    question.addEventListener('click', function () {

        const parent = question.parentElement;

        if (parent) {
            parent.classList.toggle('open');
        }

    });

});


/* =========================================
   PROCESS SECTION
   ========================================= */

const steps = document.querySelectorAll('.step');
const processImg = document.getElementById('processImg');


steps.forEach(function (step) {

    step.addEventListener('click', function () {

        /* Remove active class from all steps */

        steps.forEach(function (item) {
            item.classList.remove('active');
        });


        /* Add active class to clicked step */

        step.classList.add('active');


        /* Make sure process image exists */

        if (!processImg) {
            return;
        }


        /* Get image path from data-img */

        let imagePath = step.dataset.img;


        if (!imagePath) {
            return;
        }


        /*
           Convert Windows-style "\" paths
           into web-friendly "/" paths.

           Example:
           assets\image.png
           becomes:
           assets/image.png
        */

        imagePath = imagePath.replace(/\\/g, '/');


        /* Fade image out */

        processImg.style.opacity = '0';


        /* Change image after short delay */

        setTimeout(function () {

            processImg.src = imagePath;

            processImg.onload = function () {
                processImg.style.opacity = '1';
            };

            /*
               If image fails to load, restore visibility
               instead of leaving the image invisible.
            */

            processImg.onerror = function () {
                processImg.style.opacity = '1';
                console.warn('Process image could not be loaded:', imagePath);
            };

        }, 180);

    });

});


/* =========================================
   INITIAL PROCESS IMAGE
   ========================================= */

if (processImg) {

    processImg.style.transition = 'opacity 180ms ease';

}


document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".slider-dot");

    if (!slides.length || !dots.length) return;

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    // Automatic slider: changes every 3 seconds
    setInterval(function () {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, 3000);

    // Allow users to click dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
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
    } else if (quantity < 2) {
        this.setCustomValidity(
            "Minimum quantity should be 2."
        );
    } else if (quantity > 100) {
        this.setCustomValidity(
            "Maximum quantity allowed is 100."
        );
    } else {
        this.setCustomValidity("");
    }
});


 