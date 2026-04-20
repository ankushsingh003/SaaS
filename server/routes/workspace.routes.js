import express from 'express';
import { create, getAll, getOne } from '../controllers/workspace.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All workspace routes require auth

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);

export default router;
