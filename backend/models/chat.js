const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  lastTS: { type: Date, default: Date.now },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  isGroup: {
    type: Boolean,
  },
  groupId: { type: String },
  messages: [
    {
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
            required: true,
            ref: "User",
          },
          read_date: {
            type: Date,
            required: false,
          },
        },
      ],
    },
  ],
});

const chatRoomModel = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = {
  chatRoomModel,
};
