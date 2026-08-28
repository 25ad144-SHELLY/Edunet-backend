const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["student", "industry", "faculty"],
            default: "student"
        },

        // Student career information
        careerGoal: {
            type: String,
            default: ""
        },

        // Student skills
        skills: [
            {
                name: {
                    type: String
                },
                level: {
                    type: String,
                    enum: ["Beginner", "Intermediate", "Advanced"],
                    default: "Beginner"
                },
                progress: {
                    type: Number,
                    min: 0,
                    max: 100,
                    default: 0
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;