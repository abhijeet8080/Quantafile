// routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers, banUser, unbanUser, changeUserRole,
  getAllQuestions, deleteQuestionAdmin, toggleQuestionStatus,
  getAllAnswers, deleteAnswerAdmin,
  createTag, updateTag, deleteTag,
  getAnalytics, getAdminLogs,
  getAllTags
} from '../controllers/adminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, authorizeRoles('admin'));

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.put('/users/:id/role', changeUserRole);

// Question Management
router.get('/questions', getAllQuestions);
router.delete('/questions/:id', deleteQuestionAdmin);
router.put('/questions/:id/status', toggleQuestionStatus);

// Answer Management
router.get('/answers', getAllAnswers);
router.delete('/answers/:id', deleteAnswerAdmin);

// Tag Management
router.get('/tags', getAllTags);

router.post('/tags', createTag);
router.put('/tags/:id', updateTag);
router.delete('/tags/:id', deleteTag);

// Analytics
router.get('/analytics', getAnalytics);

// Logs
router.get('/logs', getAdminLogs);

export default router;
