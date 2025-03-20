const path = require("path");
const firebaseService = require(path.join(__dirname, "../app/services/FirebaseService"));
const admin = firebaseService.getAdmin();
const verifyToken = async (req, res, next) => {
    const idToken = req.cookies.access_token;
    if (!idToken) {
        return res.status(403).json({ error: "No token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized" });
    }
};

module.exports = verifyToken;