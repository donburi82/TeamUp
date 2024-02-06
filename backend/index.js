require("dotenv").config();
const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { User } = require("./models/user.js");
const { DBconnection } = require("./db/dbconnection");
const authRoute = require("./routes/auth/index.js");
const groupPreference = require("./routes/group-preference/index.js");
const userBasicInfoRoute = require("./routes/userBasicInfo/index.js");
const chatAuth = require("./routes/chat/index.js");
const adminRoute = require("./routes/admin/index.js");
const usersRoute = require("./routes/users/index.js");
const groupsRoute = require("./routes/groups/index.js");
const auth = require("./middleware/auth/index.js");
const adminAuth = require("./middleware/admin/index.js");

const {
  createChatRoom,
  updateChatRoom,
  deleteChatRoom,
  sendMessage,
  markMessagesAsRead,
  getMessagesFromChatRoom,
  getChatRoomsForUser,
  getMessageStatus,
} = require("./helpers/chat.js");

app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/userBasicInfo", auth, userBasicInfoRoute);
app.use("/preference", groupPreference);
app.use("/admin", auth, adminAuth, adminRoute);
app.use("/chat", auth, chatAuth);
app.use("/users", usersRoute);
app.use("/groups", groupsRoute);

io.use((socket, next) => {
  if (socket.handshake.headers.authorization) {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new Error("Authentication error"));
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.userId = decoded.userId;
      return next();
    });
  }
}).on("connection", async (socket) => {
  const userId = socket.userId;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { socketId: socket.id } },
      { new: true }
    );
    const user = await User.findById(userId);
    for (chatroomId in user.chatRooms) {
      const chatroom = user.chatRooms[chatroomId].toString();
      socket.join(`notification-${chatroom}`);
    }
    if (updatedUser) {
      console.log("user connected");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating socketId:", error);
  }

  socket.on("joinChatRoom", async (payload) => {
    socket.join(payload.chatRoomId);
  });
  socket.on("leaveChatRoom", async (payload) => {
    socket.leave(payload.chatRoomId);
  });
  socket.on("sendMessage", async (payload) => {
    try {
      console.log(`new message sent ${payload}`);
      const senderId = socket.userId;

      await sendMessage(
        payload.message,
        payload.type,
        payload.chatRoomId,
        senderId,
        payload.fileName
      );
      const user = await User.findById(senderId);
      const res = {
        name: user.name,
        message: payload.message,
        type: payload.type,
      };
      socket.to(payload.chatRoomId).emit("updateMessage", res);
      const eventName = `notification-${payload.chatRoomId}`;
      socket.to(eventName).except(payload.chatRoomId).emit("notification", res);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("testing", (payload) => {
    console.log("testing");
  });

  socket.on("disconnect", async () => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { socketId: "-1" } },
        { new: true }
      );

      if (updatedUser) {
        console.log("user disconnected");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error updating socketId:", error);
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
  DBconnection(process.env.MongoURI);
});
