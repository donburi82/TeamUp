const express = require("express");
const router = express.Router();
const User = require("../../models/users");

// req.body{ userId: string}
router.route("/getInfo").get(async (req, res) => {
  const userId = req.body.userId;
  try {
    const userInfo = (await User.find({ _id: userId }))[0];
    res
      .json({
        msg: "success",
        userInfo: {
          userId: userInfo._id,
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
    res.json({ status: "fail", error });
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
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "fail", error });
  }
});

// req.body{pre: string, cur: string}
router.route("/updatePassword").patch(async (req, res) => {
  const { pre, cur } = req.body;
  const userId = req.user.userId;
  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId });
    if (await user.comparePassword(pre)) {
      await User.updateOne(
        { _id: userId },
        {
          password: cur,
        }
      );
      res.json({ status: "success" }).status(200);
    } else {
      res.json({ status: "fail", msg: "incorrect credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "fail", error });
  }
});

module.exports = router;
