const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

//ensureAuthenticated
router.get("/", (req, res, next) => {
    res.render("home", {title: "home"})
});


module.exports = router;
