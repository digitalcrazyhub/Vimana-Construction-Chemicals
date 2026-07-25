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

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));


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

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      group: document.getElementById('fullName').closest('.contact-form__group'),
      validate: (val) => val.trim().length >= 2
    },
    email: {
      input: document.getElementById('email'),
      group: document.getElementById('email').closest('.contact-form__group'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
    },
    phone: {
      input: document.getElementById('phone'),
      group: document.getElementById('phone').closest('.contact-form__group'),
      validate: (val) => /^[\d\+\-\s\(\)]{7,20}$/.test(val.trim())
    },
    subject: {
      input: document.getElementById('subject'),
      group: document.getElementById('subject').closest('.contact-form__group'),
      validate: (val) => val !== null && val !== ''
    },
    message: {
      input: document.getElementById('message'),
      group: document.getElementById('message').closest('.contact-form__group'),
      validate: (val) => val.trim().length >= 10
    }
  };

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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      formAlert.className = 'contact-form__alert';
      formAlert.style.display = 'none';

      // Validate all fields
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const valid = field.validate(field.input.value);
        if (!valid) {
          field.group.classList.add('contact-form__group--error');
          isValid = false;
        } else {
          field.group.classList.remove('contact-form__group--error');
        }
      });

      if (!isValid) {
        showToast('Please correct the highlighted fields before submitting.', 'info');
        return;
      }

      // Show Loading State
      submitBtn.classList.add('contact-form__btn--loading');
      submitBtn.disabled = true;

      // Simulate API Submission
      setTimeout(() => {
        submitBtn.classList.remove('contact-form__btn--loading');
        submitBtn.disabled = false;

        // Show Success Feedback
        formAlert.className = 'contact-form__alert contact-form__alert--success';
        formAlert.innerHTML = '✔ Thank you! Your message has been sent successfully. A technical engineer will contact you shortly.';
        formAlert.style.display = 'block';

        showToast('Message sent successfully!', 'success');

        // Reset form
        form.reset();
        if (selectElement) {
          selectElement.classList.remove('has-value');
        }
      }, 1500);
    });
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
