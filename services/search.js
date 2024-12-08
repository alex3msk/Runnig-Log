const { Op } = require("sequelize");
const express = require("express");

const { User } = require("../models/index");
const HttpError = require("./HttpError");

const router = express.Router();

// Search by email
router.get("/users/email/:email", async (req, res, next) => {
  try {
    const email = req.params.email;
    if (!email) {
      return next(new HttpError("Email parameter is required", 400));
    }

    const users = await User.findAll({
      where: {
        email: {
          [Op.like]: "%" + email + "%",
        },
      },
    });

    if (users.length === 0) {
      return next(new HttpError("No customers found", 404));
    }

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// Search by name
router.get("/users/name/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    if (!name) {
      return next(new HttpError("Name parameter is required", 400));
    }

    const users = await User.findAll({
      where: {
        name: {
          [Op.like]: "%" + name + "%",
        },
      },
    });

    if (users.length === 0) {
      return next(new HttpError("No customers found", 404));
    }

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
