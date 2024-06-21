const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const {connectDB} = require("./config/db.js");
const ChatRouter = require("./routes/chat.js");
const { handleChat } = require("./controllers/chatController.js");

require("dotenv").config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(express.static(path.join(__dirname, "public")));
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", async (message) => {
    console.log(`Received message from client: ${message}`);
    const reply = await handleChat(message);
    console.log(`Sending reply to client: ${reply}`);
    socket.emit("chat message", reply);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api", ChatRouter);
app.get("/", (req, res) => {
  res.send("Welcome!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
