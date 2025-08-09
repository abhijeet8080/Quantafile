import express from'express';
const router = express.Router();

import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser
} from '../controllers/authController.js';


router.post('/register', registerUser);


router.post('/login', loginUser);


router.get('/verify-email/:token', verifyEmail);

router.post('/logout', logoutUser);

export default router;
