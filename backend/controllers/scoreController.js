import Score from '../models/Score.js';
import mongoose from 'mongoose';

// Save or update the score after a quiz attempt
// export const saveScore = async (req, res) => {
//     const { quizId, score } = req.body;
//     try {
//         // Convert userId to ObjectId
//         const userId = new mongoose.Types.ObjectId(req.auth.userId);
//         let userScore = await Score.findOne({ userId, quizId });

//         if (userScore) {
//             // Update the existing score
//             userScore.score = score;
//             userScore.attempts += 1;
//             userScore.lastAttempt = Date.now();
//         } else {
//             // Create a new score record
//             userScore = new Score({
//                 userId,
//                 quizId,
//                 score,
//             });
//         }

//         await userScore.save();
//         res.status(200).json({ message: "Score saved successfully", score: userScore, });
//     } catch (error) {
//         console.error("Error saving score:", error.message);
//         res.status(400).json({ message: error.message });
//     }
// };
// import mongoose from "mongoose";
// import userChats from "../models/userChats.js";
// import Score from "../models/Score.js";

// export const saveScore = async (req, res) => {
//     const { quizId, score } = req.body;

//     try {
//         const userId = new mongoose.Types.ObjectId(req.auth.userId);

//         // Check if a score for the quiz already exists
//         let userScore = await Score.findOne({ userId, quizId });

//         if (userScore) {
//             // If the score exists, update it
//             userScore.score = score;
//             userScore.attempts += 1;
//             userScore.lastAttempt = Date.now();

//             await userScore.save();

//             const userChat = await userChats.findOne({ userId });

//             if (!userChat) {
//                 console.error("UserChat document not found for userId:", userId);
//                 return res.status(404).json({ message: "User chat document not found" });
//             }


//             // Update the quiz score in the user's scores array in userChats
//             const updatedUserChats = await userChats.findOneAndUpdate(
//                 { userId, "scores.quizId": quizId }, // Find the user and the quiz
//                 {
//                     $set: {
//                         "scores.$.score": score,
//                         "scores.$.attempts": userScore.attempts,
//                     },
//                 },
//                 { new: true }
//             );

//             if (!updatedUserChats) {
//                 // If the quizId doesn't exist in the scores array, push a new entry
//                 await userChats.findOneAndUpdate(
//                     { userId },
//                     {
//                         $push: {
//                             scores: {
//                                 quizId,
//                                 score,
//                                 attempts: 1, // First attempt
//                             },
//                         },
//                     }
//                 );
//             }

//             res.status(200).json({
//                 message: "Score updated successfully",
//                 score: userScore,
//             });
//         } else {
//             // If the score doesn't exist, create a new entry in the Score model
//             userScore = new Score({
//                 userId,
//                 quizId,
//                 score,
//                 attempts: 1, // First attempt
//                 lastAttempt: Date.now(),
//             });

//             await userScore.save();

//             // Add the score to the user's scores array in the userChats model
//             const updatedUserChats = await userChats.findOneAndUpdate(
//                 { userId },
//                 {
//                     $push: {
//                         scores: {
//                             quizId,
//                             score,
//                             attempts: 1,
//                         },
//                     },
//                 }
//             );

//             if (!updatedUserChats) {
//                 console.error("Error updating userChats document");
//             }

//             res.status(200).json({
//                 message: "Score saved successfully",
//                 score: userScore,
//             });
//         }
//     } catch (error) {
//         console.error("Error saving score:", error.message);
//         res.status(400).json({
//             message: "Error saving score",
//             error: error.message,
//         });
//     }
// };


import userChats from '../models/userChats.js';

export const saveScores = async (req, res) => {
    const { quizId, score } = req.body;
    try {
        // Log userId and request body for debugging
        console.log('User ID from token:', req.auth.userId);
        console.log('Request Body:', req.body);

        const userId = new mongoose.Types.ObjectId(req.auth.userId);

        // Log user score before saving it
        let userScore = await Score.findOne({ userId, quizId });
        console.log('User Score:', userScore);

        if (userScore) {
            userScore.score = score;
            userScore.attempts += 1;
            userScore.lastAttempt = Date.now();
            await userScore.save();
        } else {
            userScore = new Score({
                userId,
                quizId,
                score,
                attempts: 1,
                lastAttempt: Date.now(),
            });
            await userScore.save();
        }
        // Ensure userId is an ObjectId if it's not already
        if (!(userId instanceof mongoose.Types.ObjectId)) {
            userId = new mongoose.Types.ObjectId(userId); // Convert if it's not
        }

        // Log user chat before saving it
        console.log('USerID:', userId);

        // Use findOne() to find user by userId field, not _id
        let user = await userChats.findOne({ userId: userId });

        if (!user) {
            console.log('User not found');
        } else {
            console.log('User found:', user);
        }

        console.log('UserChats find the user:', user);

        const users = await userChats.findById({ userId });

        if (!users) {
            console.log('User not found');
            return;
        }


        const newScore = {
            quizId: quiz._id,
            score,
            attempts: 1, // Initial attempt
            lastAttempt: new Date(),
        };

        user.scores.push(newScore);

        // Save the updated user document
        await user.save();


        // if (!userChat) {
        //     userChat = new userChats({
        //         userId,
        //         scores: [
        //             {
        //                 quizId,
        //                 score,
        //                 attempts: 1,
        //             },
        //         ],
        //     });

        //     await userChat.save();
        //     return res.status(200).json({
        //         message: "New userChats document created and score saved",
        //         score: userScore,
        //     });
        // } else {
        // const updatedUserChats = await userChats.findOneAndUpdate(
        //     { userId, quizId },
        //     {
        //         $set: {
        //             "scores.$.score": score,
        //             "scores.$.attempts": userScore.attempts,
        //         },
        //     },
        //     { new: true }
        // );

        // console.log(updatedUserChats)

        // if (!updatedUserChats) {
        //     const pushUserChats = await userChats.findOneAndUpdate(
        //         { userId },
        //         {
        //             $push: {
        //                 scores: {
        //                     quizId,
        //                     score,
        //                     attempts: 1,
        //                 },
        //             },
        //         },
        //         { new: true }
        //     );

        //     if (!pushUserChats) {
        //         console.error("Error pushing new score to userChats document");
        //         return res.status(500).json({ message: "Error saving score in userChats" });
        //     }
        // }

        return res.status(200).json({
            message: "Score updated successfully",
            score: userScore,
        });
        // }
    } catch (error) {
        console.error("Error saving score:", error.message);
        return res.status(500).json({
            message: "Error saving score",
            error: error.message,
        });
    }
};



