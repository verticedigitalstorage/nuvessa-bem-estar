(() => {
  "use strict";

  const desktop = window.matchMedia("(min-width: 701px)");
  document.querySelectorAll(".product-label [data-accordion]").forEach(panel => {
    const button = panel.querySelector(".accordion-trigger");
    const content = panel.querySelector(".accordion-content");
    let changedByVisitor = false;

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      content.setAttribute("aria-hidden", String(!open));
    }

    setOpen(desktop.matches);
    button.addEventListener("click", () => {
      changedByVisitor = true;
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });
    desktop.addEventListener("change", event => {
      if (!changedByVisitor) setOpen(event.matches);
    });
  });
})();
