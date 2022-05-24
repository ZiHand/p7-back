const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "./config/.env" });

// ===================================================
//               Sequelize Connection
// ===================================================
const sequelize = new Sequelize(
  "u311802560_groupomania",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: "sql781.main-hosting.eu",
  }
);

// ===================================================
//                Sequelize Export
// ===================================================
module.exports = sequelize;
