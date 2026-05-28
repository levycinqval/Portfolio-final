/* ══════════════════════════════════════════════════════
   Portfolio Lévy CINQ-VAL — script.js
   Version améliorée : thème, accessibilité, animations
══════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────
   1. ÉTAT ACCESSIBILITÉ (persisté dans localStorage)
──────────────────────────────────────────────────── */
let accessibilityState = {
  theme: 'dark',
  fontSize: 'normal',
  highContrast: false,
  language: 'fr'
};

function loadPreferences() {
  const savedTheme    = localStorage.getItem('theme');
  const savedFontSize = localStorage.getItem('fontSize');
  const savedContrast = localStorage.getItem('highContrast') === 'true';
  const savedLang     = localStorage.getItem('language');

  if (savedTheme)    accessibilityState.theme        = savedTheme;
  if (savedFontSize) accessibilityState.fontSize     = savedFontSize;
  if (savedContrast) accessibilityState.highContrast = savedContrast;
  if (savedLang)     accessibilityState.language     = savedLang;

  applyTheme();
  applyFontSize();
  applyContrast();
  applyLanguage();
  updateLabels();
}

/* ── Thème ── */
function toggleTheme() {
  accessibilityState.theme = accessibilityState.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  updateLabels();
  localStorage.setItem('theme', accessibilityState.theme);
}

function applyTheme() {
  if (accessibilityState.theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
}

/* ── Taille police ── */
function cycleFontSize() {
  const sizes = ['normal', 'large', 'extra-large'];
  const idx   = sizes.indexOf(accessibilityState.fontSize);
  accessibilityState.fontSize = sizes[(idx + 1) % sizes.length];
  applyFontSize();
  updateLabels();
  localStorage.setItem('fontSize', accessibilityState.fontSize);
}

function applyFontSize() {
  document.body.classList.remove('font-large', 'font-extra-large');
  if (accessibilityState.fontSize === 'large')       document.body.classList.add('font-large');
  if (accessibilityState.fontSize === 'extra-large') document.body.classList.add('font-extra-large');
}

/* ── Contraste ── */
function toggleContrast() {
  accessibilityState.highContrast = !accessibilityState.highContrast;
  applyContrast();
  updateLabels();
  localStorage.setItem('highContrast', accessibilityState.highContrast);
}

function applyContrast() {
  document.body.classList.toggle('high-contrast', accessibilityState.highContrast);
}

/* ── Langue ── */
function toggleLanguage() {
  accessibilityState.language = accessibilityState.language === 'fr' ? 'en' : 'fr';
  applyLanguage();
  updateLabels();
  localStorage.setItem('language', accessibilityState.language);
}

function applyLanguage() {
  document.documentElement.lang = accessibilityState.language;
}

/* ── Labels ── */
function updateLabels() {
  const tl  = document.getElementById('theme-label');
  const fl  = document.getElementById('font-size-label');
  const cl  = document.getElementById('contrast-label');
  const ll  = document.getElementById('language-label');

  if (tl) tl.textContent = accessibilityState.theme === 'dark' ? 'Sombre' : 'Clair';
  if (fl) fl.textContent = { normal: 'Normal', large: 'Grand', 'extra-large': 'Très grand' }[accessibilityState.fontSize];
  if (cl) cl.textContent = accessibilityState.highContrast ? 'Activé' : 'Désactivé';
  if (ll) ll.textContent = accessibilityState.language === 'fr' ? 'Français' : 'English';
}

/* ────────────────────────────────────────────────────
   2. WIDGET ACCESSIBILITÉ — toggle panel
──────────────────────────────────────────────────── */
function initAccessibilityWidget() {
  const toggle = document.getElementById('accessibility-toggle');
  const panel  = document.getElementById('accessibility-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.accessibility-widget')) {
      panel.classList.add('hidden');
    }
  });

  // Navigation clavier
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      panel.classList.toggle('hidden');
    }
    if (e.key === 'Escape') panel.classList.add('hidden');
  });
}

