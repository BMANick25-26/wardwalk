document.getElementById("copyChecklist")?.addEventListener("click", () => {
  const items = [...document.querySelectorAll("#checklist li")]
    .map(li => "• " + li.textContent)
    .join("\n");

  navigator.clipboard.writeText("Ward walk checklist\n\n" + items);
});
(function () {
  const select = document.getElementById("regionSelect");
  if (!select) return;

  function clearHighlights() {
    document.querySelectorAll(".rrdc-highlight").forEach(el => {
      el.classList.remove("rrdc-highlight");
    });
  }

  function closeAllAccordions(exceptId) {
    document.querySelectorAll("details.accordion").forEach(d => {
      if (d.id !== exceptId) d.removeAttribute("open");
    });
  }

  select.addEventListener("change", () => {
    const value = select.value;
    if (!value) return;

    const target = document.querySelector(`details.accordion[data-region="${value}"]`);
    if (!target) return;

    clearHighlights();
    closeAllAccordions(target.id);

    target.setAttribute("open", "open");
    target.classList.add("rrdc-highlight");

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
(function () {
  const frame = document.getElementById("tabFrame");
  const tabs = Array.from(document.querySelectorAll(".tab-btn[data-src][data-tab]"));

  if (!frame || tabs.length === 0) return;

  function setActive(tab) {
    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    const src = tab.getAttribute("data-src");
    if (src) frame.src = src;

    // Update hash so you can deep link and the back button behaves sensibly
    const id = tab.getAttribute("data-tab");
    if (id) history.replaceState(null, "", `#${id}`);

    // Scroll back to tabs on mobile after switching
    tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }

  tabs.forEach(tab => tab.addEventListener("click", () => setActive(tab)));

  // Load initial tab from URL hash
  const hash = (location.hash || "").replace("#", "");
  const initial = tabs.find(t => t.getAttribute("data-tab") === hash);
  if (initial) setActive(initial);
})();
