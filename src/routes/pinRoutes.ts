import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPin, getPin, updatePin, deletePin, getPinFeed, savePin, unsavePin } from '../controllers/pinController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.post('/', authMiddleware, uploadMiddleware, createPin);
router.get('/:id', authMiddleware, getPin);
router.put('/:id', authMiddleware, updatePin);
router.delete('/:id', authMiddleware, deletePin);
router.get('', authMiddleware, getPinFeed);
router.post('/:id/save', authMiddleware, savePin);
router.delete('/:id/save', authMiddleware, unsavePin);


export default router;