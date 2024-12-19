import mongoose from "mongoose";

// Leaderboard schema definition
const leaderboardSchema = new mongoose.Schema(
    {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
        scores: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                score: { type: Number, required: true },
                date: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Sorting scores by score value (high to low) before saving
leaderboardSchema.pre("save", function (next) {
    this.scores.sort((a, b) => b.score - a.score);
    next();
});

export default mongoose.model("Leaderboard", leaderboardSchema);
