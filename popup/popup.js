// TimeLens Popup Script - Enhanced Version

// Site categories for productivity classification
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
  "pinterest.com": "unproductive"
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

function formatTimeShort(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000);
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function calculateProductivityScore(timeData) {
  let totalTime = 0;
  let productiveTime = 0;
  
  for (const [domain, time] of Object.entries(timeData)) {
    totalTime += time;
    if (getCategory(domain) === "productive") {
      productiveTime += time;
    }
  }
  
  return totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
}

function renderPopup() {
  chrome.storage.local.get(["timeData", "trackingPaused"], ({ timeData, trackingPaused }) => {
    if (!timeData || Object.keys(timeData).length === 0) {
      document.getElementById("topSites").innerHTML = '<div class="no-data">Start browsing to see data</div>';
      return;
    }

    // Calculate totals
    let totalTime = 0;
    let productiveTime = 0;
    const siteEntries = Object.entries(timeData);
    
    for (const [domain, time] of siteEntries) {
      totalTime += time;
      if (getCategory(domain) === "productive") {
        productiveTime += time;
      }
    }

    // Update stats
    document.getElementById("todayTotal").textContent = formatTimeShort(totalTime);
    document.getElementById("productiveTime").textContent = formatTimeShort(productiveTime);
    
    const productivityScore = calculateProductivityScore(timeData);
    document.getElementById("productivityScore").textContent = `${productivityScore}%`;
    
    // Update productivity badge color
    const badge = document.getElementById("productivityBadge");
    if (productivityScore >= 70) {
      badge.style.background = "linear-gradient(135deg, #48bb78, #38a169)";
    } else if (productivityScore >= 40) {
      badge.style.background = "linear-gradient(135deg, #ed8936, #dd6b20)";
    } else {
      badge.style.background = "linear-gradient(135deg, #f56565, #e53e3e)";
    }

    // Sort sites by time and show top 5
    const sortedSites = siteEntries
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const topSitesHtml = sortedSites.map(([domain, time]) => {
      const category = getCategory(domain);
      const percentage = totalTime > 0 ? Math.round((time / totalTime) * 100) : 0;
      
      return `
        <div class="site-item">
          <div class="site-info">
            <div class="site-name">${domain}</div>
            <div class="site-category ${category}">${category}</div>
          </div>
          <div class="site-time">${formatTimeShort(time)} (${percentage}%)</div>
        </div>
      `;
    }).join("");

    document.getElementById("topSites").innerHTML = topSitesHtml;

    // Update pause button state
    const pauseBtn = document.getElementById("pauseTracking");
    const pauseIcon = document.getElementById("pauseIcon");
    const pauseText = document.getElementById("pauseText");
    
    if (trackingPaused) {
      pauseIcon.textContent = "▶️";
      pauseText.textContent = "Resume";
      pauseBtn.style.background = "linear-gradient(135deg, #48bb78, #38a169)";
    } else {
      pauseIcon.textContent = "⏸️";
      pauseText.textContent = "Pause";
      pauseBtn.style.background = "";
    }
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  renderPopup();

  // Open dashboard button
  document.getElementById("openDashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/dashboard.html") });
    window.close();
  });

  // Pause/Resume tracking button
  document.getElementById("pauseTracking").addEventListener("click", () => {
    chrome.storage.local.get(["trackingPaused"], ({ trackingPaused }) => {
      const newState = !trackingPaused;
      chrome.storage.local.set({ trackingPaused: newState }, () => {
        // Send message to background script to update tracking state
        chrome.runtime.sendMessage({ action: "toggleTracking", paused: newState });
        renderPopup(); // Re-render to update button state
      });
    });
  });
});

// Listen for storage changes to update popup in real-time
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && (changes.timeData || changes.trackingPaused)) {
    renderPopup();
  }
});
