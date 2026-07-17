import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPin, getPin, updatePin, deletePin, getPinFeed, savePin, unsavePin, getFollowingPinFeed } from '../controllers/pinController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';
import { createComment, getComment } from '../controllers/commentController.js';
import { createLike, deleteLike } from '../controllers/likeController.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware, createPin);
router.get('/feed', authMiddleware, cacheMiddleware(30) ,getPinFeed);
router.get('/feed/following', authMiddleware, getFollowingPinFeed);
router.delete('/:id/unsave', authMiddleware, unsavePin);


router.get('/:id', cacheMiddleware(300), getPin);
router.put('/:id', authMiddleware, updatePin);
router.delete('/:id', authMiddleware, deletePin);
router.post('/:id/save', authMiddleware, savePin);

router.post('/:id/comments', authMiddleware, createComment)
router.get('/:id/comments', getComment)

router.post('/:id/like', authMiddleware, createLike)
router.delete('/:id/like', authMiddleware, deleteLike)


export default router;
