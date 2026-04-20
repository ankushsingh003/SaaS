import express from 'express';
import { createSession, webhook } from '../controllers/billing.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Webhook endpoint (must be BEFORE express.json() if using raw body constructEvent)
// But for our simplified build, we mount it separately
router.post('/webhook', express.raw({type: 'application/json'}), webhook);

router.post('/create-checkout', protect, createSession);

export default router;
