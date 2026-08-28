const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL INTERNSHIPS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const internships = [
            {
                id: 1,
                title: "Software Development Intern",
                company: "Tech Company",
                location: "Chennai",
                mode: "Hybrid",
                skills: ["JavaScript", "React.js", "Node.js"],
                duration: "3 Months",
                status: "Open"
            },
            {
                id: 2,
                title: "AI/ML Intern",
                company: "Innovation Labs",
                location: "Bangalore",
                mode: "On-site",
                skills: ["Python", "Machine Learning", "SQL"],
                duration: "6 Months",
                status: "Open"
            },
            {
                id: 3,
                title: "Web Development Intern",
                company: "Digital Solutions",
                location: "Remote",
                mode: "Remote",
                skills: ["HTML", "CSS", "JavaScript"],
                duration: "3 Months",
                status: "Open"
            },
            {
                id: 4,
                title: "Data Science Intern",
                company: "Analytics Hub",
                location: "Hyderabad",
                mode: "Hybrid",
                skills: ["Python", "Pandas", "Data Analysis"],
                duration: "4 Months",
                status: "Open"
            }
        ];

        res.json({
            success: true,
            message: "Internships fetched successfully",
            internships: internships
        });

    } catch (error) {
        console.error("Internship error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch internships"
        });
    }
});

// ==========================================
// APPLY FOR INTERNSHIP
// ==========================================
router.post("/:internshipId/apply", authMiddleware, async (req, res) => {
    try {
        const { internshipId } = req.params;

        res.json({
            success: true,
            message: "Internship application submitted successfully",
            application: {
                internshipId: internshipId,
                studentId: req.user.id,
                status: "Applied"
            }
        });

    } catch (error) {
        console.error("Application error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to apply for internship"
        });
    }
});

module.exports = router;