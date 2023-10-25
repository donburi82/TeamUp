const express = require("express");
// import express from 'express'
// import cookieParser from 'cookie-parser'

const router = express.Router();
// router.use(cookieParser());

router.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

// export default router;
module.exports = router;
