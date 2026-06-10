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
