const { Weight } = require("../models/index");
const HttpError = require("../services/HttpError");



// get Weight record by its Id
const getting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const weight = await Weight.findByPk(id);
    if (!weight) {
      return next(new HttpError("Couldn't find weight record by Id", 404));
    }
    res.status(200).json(weight);
  } catch (err) {
    next(err);
  }
};


// select all  weight records
const gettingAll = async (req, res, next) => {
  try {
    const weights = await Weight.findAll();
    if (!weights || weights.length === 0) {
      return next(new HttpError("No user's weight records found", 404));
    }
    res.status(200).json(weights);
  } catch (err) {
    next(err);
  }
};

// delete Weight record
const deleting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Weight.destroy({ where: { id } });
    if (deleted === 0) {
      return next(new HttpError("Weight not found or deletion failed", 404));
    }
    res.status(200).json("Weight record deleted successfully");
  } catch (err) {
    next(err);
  }
};

// get all User's Weight records

// get Weight record by date



module.exports = {
  getting,
  gettingAll,
//  updating, - TODO
  deleting,
//  creating, - TODO
};
