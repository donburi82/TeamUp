const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const { ChatRoom } = require("../../models/chat.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { isStrongPassword } = require("../../helpers/userBasicInfo.js");
const bcrypt = require("bcryptjs");

const { upload } = require("../../helpers/chat.js");

let verificationCodes = new Map();

router.route("/friends").get(async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).populate("friends");
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", msg: "User doesn't exist" });
    }

    res.status(200).json({
      status: "success",
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
});

router.route("/getInfo").get(async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  try {
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo) {
      return res
        .status(400)
        .json({ status: "fail", msg: "user doesn't exist" });
    }
    res.status(200).json({
      status: "success",
      userInfo: {
        profilePic: `${process.env.cloudfrontUrl}/user/${userInfo.profilePic}`,
        userId: userInfo._id,
        email: userInfo.email,
        name: userInfo?.name,
        gender: userInfo?.gender,
        isFullTime: userInfo?.isFullTime,
        nationality: userInfo?.nationality,
        major: userInfo?.major,
        year: userInfo?.year,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "error", msg: error.message });
  }
});

router.route("/getInfo/:userId").get(async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
    const userInfo = await User.findOne({ _id: userId });
    let chatRoom;
    if (!userInfo) {
      return res
        .status(400)
        .json({ status: "fail", msg: "user doesn't exist" });
    }
    if (userInfo.friends.includes(req.user.userId)) {
      chatRoom = await ChatRoom.findOne({
        members: { $all: [req.user.userId, userId] },
        isGroup: false,
      });
      chatRoom = chatRoom?._id;
    } else {
      chatRoom = null;
    }
    res.status(200).json({
      status: "success",
      userInfo: {
        profilePic: `${process.env.cloudfrontUrl}/user/${userInfo.profilePic}`,
        userId: userInfo._id,
        email: userInfo.email,
        name: userInfo?.name,
        gender: userInfo?.gender,
        isFullTime: userInfo?.isFullTime,
        nationality: userInfo?.nationality,
        major: userInfo?.major,
        year: userInfo?.year,
        chatRoom: chatRoom,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "error", msg: error.message });
  }
});

// req.body{name: string}
router.route("/updateInfo").patch(async (req, res) => {
  const userId = req.user.userId;
  // console.log(userId);
  const info = req.body;
  console.log(info?.major);
  try {
    await User.updateOne(
      { _id: userId },
      {
        name: info?.name,
        isFullTime: info?.isFullTime,
        gender: info?.gender,
        isFullTime: info?.isFullTime,
        nationality: info?.nationality,
        major: info?.major,
        year: info?.year,
      }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", error });
  }
});

// req.body{pre: string, cur: string}
router.route("/updatePassword").patch(async (req, res) => {
  const { pre, cur } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (user == null) {
      return res.status(400).send({ status: "fail", msg: "user don't exist" });
    }
    if (await user.comparePassword(pre)) {
      if (!isStrongPassword(cur))
        return res
          .status(400)
          .send({ status: "fail", msg: "password is not strong enough" });
      user.password = cur;
      await user.save();
      res.status(200).json({ status: "success" });
    } else {
      console.log(pre, cur);
      res.status(401).json({ status: "fail", msg: "incorrect credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "fail", error });
  }
});

// router.patch("/profilePic", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ status: "fail", msg: "No file uploaded." });
//   }
//   const userId = req.user.userId;
//   if (req.file.size > 256000000) {
//     return res
//       .status(400)
//       .json({ status: "fail", msg: "file size exceed limit" });
//   }
//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         $set: {
//           "profilePic.data": req.file.buffer,
//           "profilePic.contentType": req.file.mimetype,
//         },
//       },
//       { new: true } // To return the updated document
//     );

//     return res.status(200).json({ status: "success" });
//   } catch (error) {
//     return res.status(400).json({ status: "error", msg: error.message });
//   }
// });

router.patch("/profilePic", async (req, res) => {
  const { image, type } = req.body;
  // console.log(type);
  const userId = req.user.userId;
  const buffer = Buffer.from(image, "base64");

  if (!type) {
    type = "image/jpeg";
  }
  const extension = type.split("/")[1];

  const file = {
    originalname: `${userId}.${extension}`,
    buffer,
    mimetype: type,
  };

  const key = await upload(file, "user");

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        profilePic: key,
      }
    );

    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(400).json({ status: "error", msg: error.message });
  }
});

router.get("/profilePic/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", msg: "user not found" });
    }
    res.status(200).send({
      status: "success",
      data: `${process.env.cloudfrontUrl}/user/${user.profilePic}`,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", msg: error.message });
  }
});

router.get("/profilePic", async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", msg: "user not found" });
    }
    res.status(200).send({
      status: "success",
      data: `${process.env.cloudfrontUrl}/user/${user.profilePic}`,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", msg: error.message });
  }
});

// req.body{pre: string, cur: string}
router.route("/password").patch(async (req, res) => {
  const { pre, cur } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (user == null) {
      return res.status(400).send({ status: "fail", msg: "user don't exist" });
    }
    if (await user.comparePassword(pre)) {
      if (!isStrongPassword(cur))
        return res
          .status(400)
          .send({ status: "fail", msg: "password is not strong enough" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(200).json({ status: "success" });
    } else {
      res.status(401).json({ status: "fail", msg: "incorrect credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "fail", error });
  }
});

router.post("/registerationToken", async (req, res) => {
  const userId = req.user.userId;
  const { registrationToken } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      registrationToken: registrationToken,
    });

    if (!user) {
      return res.status(404).json({ status: "fail", msg: "User not found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", error });
  }
});

module.exports = router;
