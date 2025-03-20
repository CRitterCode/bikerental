const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController')

let authController = new AuthController();

router.post("/register", (req, res, next) => {
    authController.register(req, res, next);
});

router.post("/login", (req, res, next) => {
    authController.login(req, res, next);
});

router.get("/login", (req, res, next) => {
    res.render("auth", {title: "Login"})
});

router.get("/logout", (req, res, next) => {
    authController.logout(req,res,next);
});

module.exports = router;
