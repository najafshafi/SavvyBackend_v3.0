import mongoose from "mongoose";

// Quiz schema definition
const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                solution: {
                    type: String,
                    required: true,
                },
                solutionCharacters: [
                    {
                        type: String,
                        required: true,
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
