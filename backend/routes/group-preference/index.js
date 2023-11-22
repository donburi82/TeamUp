const express = require("express");
const router = express.Router();

const { getCourseProjectPreference, createCourseProjectPreference, deleteCourseProjectPreference,
    getCourseStudyPreference, createCourseStudyPreference, deleteCourseStudyPreference,
    getExtracurricularPreference, createExtracurricularPreference, deleteExtracurricularPreference } = require("../../helpers/preference");

router.get("/hello", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

router.get("/courseproject", async (req, res) => {
    try {
        const preferences = await getCourseProjectPreference();
        return res.status(200).json({ success: true, data: preferences });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/courseproject", async (req, res) => {
    try {
        console.log(req.body);
        await createCourseProjectPreference(req.body.courseCode, req.body.projectInterest, req.body.skillset, req.body.targetGrade, req.body.experience);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.delete("/courseproject", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await deleteCourseProjectPreference(id);
        console.log(result);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.get("/coursestudy", async (req, res) => {
    try {
        const preferences = await getCourseStudyPreference();
        return res.status(200).json({ success: true, data: preferences });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/coursestudy", async (req, res) => {
    try {
        console.log(req.body);
        await createCourseStudyPreference(req.body.courseCode, req.body.targetGrade, req.body.preferredLanguage);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.delete("/coursestudy", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await deleteCourseStudyPreference(id);
        console.log(result);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.get("/extracurricular", async (req, res) => {
    try {
        const preferences = await getExtracurricularPreference();
        return res.status(200).json({ success: true, data: preferences });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.post("/extracurricular", async (req, res) => {
    try {
        console.log(req.body);
        await createExtracurricularPreference(req.body.projectInterest, req.body.skillset, req.body.experience, req.body.preferredLanguage);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

router.delete("/extracurricular", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await deleteExtracurricularPreference(id);
        console.log(result);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

module.exports = router;
