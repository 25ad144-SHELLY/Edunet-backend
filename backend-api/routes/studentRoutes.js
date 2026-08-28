const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// STUDENT PROFILE
// ==========================================
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Student profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
});


// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            success: true,
            message: "Student profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
});


// ==========================================
// STUDENT DASHBOARD
// ==========================================
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student dashboard fetched successfully",

            student: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            stats: {
                skillsCompleted: 6,
                skillsInProgress: 4,
                internshipsApplied: 3,
                placementReadiness: 72
            },

            // Get skills directly from MongoDB
            skills: user.skills,

            recommendedSkills: [
                "React.js",
                "Node.js",
                "REST APIs",
                "Git & GitHub"
            ],

            internships: [
                {
                    title: "Software Development Intern",
                    company: "Tech Company",
                    status: "Open"
                },
                {
                    title: "AI/ML Intern",
                    company: "Innovation Labs",
                    status: "Open"
                },
                {
                    title: "Web Development Intern",
                    company: "Digital Solutions",
                    status: "Applied"
                }
            ]
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard"
        });
    }
});


// ==========================================
// UPDATE SKILL PROGRESS
// ==========================================
router.put("/skill-progress", authMiddleware, async (req, res) => {
    try {
        const { skill, progress } = req.body;

        if (!skill || progress === undefined) {
            return res.status(400).json({
                success: false,
                message: "Skill and progress are required"
            });
        }

        if (progress < 0 || progress > 100) {
            return res.status(400).json({
                success: false,
                message: "Progress must be between 0 and 100"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Find existing skill
        const existingSkill = user.skills.find(
            item => item.name.toLowerCase() === skill.toLowerCase()
        );

        if (existingSkill) {
            existingSkill.progress = progress;

            // Update level automatically
            existingSkill.level =
                progress >= 80
                    ? "Advanced"
                    : progress >= 50
                        ? "Intermediate"
                        : "Beginner";

        } else {
            // Add new skill
            user.skills.push({
                name: skill,
                level:
                    progress >= 80
                        ? "Advanced"
                        : progress >= 50
                            ? "Intermediate"
                            : "Beginner",
                progress: progress
            });
        }

        await user.save();

        res.json({
            success: true,
            message: "Skill progress updated successfully",
            skill: skill,
            progress: progress
        });

    } catch (error) {
        console.error("Skill progress error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update skill progress"
        });
    }
});


module.exports = router;