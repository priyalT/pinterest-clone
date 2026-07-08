import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPin, getPin, updatePin, deletePin } from '../controllers/pinController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.post('/upload', authMiddleware, uploadMiddleware, createPin);
router.get('/:id', authMiddleware, getPin)
router.put('/:id', authMiddleware, updatePin)
router.delete('/:id', authMiddleware, deletePin)

export default router;