const { Sequelize } = require("sequelize");

const path = require('path');
require("dotenv").config({path: path.join(__dirname, '../.env')});

const dbStorage = process.env.DB_SQLITE_STORAGE;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbStorage,
//  storage: "./db/databases/1DB.db"
});

module.exports = sequelize;
