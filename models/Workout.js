const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Workout = sequelize.define("Workout", {
  wdate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  distance: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
  },
  wtime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  avgpulse: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  maxpulse: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = Workout;
