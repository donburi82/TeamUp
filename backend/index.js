require("dotenv").config();
const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { User } = require("./models/user.js");
const { DBconnection } = require("./db/dbconnection");
const authRoute = require("./routes/auth/index.js");
const groupPreference = require("./routes/group-preference/index.js");
const userBasicInfoRoute = require("./routes/userBasicInfo/index.js");
const adminRoute = require("./routes/admin/index.js");
const usersRoute = require("./routes/users/index.js");
const auth = require("./middleware/auth/index.js");
const adminAuth = require("./middleware/admin/index.js");

app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/userBasicInfo", auth, userBasicInfoRoute);
app.use("/preference", groupPreference);
app.use("/admin", auth, adminAuth, adminRoute);
app.use("/users", usersRoute);

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { socketId: socket.id } },
      { new: true }
    );

    if (updatedUser) {
      console.log("SocketId updated successfully:", updatedUser);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating socketId:", error);
  }

  socket.on("disconnect", async () => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { socketId: "-1" } },
        { new: true }
      );

      if (updatedUser) {
        console.log("SocketId updated successfully:", updatedUser);
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
