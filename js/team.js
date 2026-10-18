/* Team page. Scroll animations come from main.js; this file only runs the
   founder panels: hovering, focusing or tapping a panel opens it and closes the
   others. Layout and the stacked phone view live in css/team.css. */
const founderPanels = document.querySelectorAll('#founderPanels .founder-panel');

founderPanels.forEach(panel => {
  const open = () => {
    founderPanels.forEach(other => other.classList.toggle('is-open', other === panel));
  };
  panel.addEventListener('mouseenter', open);
  panel.addEventListener('focusin', open);
  panel.addEventListener('click', open);
});
