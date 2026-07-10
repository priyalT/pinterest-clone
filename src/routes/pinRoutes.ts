import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPin, getPin, updatePin, deletePin, getPinFeed, savePin, unsavePin } from '../controllers/pinController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';
import { createComment, getComment } from '../controllers/commentController.js';

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware, createPin);
router.get('/feed', authMiddleware, getPinFeed);
router.delete('/:id/unsave', authMiddleware, unsavePin);


router.get('/:id', getPin);
router.put('/:id', authMiddleware, updatePin);
router.delete('/:id', authMiddleware, deletePin);
router.post('/:id/save', authMiddleware, savePin);

router.post('/:id/comments', authMiddleware, createComment)
router.get('/:id/comments', getComment)


export default router;
