const jwt = require("jsonwebtoken");
const { auth } = require("../config/firebaseAdmin");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        // First try Firebase token
        try {
            const decodedFirebaseToken = await auth.verifyIdToken(token);

            req.user = {
                id: decodedFirebaseToken.uid,
                email: decodedFirebaseToken.email,
                role: decodedFirebaseToken.role || "student"
            };

            return next();
        } catch (firebaseError) {
            // If it's not a Firebase token, try our existing JWT
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = decoded;

            return next();
        }

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;