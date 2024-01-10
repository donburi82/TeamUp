const _ = require("lodash");
const nodemailer = require("nodemailer");
const { User } = require("../../models/user");
const AdminInfo = require("../../models/adminInfo");
const { isStrongPassword } = require("../../helpers/userBasicInfo");

const express = require("express");
const router = express.Router();

let verificationCodes = new Map();
let verified = new Set([]);

router.route("/verification").post(async (req, res) => {
  const adminInfo = await AdminInfo.findOne();
  domains = adminInfo.WhiteListEmailDomain;

  // Create the regular expression pattern
  const re = new RegExp(`^[a-zA-Z0-9._-]+@(${domains.join("|")})$`);

  if (!req.body.email.match(re)) {
    return res
      .status(400)
      .send({ status: "fail", msg: "invalid school email" });
  }

  const user = await User.findOne({ email: req.body.email });
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

router.route("/verify").post(async (req, res) => {
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

  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.name ||
    !req.body.isFullTime ||
    !req.body.gender ||
    !req.body.nationality ||
    !req.body.major ||
    !req.body.year
  ) {
    return res
      .status(400)
      .send({ status: "fail", msg: "incomplete information" });
  }
  if (!isStrongPassword(req.body.password)) {
    return res.status(400).send({ status: "fail", msg: "weak password" });
  }
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      isFullTime: req.body.isFullTime,
      gender: req.body.gender,
      nationality: req.body.nationality,
      major: req.body.major,
      year: req.body.year,
    });
    const token = user.createJWT();
    verified.delete(req.body.email);
    return res
      .status(201)
      .json({ status: "success", msg: "user created", token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        msg: `EmailDuplicate`,
      });
    } else if (error.name == "ValidationError") {
      return res
        .status(403)
        .json({ status: "error", error: error.name, msg: error.message });
    } else {
      res.status(400).json({ status: "error", msg: error.message });
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

    return res.status(200).json({ status: "success", token });
  } catch (error) {
    return res.status(400).json({ status: "error", msg: error.nessage });
  }
});

module.exports = router;
