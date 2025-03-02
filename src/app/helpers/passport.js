const passport = require("passport");
const LocalStrategy = require("passport-local")

const UserModel = require("../models/UserModel");
const userModel = new UserModel()

const AuthBcrypt = require("./authBcrypt");
const authBcrypt = new AuthBcrypt()

const customFields = {
    usernameField: "email",
    passwordField: "password",
    session: false
};

const verify = (email, password, done) => {

    userModel.getUserByEmail(email).then(user => {
        if (!user){
            return done(null,false, { message: "User not found" })
        }
        authBcrypt.checkPassword(password, user.password).then(result => {
            console.log(`verify: ${result}`)
            if (result)
                return done(null, user)
            else
                return done(null, false, { message: "Incorrect password" });
        }).catch(_ => {
            return done("error")
        })
    }).catch(err => {
        return (done(err))
    })
}

const strategy = new LocalStrategy(customFields, verify)

passport.use(strategy)

