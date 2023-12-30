const chatRoom = require("../models/chatRoom");
const { messageModel } = require("../models/message");
const messageStatus = require("../models/messageStatus");

const createChatRoom = async (members, groupId = null) => {
  try {
    let room;
    if (groupId) {
      room = chatRoom.create({
        members,
        isGroup: true,
        groupId,
      });
    } else {
      room = chatRoom.create({
        members,
        isGroup: false,
      });
    }
  } catch (error) {
    throw new Error("chatRoom creation fail");
  }
};

const joinChatRoom = async (userId, chatRoomId) => {
  try {
    const room = await chatRoom.findById(chatRoomId);
    if (room) {
      if (!room.members.includes(userId)) {
        room.members.push(userId);
        await room.save();
      }
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error("Failed to join chat room");
  }
};

const leaveChatRoom = async (userId, chatRoomId) => {
  try {
    const room = await chatRoom.findById(chatRoomId);
    if (room) {
      room.members = room.members.filter((member) => member !== userId);
      await room.save();
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error("Failed to leave chat room");
  }
};

const pushMessage = async (message, type, chatRoomId, senderId) => {
  try {
    const chatRoom = await chatRoom.findById(chatRoomId);

    if (chatRoom) {
      if (type == "text") {
        const newMessage = await messageModel.create({
          messageFrom: senderId,
          sentDate: Date.now(),
          messageType: type,
          messageData: message,
        });

        chatRoom.messages.push(newMessage);
        await chatRoom.save();
      } else {
        const buffer = new Buffer.from(message.image, "base64");
      }
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error) {
    throw new Error("Message cannot be sent");
  }
};
