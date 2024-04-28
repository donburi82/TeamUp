const express = require("express");
const router = express.Router();

const {
  getCourseProjectProfiles,
  getCourseStudyProfiles,
  getExtracurricularProfiles,
} = require("../../helpers/match");

router.get("/courseproject", async (req, res) => {
  try {
    const userId = req.user.userId;
    const profiles = await getCourseProjectProfiles(userId);
    return res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    // return res.status(400).json({ success: false, error: error });
    return res.status(400).send({ status: "error", msg: error.message });
  }
});

router.get("/coursestudy", async (req, res) => {
  try {
    const userId = req.user.userId;
    const profiles = await getCourseStudyProfiles(userId);
    return res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    // return res.status(400).json({ success: false, error: error });
    return res.status(400).send({ status: "error", msg: error.message });
  }
});

router.get("/extracurricular", async (req, res) => {
  try {
    const userId = req.user.userId;
    const profiles = await getExtracurricularProfiles(userId);
    return res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    // return res.status(400).json({ success: false, error: error });
    return res.status(400).send({ status: "error", msg: error.message });
  }
});

module.exports = router;
