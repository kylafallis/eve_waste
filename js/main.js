/* EvE Waste — Shared JS */

// Header scroll
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  function updateHeader() {
    if (window.scrollY > 20) siteHeader.classList.add('is-scrolled');
    else siteHeader.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// Overlay menu
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  menuOverlay.classList.add('is-open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation menu');
  document.body.classList.add('menu-is-open');
  const firstLink = menuOverlay.querySelector('.menu-link');
  if (firstLink) firstLink.focus();
}

function closeMenu() {
  menuOverlay.classList.remove('is-open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('menu-is-open');
  menuToggle.focus();
}

if (menuToggle && menuOverlay) {
  menuToggle.addEventListener('click', () => {
    if (menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  menuOverlay.querySelectorAll('.menu-link, .menu-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) closeMenu();
  });

  // Focus trap
  const focusableSelectors = 'a[href], button:not([disabled])';
  document.addEventListener('keydown', e => {
    if (!menuOverlay.classList.contains('is-open') || e.key !== 'Tab') return;
    const els = [...menuOverlay.querySelectorAll(focusableSelectors)];
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  });
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.menu-link').forEach(link => {
  const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Scroll animations
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-in').forEach(el => scrollObserver.observe(el));

// Counter animation
function animateCounter(el, target, duration, prefix, suffix, decimals) {
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = target * eased;
    el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const el = entry.target;
      animateCounter(
        el,
        parseFloat(el.dataset.target),
        2000,
        el.dataset.prefix || '',
        el.dataset.suffix || '',
        el.dataset.decimals
      );
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));
