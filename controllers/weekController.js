const HttpError = require("../services/HttpError");
const { PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, dbGetStat, dbGetWorkouts } = require("../utils/utils");

const { getWeekDates, formatDate, timeStr } = require('../utils/helpers');

const sequelize = require("../db/database");

// get all run workouts made during a week
const weekruns = async (req, res, next) => {
  try {
    const { week } = req.body;
  
    // get first and last days of the week and verify date
    let dates = getWeekDates(week);
    if ( !dates ) {
        return next(new HttpError("Invalid date format. Use 'YYYYWW' format.", 404)); 
    }
    // get current week runs
    let week_wo = await dbGetWorkouts(dates.lastDay, PERIOD_WEEK); 
    if ( !week_wo.length ) {
      week_wo = new Array ({
        firstDay: formatDate(dates.firstDay),
        lastDay: formatDate(dates.lastDay),
        result: "0 workouts made in the week."
      });
    }
    //console.log(week_wo);

    res.status(201).json(week_wo);
  } catch (err) {
    next(err);
  }
};


// get weekly statistics of run workoutss
const weeklystat = async (req, res, next) => {
  try {
    const { week } = req.body;
  
    // get first and last days of the week and verify date
    let dates = getWeekDates(week);
    if ( !dates ) {
        return next(new HttpError("Invalid date format. Use 'YYYYWW' format.", 404)); 
    }
    // get current week stats
    const week_stat = await dbGetStat(dates.lastDay, PERIOD_WEEK); // (cur_date);
    if (!week_stat) {
        return next(new HttpError("No Workouts found", 404)); 
    }
    // if no data found (nulls) -> set to zero values
    if ( week_stat[0].totalCount === 0 || !week_stat[0].totalDistance) {
        week_stat[0].totalTime = "0:00";
        week_stat[0].totalDistance = 0;
    }
    else {
        week_stat[0].totalTime = timeStr(week_stat[0].totalTime);
    }
    week_stat[0].firstDay = formatDate(dates.firstDay);
    week_stat[0].lastDay = formatDate(dates.lastDay);
    // console.log(week_stat);

    res.status(201).json(week_stat[0]);
  } catch (err) {
    next(err);
  }
};


module.exports = { weekruns, weeklystat };
