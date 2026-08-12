document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Budget Drawer Panel Toggle & Mobile Navigation Menu controls
  const orcTop = document.getElementById('orcTop');
  const orcPanel = document.getElementById('orcPanel');
  const heroCtaBtn = document.getElementById('hero-cta-btn');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    if (hamburgerBtn && navLinks) {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    }
  }

  function openOrc() {
    closeMobileMenu();
    if (orcPanel && orcTop) {
      orcPanel.classList.add('open');
      orcPanel.setAttribute('aria-hidden', 'false');
      orcTop.setAttribute('aria-expanded', 'true');
    }
  }

  function closeOrc() {
    if (orcPanel && orcTop) {
      orcPanel.classList.remove('open');
      orcPanel.setAttribute('aria-hidden', 'true');
      orcTop.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleOrc() {
    const isOpen = orcPanel.classList.contains('open');
    if (isOpen) closeOrc(); else openOrc();
  }

  orcTop?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleOrc();
  });

  // Hero CTA links directly to sliding drawer
  heroCtaBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openOrc();
  });

  const challengeCtaBtn = document.getElementById('challenge-cta-btn');
  challengeCtaBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openOrc();
  });

  // Close panel on clicking outside of it
  window.addEventListener('click', (e) => {
    if (orcPanel && orcPanel.classList.contains('open')) {
      if (!orcPanel.contains(e.target) && !orcTop.contains(e.target) && (heroCtaBtn && !heroCtaBtn.contains(e.target))) {
        closeOrc();
      }
    }
  });

  // Escape key closes drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrc();
      closeModalView();
    }
  });


// Portfolio Cards Reveal on Scroll Animation  
const portfolioCards = document.querySelectorAll('[data-reveal]');

if (portfolioCards.length > 0) {  
  const portfolioObserverOptions = {  
    root: null,  
    rootMargin: '0px 0px -100px 0px', // Trigger 100px before card enters viewport  
    threshold: 0.1  
  };

  const portfolioRevealCallback = (entries, observer) => {  
    entries.forEach((entry, index) => {  
      if (entry.isIntersecting) {  
        // Stagger animation: each card reveals 100ms after the previous  
        setTimeout(() => {  
          entry.target.classList.add('revealed');  
        }, index * 100);  
        observer.unobserve(entry.target);  
      }  
    });  
  };

  const portfolioObserver = new IntersectionObserver(portfolioRevealCallback, portfolioObserverOptions);

  portfolioCards.forEach(card => {  
    portfolioObserver.observe(card);  
  });  
} 

  // Lead Form Fields Validation
  const leadForm = document.getElementById('leadForm');
  const inputs = leadForm?.querySelectorAll('input, select, textarea');

  // Input validation state feedback
  inputs?.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      // Remove invalid state as user corrects typing
      const group = input.closest('.input-group');
      if (group?.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  function validateField(input) {
    const group = input.closest('.input-group');
    if (!group) return false;

    let isValid = true;
    
    // Check basic presence
    if (input.required && !input.value.trim()) {
      isValid = false;
    } 
    // Check specific formats
    else if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value.trim());
    } 
    else if (input.id === 'whatsapp' && input.value.trim()) {
      // Basic check for digits amount (minimum 10 digits for Brazil cellphones/fixed numbers)
      const digits = input.value.replace(/\D/g, '');
      isValid = digits.length >= 10;
    }

    if (isValid) {
      group.classList.remove('invalid');
      group.classList.add('valid');
    } else {
      group.classList.remove('valid');
      group.classList.add('invalid');
    }

    return isValid;
  }

  // Modal Window Controls
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  
  const mNome = document.getElementById('mNome');
  const mEmpresa = document.getElementById('mEmpresa');
  const mTema = document.getElementById('mTema');
  const mMsg = document.getElementById('mMsg');

  function openModalView() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModalView() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeModal?.addEventListener('click', closeModalView);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModalView();
  });


  // Form submission handler
  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    let formValid = true;
    inputs.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) formValid = false;
    });

    if (!formValid) {
      // Focus the first invalid element to assist assistive tools
      const firstInvalid = leadForm.querySelector('.input-group.invalid input, .input-group.invalid select, .input-group.invalid textarea');
      firstInvalid?.focus();
      return;
    }

    // Capture values
    const nome = document.getElementById('nome')?.value.trim();
    const empresa = document.getElementById('empresa')?.value.trim();
    const tema = document.getElementById('tema')?.value;
    const mensagem = document.getElementById('mensagem')?.value.trim();

    // Populate modal values
    if (mNome) mNome.textContent = nome;
    if (mEmpresa) mEmpresa.textContent = empresa;
    if (mTema) mTema.textContent = tema;
    if (mMsg) mMsg.textContent = mensagem;

    // Open submission modal preview
    openModalView();

    // Close the sidebar panel
    closeOrc();

    // Reset Form and validation classes
    leadForm.reset();
    inputs.forEach(input => {
      const group = input.closest('.input-group');
      group?.classList.remove('valid', 'invalid');
    });
  });


  // Interactive Accordion Service Cards
  const accordionCards = document.querySelectorAll('[data-acc]');
  
  accordionCards.forEach(card => {
    const btn = card.querySelector('.btn-accordion');
    const panel = card.querySelector('.acc-content');
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other accordions for layout clarity
      accordionCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.setAttribute('aria-expanded', 'false');
          const otherBtn = otherCard.querySelector('.btn-accordion');
          const otherPanel = otherCard.querySelector('.acc-content');
          otherBtn?.setAttribute('aria-expanded', 'false');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
            otherPanel.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle state on current card
      if (isExpanded) {
        card.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        panel.setAttribute('aria-hidden', 'true');
      } else {
        card.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.setAttribute('aria-hidden', 'false');
      }
    });
  });


  // 6. Scroll-Driven Reveal animations (IntersectionObserver)
  const observeOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once visible, stop observing to prevent repeated animations
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, observeOptions);

  // Setup elements to animate on scroll
  const animElements = document.querySelectorAll('.service-card, .process-step, .contact-card, .section-header, .challenge-card, .differential-card, .diagnostic-banner, .about-highlight');
  
  // Style transition rules via JS in runtime (or you could put these directly in style.css)
  animElements.forEach(el => {
    el.classList.add('reveal-ready');
    revealObserver.observe(el);
  });

  // 7. Mobile Navigation Hamburger Menu Toggle
  function openMobileMenu() {
    if (hamburgerBtn && navLinks) {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('open');
      // Close budget drawer to avoid overlay issues
      closeOrc();
    }
  }

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) closeMobileMenu(); else openMobileMenu();
  }

  hamburgerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close mobile menu when clicking any nav link
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile menu on clicking outside of it
  window.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close mobile menu if window resized past mobile threshold (768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
});
