/* Platform page, tab switching */

const tabs = document.querySelectorAll('.platform-tab');
const tabContents = document.querySelectorAll('.platform-tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('is-active'));
    tabContents.forEach(tc => tc.classList.remove('is-active'));

    tab.classList.add('is-active');
    const content = document.getElementById('tab-' + target);
    if (content) {
      content.classList.add('is-active');
      // Re-trigger scroll animations for newly visible elements
      content.querySelectorAll('.fade-up, .fade-in').forEach(el => {
        el.classList.remove('is-visible');
        setTimeout(() => el.classList.add('is-visible'), 50);
      });
    }
  });
});

// Auto-trigger visible items in first tab on load
document.querySelectorAll('.platform-tab-content.is-active .fade-up').forEach(el => {
  el.classList.add('is-visible');
});
