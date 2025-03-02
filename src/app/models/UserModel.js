const {join} = require("path");
const sqlite = require("sqlite3");
const db = new sqlite.Database("src/app/data/rental.db");

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255)
    );
`, function (err) {
    if (err) {
        console.log(err);
    }
});

class UserModel {

    model = {
        name: "",
        email: "",
        password: ""
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                reject("No User provided")
            }

            const sql = "Select * FROM users WHERE email = ?";
            let stmt = db.prepare(sql);

            stmt.get(email, (err, row) => {
                if (err) {
                    return reject("Server error");
                }
                console.log(`got user: ${JSON.stringify(row)}`);
                resolve(row);
            });
        })
    }

    create(data) {
        return new Promise((resolve, reject) => {
            if (PropertyHelper.hasUndefinedProperty(data)){
                reject("Not all fields have values")
            }

            this.model = data;
            const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

            let stmt = db.prepare(sql);
            stmt.run(data.username, data.email, data.password,
                (err) => {
                    if (err) {
                        reject(err)
                    }
                    console.log(`Row inserted: ${stmt.lastID}`);
                    resolve(stmt.lastID);
                });
        })

    }

}

module.exports = UserModel