const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const path = require("path");
const verifyToken = require(path.join(__dirname, "../middleware/VerifyToken"));


//ensureAuthenticated
router.get("/",verifyToken, (req, res, next) => {
    //placeholder
    return res.status(200).json({ info: "success access an Authorized endpoint with cookie." });
});


module.exports = router;