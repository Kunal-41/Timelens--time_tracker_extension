let currentTab = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (currentTab !== null && startTime !== null) {
    const timeSpent = Date.now() - startTime;
    const { url } = await chrome.tabs.get(currentTab);
    logTime(url, timeSpent);
  }

  currentTab = tabId;
  startTime = Date.now();
});

function logTime(url, time) {
  const domain = new URL(url).hostname;
  chrome.storage.local.get(["timeData"], (result) => {
    const timeData = result.timeData || {};
    timeData[domain] = (timeData[domain] || 0) + time;
    chrome.storage.local.set({ timeData });
  });
}
