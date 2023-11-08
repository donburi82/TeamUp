const _ = require("lodash");
const nodemailer = require("nodemailer");
const User = require("../../models/users");

const express = require("express");
const router = express.Router();

let verificationCodes = new Map();
let verified = new Set([]);

router.route("/verification").get(async (req, res) => {
  const re =
    /^[a-zA-Z0-9._-]+@(connect.ust.hk|connect.polyu.hk|@connect.hku.hk)$/;
  if (!req.body.email.match(re)) {
    return res
      .status(400)
      .send({ status: "fail", msg: "invalid school email" });
  }

  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user) {
    return res
      .status(400)
      .send({ status: "fail", msg: "email already being registered" });
  }

  const verificatoinCode = _.random(100000, 999999);

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
              <p><strong>${verificatoinCode}</strong></p>
              <p>This code will expire in 5 minutes.</p>
              <p>Please do not reply to this email. This mailbox is not monitored and you will not receive a response.</p>
              <br/>
              <p>Thank you,</p>
              <p>TeamUp Team</p>
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ status: "error", msg: "Internal Server Error" });
    } else {
      verificationCodes.set(req.body.email, verificatoinCode);
      setTimeout(() => {
        verificationCodes.delete(req.body.email);
      }, 1000 * 60 * 5);
      res.status(200).send({ status: "success" });
    }
  });
});

router.route("/verify").get(async (req, res) => {
  if (verificationCodes.get(req.body.email) == req.body.verificationCode) {
    verificationCodes.delete(req.body.email);
    verified.add(req.body.email);
    res.status(200).send({ status: "success" });
  } else {
    res
      .status(401)
      .send({ status: "fail", msg: "verificationCode wrong or expired" });
  }
});

router.route("/register").post(async (req, res) => {
  if (!verified.has(req.body.email)) {
    return res.status(400).send({ status: "fail", msg: "email not verified" });
  }
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    const token = user.createJWT();
    verified.delete(req.body.email);
    res.json({ status: "success", msg: "user created", token }).status(201);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        status: "error",
        msg: `EmailDuplicate`,
      });
    } else if (error.name == "ValidationError") {
      res
        .json({ status: "error", error: error.name, msg: error.message })
        .status(403);
    } else {
      res.json({ status: "error", msg: error }).status(400);
    }
  }
});

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", msg: "incorrect credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: "fail", msg: "incorrect credentials" });
    }

    const token = user.createJWT();

    return res.json({ status: "success", token }).status(200);
  } catch (error) {
    return res.json({ status: "error", msg: error }).status(400);
  }
});

module.exports = router;
