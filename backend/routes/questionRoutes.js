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
  deleteQuestionAdmin,
} from '../controllers/questionController.js';

import { authorizeRoles, isAuthenticated } from '../middleware/authMiddleware.js';
import { getAnswersForQuestion } from '../controllers/answerController.js';



router.get('/', getAllQuestions);
router.post('/', isAuthenticated, askQuestion);

router.get('/:id', getQuestionDetails);

router.put('/:id', isAuthenticated, updateQuestion);

router.delete('/:id', isAuthenticated, deleteQuestion);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteQuestionAdmin);

router.patch('/:id/status', isAuthenticated, markQuestionStatus);
router.get('/:id/answers',isAuthenticated,getAnswersForQuestion)
router.get('/search', searchQuestions);
export default router;
