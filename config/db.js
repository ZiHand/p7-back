const { Sequelize } = require('sequelize');
require('dotenv').config({path: './config/.env'});

// ===================================================
//               Sequelize Connection
// ===================================================
const sequelize = new Sequelize("groupomania", process.env.DB_USER, process.env.DB_PASS, {dialect: "mysql", host: "localhost"});

// ===================================================
//                Sequelize Export
// ===================================================
module.exports = sequelize;
