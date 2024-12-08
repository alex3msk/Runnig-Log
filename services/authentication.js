const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const HttpError = require("./HttpError");

const path = require('path');
require("dotenv").config({path: path.join(__dirname, '../.env')});
const secretKey = process.env.SECRET_KEY;

// user login
// create token, store it in cookie
const createToken = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ( email === undefined || password === undefined ) {
      return next(new HttpError("Empty e-mail/password are not enough to login.", 404));
    }

    const user = await User.findOne( { where: { email: email, }, });
    if (!user) {
      return next(new HttpError("Couldn't find user", 404));
    }
    // if (!bcrypt.compare(password, user.password)) {
    //   return next(new HttpError("Password incorrect", 404));
    // }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return next(new HttpError("Error comapring password", 404));
      } else if ( isMatch === false ) {
        return next(new HttpError("Password incorrect", 404));
      }
    });

    const token = jwt.sign(user.name, secretKey); 
    res.cookie("Ticket", token); // expires -?
    res.status(200).json({ message: `${user.name} logged in successfully` });
  } catch (err) {
    next(err);
  }
};

// user logout
// delete token
const deleteToken = async (req, res) => {
  try {
    res.cookie("Ticket", "None");
    res.status(200).json({ error: 0, message: "User logged out successfully." });
  } catch (err) {
    next(err);
  }
};

// check token - if user logged in
const checkToken = async (req, res, next) => {
  try {
    const token = req.cookies.Ticket;
    if (token) {
      jwt.verify(token, secretKey, (err, res) => {
        if (err) next(err);
        else {
          console.log(res);
          next();
        }
      });
    } else {
      next(new HttpError("No token provided. Please, login.", 401));
    }
  } catch (err) {
    next(err);
  }
};


module.exports = { createToken, deleteToken, checkToken };
