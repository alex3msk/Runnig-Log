const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const LoadLevel = sequelize.define("LoadLevel", {
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
  color: {
    type: DataTypes.STRING,
  },
});

module.exports = LoadLevel;
