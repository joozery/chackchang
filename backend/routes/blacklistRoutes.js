import express from 'express';
import BlacklistController from '../controllers/blacklistController.js';

const router = express.Router();

// Public routes
router.get('/public', BlacklistController.getApproved);
router.get('/public/:id', BlacklistController.getById);
router.get('/stats', BlacklistController.getStats);

// Admin routes (for now, no auth middleware - can add later)
router.get('/', BlacklistController.getAll);
router.get('/:id', BlacklistController.getById);
router.post('/', BlacklistController.create);
router.put('/:id', BlacklistController.update);
router.patch('/:id/status', BlacklistController.updateStatus);
router.delete('/:id', BlacklistController.delete);

export default router;

