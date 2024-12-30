import express from 'express';
import { getAllPosts, createPost, addLikes, addComment } from '../controllers/postController.js';
import checkAuth from '../middleware/middleware.js';

const router = express.Router();


router.get('/', checkAuth, getAllPosts);
router.post('/create', checkAuth, createPost);
router.post('/addLikes/:id', checkAuth, addLikes);
router.post('/comment/:postId', checkAuth, addComment);




export default router;
