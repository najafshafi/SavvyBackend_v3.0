import mongoose from "mongoose";

// Question schema definition
const questionSchema = new mongoose.Schema(
    {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
        question: {
            type: String,
            required: true,
        },
        options: [
            {
                type: String,
                required: true,
            },
        ],
        correctAnswer: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
