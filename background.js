"use strict";

// Listen for messages from popup or content script (if needed)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // You can handle background tasks here if needed
});

// On install/update, open info page
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.tabs.create({
      url: "page.html",
    });
  }
});