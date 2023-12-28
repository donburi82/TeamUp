const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { userId, rematch } = req.query;
        // no cut off date, might need to keep a boolean to prompt rematch (i.e. updated group preference)
        // might want to store matches for faster
        if (rematch==="true") {
            // find matches
        }
        // otherwise, return stored matches
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false });
    }
});

module.exports = router;
