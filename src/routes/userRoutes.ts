import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';


const router = express.Router();
router.get('/:id', authMiddleware, getUserProfile);
router.put('/:id', authMiddleware, uploadAvatarMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUserProfile)

export default router;