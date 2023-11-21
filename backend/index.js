require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const { DBconnection } = require("./db/dbconnection");
const authRoute = require("./routes/auth/index.js");
const groupPreference = require("./routes/group-preference/index.js");
const userBasicInfoRoute = require("./routes/userBasicInfo/index.js");
const adminRoute = require("./routes/admin/index.js");
const auth = require("./middleware/auth/index.js");
const adminAuth = require("./middleware/admin/index.js");

app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/userBasicInfo", auth, adminAuth, userBasicInfoRoute);
app.use("/preference", groupPreference);
app.use("/admin", auth, adminAuth, adminRoute);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
  DBconnection(process.env.MongoURI);
});
