import express from 'express';
import { register, login, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';

import { cloudinaryStorage } from '../controllers/uploadController.js';

const router = express.Router();

const fileUpload = multer({
  storage: cloudinaryStorage,
});

// Public routes
router.post('/register', fileUpload.single('image'), register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, fileUpload.single('image'), updateProfile);

export default router;

