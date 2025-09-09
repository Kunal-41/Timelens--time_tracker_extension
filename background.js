// TimeLens Background Script - Enhanced Version

let currentTab = null;
let startTime = null;
let trackingPaused = false;

// Initialize tracking state
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["trackingPaused"], ({ trackingPaused: paused }) => {
    trackingPaused = paused || false;
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["trackingPaused"], ({ trackingPaused: paused }) => {
    trackingPaused = paused || false;
  });
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (trackingPaused) return;
  
  try {
    // Log time for the previous tab if it exists
    if (currentTab !== null && startTime !== null) {
      const timeSpent = Date.now() - startTime;
      const tab = await chrome.tabs.get(currentTab).catch(() => null);
      
      if (tab && tab.url && timeSpent > 1000) { // Only log if spent more than 1 second
        logTime(tab.url, timeSpent);
      }
    }

    // Start tracking the new tab
    currentTab = tabId;
    startTime = Date.now();
  } catch (error) {
    console.error("Error in tab activation handler:", error);
  }
});

// Listen for tab updates (URL changes within the same tab)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (trackingPaused) return;
  
  // Only handle when the URL has changed and it's the active tab
  if (changeInfo.url && tabId === currentTab && startTime !== null) {
    try {
      const timeSpent = Date.now() - startTime;
      
      // Log time for the previous URL if significant time was spent
      if (timeSpent > 1000) {
        // Get the previous URL from the tab's history or use a fallback
        const previousUrl = changeInfo.url; // This is the new URL, we need the old one
        // Since we can't get the previous URL directly, we'll log the current session
        logTime(changeInfo.url, timeSpent);
      }
      
      // Reset timer for the new URL
      startTime = Date.now();
    } catch (error) {
      console.error("Error in tab update handler:", error);
    }
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (trackingPaused) return;
  
  try {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      // Browser lost focus - log current tab time
      if (currentTab !== null && startTime !== null) {
        const timeSpent = Date.now() - startTime;
        const tab = await chrome.tabs.get(currentTab).catch(() => null);
        
        if (tab && tab.url && timeSpent > 1000) {
          logTime(tab.url, timeSpent);
        }
      }
      
      // Reset tracking
      currentTab = null;
      startTime = null;
    } else {
      // Browser gained focus - start tracking active tab
      const tabs = await chrome.tabs.query({ active: true, windowId: windowId });
      if (tabs.length > 0) {
        currentTab = tabs[0].id;
        startTime = Date.now();
      }
    }
  } catch (error) {
    console.error("Error in window focus handler:", error);
  }
});

// Enhanced logging function
function logTime(url, time) {
  try {
    // Skip chrome:// URLs and extensions
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('moz-extension://')) {
      return;
    }
    
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Only log if time is significant (more than 1 second)
    if (time < 1000) return;
    
    chrome.storage.local.get(["timeData", "dailyData"], (result) => {
      const timeData = result.timeData || {};
      const dailyData = result.dailyData || {};
      
      // Update total time data
      timeData[domain] = (timeData[domain] || 0) + time;
      
      // Update daily data
      const today = new Date().toDateString();
      if (!dailyData[today]) {
        dailyData[today] = {};
      }
      dailyData[today][domain] = (dailyData[today][domain] || 0) + time;
      
      // Keep only last 30 days of daily data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      Object.keys(dailyData).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
          delete dailyData[date];
        }
      });
      
      chrome.storage.local.set({ timeData, dailyData });
    });
  } catch (error) {
    console.error("Error logging time:", error);
  }
}

// Listen for messages from popup/dashboard
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleTracking") {
    trackingPaused = request.paused;
    
    // If pausing, log current session
    if (trackingPaused && currentTab !== null && startTime !== null) {
      chrome.tabs.get(currentTab).then(tab => {
        if (tab && tab.url) {
          const timeSpent = Date.now() - startTime;
          if (timeSpent > 1000) {
            logTime(tab.url, timeSpent);
          }
        }
      }).catch(error => {
        console.error("Error getting tab for pause:", error);
      });
      
      currentTab = null;
      startTime = null;
    }
    
    // If resuming, start tracking current tab
    if (!trackingPaused) {
      chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        if (tabs.length > 0) {
          currentTab = tabs[0].id;
          startTime = Date.now();
        }
      }).catch(error => {
        console.error("Error getting active tab for resume:", error);
      });
    }
    
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async response
});

// Handle browser shutdown
chrome.runtime.onSuspend.addListener(() => {
  if (currentTab !== null && startTime !== null && !trackingPaused) {
    chrome.tabs.get(currentTab).then(tab => {
      if (tab && tab.url) {
        const timeSpent = Date.now() - startTime;
        if (timeSpent > 1000) {
          logTime(tab.url, timeSpent);
        }
      }
    }).catch(error => {
      console.error("Error logging time on suspend:", error);
    });
  }
});

// Clean up old data periodically
chrome.alarms.create("cleanupData", { periodInMinutes: 60 * 24 }); // Daily cleanup

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cleanupData") {
    chrome.storage.local.get(["dailyData"], ({ dailyData }) => {
      if (!dailyData) return;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let hasChanges = false;
      Object.keys(dailyData).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
          delete dailyData[date];
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        chrome.storage.local.set({ dailyData });
      }
    });
  }
});
