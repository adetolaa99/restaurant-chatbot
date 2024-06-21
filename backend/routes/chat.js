const express = require("express");
const chatController = require("../controllers/chatController");

const ChatRouter = express.Router();

ChatRouter.post("/chat", chatController.handleChat);

module.exports = ChatRouter;
