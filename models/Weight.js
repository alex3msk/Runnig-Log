const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Weight = sequelize.define("Weight", {
  weight: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  wdate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Weight;
