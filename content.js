
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


// Detect invalid form fields
function detectFormErrors() {
  const fields = document.querySelectorAll(
    "input, textarea, select"
  );

  fields.forEach((field) => {
    field.addEventListener("invalid", () => {
      console.log("AccessLayer detected a form error:", {
        label: getFieldLabel(field),
        message: field.validationMessage
      });
    });
  });
}

detectFormErrors();



function observeNewFormFields() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        if (node.matches("input, textarea, select")) {
          console.log(
            "AccessLayer detected a new field:",
            getFieldLabel(node)
          );
        }

        const newFields = node.querySelectorAll(
          "input, textarea, select"
        );

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


function getFieldInstructions(field) {
  const describedBy = field.getAttribute("aria-describedby");

  if (describedBy) {
    const instruction = document.getElementById(describedBy);

    if (instruction) {
      return instruction.innerText.trim();
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



function collectFormContext() {
  const fields = document.querySelectorAll(
    "input, textarea, select"
  );

  const formContext = Array.from(fields).map((field) => ({
    label: getFieldLabel(field),
    type: field.type || field.tagName.toLowerCase(),
    placeholder: field.placeholder || "",
    required: field.required,
    instructions: getFieldInstructions(field),
  }));

  console.log("AccessLayer complete form context:", formContext);

  return formContext;
}

collectFormContext();


function detectFormGroups() {
  const forms = document.querySelectorAll("form");

  const groups = Array.from(forms).map((form, index) => {
    const heading = form.querySelector(
      "h1, h2, h3, legend"
    );

    const fields = Array.from(
      form.querySelectorAll("input, textarea, select")
    ).map((field) => getFieldLabel(field));

    return {
      formNumber: index + 1,
      heading: heading ? heading.innerText.trim() : "Form section",
      fields: fields
    };
  });

  console.log("AccessLayer form groups:", groups);
  return groups;
}

detectFormGroups();


function collectPageHeadings() {
  const headings = document.querySelectorAll(
    "h1, h2, h3, h4"
  );

  const pageHeadings = Array.from(headings).map((heading) => ({
    level: heading.tagName.toLowerCase(),
    text: heading.innerText.trim()
  }));

  console.log("AccessLayer page headings:", pageHeadings);
  return pageHeadings;
}

collectPageHeadings();



function collectPageErrors() {
  const errorSelectors = [
    '[role="alert"]',
    '[aria-invalid="true"]',
    '.error',
    '.error-message',
    '.invalid-feedback'
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



function collectPageInformation() {
  const pageInfo = {
    title: document.title,
    url: window.location.href,
    language: document.documentElement.lang || "Unknown",
    description:
      document.querySelector('meta[name="description"]')
        ?.content || "No description available"
  };

  console.log("AccessLayer page information:", pageInfo);
  return pageInfo;
}

collectPageInformation();


// Create the AccessLayer floating button

const floatingButton = document.createElement("button");

floatingButton.id = "accesslayer-floating-button";
floatingButton.textContent = "AccessLayer";
floatingButton.type = "button";

// Create the assistant panel

const assistantPanel = document.createElement("div");
assistantPanel.id = "accesslayer-panel";
assistantPanel.style.display = "none";

const panelHeading = document.createElement("h3");
panelHeading.textContent = "AccessLayer Assistant";

const welcomeMessage = document.createElement("p");
welcomeMessage.textContent =
  "Hello! How can I help you understand this webpage?";

const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.type = "button";

assistantPanel.appendChild(panelHeading);
assistantPanel.appendChild(welcomeMessage);
assistantPanel.appendChild(closeButton);

// Open and close the assistant panel

floatingButton.addEventListener("click", () => {
  assistantPanel.style.display =
    assistantPanel.style.display === "none" ? "block" : "none";
});

closeButton.addEventListener("click", () => {
  assistantPanel.style.display = "none";
});

// Add everything to the webpage

document.body.appendChild(floatingButton);
document.body.appendChild(assistantPanel);




