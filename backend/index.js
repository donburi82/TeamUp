require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const { DBconnection } = require("./db/dbconnection");
const authRoute = require("./routes/auth/index.js");
const groupPreference = require("./routes/group-preference/index.js");
const auth = require("./middleware/auth/index.js");

app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/userBasicInfo", auth);
app.use("/preference", groupPreference);

server.listen(3000, () => {
  console.log("listening on *:3000");
  DBconnection(process.env.MongoURI);
});
