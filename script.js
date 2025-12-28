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
