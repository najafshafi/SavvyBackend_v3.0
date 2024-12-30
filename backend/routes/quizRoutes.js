import express from 'express';
import { createQuiz, getQuizById, getAllQuizzesWithScores } from '../controllers/quizController.js';
import checkAuth from '../middleware/middleware.js';

const router = express.Router();

router.post('/create', checkAuth, createQuiz);
router.get('/allquiz', checkAuth, getAllQuizzesWithScores);
router.get('/:quizId', getQuizById);

export default router;
