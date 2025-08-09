import express from 'express';
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  markBestAnswer,
  addCommentToAnswer,
  deleteAnswerAdmin,
  getAnswerById
} from '../controllers/answerController.js';
import { authorizeRoles, isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, createAnswer);
router.put('/:id', isAuthenticated, updateAnswer);
router.delete('/:id', isAuthenticated, deleteAnswer);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteAnswerAdmin);
router.put('/:id/best', isAuthenticated, markBestAnswer);
router.post('/:id/comments', isAuthenticated, addCommentToAnswer);
router.get("/:id", isAuthenticated, getAnswerById);

export default router;
