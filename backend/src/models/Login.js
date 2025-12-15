const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: String,
  ipAddress: String,
  userAgent: String,
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoginLog", loginLogSchema);
