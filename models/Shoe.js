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
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
    len: {
      args: [5, 32],
      msg: "Image filename must be between 5 and 32 characters long",
    },
  },
});

module.exports = Shoe;
