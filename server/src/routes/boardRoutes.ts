import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createBoard, deleteBoard, getBoard, updateBoard } from '../controllers/boardController.js';

const router = express.Router();
router.post('/', authMiddleware, createBoard);
router.get('/:id', getBoard)
router.put('/:id', authMiddleware, updateBoard)
router.delete('/:id', authMiddleware, deleteBoard)

export default router;