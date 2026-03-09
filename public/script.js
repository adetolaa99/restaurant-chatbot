var socket = io();

socket.on("connect", () => {
  console.log("WebSocket connection established");
});

socket.on("chat message", function (msg) {
  addMessage("bot", msg);
});

document.getElementById("send-button").onclick = function () {
  var input = document.getElementById("input");
  if (input.value) {
    var message = input.value;
    addMessage("user", message);
    socket.emit("chat message", message);
    input.value = "";
  }
};

function addMessage(sender, message) {
  var messages = document.getElementById("messages");
  var messageElement = document.createElement("div");
  messageElement.className = "message " + sender;
  messageElement.innerHTML = message.replace(/\n/g, "<br>");
  messages.appendChild(messageElement);

  messages.scrollTo({
    top: messages.scrollHeight,
    behavior: "smooth",
  });
}
