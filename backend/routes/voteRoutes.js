// routes/voteRoutes.js
import express from 'express';
import { voteOnItem } from '../controllers/voteController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, voteOnItem);

export default router;
