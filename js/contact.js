/* Contact page — form handling */

const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('is-error');
      if (!field.value.trim()) {
        field.classList.add('is-error');
        valid = false;
      }
    });

    if (!valid) return;

    // Disable submit, show success
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate async send (replace with actual fetch/API call)
    setTimeout(() => {
      submitBtn.style.display = 'none';
      if (successMsg) successMsg.classList.add('is-visible');
      form.reset();
    }, 800);
  });

  // Clear error state on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('is-error'));
  });
}
