const jwt = require('jsonwebtoken');
const passport = require("passport");

function ensureAuthenticated(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.render("rental", {title: "rental", error: "Unauthorized."})
    }

    jwt.verify(token, "rental", (err, decoded) => {
        if (err) {
            return res.render("rental", {title: "rental", error: "Unauthorized."})
        }
        req.user = decoded;
        next();
    });
}

const authenticateUser = (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        console.log(user)
        if (!user && info) {
            return res.render("login", {title: "login", error: info.message});
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                return res.send(err);
            }

            const token = jwt.sign({id: user.email, username: user.username}, 'rental', {expiresIn: '1h'});

            res.cookie("token", token, {httpOnly: true, maxAge: 3600000});
            res.cookie("isAuth", token, {httpOnly: false, maxAge: 3600000});

            return res.redirect("/");
        });
    })(req, res, next);
};

module.exports = {
    authenticateUser: authenticateUser,
    ensureAuthenticated: ensureAuthenticated
};