import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ status: "ok", message: "Protected route working" });
});

export default router;