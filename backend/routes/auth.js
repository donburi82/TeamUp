const express = require("express");
const { register, login, verify } = require("../controllers/auth");
const router = express.Router();

router.route("/verify").get(verify);
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
