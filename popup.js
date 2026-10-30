
// Find the status message area
const statusMessage = document.getElementById("statusMessage");

// Find all popup buttons
const guideButton = document.getElementById("guideButton");
const largeTextButton = document.getElementById("largeTextButton");
const contrastButton = document.getElementById("contrastButton");
const keyboardButton = document.getElementById("keyboardButton");
const focusButton = document.getElementById("focusButton");

// Update the status message
function showStatus(message) {
  statusMessage.textContent = message;
}

// Guided mode
guideButton.addEventListener("click", () => {
  showStatus("Guided Mode integration is coming next!");
});

// Larger text
largeTextButton.addEventListener("click", () => {
  showStatus("Larger Text selected!");
});

// High contrast
contrastButton.addEventListener("click", () => {
  showStatus("High Contrast selected!");
});

// Keyboard help
keyboardButton.addEventListener("click", () => {
  showStatus("Keyboard Help selected!");
});

// Clear focus
focusButton.addEventListener("click", () => {
  showStatus("Clear Focus selected!");
});