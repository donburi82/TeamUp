const mongoose = require("mongoose");

const messageStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  read_date: {
    type: Date,
    required: false,
  },
  delivered_date: {
    type: Date,
    required: false,
  },
});

module.exports = {
  messageStatusSchema,
  messageStatusModel: mongoose.model("MessageStatus", messageStatusSchema),
};
