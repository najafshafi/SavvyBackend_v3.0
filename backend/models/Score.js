import mongoose from "mongoose";

// Score schema definition
const scoreSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, default: 0 },
        attempts: { type: Number, default: 0 },
        lastAttempt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Update score and attempts before saving
scoreSchema.pre("save", async function (next) {
    if (!this.isModified("score")) return next();

    this.attempts += 1; // Increment the attempts count each time the score is updated
    this.lastAttempt = Date.now();
    next();
});

export default mongoose.model("Score", scoreSchema);
