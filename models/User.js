const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const User = sequelize.define("User", {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
 //   unique: true,
    validate: {
      is: {
        args: /^[\w-.]+@([\w-]+\.)+(com|co\.il)$/,
        msg: "Email must be valid and end with .com or .co.il.",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, Infinity],
        msg: "Password must be at least 8 characters long.",
      },
    },
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;
