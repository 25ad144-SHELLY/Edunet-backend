const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET MY APPLICATIONS
// ==========================================
router.get("/my-applications", authMiddleware, async (req, res) => {
    try {
        const applications = [
            {
                id: 1,
                type: "Internship",
                title: "Software Development Intern",
                company: "Tech Company",
                status: "Applied"
            },
            {
                id: 2,
                type: "Internship",
                title: "AI/ML Intern",
                company: "Innovation Labs",
                status: "Applied"
            },
            {
                id: 3,
                type: "Placement",
                title: "Software Engineer",
                company: "Tech Solutions",
                status: "Shortlisted"
            }
        ];

        res.json({
            success: true,
            message: "Applications fetched successfully",
            applications: applications
        });

    } catch (error) {
        console.error("Applications error:", error);

        resS.status(500).json({
            success: false,
            message: "Failed to fetch applications"
        });
    }
});

module.exports = router;