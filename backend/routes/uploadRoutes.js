import express from 'express';
import { upload, uploadProfileImage } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Upload profile image (protected)
router.post('/profile', authenticate, upload.single('image'), uploadProfileImage);

export default router;


