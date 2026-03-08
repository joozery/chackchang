import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (admin/moderator only)
router.use(authenticate);
router.use(authorize('admin', 'moderator'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
