const socket = io("http://localhost:5000");

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
  sendMessage();
});

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

const sendMessage = () => {
  const message = chatInput.value.trim();
  if (message) {
    appendMessage(message, "user");
    socket.emit("chat message", message);
    chatInput.value = "";
  }
};

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("chat message", (msg) => {
  appendMessage(msg, "bot");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});
