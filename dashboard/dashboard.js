// TimeLens Dashboard Script - Enhanced Version

// Extended site categories for better productivity classification
const categories = {
  // Productive sites
  "github.com": "productive",
  "stackoverflow.com": "productive",
  "developer.mozilla.org": "productive",
  "docs.google.com": "productive",
  "notion.so": "productive",
  "trello.com": "productive",
  "slack.com": "productive",
  "figma.com": "productive",
  "codepen.io": "productive",
  "medium.com": "productive",
  "dev.to": "productive",
  "leetcode.com": "productive",
  "coursera.org": "productive",
  "udemy.com": "productive",
  "khanacademy.org": "productive",
  "w3schools.com": "productive",
  "mdn.dev": "productive",
  "freecodecamp.org": "productive",
  "codecademy.com": "productive",
  "replit.com": "productive",
  "codesandbox.io": "productive",
  "jsfiddle.net": "productive",
  "gitlab.com": "productive",
  "bitbucket.org": "productive",
  "atlassian.com": "productive",
  "linear.app": "productive",
  "asana.com": "productive",
  "monday.com": "productive",
  
  // Unproductive sites
  "facebook.com": "unproductive",
  "instagram.com": "unproductive",
  "twitter.com": "unproductive",
  "x.com": "unproductive",
  "youtube.com": "unproductive",
  "tiktok.com": "unproductive",
  "reddit.com": "unproductive",
  "9gag.com": "unproductive",
  "twitch.tv": "unproductive",
  "netflix.com": "unproductive",
  "hulu.com": "unproductive",
  "disneyplus.com": "unproductive",
  "primevideo.com": "unproductive",
  "buzzfeed.com": "unproductive",
  "pinterest.com": "unproductive",
  "snapchat.com": "unproductive",
  "discord.com": "unproductive",
  "whatsapp.com": "unproductive",
  "telegram.org": "unproductive"
};

function getCategory(domain) {
  // Check exact match first
  if (categories[domain]) {
    return categories[domain];
  }
  
  // Check for subdomain matches
  for (const [siteDomain, category] of Object.entries(categories)) {
    if (domain.includes(siteDomain)) {
      return category;
    }
  }
  
  return "neutral";
}

