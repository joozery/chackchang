import express from 'express';
import { getSetting, updateSetting } from '../controllers/settingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public: Fetch a setting by key
router.get('/:key', getSetting);

// Admin/Moderator: Update a setting by key 
router.put('/:key', authenticate, authorize('admin', 'moderator'), updateSetting);

export default router;
