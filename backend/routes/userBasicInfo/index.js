const express = require("express");
const router = express.Router();

// req.body{ userId: string}
router.route("/getUserInfo").get(async (req, res) => {});

module.exports = router;
