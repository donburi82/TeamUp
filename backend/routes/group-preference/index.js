const express = require("express");
const router = express.Router();

const {
  getGroupPreferences,
  createCourseProjectPreference,
  createCourseStudyPreference,
  createExtracurricularPreference,
  deleteGroupPreference,
} = require("../../helpers/preference");

router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupType } = req.query;
    const preferences = await getGroupPreferences(userId, groupType);
    return res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/courseproject", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseCode, semester, projectInterest, skillset, targetGrade, experience } = req.body;
    await createCourseProjectPreference(userId, courseCode, semester, projectInterest, skillset, targetGrade, experience);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/coursestudy", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseCode, semester, targetGrade, preferredLanguage } = req.body;
    await createCourseStudyPreference(userId, courseCode, semester, targetGrade, preferredLanguage);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.post("/extracurricular", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { projectInterest, skillset, experience, preferredLanguage } = req.body;
    await createExtracurricularPreference(userId, projectInterest, skillset, experience, preferredLanguage);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferenceId } = req.query;
    await deleteGroupPreference(userId, preferenceId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
});

module.exports = router;
