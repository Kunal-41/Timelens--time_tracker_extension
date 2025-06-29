chrome.storage.local.get("timeData", ({ timeData }) => {
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = Object.entries(timeData || {})
    .map(([domain, ms]) => `<p>${domain}: ${(ms / 1000 / 60).toFixed(2)} mins</p>`)
    .join("");
});
