import Joi from 'joi';

/**
 * Workspace Validation Schemas:
 * Ensures workspace names are within acceptable limits.
 */

export const createWorkspaceSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.min': 'Workspace name must be at least 3 characters',
        'string.max': 'Workspace name cannot exceed 30 characters'
    })
});
