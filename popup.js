
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const chatArea = document.getElementById("chatArea");

function sendMessage() {
  const message = userInput.value.trim();

  if (message === "") {
    return;
  }

  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = message;

  chatArea.appendChild(userMessage);

  userInput.value = "";
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
