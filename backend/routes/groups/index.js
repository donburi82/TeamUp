const express = require("express");
const router = express.Router();

const {
    createGroup
} = require("../../helpers/group");

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        await createGroup(
            req.body.userId,
            req.body.category,
            req.body.project,
            req.body.quota,
            req.body.members
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

module.exports = router;
