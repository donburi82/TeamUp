require("dotenv").config();
const _ = require("lodash");
const express = require("express");
const http = require("http");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const { DBconnection } = require("./db/dbconnection");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/verify", (req, res) => {
  const verifyCode = _.random(100000, 999999);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "noreplyteamup78@gmail.com",
      pass: "tldfmpkeprxlvmhu",
    },
  });

  const mailOptions = {
    from: "no-reply-teamup78@gmail.com",
    to: req.body.email,
    subject: "Your verification code for TeamUp",
    html: `<p>Hello,</p>
              <br/>
              <p>Thank you for choosing TeamUp.</p>
              <p>To verify your account, please enter the following code in the app:</p>
              <p><strong>${verifyCode}</strong></p>
              <p>This code will expire in 10 minutes.</p>
              <p>Please do not reply to this email. This mailbox is not monitored and you will not receive a response.</p>
              <br/>
              <p>Thank you,</p>
              <p>TeamUp Team</p>
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ msg: "Internal Server Error" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ verifyCode });
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
  DBconnection(process.env.MongoURI);
});
