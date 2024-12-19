import express from 'express';
import { createQuiz, getAllQuizzes, getQuizById } from '../controllers/quizController.js';
import checkAuth from '../middleware/middleware.js';

const router = express.Router();

router.post('/create', checkAuth, createQuiz);
router.get('/allquiz', getAllQuizzes);
router.get('/:quizId', getQuizById);

export default router;
