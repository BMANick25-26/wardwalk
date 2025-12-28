(function () {
  const tabs = Array.from(document.querySelectorAll(".tab[data-tab]"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));

  function activate(tabId, { pushHash = true } = {}) {
    // tabs
    tabs.forEach(t => {
      t.classList.toggle("active", t.dataset.tab === tabId);
      t.setAttribute("aria-selected", t.dataset.tab === tabId ? "true" : "false");
    });

    // panels
    panels.forEach(p => {
      const isActive = p.id === tabId;
      p.style.display = isActive ? "block" : "none";
      p.classList.toggle("active", isActive);
    });

    if (pushHash) {
      history.replaceState(null, "", `#${tabId}`);
    }

    // “tab” feel: jump to top of page content
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Click handlers
  tabs.forEach(btn => {
    btn.addEventListener("click", () => activate(btn.dataset.tab));
  });

  // Support links/buttons that should open a tab
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-open-tab]");
    if (!el) return;
    e.preventDefault();
    const tabId = el.getAttribute("data-open-tab");
    if (!tabId) return;
    activate(tabId);
  });

  // Initial tab from hash (e.g. /#help) or default to "what"
  const initial = (location.hash || "").replace("#", "");
  const valid = panels.some(p => p.id === initial);
  activate(valid ? initial : "what", { pushHash: true });
})();
