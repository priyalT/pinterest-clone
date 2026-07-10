import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.delete('/:id', deleteComment)

export default router;
