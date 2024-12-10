const { Op, fn, col } = require('sequelize');
const { Workout } = require("../models/index");
const HttpError = require("../services/HttpError");
const { PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, dbGetStat, dbGetWorkouts } = require("../utils/utils");

const { formatDate, timeStr } = require('../utils/helpers');

const sequelize = require("../db/database");

// get month statistics of run workoutss
const monthruns = async (req, res, next) => {
  try {
    const { month } = req.body;
  
    // get first and last days of the month and verify date
    const year = parseInt(month.substr(0, 4));
    const mon = parseInt(month.substr(4, 2));
    if ( !year || !mon || mon > 12 || mon < 1 || year < 2000 ) {
        return next(new HttpError("Invalid date format. Use 'YYYYMM' format.", 404)); 
    }

    // get 1st day of the month
    const firstDay = new Date(year, mon - 1, 1);
    // get last day of the month
    const lastDay = new Date(year, mon, 0);

    // get current month stats
    let month_wo = await dbGetWorkouts(firstDay, PERIOD_MONTH); 
    if ( !month_wo.length ) {
      month_wo = new Array ({
        firstDay: formatDate(firstDay),
        lastDay: formatDate(lastDay),
        result: "0 workouts made in the month."
      });

    }
    // console.log(month_wo);

    res.status(201).json(month_wo);
  } catch (err) {
    next(err);
  }
};


// get month statistics of run workoutss
const monthlystat = async (req, res, next) => {
  try {
    const { month } = req.body;
  
    // get first and last days of the month and verify date
    const year = parseInt(month.substr(0, 4));
    const mon = parseInt(month.substr(4, 2));
    if ( !year || !mon || mon > 12 || mon < 1 || year < 2000 ) {
        return next(new HttpError("Not valid date format. Use 'YYYYMM' format.", 404)); 
    }

    // get 1st day of the month
    const firstDay = new Date(year, mon - 1, 1);
    // get last day of the month
    const lastDay = new Date(year, mon, 0);

    // get current month stats
    const month_stat = await dbGetStat(firstDay, PERIOD_MONTH); 
    if (!month_stat) {
        return next(new HttpError("No Run records found", 404)); 
    }
    // if no data found (nulls) -> set to zero values
    if ( month_stat[0].totalCount === 0 || !month_stat[0].totalDistance) {
        month_stat[0].totalTime = "0:00";
        month_stat[0].totalDistance = 0;
    }
    else {
        month_stat[0].totalTime = timeStr(month_stat[0].totalTime);
    }
    month_stat[0].firstDay = formatDate(firstDay);
    month_stat[0].lastDay = formatDate(lastDay);

    console.log(month_stat);

    res.status(201).json(month_stat[0]);
  } catch (err) {
    next(err);
  }
};


module.exports = { monthruns, monthlystat };
