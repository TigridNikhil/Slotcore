require("dotenv").config();
const { Sequelize } = require("sequelize");
const isLocal =
  process.env.DB_HOST === "localhost" || process.env.DB_HOST === "127.0.0.1";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: isLocal
      ? {}
      : {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
  },
);

module.exports = sequelize;
