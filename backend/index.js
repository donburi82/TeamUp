require("dotenv").config();
const fs = require("fs");
const http = require("http");
// const https = require("https");
const socketIo = require("socket.io");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
// const options = {
//   key: fs.readFileSync("./cert/server.key"),
//   cert: fs.readFileSync("./cert/server.cert"),
// };
const server = http.createServer(app);
// const server = https.createServer(options, app);
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
app.use("/groups", auth, groupsRoute);

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
      // console.log("user connected");
    } else {
      // console.log("User not found");
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
      const senderId = socket.userId;
      console.log("senderId is", senderId);
      const newMessage = await sendMessage(
        payload.message,
        payload.type,
        payload.chatRoomId,
        senderId,
        payload.fileName
      );
      socket.to(payload.chatRoomId).emit("updateMessage", newMessage);
      socket.emit("updateMessage", newMessage);
      const eventName = `notification-${payload.chatRoomId}`;
      socket
        .to(eventName)
        .except(payload.chatRoomId)
        .emit("notification", newMessage);
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

app.get("/riverTestUsers", (req, res) => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      name: "Jason",
      major: "CPEG",
      gender: "M",
      lookingFor: ["COMP3111", "COMP4211"],
    });
  }
  res.status(200).send({ data });
});
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
  DBconnection(process.env.MongoURI);
});
