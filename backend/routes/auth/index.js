const _ = require("lodash");
const nodemailer = require("nodemailer");
const User = require("../../models/users");

const express = require("express");
const router = express.Router();

router.route("/auth/verify").get(async (req, res) => {
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

router.route("/auth/register").post(async (req, res) => {
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    const token = user.createJWT();
    res.json({ msg: "user created", token }).status(201);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        err: `email has already be taken.`,
      });
    }
  }
});

router.route("/auth/login").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "email don't exit" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "incorrect password" });
    }
    const token = user.createJWT();

    return res.json({ msg: "login successful", token }).status(200);
  } catch (error) {
    console.log(error);
    return res.json({ error: "error" }).status(401);
  }
});

module.exports = router;
