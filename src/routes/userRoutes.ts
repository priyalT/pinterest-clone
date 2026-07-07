import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();
router.get('/:id', authMiddleware, getUserProfile);
router.post('/:id', authMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUserProfile)

export default router;