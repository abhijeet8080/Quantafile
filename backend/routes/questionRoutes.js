// routes/questionRoutes.js
import express from 'express';
const router = express.Router();

import {
  askQuestion,
  getQuestionDetails,
  updateQuestion,
  deleteQuestion,
  markQuestionStatus,
  searchQuestions,
  getAllQuestions,
  deleteQuestionAdmin
} from '../controllers/questionController.js';

import { authorizeRoles, isAuthenticated } from '../middleware/authMiddleware.js';
import { getAnswersForQuestion } from '../controllers/answerController.js';



router.get('/', getAllQuestions);
// @route   POST /api/questions
// @desc    Ask a new question
router.post('/', isAuthenticated, askQuestion);

// @route   GET /api/questions/:id
// @desc    Get a specific question's details
router.get('/:id', getQuestionDetails);

// @route   PUT /api/questions/:id
// @desc    Update a question
router.put('/:id', isAuthenticated, updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete a question
router.delete('/:id', isAuthenticated, deleteQuestion);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteQuestionAdmin);

// @route   PATCH /api/questions/:id/status
// @desc    Mark question as resolved/unresolved
router.patch('/:id/status', isAuthenticated, markQuestionStatus);
router.get('/:id/answers',isAuthenticated,getAnswersForQuestion)
router.get('/search', searchQuestions);

export default router;
