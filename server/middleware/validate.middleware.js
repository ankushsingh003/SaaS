/**
 * Validation Middleware:
 * A generic middleware that validates the request body against a Joi schema.
 * If validation fails, it prevents the request from reaching the controller 
 * and returns a structured error response.
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false, // Include all errors, not just the first one
        errors: { label: 'key' } // Prefer keys over labels in messages
    });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: errorMessage
        });
    }

    next();
};

export default validate;
