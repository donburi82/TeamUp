const express = require("express");
const router = express.Router();

const { getExtracurricularPreference, createExtracurricularPreference, deleteExtracurricularPreference  } = require("../../helpers/preference");

router.get("/hello", (req, res) => {
    res.send("<h1>Hello world</h1>");
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
