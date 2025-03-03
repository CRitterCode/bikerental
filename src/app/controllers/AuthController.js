const UserModel = require("../models/UserModel");
const userModel = new UserModel()
const AuthBcrypt = require("../helpers/authBcrypt");
const authHelper = require("../helpers/authHelper");
const authBcrypt = new AuthBcrypt()

class AuthController {
    user = userModel.model

    register(req, res) {
        this.user = req.body;
        userModel.getUserByEmail(this.user.email).then(user => {
            if (user){
                res.render("auth", { title: "login", error: "Email already exists" });
            } else{

                authBcrypt.generateHash(this.user.password).then(hash => {
                    this.user.password = hash;
                    userModel.create(this.user).then(_ => {
                        res.redirect(307, "/auth/login")
                    }).catch(err => {
                        res.render("auth", {title: "login", error: err})
                    })
                })
            }
        }).catch(err => {
            res.render("auth", {title: "login", error: err})
        })

    }


}

module.exports = AuthController;