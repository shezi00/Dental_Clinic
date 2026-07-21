import express from 'express';
import { createAppointmentRequest, getAllAppointments } from '../controllers/appointmentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for frontend booking form
router.post('/book', createAppointmentRequest);

// Protected dashboard route (Admin, Doctor, Staff)
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'STAFF'), getAllAppointments);

export default router;