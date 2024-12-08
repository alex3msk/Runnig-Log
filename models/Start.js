const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Start = sequelize.define("Start", {
  startdate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  distance: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Start;
