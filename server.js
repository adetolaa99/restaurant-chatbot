const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");

const { connectDB } = require("./config/db.js");
const chatController = require("./controllers/chatController.js");

require("dotenv").config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({ secret: "chatbot-secret", resave: false, saveUninitialized: true })
);

app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Websocket connected :)");

  // Send initial options to the user
  socket.emit(
    "chat message",
    `
    Welcome to A's Restaurant! Please choose an option below:
    <br>Select 1 to Place an order
    <br>Select 99 to checkout order
    <br>Select 98 to see order history
    <br>Select 97 to see current order
    <br>Select 0 to cancel order
  `
  );

  socket.on("chat message", async (msg) => {
    console.log("message: " + msg);
    const sessionId = socket.id;
    try {
      const reply = await chatController.handleChat(msg, sessionId);
      socket.emit("chat message", reply);
    } catch (error) {
      console.error("Error handling chat message:", error);
      socket.emit("chat message", "An error occurred. Please try again.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Websocket disconnected :(");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`The app is running on http://localhost:${PORT}`);
});
