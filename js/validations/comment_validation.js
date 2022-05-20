const Joi = require("joi");

// ===================================================
//                 Comment Validation
// ===================================================
const commentValidation = (comment) =>
{
    const commentSchema = Joi.object
    (
        {
            ownerId : Joi.string().required(),
            message : Joi.string().min(0).max(500).trim(),
        }
    )

    return commentSchema.validate(comment);
}

// ===================================================
//               Comment Validation Export
// ===================================================
module.exports = commentValidation;