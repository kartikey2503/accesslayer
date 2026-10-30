
console.log("AccessLayer is active!");

function getFieldLabel(field) {
  // Check whether the field has an associated label
  if (field.labels && field.labels.length > 0) {
    return field.labels[0].innerText.trim();
  }

  // Check placeholder text
  if (field.placeholder) {
    return field.placeholder;
  }

  // Check accessible label
  if (field.getAttribute("aria-label")) {
    return field.getAttribute("aria-label");
  }

  // Check name attribute
  if (field.name) {
    return field.name;
  }

  return "Unlabelled field";
}

function detectFormFields() {
  const fields = document.querySelectorAll(
    "input, textarea, select"
  );

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

  if (field.matches("input, textarea, select")) {
    field.classList.add("accesslayer-highlight");
  }
});

document.addEventListener("focusout", (event) => {
  const field = event.target;

  if (field.matches("input, textarea, select")) {
    field.classList.remove("accesslayer-highlight");
  }
});
