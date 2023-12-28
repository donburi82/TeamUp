const mongoose = require("mongoose");
const { messageSchema } = require("./message.js");

const chatRoomSchema = new mongoose.Schema({
  lastTS: { type: Date, default: Date.now },
  members: [{ type: String }],
  isGroup: {
    type: Boolean,
  },
  groupId: { type: String },
  message: [messageSchema],
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
