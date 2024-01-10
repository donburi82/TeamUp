const express = require("express");
const router = express.Router();
const {
  createChatRoom,
  updateChatRoom,
  deleteChatRoom,
  sendMessage,
  markMessagesAsRead,
  getMessagesFromChatRoom,
  getChatRoomsForUser,
  getMessageStatus,
} = require("../../helpers/chat");

module.exports = router;

router
  .route("/message/:chatRoomId")
  .get(async (req, res) => {
    try {
      const { chatRoomId } = req.params;
      const messages = await getMessagesFromChatRoom(chatRoomId);
      return res.status(200).send({ status: "success", messages });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  })
  // req.body {message: string, type:"text"||"image"}
  .post(async (req, res) => {
    try {
      const { chatRoomId } = req.params;
      const senderId = req.user.userId;
      const { message, type } = req.body;
      await sendMessage(message, type, chatRoomId, senderId);
      return res.status(200).send({ status: "success" });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  });

router
  .route("/chatRoom/:chatRoomId")
  // res.body {isJoin: Boolean} (true when user want to join chatroom)
  .patch(async (req, res) => {
    try {
      const { chatRoomId } = req.params;
      const { isJoin } = req.body;
      const userId = req.user.userId;
      await updateChatRoom(userId, chatRoomId, isJoin);
      res.status(200).send({ status: "success" });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const { chatRoomId } = req.params;
      await deleteChatRoom(chatRoomId);
      return res.status(200).send({ status: "success" });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  });
// req.body {members:[string]}
router
  .route("/chatRoom")
  .post(async (req, res) => {
    try {
      const { members, groupId } = req.body;
      if (!members) {
        return res
          .status(400)
          .send({ status: "fail", msg: "memebers cannot be empty" });
      }
      let room;
      if (groupId) {
        room = await createChatRoom(members, groupId);
      } else {
        room = await createChatRoom(members);
      }
      return res.status(200).send({ status: "success", room });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  })
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const chatRooms = await getChatRoomsForUser(userId);
      console.log("chatrooms:", chatRooms);
      return res.status(200).send({ status: "success", chatRooms });
    } catch (error) {
      return res.status(400).send({ status: "error", msg: error.message });
    }
  });

router.route("/messageStatus/:chatRoomId").patch(async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { userId } = req.user;
    await markMessagesAsRead(userId, chatRoomId);
    return res.status(200).send({ status: "success" });
  } catch (error) {
    return res.status(400).send({ status: "error", msg: error.message });
  }
});
// .get(async (req, res) => {
//   try {
//     const { chatRoomId } = req.params;
//     const { messageId } = req.query;
//     const messageStatus = await getMessageStatus(chatRoomId, messageId);
//     return res.status(200).send({ status: "success", messageStatus });
//   } catch (error) {
//     return res.status(400).send({ status: "error", msg: error.message });
//   }
// });