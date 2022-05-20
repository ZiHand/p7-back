const Joi = require("joi");

// ===================================================
//                 Post Validation
// ===================================================
const postValidation = (post) =>
{
    const postSchema = Joi.object
    (
        {
            message : Joi.string().min(0).max(500).trim(),
            picture : Joi.string().min(0).max(150).trim(),
            video   : Joi.string().min(0).max(200).trim(),
        }
    )

    return postSchema.validate(post);
}

// ===================================================
//               Post Validation Export
// ===================================================
module.exports = postValidation;