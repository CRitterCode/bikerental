const jwt = require('jsonwebtoken');
const passport = require("passport");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

function ensureAuthenticated(req, res, next) {

    const token = req.cookies[process.env.TOKEN];

    if (!token) {
        return res.render("auth", {title: "auth", error: "Unauthorized."})
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.render("auth", {title: "auth", error: "Cant verify"})
        }
        req.user = decoded;
        res.locals.user = decoded;
        next();
    });
}

const authenticateUser = (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        console.log("userlogin: ", JSON.stringify(user))
        if (!user && info) {
            return res.render("auth", {title: "auth", error: info.message});
        }

        if (!user){
            return res.render("auth", {title: "auth", error: "Authentication failed"})
        }

        const token = jwt.sign({id: user.email, username: user.username}, SECRET_KEY, {expiresIn: "1h"});

        res.cookie(process.env.TOKEN, token, {httpOnly: true, maxAge: 3600000});
        res.locals.user = user;
        return  res.redirect("/");

    })(req, res, next);
};

module.exports = {
    authenticateUser: authenticateUser,
    ensureAuthenticated: ensureAuthenticated
};