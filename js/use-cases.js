/* Use cases page — industry filter */

const filterBtns = document.querySelectorAll('.industry-filter');
const caseCards = document.querySelectorAll('.case-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    caseCards.forEach(card => {
      if (filter === 'all' || card.dataset.industry === filter) {
        card.removeAttribute('data-filtered');
        card.style.display = '';
      } else {
        card.dataset.filtered = 'true';
        card.style.display = 'none';
      }
    });
  });
});

// Pilot timeline — the panel is shown by CSS on :hover / :focus-within so it
// works with JS off. This keeps aria-expanded truthful and makes a tap toggle
// rather than latch open on touch, where there is no hover to end.
document.querySelectorAll('.pilot-step').forEach(step => {
  const dot = step.querySelector('.pilot-step__dot');
  if (!dot) return;

  const set = open => dot.setAttribute('aria-expanded', String(open));

  step.addEventListener('mouseenter', () => set(true));
  step.addEventListener('mouseleave', () => set(false));
  dot.addEventListener('focus', () => set(true));
  dot.addEventListener('blur', () => set(false));
  dot.addEventListener('click', () => {
    if (dot.getAttribute('aria-expanded') === 'true') {
      dot.blur();
      set(false);
    } else {
      set(true);
    }
  });
});
