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
    // ...existing code for exporting component detail...
    // (copy unchanged from your original background.js)
    // ...existing code...
    // [The full code for this block is unchanged]
  } else if (exportData && exportTab == "Component List") {
    // ...existing code for exporting component list...
    // (copy unchanged from your original background.js)
    // ...existing code...
    // [The full code for this block is unchanged]
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
        '[class*="dsa_file_view_tabs--dropdownContainer--"]'
      );
    } else if (
      document.querySelector(
        '[class*="dsa_file_view_v2--slidingPaneContainer--"]'
      )
    ) {
      // ✅ Visible: All components
      targetContainer = modal.querySelector(
        '[class*="dsa_file_view_tabs--dropdownContainer--"]'
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