/**
 * Vimana Construction Chemicals - Contact Page Script
 * Interactivity, Form Validation, Animations & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Scroll Reveal Animations (Intersection Observer)
     ========================================================================== */
  const animatedElements = document.querySelectorAll(
    '.js-scroll-fade-up, .js-scroll-fade-left, .js-scroll-fade-right, .js-scroll-zoom'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ==========================================================================
     2. Form Select Floating Label Handler
     ========================================================================== */
  const selectElement = document.getElementById('subject');
  if (selectElement) {
    const handleSelectValue = () => {
      if (selectElement.value !== '') {
        selectElement.classList.add('has-value');
      } else {
        selectElement.classList.remove('has-value');
      }
    };

    selectElement.addEventListener('change', handleSelectValue);
    handleSelectValue(); // Check initial state
  }


  /* ==========================================================================
     3. Form Validation & Interactive Submission
     ========================================================================== */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formAlert = document.getElementById('formAlert');

  const apiEndpoint = '/api/contact.php';

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  const errorElements = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    subject: document.getElementById('subjectError'),
    message: document.getElementById('messageError')
  };

  const fields = form && fullNameInput && emailInput && phoneInput && selectElement && messageInput ? {
    fullName: {
      input: fullNameInput,
      group: fullNameInput.closest('.contact-form__group'),
      validate: (val) => /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(val.trim()) && val.trim().length >= 2 && val.trim().length <= 100
    },
    email: {
      input: emailInput,
      group: emailInput.closest('.contact-form__group'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) && val.trim().length <= 150
    },
    phone: {
      input: phoneInput,
      group: phoneInput.closest('.contact-form__group'),
      validate: (val) => /^[\d\+\-\s\(\)]{7,20}$/.test(val.trim()) && (val.match(/\d/g) || []).length >= 7 && (val.match(/\d/g) || []).length <= 15
    },
    subject: {
      input: selectElement,
      group: selectElement.closest('.contact-form__group'),
      validate: (val) => val !== null && val !== ''
    },
    message: {
      input: messageInput,
      group: messageInput.closest('.contact-form__group'),
      validate: (val) => val.trim().length >= 10 && val.trim().length <= 2000
    }
  } : {};

  // Real-time input clearing of errors
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    const eventType = field.input.tagName === 'SELECT' ? 'change' : 'input';

    field.input.addEventListener(eventType, () => {
      if (field.group.classList.contains('contact-form__group--error')) {
        if (field.validate(field.input.value)) {
          field.group.classList.remove('contact-form__group--error');
        }
      }
    });

    field.input.addEventListener('blur', () => {
      if (field.input.value.trim() !== '') {
        if (!field.validate(field.input.value)) {
          field.group.classList.add('contact-form__group--error');
        } else {
          field.group.classList.remove('contact-form__group--error');
        }
      }
    });
  });

  // Handle Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      if (formAlert) {
        formAlert.className = 'contact-form__alert';
        formAlert.style.display = 'none';
      }

      // Validate all fields
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const valid = field.validate(field.input.value);
        if (errorElements[key]) {
          errorElements[key].textContent = valid ? '' : getClientError(key);
        }
        if (!valid) {
          field.group.classList.add('contact-form__group--error');
          isValid = false;
        } else {
          field.group.classList.remove('contact-form__group--error');
        }
      });

      if (!isValid) {
        showFormAlert('Please correct the highlighted fields.', false);
        return;
      }

      if (typeof grecaptcha === 'undefined' || grecaptcha.getResponse() === '') {
        showFormAlert('Please complete the security verification and try again.', false);
        return;
      }

      // Show Loading State
      if (submitBtn) {
        submitBtn.classList.add('contact-form__btn--loading');
        submitBtn.disabled = true;
      }

      try {
        const csrfResponse = await fetch(`${apiEndpoint}?action=csrf`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          credentials: 'same-origin'
        });
        const csrfData = await csrfResponse.json();
        if (!csrfResponse.ok || !csrfData.token) {
          throw new Error('Unable to initialize secure form submission.');
        }

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-CSRF-Token': csrfData.token
          },
          body: new FormData(form),
          credentials: 'same-origin'
        });
        const data = await response.json();

        Object.keys(fields).forEach(key => {
          const error = data.errors && data.errors[key];
          if (errorElements[key]) errorElements[key].textContent = error || '';
          fields[key].group.classList.toggle('contact-form__group--error', Boolean(error));
        });

        if (!response.ok || !data.success) {
          showFormAlert(data.message || 'We could not process your enquiry right now. Please try again later.', false);
          return;
        }

        showFormAlert(data.message, true);
        form.reset();
        if (selectElement) selectElement.classList.remove('has-value');
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
      } catch (error) {
        showFormAlert('We could not process your enquiry right now. Please try again later.', false);
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('contact-form__btn--loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  function getClientError(key) {
    const messages = {
      fullName: 'Please enter your full name',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      subject: 'Please select a subject area',
      message: 'Please enter your message (at least 10 characters)'
    };
    return messages[key];
  }

  function showFormAlert(message, success) {
    if (!formAlert) return;
    formAlert.className = `contact-form__alert${success ? ' contact-form__alert--success' : ' contact-form__alert--error'}`;
    formAlert.textContent = message || '';
    formAlert.style.display = 'block';
    formAlert.setAttribute('aria-hidden', message ? 'false' : 'true');
  }


  /* ==========================================================================
     4. Toast Notification Utility
     ========================================================================== */
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'info' ? 'toast--info' : ''}`;
    
    const icon = type === 'success' ? '✔' : 'ℹ';
    toast.innerHTML = `<span style="font-weight: 700; color: var(--accent);">${icon}</span> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }


  /* ==========================================================================
     5. Copy to Clipboard Micro-Interaction
     ========================================================================== */
  const copyTriggers = document.querySelectorAll('.js-copy-trigger');
  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = trigger.getAttribute('data-copy') || trigger.innerText;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`, 'success');
      }).catch(() => {
        showToast(`Text: ${textToCopy}`, 'info');
      });
    });
  });


  /* ==========================================================================
     6. Card Hover Tilt & Magnetic Micro-Interaction
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.js-card-tilt');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse X position within card
      const y = e.clientY - rect.top;  // Mouse Y position within card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 25;
      const tiltY = (centerX - x) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

});
