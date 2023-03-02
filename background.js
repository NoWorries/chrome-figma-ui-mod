// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

// Listen for messages from the background.js
let currentlyEnabled = false;

// Action button in browser bar
chrome.action.onClicked.addListener(async (tab) => {
  console.clear();
  if (currentlyEnabled) {
    await chrome.scripting.removeCSS({
      target: {
        tabId: tab.id
      },
      files: ["inject.css"],
    });
    chrome.action.setBadgeText({ text: "",tabId: tab.id });
    currentlyEnabled = false;
    

  } else {
    // If not currently enabled, insert the CSS file
    await chrome.scripting.insertCSS({
      target: {
        tabId: tab.id
      },
      files: ["inject.css"],
    });
    
    // Set the label on the action button
    chrome.action.setBadgeText({ text: "ON", tabId: tab.id });
    
    // Set currently enabled to true
    currentlyEnabled = true;

  }
});