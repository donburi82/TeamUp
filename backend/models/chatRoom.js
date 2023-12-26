const mongoose = require("mongoose");
const { messageSchema } = require("./message.js");

const chatRoomSchema = new mongoose.Schema({
  chatRoomImage: { data: Buffer, contentType: String },
  chatRoomName: {
    type: String,
    required: true,
  },
  message: [messageSchema],
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
