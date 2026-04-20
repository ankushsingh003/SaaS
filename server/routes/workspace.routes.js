import express from 'express';
import { create, getAll, getOne, inviteMember, getMembers, update } from '../controllers/workspace.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createWorkspaceSchema } from '../validations/workspace.validation.js';

const router = express.Router();

router.use(protect); // All workspace routes require auth

router.post('/', validate(createWorkspaceSchema), create);
router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:id/members', getMembers);
router.post('/:id/invite', inviteMember);
router.patch('/:id', update);

export default router;
