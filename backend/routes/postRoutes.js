import express from 'express';
import { getAllPosts, createPost, addLikes, addComment, editPost, deletePost, Uploadapplication, getApplications } from '../controllers/postController.js';
import checkAuth from '../middleware/middleware.js';

const router = express.Router();


router.get('/', checkAuth, getAllPosts);
router.post('/create', checkAuth, createPost);
router.post('/addLikes/:id', checkAuth, addLikes);
router.post('/comment/:postId', checkAuth, addComment);
router.put('/edit/:postId', checkAuth, editPost);
router.delete('/delete/:postId', checkAuth, deletePost);
router.post('/upload/:postId', checkAuth, Uploadapplication);
router.get('/download/:postId', checkAuth, getApplications);


export default router;
