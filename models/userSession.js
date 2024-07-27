const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  currentOrder: { type: [String], default: [] },
  orderHistory: { type: [[String]], default: [] },
  expectingItemSelection: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserSession", UserSessionSchema);
