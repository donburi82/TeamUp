const { chatRoomModel } = require("../models/chat");
// const { messageModel } = require("../models/chat");
// const { messageStatusModel } = require("../models/chat");

const createChatRoom = async (members, groupId = null) => {
  try {
    let room;
    if (groupId) {
      room = chatRoomModel.create({
        members,
        isGroup: true,
        groupId,
      });
    } else {
      room = chatRoomModel.create({
        members,
        isGroup: false,
      });
    }
    return room;
  } catch (error) {
    throw new Error("chatRoom creation fail");
  }
};

const updateChatRoom = async (userId, chatRoomId, isJoin) => {
  if (isJoin) {
    try {
      const room = await chatRoomModel.findById(chatRoomId);
      if (room) {
        if (!room.members.includes(userId)) {
          room.members.push(userId);
          await room.save();
        } else {
          throw new Error("user already in chatRoom");
        }
      } else {
        throw new Error("Chat room not found");
      }
      return room;
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    try {
      const room = await chatRoomModel.findById(chatRoomId);
      if (room) {
        console.log(userId);
        room.members = room.members.filter((member) => member != userId);
        await room.save();
      } else {
        throw new Error("Chat room not found");
      }
    } catch (error) {
      throw new Error(`Failed to leave chat room${error.message}`);
    }
  }
};

const deleteChatRoom = async (chatRoomId) => {
  try {
    const chatRoom = await chatRoomModel.findById(chatRoomId);

    if (chatRoom) {
      // Remove the chat room from the database
      await chatRoomModel.findByIdAndRemove(chatRoomId);

      console.log(`Chat room with ID ${chatRoomId} deleted successfully`);
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error(`Failed to delete chat room: ${error.message}`);
  }
};

const sendMessage = async (message, type, chatRoomId, senderId) => {
  try {
    const chatRoom = await chatRoomModel.findById(chatRoomId);

    if (chatRoom) {
      let messageStatuses = [];

      chatRoom.members.forEach((memberId) => {
        if (memberId != senderId) {
          messageStatuses.push({
            userId: memberId,
            read_date: null,
          });
        }
      });

      let newMessage;
      if (type == "text") {
        newMessage = {
          messageFrom: senderId,
          sentDate: Date.now(),
          messageType: type,
          messageData: message,
          messageStatus: messageStatuses,
        };
      } else {
        const buffer = new Buffer.from(message.image, "base64");
        newMessage = {
          messageFrom: senderId,
          sentDate: Date.now(),
          messageType: type,
          messageData: buffer,
          messageStatus: messageStatuses,
        };
      }

      chatRoom.messages.push(newMessage);
      chatRoom.lastTS = newMessage.sentDate;
      await chatRoom.save();
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error(`Message cannot be sent ${error.message}`);
  }
};

const markMessagesAsRead = async (userId, chatRoomId) => {
  try {
    const chatRoom = await chatRoomModel.findById(chatRoomId);

    if (chatRoom) {
      // Iterate through all messages in the chat room
      for (const message of chatRoom.messages) {
        // Find the message status for the specified user in each message
        const messageStatus = message.messageStatus.find((status) => {
          return status.userId == userId;
        });

        if (messageStatus && !messageStatus.read_date) {
          messageStatus.read_date = new Date();
        }
      }

      // Save the updated chat room
      await chatRoom.save();
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error(`Failed to mark all messages as read: ${error.message}`);
  }
};

const getMessagesFromChatRoom = async (chatRoomId) => {
  try {
    const chatRoom = await chatRoomModel.findById(chatRoomId).populate({
      path: "messages.messageFrom",
      model: "user",
      select: "name _id",
    });

    if (chatRoom) {
      const messages = [];

      for (const message of chatRoom.messages) {
        const messageStatuses = [];

        for (const status of message.messageStatus) {
          messageStatuses.push({
            userId: status.userId,
            read_date: status.read_date,
          });
        }

        const isAllRead = messageStatuses.every(
          (status) => status.read_date !== null
        );
        messages.push({
          senderId: message.messageFrom._id,
          senderName: message.messageFrom.name,
          sentDate: message.sentDate,
          messageType: message.messageType,
          messageData: message.messageData,
          isAllRead: isAllRead,
        });
      }

      return messages;
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error(`Failed to get messages from chat room: ${error.message}`);
  }
};

module.exports = {
  createChatRoom,
  updateChatRoom,
  deleteChatRoom,
  sendMessage,
  markMessagesAsRead,
  getMessagesFromChatRoom,
};