function formatTime(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function generateReport(timeData) {
  let total = 0;
  let productive = 0;
  let unproductive = 0;
  let neutral = 0;

  for (const [domain, time] of Object.entries(timeData)) {
    total += time;
    const category = getCategory(domain);
    
    switch (category) {
      case "productive":
        productive += time;
        break;
      case "unproductive":
        unproductive += time;
        break;
      default:
        neutral += time;
    }
  }

  return {
    totalMinutes: total / 60000,
    productiveMinutes: productive / 60000,
    unproductiveMinutes: unproductive / 60000,
    neutralMinutes: neutral / 60000,
    productivityScore: total ? ((productive / total) * 100).toFixed(1) : 0,
    sitesVisited: Object.keys(timeData).length
  };
}

let timeChart = null;
let productivityChart = null;

function createCharts(timeData) {
  const sortedSites = Object.entries(timeData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Time Distribution Chart
  const timeCtx = document.getElementById('timeChart').getContext('2d');
  if (timeChart) timeChart.destroy();
  
  timeChart = new Chart(timeCtx, {
    type: 'doughnut',
    data: {
      labels: sortedSites.map(([domain]) => domain),
      datasets: [{
        data: sortedSites.map(([, time]) => Math.round(time / 60000)),
        backgroundColor: [
          '#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565',
          '#38b2ac', '#ecc94b', '#ed64a6', '#4fd1c7', '#fc8181'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed} minutes`;
            }
          }
        }
      }
    }
  });

  // Productivity Breakdown Chart
  const result = generateReport(timeData);
  const productivityCtx = document.getElementById('productivityChart').getContext('2d');
  if (productivityChart) productivityChart.destroy();
  
  productivityChart = new Chart(productivityCtx, {
    type: 'bar',
    data: {
      labels: ['Productive', 'Neutral', 'Unproductive'],
      datasets: [{
        label: 'Time (minutes)',
        data: [
          Math.round(result.productiveMinutes),
          Math.round(result.neutralMinutes),
          Math.round(result.unproductiveMinutes)
        ],
        backgroundColor: ['#48bb78', '#a0aec0', '#f56565'],
        borderColor: ['#38a169', '#718096', '#e53e3e'],
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} minutes`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#e2e8f0'
          },
          ticks: {
            callback: function(value) {
              return value + 'm';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function renderDetailedReport(timeData, filter = 'all') {
  const reportDiv = document.getElementById("detailedReport");
  
  if (!timeData || Object.keys(timeData).length === 0) {
    reportDiv.innerHTML = '<div class="no-data">No data available yet. Start browsing to see your activity!</div>';
    return;
  }

  const result = generateReport(timeData);
  const sortedSites = Object.entries(timeData)
    .filter(([domain]) => {
      if (filter === 'all') return true;
      return getCategory(domain) === filter;
    })
    .sort(([,a], [,b]) => b - a);

  const totalTime = Object.values(timeData).reduce((sum, time) => sum + time, 0);

  const reportHtml = sortedSites.map(([domain, time]) => {
    const category = getCategory(domain);
    const percentage = totalTime > 0 ? ((time / totalTime) * 100).toFixed(1) : 0;
    
    return `
      <div class="report-item">
        <div class="report-info">
          <div class="report-domain">${domain}</div>
          <div class="site-category ${category}">${category}</div>
        </div>
        <div class="report-stats">
          <div class="report-time">${formatTime(time)}</div>
          <div class="report-percentage">${percentage}%</div>
        </div>
      </div>
    `;
  }).join("");

  reportDiv.innerHTML = reportHtml || '<div class="no-data">No sites match the selected filter.</div>';
}

function updateStats(result) {
  document.getElementById("totalTime").textContent = formatTime(result.totalMinutes * 60000);
  document.getElementById("productiveTime").textContent = formatTime(result.productiveMinutes * 60000);
  document.getElementById("productivityScore").textContent = `${result.productivityScore}%`;
  document.getElementById("sitesVisited").textContent = result.sitesVisited;
}

function renderDashboard() {
  chrome.storage.local.get("timeData", ({ timeData }) => {
    if (!timeData || Object.keys(timeData).length === 0) {
      document.getElementById("detailedReport").innerHTML = '<div class="no-data">No data available yet. Start browsing to see your activity!</div>';
      
      // Reset stats
      document.getElementById("totalTime").textContent = "0h 0m";
      document.getElementById("productiveTime").textContent = "0h 0m";
      document.getElementById("productivityScore").textContent = "0%";
      document.getElementById("sitesVisited").textContent = "0";
      
      return;
    }

    const result = generateReport(timeData);
    updateStats(result);
    createCharts(timeData);
    renderDetailedReport(timeData);
  });
}

function exportData() {
  chrome.storage.local.get("timeData", ({ timeData }) => {
    if (!timeData) {
      alert("No data to export!");
      return;
    }

    const result = generateReport(timeData);
    const exportData = {
      generatedAt: new Date().toISOString(),
      summary: result,
      detailedData: Object.entries(timeData).map(([domain, time]) => ({
        domain,
        timeMinutes: Math.round(time / 60000),
        category: getCategory(domain),
        percentage: ((time / Object.values(timeData).reduce((sum, t) => sum + t, 0)) * 100).toFixed(1)
      })).sort((a, b) => b.timeMinutes - a.timeMinutes)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timelens-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();

  // Clear data button
  document.getElementById("clearBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tracking data? This action cannot be undone.")) {
      chrome.storage.local.clear(() => {
        renderDashboard();
        alert("All data has been cleared.");
      });
    }
  });

  // Export data button
  document.getElementById("exportBtn").addEventListener("click", exportData);

  // Category filter
  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    chrome.storage.local.get("timeData", ({ timeData }) => {
      renderDetailedReport(timeData, e.target.value);
    });
  });
});

// Listen for storage changes to update dashboard in real-time
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.timeData) {
    renderDashboard();
  }
});
