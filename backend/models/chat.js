const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageFrom: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  sentDate: {
    type: Date,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  messageData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  messageStatus: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      read_date: {
        type: Date,
        default: null,
      },
    },
  ],
});

const chatRoomSchema = new mongoose.Schema({
  lastTS: { type: Date, default: Date.now },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isGroup: {
    type: Boolean,
  },
  groupId: { type: String },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const Message = mongoose.model("Message", messageSchema);
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = {
  Message,
  ChatRoom,
};