// export const saveScore = async (req, res) => {
//     const { quizId, score } = req.body;
//     try {

//         // Use userId from the token directly as a string (no conversion needed)
//         const userId = req.auth.userId;


//         // Query user by userId (which is a string in your schema)
//         let user = await userChats.findById(userId);

//         let userScore = await Score.findOne({ userId, quizId });

//         if (userScore) {
//             // Update the existing score
//             userScore.score = score;
//             userScore.attempts += 1;
//             userScore.lastAttempt = Date.now();
//         } else {
//             // Create a new score record
//             userScore = new Score({
//                 userId,
//                 quizId,
//                 score,
//             });
//         }

//         await userScore.save();

//         // Process score update (add score to the user's scores array)
//         const newScore = {
//             quizId: req.body.quizId,
//             score: req.body.score,
//             attempts: userScore.attempts,  // Initial attempt
//             lastAttempt: new Date(),
//         };

//         // Push the new score to the user's scores array
//         user.scores.push(newScore);

//         // Save the updated user data
//         await user.save();



//         const updatedUserChats = await userChats.findOneAndUpdate(
//             { userId },
//             {
//                 $set: {
//                     "scores.$.score": score,
//                     "scores.$.attempts": newScore.attempts,
//                 },
//             },
//             // { new: true }
//         );
//         await user.save();

//         if (!updatedUserChats) {
//             const pushUserChats = await userChats.findOneAndUpdate(
//                 { userId },
//                 {
//                     $push: {
//                         scores: {
//                             quizId,
//                             score,
//                             attempts: 1,
//                         },
//                     },
//                 },
//                 // { new: true }
//             );

//             //     if (!pushUserChats) {
//             //         console.error("Error pushing new score to userChats document");
//             //         return res.status(500).json({ message: "Error saving score in userChats" });
//             //     }
//         }






//         return res.status(200).json({
//             message: "Score updated successfully",
//             score: newScore,
//         });

//     } catch (error) {
//         console.error("Error saving score:", error.message);
//         return res.status(500).json({
//             message: "Error saving score",
//             error: error.message,
//         });
//     }
// };


export const saveScore = async (req, res) => {
    const { quizId, score } = req.body;
    try {
        const userId = req.auth.userId;

        // Fetch the user document from userChats collection
        let user = await userChats.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user already has a score for the quiz in the Score collection
        let userScore = await Score.findOne({ userId, quizId });

        let updatedScore;
        if (userScore) {
            // If the score exists, check if the new score is higher and update it
            if (score > userScore.score) {
                userScore.score = score; // Update score
                userScore.attempts += 1; // Increment attempts
                userScore.lastAttempt = new Date(); // Update last attempt timestamp
            }
            updatedScore = userScore;
        } else {
            // If the score does not exist, create a new score in the Score collection
            updatedScore = new Score({
                userId,
                quizId,
                score,
                attempts: 1,
                lastAttempt: new Date(),
            });
            await updatedScore.save(); // Save the new score
        }

        // Save the updated score in the Score collection
        await updatedScore.save();

        // Now update the user's scores in the userChats collection
        const existingScoreIndex = user.scores.findIndex(s => s.quizId.toString() === quizId.toString());

        if (existingScoreIndex !== -1) {
            // If the score exists in userChats, update it
            user.scores[existingScoreIndex].score = updatedScore.score;
            user.scores[existingScoreIndex].attempts = updatedScore.attempts;
            user.scores[existingScoreIndex].lastAttempt = updatedScore.lastAttempt;
        } else {
            // If the score doesn't exist, add it to the user's scores
            user.scores.push({
                quizId,
                score: updatedScore.score,
                attempts: updatedScore.attempts,
                lastAttempt: updatedScore.lastAttempt,
            });
        }

        // Save the updated user data in userChats
        await user.save();

        return res.status(200).json({
            message: "Score updated successfully",
            score: updatedScore,
        });

    } catch (error) {
        console.error("Error saving score:", error.message);
        return res.status(500).json({
            message: "Error saving score",
            error: error.message,
        });
    }
};
