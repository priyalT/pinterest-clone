import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPin, getPin, updatePin, deletePin } from '../controllers/pinController.js';

const router = express.Router();
router.post('', authMiddleware, createPin);
router.get('/:id', authMiddleware, getPin)
router.put('/:id', authMiddleware, updatePin)
router.delete('/:id', authMiddleware, deletePin)

export default router;