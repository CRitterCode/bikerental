const express = require('express');
const rootDir = require('../util/path');
const {ensureAuthenticated} = require("../app/helpers/authHelper");
const router = express.Router();

//ensureAuthenticated
router.get("/",ensureAuthenticated, (req, res, next) => {
    res.render("home", {title: "home", error: ""})
});


module.exports = router;
