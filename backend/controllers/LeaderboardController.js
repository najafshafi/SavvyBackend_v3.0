// import Score from '../models/Score.js';

// // Get the top 10 leaderboard
// export const getLeaderboard = async (req, res) => {
//     try {
//         const leaderboard = await Score.aggregate([
//             { $group: { _id: "$userId", totalScore: { $sum: "$score" } } },
//             { $sort: { totalScore: -1 } },
//             { $limit: 10 },
//         ]);

//         res.status(200).json(leaderboard);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


import Score from '../models/Score.js';
import userChats from '../models/userChats.js'; // Assuming the User model is named "User"

// Get the top 10 leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        // Aggregate scores and join with user data to get the user name
        const leaderboard = await Score.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" }
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users', // The name of the collection where users are stored
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Unwind the userDetails array to get a single object
            },
            {
                $project: {
                    name: '$userDetails.name', // Get user name from the joined data
                    totalScore: 1 // Keep totalScore in the response
                }
            }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
