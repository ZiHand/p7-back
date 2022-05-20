const Joi = require("joi");

// ===================================================
//                Moderator Validation
// ===================================================
const moderatorValidation = (mod) =>
{
    const moderatorSchema = Joi.object
    (
        {
            userId : Joi.string().required(),
        }
    )

    return moderatorSchema.validate(mod);
}

// ===================================================
//               Moderator Validation Export
// ===================================================
module.exports = moderatorValidation;