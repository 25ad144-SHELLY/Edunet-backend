const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET PLACEMENT OPPORTUNITIES
router.get("/", authMiddleware, async (req, res) => {
    try {
        const placements = [
            {
                id: 1,
                jobTitle: "Junior Full Stack Developer",
                company: "Tech Solutions",
                location: "Chennai",
                mode: "Hybrid",
                skills: ["JavaScript", "React.js", "Node.js"],
                salary: "4-6 LPA"
            },
            {
                id: 2,
                jobTitle: "Software Engineer",
                company: "Innovation Labs",
                location: "Bangalore",
                mode: "On-site",
                skills: ["Java", "SQL", "REST APIs"],
                salary: "5-8 LPA"
            },
            {
                id: 3,
                jobTitle: "Frontend Developer",
                company: "Digital Solutions",
                location: "Remote",
                mode: "Remote",
                skills: ["HTML", "CSS", "JavaScript", "React.js"],
                salary: "4-7 LPA"
            }
        ];

        res.json({
            success: true,
            message: "Placement opportunities fetched successfully",
            placements: placements
        });

    } catch (error) {
        console.error("Placement error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch placement opportunities"
        });
    }
});

module.exports = router;