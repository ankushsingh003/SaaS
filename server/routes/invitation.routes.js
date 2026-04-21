import express from 'express';
import { getInvitation, acceptInvitation } from '../controllers/invitation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Get invite info (workspace name, etc.) to show on the join page
router.get('/:token', getInvitation);

// Protected: Accept the invite
router.post('/:token/accept', protect, acceptInvitation);

export default router;
