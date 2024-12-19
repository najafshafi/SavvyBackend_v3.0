import Score from '../models/Score.js';

// Get the top 10 leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Score.aggregate([
            { $group: { _id: "$userId", totalScore: { $sum: "$score" } } },
            { $sort: { totalScore: -1 } },
            { $limit: 10 },
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
