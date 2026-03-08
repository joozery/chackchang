import express from 'express';
import {
    getAllTechnicians,
    getTechnicianById,
    updateTechnician,
    deleteTechnician,
    getPortfolioItems,
    addPortfolioItem,
    deletePortfolioItem
} from '../controllers/technicianController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import multer from 'multer';
import { cloudinaryStorage } from '../controllers/uploadController.js';

const router = express.Router();
const fileUpload = multer({
    storage: cloudinaryStorage,
});

// Public routes
router.get('/', getAllTechnicians);
router.get('/:id', getTechnicianById);
router.get('/:id/portfolios', getPortfolioItems);

// Protected technician routes
router.post('/portfolios', authenticate, authorize('technician'), fileUpload.single('image'), addPortfolioItem);
router.delete('/portfolios/:id', authenticate, authorize('technician'), deletePortfolioItem);

// Protected admin routes
router.put('/:id', authenticate, authorize('admin', 'moderator'), updateTechnician);
router.delete('/:id', authenticate, authorize('admin', 'moderator'), deleteTechnician);

export default router;


