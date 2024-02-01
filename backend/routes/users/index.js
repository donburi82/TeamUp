const express = require("express");
const router = express.Router();

const {
    getCourseProjectProfiles, getCourseStudyProfiles, getExtracurricularProfiles
} = require("../../helpers/match");

router.get("/courseproject", async (req, res) => {
    try {
        const { userId } = req.query;
        const profiles = await getCourseProjectProfiles(userId);
        console.log(profiles);
        return res.status(200).json({ success: true, data: profiles });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.get("/coursestudy", async (req, res) => {
    try {
        const { userId } = req.query;
        const profiles = await getCourseStudyProfiles(userId);
        console.log(profiles);
        return res.status(200).json({ success: true, data: profiles });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.get("/extracurricular", async (req, res) => {
    try {
        const { userId } = req.query;
        const profiles = await getExtracurricularProfiles(userId);
        console.log(profiles);
        return res.status(200).json({ success: true, data: profiles });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

module.exports = router;
