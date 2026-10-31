// Find the status message area
const statusMessage = document.getElementById("statusMessage");

// Find the popup buttons
const guideButton = document.getElementById("guideButton");
const largeTextButton = document.getElementById("largeTextButton");
const contrastButton = document.getElementById("contrastButton");
const keyboardButton = document.getElementById("keyboardButton");
const focusButton = document.getElementById("focusButton");

// Show a message in the popup
function showStatus(message) {
  statusMessage.textContent = message;
}

// Send a message to the content script in the active tab
function sendMessageToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    if (!activeTab || !activeTab.id) {
      showStatus("Could not find the active tab.");
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, message, (response) => {
      if (chrome.runtime.lastError) {
        showStatus(
          "AccessLayer couldn't connect to this page. Try a normal website or reload the page."
        );
        return;
      }

      showStatus(response?.message || "Guided Mode toggled.");
    });
  });
}

// Guided Mode: popup.js → content.js → guide.js
guideButton.addEventListener("click", () => {
  sendMessageToActiveTab({ type: "TOGGLE_GUIDE" });
});

// These controls are placeholders for now
largeTextButton.addEventListener("click", () => {
  showStatus("Large Text is not connected yet.");
});

contrastButton.addEventListener("click", () => {
  showStatus("High Contrast is not connected yet.");
});

keyboardButton.addEventListener("click", () => {
  showStatus("Keyboard Navigation is not connected yet.");
});

focusButton.addEventListener("click", () => {
  showStatus("Focus Highlight is not connected yet.");
});