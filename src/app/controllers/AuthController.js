const firebaseService = require("../services/firebaseService");

class AuthController {
    async register(req, res, next) {

        if (!this.#isModelValid(req?.body)){
            return res.render("auth", {title: "Register", error: "No Credentials."});
        }

        let birthdate = new Date(req.body?.birthdate);
        if (birthdate > new Date().setFullYear(new Date().getFullYear()-18)){
            return res.render("auth", {title: "Register", error: "Must be at least 18 years old"});
        }

        try {
            await firebaseService.createUser(req.body);
            await firebaseService.sendVerificationEmail();

            return res.render("auth", {title: "Login", error: "Success, check your email to verify your account."});
        } catch (err) {
            return res.render("auth", {title: "Register", error: err.message || "Error while registration"});
        }
    }

    async login(req, res, next) {
        if (!this.#isModelValid(req?.body)) {
            return res.render("auth", {title: "Login", error: "No Credentials."});
        }

        try {
            let token = await firebaseService.signIn(req.body);

            if (!token) {
                return res.render("auth", {title: "Login", error: "Error while logging in."});
            }

            let user = await firebaseService.getCurrentUser();
            if (!user?.emailVerified){
                return res.render("auth", {title: "Login", error: "Email not verified."});
            }

                res.cookie("access_token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict"
                });
                res.locals.user = {};

                return res.render("home", {title: "Home"});

        } catch (err) {
            return res.render("auth", {title: "Login", error: err.message});
        }
    }

    #isModelValid(userModel){
        return userModel && Object.keys(userModel).length > 0
    }

    async logout(req, res, next) {
        if (!firebaseService.getCurrentUser()){
            return res.render("home", {title: "Home", error: "No user available."});
        }

        try{
            await firebaseService.signOut().then(_ => {
                res.clearCookie("access_token");
                res.locals.user = null;
                return res.render("home", {title: "Home"});
            });
        }catch (err) {
            return res.render("auth", {title: "Home", error: err.message});
        }
    }
}

module.exports = AuthController;

