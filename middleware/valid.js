import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

function validInfo(req, res, next) {
    let schema;
    if (req.path === "/register") {
        schema = registerSchema;
    } else if (req.path === "/login") {
        schema = loginSchema;
    } else {
        return next(); 
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }

    req.user = value; 
    next();
}

export default validInfo;
