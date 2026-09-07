/* Contact page, form handling */

const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg = document.getElementById('formError');

// Preselect the inquiry type from ?inquiry=... (the product page's spec-request button links here)
const requestedInquiry = new URLSearchParams(window.location.search).get('inquiry');
if (requestedInquiry) {
  const select = document.getElementById('inquiry');
  const isKnownOption = select && [...select.options].some(opt => opt.value === requestedInquiry);
  if (isKnownOption) select.value = requestedInquiry;
}

if (form) {
  form.addEventListener('submit', async e => {
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

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    if (errorMsg) errorMsg.classList.remove('is-visible');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await res.json();

      // The success state appears only on a confirmed success response, never optimistically.
      if (data.success) {
        submitBtn.style.display = 'none';
        if (successMsg) successMsg.classList.add('is-visible');
        form.reset();
      } else {
        throw new Error(data.message || 'Submission rejected');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      if (errorMsg) errorMsg.classList.add('is-visible');
    }
  });

  // Clear error state on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('is-error'));
    field.addEventListener('change', () => field.classList.remove('is-error'));
  });
}
