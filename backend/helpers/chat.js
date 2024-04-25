const { MessageStatus, Message, ChatRoom } = require("../models/chat");
const { User } = require("../models/user.js");
const mongoose = require("mongoose");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const admin = require("firebase-admin");
const { getMessaging } = require("firebase-admin/messaging");
const { Group } = require("../models/group");
const ObjectId = require("mongodb").ObjectId;

const serviceAccount = require("../serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

const upload = async (file, path) => {
  const key = `${uuidv4()}-${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: "awsteamupbucket",
    Key: `${path}/${key}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  try {
    const response = await s3Client.send(new PutObjectCommand(params));
    console.log(`media uploaded successfully. Location: ${response}`);
    return key;
  } catch (error) {
    throw new Error(`Error uploading media: ${error}`);
  }
};

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

      // update group's chatRoomId
      const group = await Group.findOne({ _id: new ObjectId(groupId) });
      group.chatRoomID = room;
      await group.save();
    } else {
      room = await ChatRoom.create({
        members: memberObjectIds,
        isGroup: false,
      });

      const [userId1, userId2] = members;
      await User.updateOne(
        { _id: userId1 },
        { $addToSet: { friends: userId2 } }
      );
      await User.updateOne(
        { _id: userId2 },
        { $addToSet: { friends: userId1 } }
      );
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

const checkChatRoom = async (userId, leaderId) => {
  try {
    const chatRoom = await ChatRoom.findOne({
      isGroup: false,
      members: { $all: [userId, leaderId] },
    });

    if (chatRoom) {
      return chatRoom;
    } else {
      return "";
    }
  } catch (error) {
    console.error(`Error checking chat room: ${error.message}`);
    return "";
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
        const user = await User.findById(userId);
        // await getMessaging().subscribeToTopic(
        //   user.registrationTokens,
        //   chatRoomId
        // );
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
        // await getMessaging().unsubscribeFromTopic(
        //   user.registrationTokens,
        //   chatRoomId
        // );
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

const sendMessage = async (message, type, chatRoomId, senderId, fileName) => {
  let chatRoom;
  try {
    console.log("chatroomId", chatRoomId);
    chatRoom = await ChatRoom.findById(chatRoomId).populate("members");

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
      const buffer = Buffer.from(message, "base64");
      const key = `${uuidv4()}-${fileName}`;
      console.log(key);
      const params = {
        Bucket: "awsteamupbucket",
        Key: `chat/${key}`,
        Body: buffer,
      };
      try {
        const response = await s3Client.send(new PutObjectCommand(params));
        console.log(`Image uploaded successfully. Location: ${response}`);
      } catch (error) {
        throw new Error(`Error uploading image: ${error}`);
      }

      newMessage = new Message({
        messageFrom: senderId,
        sentDate: Date.now(),
        messageType: type,
        messageData: key,
        messageStatus: messageStatuses,
      });
    } else if (type === "audio") {
      // const buffer = Buffer.from(message, "base64");
      // const key = `${uuidv4()}.mp3`;
      // const params = {
      //   Bucket: "awsteamupbucket",
      //   Key: `chat/${key}`,
      //   Body: buffer,
      // };
      // try {
      //   const response = await s3Client.send(new PutObjectCommand(params));
      //   console.log(`Image uploaded successfully. Location: ${response}`);
      // } catch (error) {
      //   throw new Error(`Error uploading image: ${error}`);
      // }

      newMessage = new Message({
        messageFrom: senderId,
        sentDate: Date.now(),
        messageType: type,
        messageData: message,
        messageStatus: messageStatuses,
      });
    }
    newMessage = await newMessage.save();

    newMessage = await newMessage.populate({
      path: "messageFrom",
      model: "User",
      select: "name _id profilePic",
    });

    chatRoom.messages = [...chatRoom.messages, newMessage];
    chatRoom.markModified("messages");
    chatRoom.lastTS = newMessage.sentDate;
    await chatRoom.save();

    const obj = {
      messageId: newMessage._id.toString(),
      senderId: newMessage.messageFrom._id.toString(),
      profilePic: newMessage.messageFrom.profilePic,
      senderName: newMessage.messageFrom.name,
      sentDate: newMessage.sentDate,
      messageType: newMessage.messageType,
      messageData: newMessage.messageData,
      isAllRead: newMessage.messageStatus.every(
        (status) => status.read_date !== null
      ),
    };

    // handle push notification
    const recipients = chatRoom.members.filter(
      (member) => member._id.toString() !== senderId
    );
    console.log("senderId", senderId);
    const registrationTokens = recipients
      .map((member) => member.registrationToken)
      .filter((token) => token !== undefined);
    console.log("regToken", registrationTokens);

    const senderName = newMessage.messageFrom.name;

    const notification = {
      title: chatRoom.isGroup
        ? `New Group message`
        : `New message from ${senderName}`,
      body:
        type == "image"
          ? "an image"
          : type == "audio"
          ? `an audio message from ${senderName}`
          : chatRoom.isGroup
          ? `${senderName}: ${message}`
          : message,
    };
    if (type == "image") {
      notification.imageUrl = `${process.env.cloudfrontUrl}/chat/${newMessage.messageData}`;
    }

    const pushMessage = {
      notification,
      android: {
        priority: "high",
        notification: {
          channelId: "test-channel",
        },
      },
      tokens: registrationTokens,
    };
    if (registrationTokens.length < 0) {
      return obj;
    }
    const response = await admin.messaging().sendMulticast(pushMessage);

    return obj;
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

const getMessagesFromChatRoom = async (chatRoomId, lastMessageId, limit) => {
  let chatRoom;
  if (!lastMessageId) {
    try {
      chatRoom = await ChatRoom.findById(chatRoomId);
      const messageIds = chatRoom.messages.slice(-limit);
      chatRoom.messages = await Message.find({
        _id: { $in: messageIds },
      })
        .sort({ sentDate: 1 })
        .populate({
          path: "messageFrom",
          model: "User",
          select: "name _id profilePic",
        });
      if (!chatRoom) {
        throw new Error("Chat room not found");
      }
    } catch (error) {
      throw new Error(
        `Failed to get messages from chat room: ${error.message}`
      );
    }
  } else {
    try {
      const lastMessage = await Message.findById(lastMessageId);
      console.log(chatRoomId);
      chatRoom = await ChatRoom.findById(chatRoomId)
        .sort({ sentDate: 1 })
        .populate({
          path: "messages",
          populate: {
            path: "messageFrom",
            model: "User",
            select: "name _id profilePic",
          },
        });

      chatRoom.messages = chatRoom.messages.filter(
        (message) => message.sentDate < lastMessage.sentDate
      );

      console.log(chatRoom);
    } catch (error) {
      throw new Error(
        `Failed to get messages from chat room: ${error.message}`
      );
    }
  }
  let messages = [];
  for (const message of chatRoom.messages) {
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
};

const getChatRoomsForUser = async (userId) => {
  try {
    // Find user with chat rooms
    let groupTitle = null;
    let groupId = null;
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

          if (otherMember) {
            chatmateName = otherMember.name;
            senderProfilePic = otherMember.profilePic || null;
          }
        } else {
          const group = await Group.findById(chatRoom.groupId);
          if (group) {
            groupTitle = group.project;
            groupId = group._id;
          }
        }

        return {
          groupTitle,
          groupId,
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
  upload,
  checkChatRoom,
};
