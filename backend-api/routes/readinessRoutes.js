const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PLACEMENT READINESS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const readiness = {
            placementReadiness: 72,
            skillsCompleted: 6,
            skillsInProgress: 4,
            internships: 3,
            recommendedSkills: [
                "Data Structures",
                "Algorithms",
                "System Design"
            ]
        };

        res.json({
            success: true,
            message: "Placement readiness fetched successfully",
            readiness: readiness
        });

    } catch (error) {
        console.error("Readiness error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch placement readiness"
        });
    }
});

module.exports = router;