const socket = io("http://localhost:5000"); // Ensure this URL is correct

const chatContainer = document.getElementById("chat-container");
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const appendMessage = (text, sender) => {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}-message`;
  messageElement.innerText = text;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (message) {
    appendMessage(message, "user");
    socket.emit("chat message", message);
    chatInput.value = "";
  }
});

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

socket.on("chat message", (msg) => {
  appendMessage(msg, "bot");
});

appendMessage(
  "Select 1 to Place an order\nSelect 99 to checkout order\nSelect 98 to see order history\nSelect 97 to see current order\nSelect 0 to cancel order",
  "bot"
);
