require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const auth = require("./routes/auth/index.js");
const groupPreference = require("./routes/group-preference/index.js");

const app = express();
const server = http.createServer(app);
const { DBconnection } = require("./db/dbconnection");
const auth = require("./routes/auth");

app.use(express.json());
app.use(cors());
app.use(auth);
app.use(groupPreference);

server.listen(3000, () => {
  console.log("listening on *:3000");
  DBconnection(process.env.MongoURI);
});
