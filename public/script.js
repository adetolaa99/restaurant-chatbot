/**
 * This script handles the WebSocket connection and user interface for a chat application.
 * It manages sending and receiving messages, and updating the chat display.
 */

// Initialize Socket.io connection
var socket = io();

// Event listener for successful WebSocket connection
socket.on("connect", () => {
  console.log("WebSocket connection established");
});

/**
 * Event listener for incoming chat messages from the server.
 * Adds the received message to the chat display.
 */
socket.on("chat message", function (msg) {
  addMessage("bot", msg);
});

/**
 * Event handler for the send button.
 * Sends the user's message to the server and clears the input field.
 */
document.getElementById("send-button").onclick = function () {
  var input = document.getElementById("input");
  if (input.value) {
    var message = input.value;
    addMessage("user", message);
    socket.emit("chat message", message);
    input.value = "";
  }
};

/**
 * Adds a new message to the chat display.
 *
 * @param {string} sender - The sender of the message ("user" or "bot").
 * @param {string} message - The content of the message.
 */
function addMessage(sender, message) {
  var messages = document.getElementById("messages");
  var messageElement = document.createElement("div");
  messageElement.className = "message " + sender;
  messageElement.innerHTML = message.replace(/\n/g, "<br>");
  messages.appendChild(messageElement);

  // Scroll to the bottom of the chat
  messages.scrollTo({
    top: messages.scrollHeight,
    behavior: "smooth",
  });
}
