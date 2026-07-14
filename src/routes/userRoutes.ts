import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile, getUserPinFeed, getUserBoard } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';
import { followUser, getFollowerFeed, getFollowingFeed, unfollowUser } from '../controllers/followController.js';


const router = express.Router();
router.get('/:id/boards', getUserBoard)

router.get('/:id', getUserProfile);
router.get('/:id/pins', getUserPinFeed);
router.put('/:id', authMiddleware, uploadAvatarMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUserProfile);

router.post('/:id/follow', authMiddleware, followUser)
router.delete('/:id/follow', authMiddleware, unfollowUser)

router.get('/:id/followers', getFollowerFeed)
router.get('/:id/following', getFollowingFeed)


export default router;