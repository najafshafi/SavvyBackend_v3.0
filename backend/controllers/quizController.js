// import Quiz from '../models/quiz.js';
// import Question from '../models/Question.js';

// // Create a new quiz
// export const createQuiz = async (req, res) => {
//     const { name, type } = req.body;

//     try {
//         const newQuiz = new Quiz({
//             name,
//             type,
//         });

//         await newQuiz.save();
//         res.status(201).json(newQuiz);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Get all quizzes
// export const getAllQuizzes = async (req, res) => {
//     try {
//         const quizzes = await Quiz.find();
//         res.status(200).json(quizzes);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Get a specific quiz by ID with questions
// export const getQuizById = async (req, res) => {
//     const { quizId } = req.params;

//     try {
//         const quiz = await Quiz.findById(quizId);
//         const questions = await Question.find({ quizId: quiz._id });

//         if (!quiz) {
//             return res.status(404).json({ message: "Quiz not found" });
//         }

//         res.status(200).json({ quiz, questions });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


import Quiz from '../models/quiz.js';
import Question from '../models/Question.js';
import userChats from "../models/userChats.js";

// Create a new quiz
export const createQuiz = async (req, res) => {
    const { title, difficulty, questions, category } = req.body;

    // Check for missing fields
    if (!title || !difficulty || !category) {
        return res.status(400).json({ message: "Quiz title and difficulty are required" });
    }

    try {
        // Map through questions and split the solution into characters
        const processedQuestions = questions.map(question => {
            const solutionCharacters = question.solution.split("");

            return {
                ...question,
                solutionCharacters,
            };
        });

        // Create and save the quiz with questions
        const newQuiz = new Quiz({
            title,
            difficulty,
            category,
            questions: processedQuestions,
        });

        await newQuiz.save();

        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a specific quiz by ID with questions
export const getQuizById = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId);
        const questions = await Question.find({ quizId: quiz._id });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ quiz, questions });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Example: Update a quiz (could be useful for editing quizzes)
export const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { name, type, questions } = req.body;

    try {
        const quiz = await Quiz.findByIdAndUpdate(quizId, { name, type }, { new: true });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Optionally, update questions
        if (questions) {
            await Question.deleteMany({ quizId });  // Remove existing questions
            const questionPromises = questions.map(async (questionData) => {
                const newQuestion = new Question({
                    quizId: quiz._id,
                    ...questionData,
                });
                await newQuestion.save();
            });
            await Promise.all(questionPromises);
        }

        res.status(200).json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Example: Delete a quiz (could be useful for quiz management)
export const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findByIdAndDelete(quizId);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Optionally, delete associated questions
        await Question.deleteMany({ quizId });

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};





export const getAllQuizzesWithScoress = async (req, res) => {
    try {
        // Retrieve userId from the auth middleware
        const userId = req.auth.userId;

        // Fetch the user (from the userChats model) and populate their scores
        const user = await userChats.findById(userId).populate("scores.quizId");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const quizzes = await Quiz.find({});

        // const quizzesWithScores = quizzes.map((quiz) => {
        //     const userScore = user.scores.find((score) => {
        //         return score.quizId?.toString() === quiz._id.toString(); // Make sure both are the same type
        //     });


        //     // Ensure that both attempts and score are returned, fallback to default (3) if not found
        //     return {
        //         _id: quiz._id,
        //         title: quiz.title,
        //         category: quiz.category,
        //         difficulty: quiz.difficulty,
        //         attempts: userScore?.attempts ?? 3,  // Use fallback (3) if no score found
        //         score: userScore?.score ?? 3,      // Use fallback (3) if no score found
        //     };
        // });
        const quizzesWithScores = quizzes.map((quiz) => {
            // Find the score object for the current quiz
            const userScore = user.scores.find((score) => {
                // Compare the quiz._id with score.quizId._id
                return score.quizId._id.toString() === quiz._id.toString(); // Use score.quizId._id for comparison
            });

            const questionsLength = quiz.questions?.length ?? 0;

            // Ensure that both attempts and score are returned, fallback to default (3) if not found
            return {
                _id: quiz._id,
                title: quiz.title,
                category: quiz.category,
                difficulty: quiz.difficulty,
                attempts: userScore?.attempts ?? 0,  // Use fallback (3) if no score found
                score: userScore?.score ?? 0,      // Use fallback (3) if no score found
                questionsLength,
            };
        });

        // Return the response


        // Return the response
        res.status(200).json(quizzesWithScores);
    } catch (error) {
        console.error("Error fetching quizzes with scores:", error);
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
};


export const getAllQuizzesWithScores = async (req, res) => {
    try {

        const userId = req.auth.userId;

        const user = await userChats.findById(userId).populate("scores.quizId");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const quizzes = await Quiz.find({});

        const quizzesWithScores = quizzes.map((quiz) => {

            const userScore = user.scores.find((score) => {
                return score.quizId && score.quizId._id.toString() === quiz._id.toString();
            });

            const questionsLength = quiz.questions?.length ?? 0;


            return {
                _id: quiz._id,
                title: quiz.title,
                category: quiz.category,
                difficulty: quiz.difficulty,
                attempts: userScore?.attempts ?? 0,
                score: userScore?.score ?? 0,
                questionsLength,
            };
        });

        res.status(200).json(quizzesWithScores);
    } catch (error) {
        console.error("Error fetching quizzes with scores:", error);
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
};
