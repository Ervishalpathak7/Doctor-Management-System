import Joi from "joi";

const schemas = {
    register: Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .trim()
            .required()
            .messages({
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name cannot exceed 50 characters'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address'
            }),
        password: Joi.string()
            .min(6)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one letter and one number',
                'string.min': 'Password must be at least 6 characters long'
            })
    }),
    
    login: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address'
            }),
        password: Joi.string()
            .min(6)
            .required()
    })
};

function validInfo(req, res, next) {
    try {
        const operation = req.path.slice(1);
        const schema = schemas[operation];
        
        if (!schema) {
            return next();
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        req.validatedData = value;
        next();
        
    } catch (err) {
        next(err);
    }
}

export default validInfo;