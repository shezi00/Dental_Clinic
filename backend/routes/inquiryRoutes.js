import express from 'express';
import { createInquiry, getInquiries, replyToInquiry } from '../controllers/inquiryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public POST route for public contact form
router.post('/', createInquiry);

// Protected GET route for Admin Dashboard Inbox
router.get('/', authenticateToken, getInquiries);
router.post('/:id/reply', authenticateToken, replyToInquiry);
export default router;