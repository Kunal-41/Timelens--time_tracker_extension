const categories = {
  "stackoverflow.com": "productive",
  "github.com": "productive",
  "facebook.com": "unproductive",
  "youtube.com": "unproductive",
};

function generateReport(timeData) {
  let total = 0;
  let productive = 0;

  for (const [domain, time] of Object.entries(timeData)) {
    total += time;
    if (categories[domain] === "productive") {
      productive += time;
    }
  }

  return {
    totalMinutes: total / 60000,
    productiveMinutes: productive / 60000,
    productivityScore: total ? ((productive / total) * 100).toFixed(2) : 0,
  };
}

function renderReport() {
  chrome.storage.local.get("timeData", ({ timeData }) => {
    const reportDiv = document.getElementById("report");
    if (!timeData) {
      reportDiv.innerHTML = "<p>No data available yet.</p>";
      return;
    }

    const result = generateReport(timeData);
    reportDiv.innerHTML = `
      <p><strong>Total Time:</strong> ${result.totalMinutes.toFixed(2)} mins</p>
      <p><strong>Productive Time:</strong> ${result.productiveMinutes.toFixed(2)} mins</p>
      <p><strong>Productivity Score:</strong> ${result.productivityScore}%</p>
    `;
  });
}

document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    document.getElementById("report").innerHTML = "<p>Data cleared.</p>";
  });
});

renderReport();
