
console.log("AccessLayer is active!");

const FIELD_SELECTOR = "input, textarea, select";

// Get the accessible label of a form field
function getFieldLabel(field) {
  if (field.labels && field.labels.length > 0) {
    return Array.from(field.labels)
      .map((label) => label.innerText.trim())
      .filter(Boolean)
      .join(", ");
  }

  if (field.getAttribute("aria-label")) {
    return field.getAttribute("aria-label");
  }

  if (field.placeholder) {
    return field.placeholder;
  }

  if (field.name) {
    return field.name;
  }

  return "Unlabelled field";
}

// Detect existing form fields
function detectFormFields() {
  const fields = document.querySelectorAll(FIELD_SELECTOR);

  console.log("AccessLayer detected", fields.length, "fields.");

  fields.forEach((field, index) => {
    console.log("Field", index + 1, {
      type: field.type || field.tagName.toLowerCase(),
      label: getFieldLabel(field)
    });
  });
}

detectFormFields();

// Highlight the form field currently selected by the user
document.addEventListener("focusin", (event) => {
  const field = event.target;

  if (field.matches?.(FIELD_SELECTOR)) {
    field.classList.add("accesslayer-highlight");
  }
});

document.addEventListener("focusout", (event) => {
  const field = event.target;

  if (field.matches?.(FIELD_SELECTOR)) {
    field.classList.remove("accesslayer-highlight");
  }
});

// Detect invalid fields, including dynamically added fields.
// The capture option is needed because invalid events do not bubble.
document.addEventListener(
  "invalid",
  (event) => {
    const field = event.target;

    if (field.matches?.(FIELD_SELECTOR)) {
      console.log("AccessLayer detected a form error:", {
        label: getFieldLabel(field),
        message: field.validationMessage
      });
    }
  },
  true
);

// Observe dynamically added form fields
function observeNewFormFields() {
  if (!document.body) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        if (node.matches(FIELD_SELECTOR)) {
          console.log(
            "AccessLayer detected a new field:",
            getFieldLabel(node)
          );
        }

        const newFields = node.querySelectorAll(FIELD_SELECTOR);

        newFields.forEach((field) => {
          console.log(
            "AccessLayer detected a new field:",
            getFieldLabel(field)
          );
        });
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

observeNewFormFields();

// Get additional instructions associated with a field
function getFieldInstructions(field) {
  const describedBy = field.getAttribute("aria-describedby");

  if (describedBy) {
    const instructions = describedBy
      .split(/\s+/)
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((element) => element.innerText.trim())
      .filter(Boolean);

    if (instructions.length > 0) {
      return instructions.join(" ");
    }
  }

  const parent = field.parentElement;

  if (parent) {
    const smallText = parent.querySelector("small");

    if (smallText) {
      return smallText.innerText.trim();
    }
  }

  return "No additional instructions";
}

// Collect form context without collecting user-entered values
function collectFormContext() {
  const fields = document.querySelectorAll(FIELD_SELECTOR);

  const formContext = Array.from(fields).map((field) => ({
    label: getFieldLabel(field),
    type: field.type || field.tagName.toLowerCase(),
    placeholder: field.placeholder || "",
    required: field.required,
    instructions: getFieldInstructions(field)
  }));

  console.log("AccessLayer complete form context:", formContext);

  return formContext;
}

collectFormContext();

// Detect form groups
function detectFormGroups() {
  const forms = document.querySelectorAll("form");

  const groups = Array.from(forms).map((form, index) => {
    const heading = form.querySelector("h1, h2, h3, legend");

    const fields = Array.from(
      form.querySelectorAll(FIELD_SELECTOR)
    ).map((field) => getFieldLabel(field));

    return {
      formNumber: index + 1,
      heading: heading ? heading.innerText.trim() : "Form section",
      fields
    };
  });

  console.log("AccessLayer form groups:", groups);

  return groups;
}

detectFormGroups();

// Collect page headings
function collectPageHeadings() {
  const headings = document.querySelectorAll("h1, h2, h3, h4");

  const pageHeadings = Array.from(headings).map((heading) => ({
    level: heading.tagName.toLowerCase(),
    text: heading.innerText.trim()
  }));

  console.log("AccessLayer page headings:", pageHeadings);

  return pageHeadings;
}

collectPageHeadings();

// Detect page errors
function collectPageErrors() {
  const errorSelectors = [
    '[role="alert"]',
    '[aria-invalid="true"]',
    ".error",
    ".error-message",
    ".invalid-feedback"
  ];

  const errorElements = document.querySelectorAll(
    errorSelectors.join(",")
  );

  const errors = Array.from(errorElements)
    .map((element) => ({
      text: element.innerText.trim(),
      field: element.getAttribute("for") || "",
      label: element.getAttribute("aria-label") || ""
    }))
    .filter((error) => error.text || error.label);

  console.log("AccessLayer page errors:", errors);

  return errors;
}

collectPageErrors();

// Collect basic page information
function collectPageInformation() {
  const pageInfo = {
    title: document.title,
    url: window.location.href,
    language: document.documentElement.lang || "Unknown",
    description:
      document.querySelector('meta[name="description"]')?.content ||
      "No description available"
  };

  console.log("AccessLayer page information:", pageInfo);

  return pageInfo;
}

collectPageInformation();

// Listen for Guided Mode requests from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "TOGGLE_GUIDE") {
    return;
  }

  try {
    if (typeof toggleGuidedMode === "function") {
      toggleGuidedMode();

      sendResponse({
        success: true,
        message: "Guided Mode request handled."
      });
    } else {
      sendResponse({
        success: false,
        message: "Guided Mode is unavailable on this page."
      });
    }
  } catch (error) {
    console.error("AccessLayer Guided Mode error:", error);

    sendResponse({
      success: false,
      message: "Unable to start Guided Mode."
    });
  }
});
