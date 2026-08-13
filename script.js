document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIGURAÇÃO DO SUPABASE ---
  const SUPABASE_URL = 'https://alxixhmzdluegvqexvuo.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_HEK7OIFSzWzn7_trFHZwEw_59RVx0CU';
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // --- ELEMENTOS ---
  const orcTop = document.getElementById('orcTop');
  const orcPanel = document.getElementById('orcPanel');
  const heroCtaBtn = document.getElementById('hero-cta-btn');
  const challengeCtaBtn = document.getElementById('challenge-cta-btn');
  const footerCtaBtn = document.getElementById('footer-cta-btn');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const leadForm = document.getElementById('leadForm');
  const inputs = leadForm?.querySelectorAll('input, select, textarea');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');

  // --- FUNÇÕES DE UI ---
  function closeMobileMenu() {
    hamburgerBtn?.classList.remove('active');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    navLinks?.classList.remove('open');
  }

  function openOrc() {
    closeMobileMenu();
    orcPanel?.classList.add('open');
    orcPanel?.setAttribute('aria-hidden', 'false');
    orcTop?.setAttribute('aria-expanded', 'true');
  }

  function closeOrc() {
    orcPanel?.classList.remove('open');
    orcPanel?.setAttribute('aria-hidden', 'true');
    orcTop?.setAttribute('aria-expanded', 'false');
  }

  function openModal() {
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
  }

  function closeModalView() {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
  }

  // Eventos de abertura/fechamento
  orcTop?.addEventListener('click', (e) => {
    e.stopPropagation();
    orcPanel?.classList.contains('open') ? closeOrc() : openOrc();
  });

  [heroCtaBtn, challengeCtaBtn, footerCtaBtn].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openOrc();
    });
  });

  closeModal?.addEventListener('click', closeModalView);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModalView();
  });

  window.addEventListener('click', (e) => {
    if (orcPanel?.classList.contains('open') &&
        !orcPanel.contains(e.target) &&
        !orcTop?.contains(e.target)) {
      closeOrc();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrc();
      closeModalView();
    }
  });

  // Hamburger
  hamburgerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks?.classList.contains('open');
    if (isOpen) closeMobileMenu();
    else {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      navLinks?.classList.add('open');
      closeOrc();
    }
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- VALIDAÇÃO ---
  function validateField(input) {
    const group = input.closest('.input-group');
    if (!group) return false;

    let isValid = true;
    if (input.required && !input.value.trim()) {
      isValid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    } else if (input.id === 'whatsapp' && input.value.trim()) {
      isValid = input.value.replace(/\D/g, '').length >= 10;
    }

    group.classList.toggle('invalid', !isValid);
    group.classList.toggle('valid', isValid);
    return isValid;
  }

  inputs?.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.input-group')?.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  // --- ENVIO DO FORMULÁRIO ---
  leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formValid = true;
    inputs?.forEach(input => {
      if (!validateField(input)) formValid = false;
    });

    if (!formValid) {
      const firstInvalid = leadForm.querySelector('.input-group.invalid input, .input-group.invalid select, .input-group.invalid textarea');
      firstInvalid?.focus();
      return;
    }

    const leadData = {
      nome: document.getElementById('nome')?.value.trim(),
      empresa: document.getElementById('empresa')?.value.trim(),
      setor: document.getElementById('setor')?.value,
      tema: document.getElementById('tema')?.value,
      mensagem: document.getElementById('mensagem')?.value.trim(),
      email: document.getElementById('email')?.value.trim(),
      whatsapp: document.getElementById('whatsapp')?.value.trim()
    };

    try {
  const { error } = await supabaseClient
    .from('leads')
    .insert([leadData]);

  if (error) throw error;

  // Envia e-mail de confirmação
  await fetch('https://alxixhmzdluegvqexvuo.supabase.co/functions/v1/resend-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    nome: leadData.nome,
    email: leadData.email,
    empresa: leadData.empresa,
    tema: leadData.tema
  })
});

  // Preenche o modal
  document.getElementById('mNome').textContent = leadData.nome;
  document.getElementById('mEmpresa').textContent = leadData.empresa;
  document.getElementById('mTema').textContent = leadData.tema;
  document.getElementById('mMsg').textContent = leadData.mensagem;

  // Atualiza textos do modal
  const intro = document.querySelector('.modal-intro');
  if (intro) {
    intro.textContent = 'Recebemos seu diagnóstico técnico. Em breve entraremos em contato.';
  }

  const footerInfo = document.querySelector('.modal-footer-info p');
  if (footerInfo) {
    footerInfo.textContent = 'Obrigado pelo contato! Nossa equipe técnica analisará as informações e retornará em breve.';
  }

  document.activeElement?.blur();
  openModal();
  closeOrc();
  leadForm.reset();
  inputs?.forEach(i => i.closest('.input-group')?.classList.remove('valid', 'invalid'));

} catch (err) {
  console.error('Erro ao enviar lead:', err);
  alert('Erro ao enviar. Tente novamente ou fale conosco pelo WhatsApp.');
}

  });

 // --- ANIMAÇÕES (IntersectionObserver) ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Cards normais
document.querySelectorAll(
  '.service-card, .process-step, .contact-card, .challenge-card, .differential-card, .diagnostic-banner, .about-highlight'
).forEach(el => {
  el.classList.add('reveal-ready');
  revealObserver.observe(el);
});

// Cards do Portfolio (data-reveal) — com stagger
const portfolioCards = document.querySelectorAll('[data-reveal]');
if (portfolioCards.length > 0) {
  const portfolioObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  portfolioCards.forEach(card => portfolioObserver.observe(card));
}

}); // ← ESTA LINHA ESTÁ FALTANDO

// --- ACCORDION DOS SERVIÇOS ---
const accordionCards = document.querySelectorAll('[data-acc]');

accordionCards.forEach(card => {
  const btn = card.querySelector('.btn-accordion');
  const panel = card.querySelector('.acc-content');
  if (!btn || !panel) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Fecha todos os outros
    accordionCards.forEach(otherCard => {
      if (otherCard !== card) {
        const otherBtn = otherCard.querySelector('.btn-accordion');
        const otherPanel = otherCard.querySelector('.acc-content');
        otherBtn?.setAttribute('aria-expanded', 'false');
        if (otherPanel) {
          otherPanel.style.maxHeight = null;
          otherPanel.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // Alterna o atual
    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
      panel.setAttribute('aria-hidden', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.setAttribute('aria-hidden', 'false');
    }
  });
});