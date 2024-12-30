import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/TaskController.js";
import checkAuth from '../middleware/middleware.js';

const router = express.Router();

router.post("/create", checkAuth, createTask);
router.get("/all", checkAuth, getTasks);
router.put("/:id", checkAuth, updateTask);
router.delete("/:id", checkAuth, deleteTask);

export default router;
