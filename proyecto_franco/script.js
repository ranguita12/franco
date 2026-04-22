/* ===============================================
   ART PORTFOLIO — script.js
   =============================================== */


/* ---- PAGE LOADER ---- */
const loader = document.getElementById('pageLoader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 750);
  }, 900); // minimum display time for elegance
});


/* ---- CUSTOM CURSOR ---- */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot follows instantly
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// Ring follows with smooth lag
(function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
})();

// Expand ring over interactive elements
const hoverTargets = 'a, button, .artwork-card, .about-interests span, .hero-cta';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
});


/* ---- NAVBAR: scroll shadow ---- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });


/* ---- NAVBAR: mobile toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));

  const [top, mid, bot] = navToggle.querySelectorAll('span');
  if (isOpen) {
    top.style.transform = 'translateY(6.5px) rotate(45deg)';
    mid.style.opacity   = '0';
    bot.style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    top.style.transform = '';
    mid.style.opacity   = '';
    bot.style.transform = '';
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    const [top, mid, bot] = navToggle.querySelectorAll('span');
    top.style.transform = '';
    mid.style.opacity   = '';
    bot.style.transform = '';
  });
});


/* ---- PARALLAX: hero image drifts on scroll ---- */
const heroImage = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
  if (!heroImage) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight * 1.2) {
    heroImage.querySelector('img').style.transform =
      `scale(1) translateY(${scrolled * 0.12}px)`;
  }
}, { passive: true });


/* ---- MAGNETIC CTA BUTTON ---- */
const heroCta = document.querySelector('.hero-cta');
if (heroCta) {
  heroCta.addEventListener('mousemove', e => {
    const rect = heroCta.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.35;
    heroCta.style.transform = `translate(${x}px, ${y}px)`;
  });
  heroCta.addEventListener('mouseleave', () => {
    heroCta.style.transform = '';
  });
}


/* ---- MODALS ---- */
const artworkCards = document.querySelectorAll('.artwork-card');
const modals       = document.querySelectorAll('.modal');

function openModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.querySelector('.modal-close')?.focus());
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

artworkCards.forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.project);
    }
  });
});

modals.forEach(modal => {
  modal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(modal));
  modal.querySelector('.modal-close').addEventListener('click',   () => closeModal(modal));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const open = document.querySelector('.modal.open');
    if (open) closeModal(open);
  }
});


/* ---- ACTIVE NAV LINK ---- */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: `-${navbar.offsetHeight}px 0px -55% 0px` });

sections.forEach(s => sectionObserver.observe(s));


/* ---- SCROLL REVEALS (clip-path for cards, fade for the rest) ---- */
const fadeTargets = document.querySelectorAll(
  '.artwork-card, .section-header, .about-text, .about-visual, .final-inner'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });

fadeTargets.forEach(el => {
  el.classList.add('fade-in');
  revealObserver.observe(el);
});
