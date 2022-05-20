const Sequelize = require('sequelize');
const db        = require('../../config/db');
const UserModel = require('./user_model');

// ===================================================
//                 Comment Model
// ===================================================
const commentSchema = db.define('comments', 
{
    id : 
    {
        type            : Sequelize.UUID,
        defaultValue    : Sequelize.UUIDV4,
        primaryKey      : true,
        allowNull       : false
    },
    message : 
    {
        type            : Sequelize.DataTypes.STRING(500)
    }
});

//commentSchema.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

// ===================================================
//                 Post Export
// ===================================================
module.exports = commentSchema ;