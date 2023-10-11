require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const { DBconnection } = require("./db/dbconnection");
const authRoute = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/auth", authRoute);

server.listen(3000, () => {
  console.log("listening on *:3000");
  DBconnection(process.env.MongoURI);
});
