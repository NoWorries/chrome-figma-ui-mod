// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

function executeScriptBasedOnModals() {
  var exportData = false;
  var exportTab = "";

  if (
    document.querySelector('[class*="dsa_file_view_modal--container--"]') ||
    document.querySelector('[class*="org_view_modal--container--"]')
  ) {
    console.log("------");
    console.log("✅ Library Analytics: Open");

    var exportData = true;

    if (document.querySelector('[class*="org_view_modal--container--"]')) {
      console.log("Modal: Org wrapper");
      var modalTypeOrg = true;
    } else {
      console.log("Modal: DSA wrapper");
      var modalTypeOrg = false;
    }

    if (
      document.querySelector('[class*="dsa_file_view_overview--fileViewDSA--"]')
    ) {
      console.log("❌ Visible: Overview");
      alert("ℹ️ Switch to the Analytics tab to export data.");
    } else if (
      modalTypeOrg &&
      document.querySelector(
        '[class*="overview_stats_view--componentDescriptionAndImage--"]'
      )
    ) {
      console.log("✅ Visible: Org Component detail");
      var exportTab = "Component Detail";
    } else if (
      document.querySelector('[class*="dsa_file_view_v2--slidingPaneLeft--"]')
    ) {
      console.log("✅ Visible: Component detail");
      var exportTab = "Component Detail";
    } else if (
      modalTypeOrg &&
      document.querySelector(
        '[class*="dsa_library_view--slidingPaneContainer--"]'
      )
    ) {
      console.log("✅ Visible: All org components");
      var exportTab = "Component List";
    } else if (
      document.querySelector(
        '[class*="dsa_file_view_v2--slidingPaneContainer--"]'
      )
    ) {
      console.log("✅ Visible: All components");
      var exportTab = "Component List";
    } else {
      console.log("❌ Can't determine current tab");
    }
  } else {
    alert("Library Analytics modal is not visible.");
    console.log("❌ Library Analytics: Closed");
  }

  if (exportData && exportTab == "Component Detail") {
    // Call the function for element1
    // functionForElement1();
    // alert("component page");

    // Export Figma Component Analytics

    console.log("Running: Component Detail export");

    // Scrape content from the webpage
    const containerDiv =
      document.querySelector('div[data-testid="component-drilldown"]') ||
      document.querySelector('div[data-testid="style-drilldown"]');
    const rows = Array.from(
      containerDiv.querySelectorAll('div[class*="table--row--"]')
    );

    // Extract table headings
    const headerRow = containerDiv.querySelector(
      'div[class*="library_item_view--headerRow--"], div[class*="library_modal_stats--headerRow--"]'
    );
    const headings = Array.from(
      headerRow.querySelectorAll('div[class^="entity--sortableField--"]')
    ).map((heading) => heading.textContent.trim());

    // Extract data from each row
    const data = rows.map((row) => {
      const avatarColumn = row.querySelector(
        'div[class*="library_item_view--oneComponentViewFileNameCol--"], div[class*="stats_table--fileNameColumn--"]'
      );
      const teamNameCol = row.querySelector(
        'div[class*="library_item_view--oneComponentViewTeamCol--"]'
      );
      const componentName = avatarColumn.textContent.trim();
      const teamName = teamNameCol.textContent.trim();
      const statsColumns = Array.from(
        row.querySelectorAll('div[class*="library_modal_stats--numCol"]')
      ).map((column) => column.textContent.trim());
      return [componentName, teamName, ...statsColumns];
    });

    // Get current date
    const currentDate = new Date().toISOString().split("T")[0];

    // Get the text from the div with the partial classname
    let headerElement = "Undefined";
    let text = ""; // Declare text outside the if block

    if (modalTypeOrg) {
      console.log("✅ Org view header");

      // Select the span element that contains the text
      let element = document.querySelector(
        'span[class*="end_truncated_text--truncatedText--"]'
      );

      if (element) {
        text = element.textContent; // Now text is accessible outside this block
        console.log(text);

        // Check if the text contains " • Default library for all files"
        if (text.includes(" • Default library for all files")) {
          // Remove the unwanted part
          text = text.replace(" • Default library for all files", "");
        }
      } else {
        console.error("Element not found");
      }

      // Set headerElement to the cleaned text
      headerElement = text;
    } else {
      console.log("✅ DSA File view header");
      let element = document.querySelector(
        'h2[class*="dialog-common__title__"]'
      );
      headerElement = element ? element.textContent.trim() : "Undefined";
    }

    const headerTitle = headerElement ? headerElement : "Undefined";

    // Get the component title
    const componentTitle = document
      .querySelector('div[class*="asset_file_view_header--name--"]')
      .textContent.trim();

    // Extract additional content
    const description = document
      .querySelector(
        'div[class*="overview_stats_view--componentDescription--"]'
      )
      .textContent.trim();
    const total = document
      .querySelector('div[class*="overview_stats_view--stat--"]')
      .textContent.trim();
    const usedBy = document
      .querySelectorAll('div[class*="overview_stats_view--stat--"]')[1]
      .textContent.trim();
    const usedIn = document
      .querySelectorAll('div[class*="overview_stats_view--stat--"]')[2]
      .textContent.trim();

    // Prepend additional content to data
    const prependedData = [
      ["Library", headerTitle],
      ["Date", currentDate],
      ["Name", componentTitle],
      ["Description", description],
      ["Total", total],
      ["Used by", usedBy],
      ["Used in", usedIn],
      [],
    ];

    // Combine prependedData with existing data
    const combinedData = [...prependedData, ...data];

    // Create CSV content
    const csvComponentContent = `${combinedData
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n")}`;

    // Replace spaces and special characters with underscores
    const cleanedHeaderTitle = headerTitle.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanedComponentTitle = componentTitle.replace(/[^a-zA-Z0-9]/g, "_");

    // Generate the filename with today's date and the cleaned header title
    const fileNameDetail = `Figma-Component-Analytics_-_${cleanedHeaderTitle}_-_${cleanedComponentTitle}_-_${currentDate}.csv`;

    // Create a Blob object to download the CSV file
    const blob = new Blob([csvComponentContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a temporary link element to initiate the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileNameDetail);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("📄 Exporting: " + fileNameDetail + "");
    }
  } else if (exportData && exportTab == "Component List") {
    // Export Figma Library Analytics
    console.log("Running: Component List export");

    // Error if there are no results in table
    if (
      document.querySelectorAll('div[class*="stats_table--row--"]').length === 0
    ) {
      alert("No results found!");
    } else {
      // Scrape content from the webpage
      const containerDiv = document.querySelector(
        'div[class*="library_item_stats_by_asset--"]'
      );
      const rows = Array.from(
        containerDiv.querySelectorAll('div[class*="stats_table--row--"]')
      );

      // Extract table headings
      const headerRow = containerDiv.querySelector(
        'tr[class*="library_modal_stats--headerRow--"]'
      );

      const headings = Array.from(
        headerRow.querySelectorAll('div[class^="entity--sortableField--"]')
      ).map((heading) => heading.textContent.trim());

      // Extract data from each row
      const data = rows.map((row) => {
        const avatarColumn = row.querySelector(
          'div[class*="stats_table--avatarColumn--"]'
        );
        const componentName = avatarColumn.textContent.trim();
        const statsColumns = Array.from(
          row.querySelectorAll('div[class*="stats_table--statsColVal--"]')
        ).map((column) => column.textContent.trim());
        return [componentName, ...statsColumns];
      });

      // Get current date
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the text from the div with the partial classname
      let headerTitle;

      if (modalTypeOrg) {
        console.log("Workspace Modal");
        // Select the span element that contains the text
        let element = document.querySelector(
          "[class^='end_truncated_text--truncatedText--']"
        );
        // Extract the text content
        let text = element.innerText || element.textContent;

        // Check if the text contains " • Default library for all files"
        if (text.includes(" • Default library for all files")) {
          // Remove the unwanted part
          text = text.replace(" • Default library for all files", "");
        }

        // Log or use the cleaned text
        headerTitle = text.trim();
      } else {
        console.log("File Modal");
        headerTitle = document
          .querySelector('h2[class*="dialog-common__title__"]')
          .textContent.trim();
      } 

      // Get the analytics type from the div with the partial classname
      const analyticsType = document
        .querySelector('div[class*="dsa_file_view_tabs--dsaDropdowns"] > div[class*="dsa_select--dsaSelectWrapper--"]:first-child button')
        .textContent.trim();

      // Get the date range from the div with the partial classname
      const headerDateRange = document
        .querySelector('div[class*="dsa_file_view_tabs--dsaDropdowns"] > div[class*="dsa_select--dsaSelectWrapper--"]:nth-child(2) button')
        .textContent.trim();

      // Prepend additional content to data
      const prependedData = [
        ["Library", headerTitle],
        ["Type", analyticsType],
        ["Date", currentDate],
        ["Date range", headerDateRange],
        [],
      ];

      // Combine prependedData with existing data
      const combinedData = [...prependedData, headings, ...data];

      // Create CSV content
      const csvContent = `${combinedData
        .map((row) =>
          row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")
        )
        .join("\n")}`;

      // Replace spaces and special characters with underscores
      const cleanedHeaderTitle = headerTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanedDateRange = headerDateRange.replace(/[^a-zA-Z0-9]/g, "_");

      // Generate the filename with today's date and the cleaned header title
      const fileName = `Figma-Analytics_-_${cleanedHeaderTitle}_-_${analyticsType}_-_${cleanedDateRange}_-_${currentDate}.csv`;

      // Create a Blob object to download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a temporary link element to initiate the download
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("📄 Exporting: " + fileName + "");
      }
    }
  }
}

