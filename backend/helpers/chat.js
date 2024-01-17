const { MessageStatus, Message, ChatRoom } = require("../models/chat");
const { User } = require("../models/user.js");
const mongoose = require("mongoose");

const createChatRoom = async (members, groupId = null) => {
  try {
    // Validate members array
    if (!members || members.length === 0) {
      throw new Error("At least one member is required for a chat room");
    }

    // Convert member strings to ObjectId
    const memberObjectIds = members.map(
      (userId) => new mongoose.Types.ObjectId(userId)
    );

    // Validate groupId if provided
    // if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
    //   throw new Error("Invalid groupId format");
    // }

    // Create the chat room
    let room;
    if (groupId) {
      room = await ChatRoom.create({
        members: memberObjectIds,
        isGroup: true,
        groupId,
      });
    } else {
      room = await ChatRoom.create({
        members: memberObjectIds,
        isGroup: false,
      });
    }

    // Add the chat room's ID to the users' chatRooms arrays
    await User.updateMany(
      { _id: { $in: memberObjectIds } },
      { $addToSet: { chatRooms: room._id } }
    );

    return room;
  } catch (error) {
    // Log the error or handle it as needed
    throw new Error(`ChatRoom creation failed: ${error.message}`);
  }
};
const updateChatRoom = async (userId, chatRoomId, isJoin) => {
  try {
    const room = await ChatRoom.findById(chatRoomId);

    if (!room) {
      throw new Error("Chat room not found");
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    const memberIndex = room.members.indexOf(userIdObj);

    if (!room.isGroup) {
      throw new Error("cannot update private chat");
    }

    if (isJoin) {
      if (memberIndex === -1) {
        room.members.push(userIdObj);
        await room.save();

        // Update the user's chatRooms array
        await User.findByIdAndUpdate(userId, {
          $addToSet: { chatRooms: chatRoomId },
        });
      } else {
        throw new Error("User already in the chat room");
      }
    } else {
      if (memberIndex !== -1) {
        room.members.splice(memberIndex, 1);
        if (room.members.length == 0) {
          await deleteChatRoom(room._id);
        } else {
          await room.save();
        }
        // Remove the chat room reference from the user's chatRooms array
        await User.findByIdAndUpdate(userId, {
          $pull: { chatRooms: chatRoomId },
        });
      }
    }
    return room;
  } catch (error) {
    throw new Error(
      `Failed to ${isJoin ? "join" : "leave"} chat room: ${error.message}`
    );
  }
};

const deleteChatRoom = async (chatRoomId) => {
  try {
    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    // Remove corresponding messages and message statuses
    await Message.deleteMany({ _id: { $in: chatRoom.messages } });

    // Remove the chat room reference from users
    await User.updateMany(
      { _id: { $in: chatRoom.members } },
      { $pull: { chatRooms: chatRoomId } }
    );

    // Remove the chat room from the database
    await ChatRoom.findByIdAndRemove(chatRoomId);

    console.log(`Chat room with ID ${chatRoomId} deleted successfully`);
  } catch (error) {
    throw new Error(`Failed to delete chat room: ${error.message}`);
  }
};

const sendMessage = async (message, type, chatRoomId, senderId) => {
  try {
    console.log("chatroomId", chatRoomId);
    const chatRoom = await ChatRoom.findById(chatRoomId).populate("members");

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    const messageStatuses = chatRoom.members
      .filter((member) => String(member._id) !== String(senderId))
      .map((member) => ({
        userId: member._id,
        read_date: null,
      }));

    let newMessage;
    if (type === "text") {
      newMessage = new Message({
        messageFrom: senderId,
        sentDate: Date.now(),
        messageType: type,
        messageData: message,
        messageStatus: messageStatuses,
      });
    } else if (type === "image") {
      const buffer = Buffer.from(message.image, "base64");
      newMessage = new Message({
        messageFrom: senderId,
        sentDate: Date.now(),
        messageType: type,
        messageData: buffer,
        messageStatus: messageStatuses,
      });
    }

    await newMessage.save();

    chatRoom.messages.push(newMessage);
    chatRoom.lastTS = newMessage.sentDate;
    await chatRoom.save();
  } catch (error) {
    throw new Error(`Message cannot be sent: ${error.message}`);
  }
};

const markMessagesAsRead = async (userId, chatRoomId) => {
  try {
    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    await Message.updateMany(
      {
        _id: { $in: chatRoom.messages },
        "messageStatus.userId": userIdObj,
        "messageStatus.read_date": null,
      },
      {
        $set: {
          "messageStatus.$.read_date": new Date(),
        },
      }
    );

    await chatRoom.save();
  } catch (error) {
    throw new Error(`Failed to mark messages as read: ${error.message}`);
  }
};

const getMessagesFromChatRoom = async (chatRoomId) => {
  try {
    const chatRoom = await ChatRoom.findById(chatRoomId).populate({
      path: "messages",
      populate: {
        path: "messageFrom",
        model: "User",
        select: "name _id profilePic",
      },
    });

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    const messages = [];

    for (const message of chatRoom.messages) {
      // const messageStatuses = await MessageStatus.find({
      //   _id: { $in: message.messageStatus },
      // });
      // console.log(message);
      const isAllRead = message.messageStatus.every(
        (status) => status.read_date !== null
      );

      messages.push({
        messageId: message._id,
        senderId: message.messageFrom._id,
        profilePic: message.messageFrom.profilePic,
        senderName: message.messageFrom.name,
        sentDate: message.sentDate,
        messageType: message.messageType,
        messageData: message.messageData,
        isAllRead: isAllRead,
      });
    }

    return messages;
  } catch (error) {
    throw new Error(`Failed to get messages from chat room: ${error.message}`);
  }
};

const getChatRoomsForUser = async (userId) => {
  try {
    // Find user with chat rooms
    const user = await User.findById(userId).populate({
      path: "chatRooms",
      populate: {
        path: "members",
        model: "User",
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.chatRooms || user.chatRooms.length === 0) {
      throw new Error("No chat rooms for this user");
    }

    // Extract relevant information from chat rooms
    const chatRooms = await Promise.all(
      user.chatRooms.map(async (chatRoom) => {
        const lastMessage =
          chatRoom.messages.length > 0
            ? await Message.findById(
                chatRoom.messages[chatRoom.messages.length - 1]
              )
            : null;

        let chatmateName = null;
        let senderProfilePic = null;

        if (!chatRoom.isGroup) {
          const otherMember = chatRoom.members.find(
            (member) => String(member._id) !== userId
          );

          chatmateName = otherMember.name;
          senderProfilePic = otherMember.profilePic || null;
        }

        return {
          chatRoomId: chatRoom._id,
          lastTS: chatRoom.lastTS,
          isGroup: chatRoom.isGroup,
          chatmateName: chatmateName,
          senderProfilePic: senderProfilePic,
          lastMessage: lastMessage
            ? {
                messageType: lastMessage.messageType,
                messageData: lastMessage.messageData,
                isAllRead: lastMessage.messageStatus.every(
                  (status) => status.read_date !== null
                ),
              }
            : null,
        };
      })
    );

    // Sort chat rooms based on lastTS in descending order
    const sortedChatRooms = chatRooms.sort(
      (a, b) => (b.lastTS || 0) - (a.lastTS || 0)
    );

    return sortedChatRooms;
  } catch (error) {
    throw new Error(`Failed to get chat rooms for user: ${error.message}`);
  }
};

const getMessageStatus = async (messageId) => {
  try {
    // Convert the string messageId to a MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(messageId);

    // Find the message with the given messageId and populate the 'messageStatus.userId' field with user details
    const message = await Message.findById(objectId).populate({
      path: "messageStatus.userId",
      model: "User",
      select: "name",
    });

    if (!message) {
      throw new Error("Message not found");
    }

    // Extract and return the messageStatus
    const messageStatus = message.messageStatus.map((status) => {
      console.log(status);
      return {
        name: status.userId.name,
        read_date: status.read_date,
      };
    });

    return messageStatus;
  } catch (error) {
    // Handle errors, e.g., log them or throw a custom error
    console.error(`Error fetching message status: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createChatRoom,
  updateChatRoom,
  deleteChatRoom,
  sendMessage,
  markMessagesAsRead,
  getMessagesFromChatRoom,
  getChatRoomsForUser,
  getMessageStatus,
};
