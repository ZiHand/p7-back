const Joi = require("joi");

// ===================================================
//                 User Validation
// ===================================================
const userValidation = (user) =>
{
    const userSchema = Joi.object
    (
        {
            pseudo      : Joi.string().min(3).max(15).trim().required(),
            email       : Joi.string().email().required(),
            password    : Joi.string().min(3).max(255).trim().required(),
            avatar_url  : Joi.string().min(3).max(150).trim()
        }
    )

    return userSchema.validate(user);
}

// ===================================================
//               User Validation Export
// ===================================================
module.exports = userValidation;