const express = require("express");
const router = express.Router();
const User = require("../../models/users");

// req.body{ userId: string}
router.route("/getInfo").get(async (req, res) => {
  const userId = req.body.userId;
  try {
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo) {
      return res
        .json({ status: "fail", msg: "user doesn't exist" })
        .status(400);
    }
    res
      .json({
        status: "success",
        userInfo: {
          userId: userInfo._id,
          email: userInfo.email,
          name: userInfo?.name,
          gender: userInfo?.gender,
          isFullTime: userInfo?.isFullTime,
          nationality: userInfo?.nationality,
          major: userInfo?.major,
          year: userInfo?.year,
        },
      })
      .status(200);
  } catch (error) {
    res.json({ status: "error", msg: error }).status(400);
  }
});

// req.body{name: string}
router.route("/updateInfo").patch(async (req, res) => {
  const userId = req.user.userId;
  const info = req.body;
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
    res.json({ status: "success" }).status(200);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error }).status(400);
  }
});

// req.body{pre: string, cur: string}
router.route("/updatePassword").patch(async (req, res) => {
  const { pre, cur } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (user == null) {
      return res.send({ status: "fail", msg: "user don't exist" }).status(400);
    }
    if (await user.comparePassword(pre)) {
      user.password = cur;
      await user.save();
      res.json({ status: "success" }).status(200);
    } else {
      res.json({ status: "fail", msg: "incorrect credentials" }).status(401);
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "fail", error }).status(400);
  }
});

module.exports = router;
