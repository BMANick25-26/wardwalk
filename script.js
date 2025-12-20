document.getElementById("copyChecklist")?.addEventListener("click", () => {
  const items = [...document.querySelectorAll("#checklist li")]
    .map(li => "• " + li.textContent)
    .join("\n");

  navigator.clipboard.writeText("Ward walk checklist\n\n" + items);
});