let modalInterval = null;

// Function to start interval when modal appears
function startModalInterval(modal) {
  if (modalInterval) return; // already running

  console.log("🔵 Modal opened, starting interval check");

  // First, inject CSS (only once)
  if (!document.getElementById("extensionStyles")) {
    const style = document.createElement("style");
    style.id = "extensionStyles";
    style.textContent = `
    .extension-download-analytics {
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      height: 24px;
      line-height: 32px;
      max-width: 200px;
      padding: 0 10px;
      background-color: transparent;
      border-radius: 6px;
      -moz-outline-radius: 6px;
      cursor: default;
      -webkit-user-select: none;
      user-select: none;
      color: var(--color-text);
      outline: 1px solid var(--color-text);
      outline-offset: -1px;
      background-clip: padding-box;
      box-sizing: border-box;
      margin-left:16px;
    }
    .extension-download-analytics:active:not(:disabled) {
      background-color: var(--color-bg-pressed);
    }
    .extension-download-analytics:focus:not(:disabled) {
      outline-width: 2px;
      outline-offset: -2px;
      background-color: var(--color-bg-pressed);
      outline-color: var(--color-bg-toolbar-selected);
    }
  `;
    document.head.appendChild(style);
  }

  modalInterval = setInterval(() => {
    let targetContainer = null;
    const modalTypeOrg = document.querySelector(
      '[class*="org_view_modal--container--"]'
    )
      ? true
      : false;

    if (
      document.querySelector('[class*="dsa_file_view_overview--fileViewDSA--"]')
    ) {
      // ❌ Visible: Overview
    } else if (
      modalTypeOrg &&
      document.querySelector(
        '[class*="overview_stats_view--componentDescriptionAndImage--"]'
      )
    ) {
      // ✅ Visible: Org Component detail
      targetContainer = Array.from(
        document.querySelectorAll(
          '[data-testid="component-drilldown"] [class*="asset_file_view_header--header--"]'
        )
      ).find((el) => el.offsetParent !== null);
    } else if (
      document.querySelector('[class*="dsa_file_view_v2--slidingPaneLeft--"]')
    ) {
      // ✅ Visible: Component detail
      targetContainer = modal.querySelector(
        '[class*="asset_file_view_header--header--"]'
      );
    } else if (
      modalTypeOrg &&
      document.querySelector(
        '[class*="dsa_library_view--slidingPaneContainer--"]'
      )
    ) {
      // ✅ Visible: All org components
      targetContainer = modal.querySelector(
        '[class*="dsa_file_view_tabs--dsaDropdowns--"]'
      );
    } else if (
      document.querySelector(
        '[class*="dsa_file_view_v2--slidingPaneContainer--"]'
      )
    ) {
      // ✅ Visible: All components
      targetContainer = modal.querySelector(
        '[class*="dsa_file_view_tabs--dsaDropdowns--"]'
      );
    } else {
      // ❌ Can't determine current tab
    }

    if (targetContainer) {
      if (!targetContainer.querySelector("#downloadAnalytics")) {
        const button = document.createElement("button");
        button.id = "downloadAnalytics";
        button.innerText = "Download analytics";
        button.className = "extension-download-analytics";
        button.onclick = () => {
          executeScriptBasedOnModals();
        };
        targetContainer.appendChild(button);
      }
    }
  }, 1000); // check every half second while modal is open
}

// Function to stop interval when modal disappears
function stopModalInterval() {
  if (modalInterval) {
    clearInterval(modalInterval);
    modalInterval = null;
    console.log("🔴 Modal closed, stopping interval");
  }
}

// Observer to detect modal open/close
const modalObserver = new MutationObserver(() => {
  const modal =
    document.querySelector('[class*="dsa_file_view_modal--container--"]') ||
    document.querySelector('[class*="org_view_modal--container--"]');

  if (modal) {
    startModalInterval(modal);
  } else {
    stopModalInterval();
  }
});

// Start watching the document body
modalObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Receive message from the extension popup to execute the script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "executeScript") {
    executeScriptBasedOnModals();
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.tabs.create({
      url: "page.html",
    });
  }
});
