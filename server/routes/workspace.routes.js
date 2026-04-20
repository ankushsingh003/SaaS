import express from 'express';
import { create, getAll, getOne } from '../controllers/workspace.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createWorkspaceSchema } from '../validations/workspace.validation.js';

const router = express.Router();

router.use(protect); // All workspace routes require auth

router.post('/', validate(createWorkspaceSchema), create);
router.get('/', getAll);
router.get('/:id', getOne);

export default router;
