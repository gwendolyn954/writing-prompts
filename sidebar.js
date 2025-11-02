// Move sidebar between desktop (sticky) and mobile (collapsible)

(function () {
  const mq = window.matchMedia('(max-width: 979px)');
  const main = document.querySelector('main.rp-layout');
  const aside = document.querySelector('.rp-sidebar');
  const panel = document.getElementById('how-it-works-panel');
  const toggle = document.querySelector('.rp-help-toggle');
  const chev = toggle ? toggle.querySelector('.chev') : null;

  if (!main || !aside || !panel || !toggle) return;

  // Ensure panel starts hidden on load
  panel.setAttribute('hidden', '');

  function toMobile() {
    // Move the aside into the collapsible panel
    if (aside.parentElement !== panel) {
      panel.appendChild(aside);
    }
    // Keep it collapsed by default
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (chev) {
      chev.style.transition = 'transform .2s ease';
      chev.style.transform = 'rotate(0deg)'; // down
    }
  }

  function toDesktop() {
    // Move the aside back beside the main card
    if (aside.parentElement === panel) {
      // Place after the main container, at the end of <main>
      main.appendChild(aside);
    }
    // Desktop doesn't use the collapsible panel
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (chev) {
      chev.style.transform = 'rotate(0deg)';
    }
  }

  function syncLayout(e) {
    if (e.matches) {
      toMobile();
    } else {
      toDesktop();
    }
  }

  // Initial sync
  syncLayout(mq);
  // Respond to viewport changes
  mq.addEventListener('change', syncLayout);

  // Toggle open/close
  toggle.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');          // show
      toggle.setAttribute('aria-expanded', 'true');
      if (chev) chev.style.transform = 'rotate(180deg)'; // up
    } else {
      panel.setAttribute('hidden', '');         // hide
      toggle.setAttribute('aria-expanded', 'false');
      if (chev) chev.style.transform = 'rotate(0deg)';   // down
    }
  });
})();
