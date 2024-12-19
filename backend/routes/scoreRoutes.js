import express from 'express';
import { saveScore } from '../controllers/scoreController.js';
import checkAuth from '../middleware/middleware.js';

const router = express.Router();

router.post('/save', checkAuth, saveScore);
// router.post('/save', saveScore);


export default router;
