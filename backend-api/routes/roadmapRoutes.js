const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// AI SKILL ROADMAP
// ==========================================
router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const { careerGoal } = req.body;

        // Check career goal
        if (!careerGoal) {
            return res.status(400).json({
                success: false,
                message: "Career goal is required"
            });
        }

        // Temporary roadmap data
        // Later we can connect this to a real AI model.
        const roadmap = {
            careerGoal: careerGoal,

            skills: [
                {
                    name: "JavaScript",
                    level: "Beginner",
                    progress: 0
                },
                {
                    name: "React.js",
                    level: "Beginner",
                    progress: 0
                },
                {
                    name: "Node.js",
                    level: "Beginner",
                    progress: 0
                },
                {
                    name: "MongoDB",
                    level: "Beginner",
                    progress: 0
                },
                {
                    name: "REST APIs",
                    level: "Beginner",
                    progress: 0
                },
                {
                    name: "Git & GitHub",
                    level: "Beginner",
                    progress: 0
                }
            ],

            roadmap: [
                {
                    step: 1,
                    title: "Learn JavaScript",
                    description: "Learn variables, functions, arrays, objects and asynchronous programming."
                },
                {
                    step: 2,
                    title: "Learn React.js",
                    description: "Build interactive user interfaces using React."
                },
                {
                    step: 3,
                    title: "Learn Node.js",
                    description: "Learn backend development and create APIs using Node.js."
                },
                {
                    step: 4,
                    title: "Learn MongoDB",
                    description: "Learn how to store and manage application data."
                },
                {
                    step: 5,
                    title: "Build REST APIs",
                    description: "Connect frontend applications with backend services."
                },
                {
                    step: 6,
                    title: "Learn Git & GitHub",
                    description: "Manage your code and collaborate with development teams."
                }
            ],

            projects: [
                "Build a personal portfolio",
                "Build a task management application",
                "Build a full-stack web application"
            ]
        };

        res.json({
            success: true,
            message: "Skill roadmap generated successfully",
            roadmap: roadmap
        });

    } catch (error) {
        console.error("Roadmap error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate skill roadmap"
        });
    }
});

module.exports = router;