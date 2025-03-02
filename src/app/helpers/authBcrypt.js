const bcrypt = require("bcrypt");
const {join} = require("path");
const saltRounds = 10;
"use strict"

const UserModel = require("../models/UserModel");
const userModel = new UserModel()

class AuthBcrypt {

    user = userModel.model;

    async checkPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    async generateHash(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds).then(hash => {
                resolve(hash);
            }).catch(_ => {
                reject("Couldn't create User.");
            });
        });
    }

}

module.exports = AuthBcrypt;