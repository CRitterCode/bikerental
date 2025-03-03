const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController')

const authHelper = require("../app/helpers/authHelper");
let authController = new AuthController(rootDir);

router.post("/login", (req, res, next) => {
    authHelper.authenticateUser(req, res, next)
});
router.get("/login", (req, res, next) => {
    res.render("auth", {title: "login", error: ""})
});

router.post("/register", (req, res, next) => {
    authController.register(req, res, next);
    console.log(res.headersSent)
});

router.get("/logout", (req, res, next) => {
    res.clearCookie(process.env.TOKEN);
    res.locals.user = null;
    res.redirect("/auth/login")
});

module.exports = router;
