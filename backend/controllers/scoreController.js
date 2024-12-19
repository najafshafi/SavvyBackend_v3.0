import Score from '../models/Score.js';
import mongoose from 'mongoose';

// Save or update the score after a quiz attempt
export const saveScore = async (req, res) => {
    const { quizId, score } = req.body;
    try {
        // Convert userId to ObjectId
        const userId = new mongoose.Types.ObjectId(req.auth.userId);
        let userScore = await Score.findOne({ userId, quizId });

        if (userScore) {
            // Update the existing score
            userScore.score = score;
            userScore.attempts += 1;
            userScore.lastAttempt = Date.now();
        } else {
            // Create a new score record
            userScore = new Score({
                userId,
                quizId,
                score,
            });
        }

        await userScore.save();
        res.status(200).json({ message: "Score saved successfully", score: userScore, });
    } catch (error) {
        console.error("Error saving score:", error.message);
        res.status(400).json({ message: error.message });
    }
};
