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
    const { userId, groupType } = req.query;
    const preferences = await getGroupPreferences(userId, groupType);
    console.log(preferences);
    return res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

router.post("/courseproject", async (req, res) => {
  try {
    console.log(req.body);
    await createCourseProjectPreference(
      req.body.userId,
      req.body.courseCode,
      req.body.projectInterest,
      req.body.skillset,
      req.body.targetGrade,
      req.body.experience
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

router.post("/coursestudy", async (req, res) => {
  try {
    console.log(req.body);
    await createCourseStudyPreference(
      req.body.userId,
      req.body.courseCode,
      req.body.targetGrade,
      req.body.preferredLanguage
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

router.post("/extracurricular", async (req, res) => {
  try {
    console.log(req.body);
    await createExtracurricularPreference(
      req.body.userId,
      req.body.projectInterest,
      req.body.skillset,
      req.body.experience,
      req.body.preferredLanguage
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userId, preferenceId } = req.query;
    const result = await deleteGroupPreference(userId, preferenceId);
    console.log(result);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false });
  }
});

module.exports = router;
