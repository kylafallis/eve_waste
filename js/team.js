/* Team page. Scroll animations come from main.js; this file only runs the
   founder panels: hovering, focusing or tapping a panel opens it and closes the
   others. Layout and the stacked phone view live in css/team.css. */
const founderPanels = document.querySelectorAll('#founderPanels .founder-panel');

const openPanel = panel => {
  founderPanels.forEach(other => other.classList.toggle('is-open', other === panel));
};

founderPanels.forEach(panel => {
  const open = () => openPanel(panel);
  panel.addEventListener('mouseenter', open);
  panel.addEventListener('focusin', open);
  panel.addEventListener('click', open);
});

// The investors page links to team.html#<founder>; open that founder's panel.
const openFromHash = () => {
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && target.classList.contains('founder-panel')) openPanel(target);
};
openFromHash();
window.addEventListener('hashchange', openFromHash);
