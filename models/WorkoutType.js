const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const WorkoutType = sequelize.define("WorkoutType", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 18],
        msg: "Name must be between 3 and 18 characters long",
      },
      is: {
        args: /^[A-Za-z ]{3,18}$/,
        msg: "Name can only contain letters",
      },
    },
  },
});

module.exports = WorkoutType;
