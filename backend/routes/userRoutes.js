import express from 'express';
const router = express.Router();

import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  banUser,
  getUserDetails,
} from '../controllers/userController.js';

import { isAuthenticated,authorizeRoles } from '../middleware/authMiddleware.js';

// ===================== USER ROUTES =====================

// Get logged-in user profile
router.get('/me',isAuthenticated, getUserDetails);


router.get('/profile/:id', isAuthenticated, getUserProfile);

// Update logged-in user profile
router.put('/profile', isAuthenticated, updateUserProfile);

// ===================== ADMIN ROUTES =====================

// Get all users - Admin only
router.get('/admin/users', isAuthenticated, authorizeRoles('admin'), getAllUsers);

// Ban a user - Admin only
router.put('/admin/ban/:id', isAuthenticated, authorizeRoles('admin'), banUser);

export default router;
