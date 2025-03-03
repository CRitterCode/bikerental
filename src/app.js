require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const app = express();

//views
app.set("view engine", "ejs");
app.set("views", "src/app/views");

//config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//auth
require("./app/helpers/passport")
app.use(passport.initialize());

app.use((req, res, next) => {
    res.locals.user = req.cookies[process.env.TOKEN];
    next();
});

//routes
const authRoutes = require("./routes/auth")
const homeRoutes = require("./routes/home")


app.use("/auth", authRoutes);
app.use("/", homeRoutes);




//error
app.use((req, res, next) => {
    res.status(404).render("errPage", {title: "404", err: "Page not found."});
});

app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack); // Stacktrace ausgeben
    res.status(500).render("errPage", { title: "500", err: "Error, please contact host." });
});

app.listen(3000);
