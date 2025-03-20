const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

//views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));

//config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
dotenv.config();


//routes
const authRoutes = require("./routes/auth")
const homeRoutes = require("./routes/home")
const backofficeRoutes = require("./routes/backoffice")
const shopRoutes = require("./routes/shop")



app.use((req, res, next) => {
    res.locals.title = "";
    res.locals.info = "";
    res.locals.error = "";
    res.locals.user = req.cookies.access_token ? {} : null;
    next();
});

app.use("/auth", authRoutes);
app.use("/backoffice", backofficeRoutes);
app.use("/shop", shopRoutes);
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
