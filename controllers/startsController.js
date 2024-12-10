const { Start } = require("../models/index");
const HttpError = require("../services/HttpError");



// get Start imfo by its Id
const getting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const start = await Start.findByPk(id);
    if (!start) {
      return next(new HttpError("Couldn't find start by Id", 404));
    }
    res.status(200).json(start);
  } catch (err) {
    next(err);
  }
};

// select all Starts records
const gettingAll = async (req, res, next) => {
  try {
    const starts = await Start.findAll();
    if (!starts || starts.length === 0) {
      return next(new HttpError("No user's starts found", 404));
    }
    res.status(200).json(starts);
  } catch (err) {
    next(err);
  }
};


// delete Start records
const deleting = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Start.destroy({ where: { id } });
    if (deleted === 0) {
      return next(new HttpError("Start not found or deletion failed", 404));
    }
    res.status(200).json("Start deleted successfully");
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getting,
  gettingAll,
//  updating, - TODO
  deleting,
//  creating, - TODO
};
