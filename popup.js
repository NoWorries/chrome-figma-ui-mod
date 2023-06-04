
const function1 = document.getElementById('button1');
const function2 = document.getElementById('button2');
  
async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

// Listen for messages from the background.js
let currentlyEnabled = false;

function1.addEventListener('click', async () => {
    const tab = await getCurrentTab();

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

  function2.addEventListener('click', async function () {
    // Get the current tab
    const currentTab = await getCurrentTab();
  
    // Send a message to the content script in the current tab to execute the script
    chrome.tabs.sendMessage(currentTab.id, 'executeScript');
  });