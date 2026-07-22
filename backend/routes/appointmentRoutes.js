import express from 'express';
import { 
  createAppointmentRequest, 
  getAllAppointments, 
  updateAppointmentStatus 
} from '../controllers/appointmentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for frontend booking form
router.post('/book', createAppointmentRequest);

// Protected dashboard routes (Admin, Doctor, Staff)
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'STAFF'), getAllAppointments);
router.put('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'STAFF'), updateAppointmentStatus);

export default router;