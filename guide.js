// Stores whether guided mode is currently active
let isGuidedModeActive = false;

// Stores the current field being explained
let currentFieldIndex = 0;

// Information about each form field
const fieldGuides = [
    {
        id: "fullName",
        title: "Full Name",
        explanation: "Enter your complete name as it appears on your official documents."
    },
    {
        id: "email",
        title: "Email Address",
        explanation: "Enter a valid email address. We may use it to contact you about your application."
    },
    {
        id: "address",
        title: "Residential Address",
        explanation: "Enter the address where you currently live, including your city and PIN code."
    },
    {
        id: "applicationCategory",
        title: "Application Category",
        explanation: "This asks which group your application belongs to. Choose the category that applies to you. If you are unsure, check the application's eligibility guidelines."
    }
];

// Main function called by the Chrome extension
function toggleGuidedMode() {
    const form = document.getElementById("accessForm");

    if (!form) {
        alert("AccessLayer: No supported form found on this page.");
        return;
    }

    if (isGuidedModeActive) {
        stopGuidedMode();
    } else {
        startGuidedMode();
    }
}

// Starts guided mode
function startGuidedMode() {
    isGuidedModeActive = true;
    currentFieldIndex = 0;

    showGuidancePanel();
    showCurrentField();
}

// Creates the guidance panel
function showGuidancePanel() {
    if (document.getElementById("accesslayer-panel")) {
        return;
    }

    const panel = document.createElement("div");
    panel.id = "accesslayer-panel";

    panel.innerHTML = `
        <h3>AccessLayer Guide</h3>
        <p id="accesslayer-progress"></p>
        <h4 id="accesslayer-title"></h4>
        <p id="accesslayer-explanation"></p>

        <div class="accesslayer-buttons">
            <button id="accesslayer-previous" type="button">Previous</button>
            <button id="accesslayer-next" type="button">Next</button>
            <button id="accesslayer-close" type="button">Close</button>
        </div>
    `;

    document.body.appendChild(panel);

    document.getElementById("accesslayer-previous")
        .addEventListener("click", previousField);

    document.getElementById("accesslayer-next")
        .addEventListener("click", nextField);

    document.getElementById("accesslayer-close")
        .addEventListener("click", stopGuidedMode);
}

// Displays the current field's explanation
function showCurrentField() {
    const field = fieldGuides[currentFieldIndex];
    const element = document.getElementById(field.id);

    if (!element) {
        alert("AccessLayer: A guided form field could not be found.");
        stopGuidedMode();
        return;
    }

    // Remove highlighting from the previous field
    document.querySelectorAll(".accesslayer-highlight")
        .forEach(item => item.classList.remove("accesslayer-highlight"));

    // Highlight and focus the current field
    element.classList.add("accesslayer-highlight");
    element.focus();

    // Update the guidance panel
    document.getElementById("accesslayer-progress").textContent =
        `Step ${currentFieldIndex + 1} of ${fieldGuides.length}`;

    document.getElementById("accesslayer-title").textContent =
        field.title;

    document.getElementById("accesslayer-explanation").textContent =
        field.explanation;

    // Update navigation buttons
    document.getElementById("accesslayer-previous").disabled =
        currentFieldIndex === 0;

    document.getElementById("accesslayer-next").textContent =
        currentFieldIndex === fieldGuides.length - 1
            ? "Finish"
            : "Next";
}

// Moves to the next field
function nextField() {
    if (currentFieldIndex < fieldGuides.length - 1) {
        currentFieldIndex++;
        showCurrentField();
    } else {
        stopGuidedMode();
        alert("You have completed the guided walkthrough!");
    }
}

// Moves to the previous field
function previousField() {
    if (currentFieldIndex > 0) {
        currentFieldIndex--;
        showCurrentField();
    }
}

// Stops guided mode
function stopGuidedMode() {
    isGuidedModeActive = false;

    document.querySelectorAll(".accesslayer-highlight")
        .forEach(item => item.classList.remove("accesslayer-highlight"));

    const panel = document.getElementById("accesslayer-panel");

    if (panel) {
        panel.remove();
    }
}