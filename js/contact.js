(() => {
  "use strict";

  const init = () => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const form = document.getElementById("contactForm");
    const alertBox = document.getElementById("formAlert");
    const submitButton = document.getElementById("submitBtn");
    const select = document.getElementById("subject");

    const animated = [...document.querySelectorAll(".js-scroll-fade-up, .js-scroll-fade-left, .js-scroll-fade-right, .js-scroll-zoom")];
    if (reducedMotion || !("IntersectionObserver" in window)) {
      animated.forEach((element) => element.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            instance.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -60px", threshold: 0.15 });
      animated.forEach((element) => observer.observe(element));
    }

    select?.addEventListener("change", () => select.classList.toggle("has-value", Boolean(select.value)));
    if (!form) return;

    const fields = {
      fullName: {
        input: document.getElementById("fullName"),
        error: document.getElementById("fullNameError"),
        message: "Please enter your full name.",
        valid: (value) => /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(value.trim()) && value.trim().length >= 2 && value.trim().length <= 100
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("emailError"),
        message: "Please enter a valid email address.",
        valid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 150
      },
      phone: {
        input: document.getElementById("phone"),
        error: document.getElementById("phoneError"),
        message: "Please enter a valid phone number.",
        valid: (value) => /^[\d+\-\s()]{7,20}$/.test(value.trim()) && (value.match(/\d/g) || []).length >= 7
      },
      subject: {
        input: select,
        error: document.getElementById("subjectError"),
        message: "Please select a service area.",
        valid: (value) => Boolean(value)
      },
      message: {
        input: document.getElementById("message"),
        error: document.getElementById("messageError"),
        message: "Please enter at least 10 characters.",
        valid: (value) => value.trim().length >= 10 && value.trim().length <= 2000
      }
    };

    const availableFields = Object.values(fields).filter((field) => field.input);
    const setError = (field, invalid) => {
      const group = field.input.closest(".contact-form__group");
      group?.classList.toggle("contact-form__group--error", invalid);
      field.input.setAttribute("aria-invalid", String(invalid));
      if (field.error) field.error.textContent = invalid ? field.message : "";
    };

    const validate = () => {
      let firstInvalid = null;
      let valid = true;
      availableFields.forEach((field) => {
        const invalid = !field.valid(field.input.value);
        setError(field, invalid);
        if (invalid && !firstInvalid) firstInvalid = field.input;
        valid = valid && !invalid;
      });
      if (firstInvalid) firstInvalid.focus();
      return valid;
    };

    availableFields.forEach((field) => {
      const eventName = field.input.tagName === "SELECT" ? "change" : "input";
      field.input.addEventListener(eventName, () => {
        if (field.valid(field.input.value)) setError(field, false);
      });
      field.input.addEventListener("blur", () => {
        if (field.input.value.trim()) setError(field, !field.valid(field.input.value));
      });
    });

    const showAlert = (message, kind = "info") => {
      if (!alertBox) return;
      alertBox.className = "contact-form__alert contact-form__alert--" + kind;
      alertBox.textContent = message;
      alertBox.setAttribute("aria-hidden", "false");
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (alertBox) {
        alertBox.textContent = "";
        alertBox.setAttribute("aria-hidden", "true");
      }
      if (!validate()) {
        showAlert("Please correct the highlighted fields.", "error");
        return;
      }

      const endpoint = form.dataset.endpoint?.trim();
      if (!endpoint) {
        showAlert("Your details are valid. Online submission is not connected yet; please call +91 78454 01301 for immediate help.", "info");
        return;
      }

      submitButton?.classList.add("contact-form__btn--loading");
      if (submitButton) submitButton.disabled = true;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
          credentials: "same-origin"
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Submission failed.");
        showAlert(data.message || "Thanks. We will be in touch shortly.", "success");
        form.reset();
        select?.classList.remove("has-value");
        availableFields.forEach((field) => setError(field, false));
      } catch (error) {
        showAlert(error.message || "We could not process your enquiry right now. Please try again later.", "error");
      } finally {
        submitButton?.classList.remove("contact-form__btn--loading");
        if (submitButton) submitButton.disabled = false;
      }
    });

    if (!reducedMotion && window.matchMedia?.("(pointer: fine)").matches) {
      document.querySelectorAll(".js-card-tilt").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left - rect.width / 2) / 25;
          const y = (event.clientY - rect.top - rect.height / 2) / 25;
          card.style.transform = "perspective(1000px) rotateX(" + y + "deg) rotateY(" + -x + "deg) translateY(-8px)";
        });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; });
      });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