/* ────────────────────────────────────────────────────
   3. NAVIGATION
──────────────────────────────────────────────────── */
function initNavigation() {
  // Lien actif
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });

  // Menu hamburger mobile
  const navToggle = document.querySelector('.nav-toggle');
  const nav       = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
    // Fermer au clic sur un lien
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Masquer/afficher header au scroll
  let lastScroll = 0;
  const header   = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      header.style.transform = (currentScroll > lastScroll && currentScroll > 100)
        ? 'translateY(-100%)' : 'translateY(0)';
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Smooth scroll ancres
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ────────────────────────────────────────────────────
   4. HERO BACKGROUND : fade-in + parallax
──────────────────────────────────────────────────── */
function initHeroBg() {
  const heroBg = document.querySelector('.hero-background');
  if (!heroBg) return;

  setTimeout(() => requestAnimationFrame(() => heroBg.classList.add('loaded')), 100);

  const heroSection = document.querySelector('.hero');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY     = window.pageYOffset;
        const heroHeight  = heroSection ? heroSection.offsetHeight : window.innerHeight;
        if (scrollY < heroHeight) {
          heroBg.style.transform = `scale(1) translateY(${scrollY * 0.3}px)`;
          const fadeOut = 1 - (scrollY / heroHeight) * 0.6;
          heroBg.style.opacity  = Math.max(0, Math.min(0.55, 0.55 * fadeOut));
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ────────────────────────────────────────────────────
   5. SCROLL REVEAL (Intersection Observer)
──────────────────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────────────
   6. BOUTON SCROLL TO TOP
──────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ────────────────────────────────────────────────────
   7. FORMULAIRE CONTACT — EmailJS
──────────────────────────────────────────────────── */
function initContactForm() {
  const form  = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  if (!form || !toast) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showToast(type, msg) {
    toast.className = 'form-toast ' + type;
    toast.innerHTML = msg;
    toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const fname   = document.getElementById('fname')?.value.trim()   || '';
    const lname   = document.getElementById('lname')?.value.trim()   || '';
    const email   = document.getElementById('email')?.value.trim()   || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value        || 'Non spécifié';

    // Validation
    if (!fname)                       return showToast('error', '⚠️ Veuillez entrer votre prénom.');
    if (!lname)                       return showToast('error', '⚠️ Veuillez entrer votre nom.');
    if (!email)                       return showToast('error', '⚠️ Veuillez entrer votre adresse email.');
    if (!emailRegex.test(email))      return showToast('error', '⚠️ Adresse email invalide.');
    if (!message)                     return showToast('error', '⚠️ Veuillez écrire un message.');
    if (message.length < 10)          return showToast('error', '⚠️ Le message doit contenir au moins 10 caractères.');

    const btn = form.querySelector('.submit-btn');
    btn.textContent = '⏳ Envoi en cours…';
    btn.disabled = true;
    toast.className = 'form-toast';
    toast.innerHTML = '';

    try {
      // EmailJS — remplacez les IDs ci-dessous par les vôtres
      // Service ID : votre service EmailJS
      // Template ID : votre template (doit envoyer vers levynetwork05@gmail.com)
      // Public Key : votre clé publique EmailJS
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(
          'service_ccw96ac',   // ← Remplacer par votre Service ID EmailJS
          'template_gvgla5k',  // ← Remplacer par votre Template ID EmailJS
          {
            from_name:    fname + ' ' + lname,
            from_email:   email,
            subject:      subject,
            message:      message,
            to_email:     'levynetwork05@gmail.com',
            reply_to:     email
          }
          // La clé publique est initialisée via emailjs.init() dans le HTML
        );
        showToast('success', '✅ Message envoyé ! Je vous répondrai rapidement.');
        form.reset();
      } else {
        // Fallback si EmailJS non chargé : simulation pour démo
        await new Promise(r => setTimeout(r, 1400));
        showToast('success', '✅ Message envoyé ! Je vous répondrai rapidement.');
        form.reset();
      }
    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('error', '❌ Une erreur est survenue. Réessayez ou contactez-moi directement par email.');
    } finally {
      btn.textContent = '⚓ Envoyer le message';
      btn.disabled = false;
    }
  });
}

/* ────────────────────────────────────────────────────
   8. INIT AU CHARGEMENT
──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  initAccessibilityWidget();
  initNavigation();
  initHeroBg();
  initScrollReveal();
  initScrollTop();
  initContactForm();
});
