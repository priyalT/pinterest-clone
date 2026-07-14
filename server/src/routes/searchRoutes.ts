import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { searchPins, searchUsers } from '../controllers/searchController.js';

const router = express.Router();
router.get("/pins", authMiddleware, searchPins);
router.get("/users", authMiddleware, searchUsers)

export default router;