const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Shoe = sequelize.define("Shoe", {
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  purchased: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  firstuse: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
});

module.exports = Shoe;
