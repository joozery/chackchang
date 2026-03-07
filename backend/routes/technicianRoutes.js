import express from 'express';
import { getAllTechnicians, getTechnicianById } from '../controllers/technicianController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getAllTechnicians);
router.get('/:id', getTechnicianById);

export default router;


