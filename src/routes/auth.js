const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController')
const jwt = require('jsonwebtoken');
const authHelper = require("../app/helpers/authHelper");
let authController = new AuthController(rootDir);

router.post("/login", (req, res, next) => {
    authHelper.authenticateUser(req, res, next)
});
router.get("/login", (req, res, next) => {
    res.render("login", {title: "login", error: ""})
});

router.post("/register", (req, res, next) => {
    authController.register(req, res, next);
    console.log(res.headersSent)
});

router.get("/logout", (req, res, next) => {
    res.clearCookie("token");
    res.clearCookie("isAuth");
    res.redirect("/");
});

module.exports = router;
