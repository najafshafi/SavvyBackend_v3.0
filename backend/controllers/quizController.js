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

// Create a new quiz
export const createQuiz = async (req, res) => {
    const { title, difficulty, questions } = req.body;

    // Check for missing fields
    if (!title || !difficulty) {
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
