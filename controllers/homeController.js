const { Op, fn, col } = require('sequelize');
const { Workout } = require("../models/index");
const HttpError = require("../services/HttpError");
const { PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, dbGetStat, dbGetWorkouts } = require("../utils/utils");

const helpers = require('../utils/helpers');

const sequelize = require("../db/database");

// render homepage
// show last ran info, current week and current month statistics
const homepage = async (req, res, next) => {
  try {
    // get last run
    const last_run = await Workout.findOne( {
        order: [['wdate', 'DESC']]
    });
    if (!last_run) {
      return next(new HttpError("No Run records found", 404));
    }

    // get current week stats
    let cur_date = new Date();
    const week_stat = await dbGetStat(cur_date, PERIOD_WEEK); // (cur_date);

    if (!week_stat) {
      return next(new HttpError("No Run records found", 404)); 
    }
    // if no data found (nulls) -> set to zero values
    if ( week_stat[0].totalCount === 0 || !week_stat[0].totalDistance) {
      week_stat[0].totalTime = "0:00";
      week_stat[0].totalDistance = 0;
    }
    console.log(week_stat);

    const month_stat = await dbGetStat(cur_date, PERIOD_MONTH); // (cur_date);

    if (!month_stat) {
      return next(new HttpError("No Run records found", 404)); // TODO -> insert zero values
    }
    // if no data found (nulls) -> set to zero values
    if ( month_stat[0].totalCount === 0 || !month_stat[0].totalDistance) {
      month_stat[0].totalTime = "0:00";
      month_stat[0].totalDistance = 0;
    }
    console.log(month_stat);

    // main page 
    res.render('index',{
      last_run, week_stat, month_stat, helpers
    });

  } catch (err) {
    next(err);
  }
};

// show daily statistics page
// show all runs made in this month + totals + pie chart of training load
const dailystat = async (req, res, next) => {
  try {
    // get all workouts of this month
    let cur_date = new Date();
    
    const month_wo = await dbGetWorkouts(cur_date, PERIOD_MONTH); // (cur_date);
    if (!month_wo) {
      return next(new HttpError("No Run records found", 404)); // TODO -> insert zero values
    }
    console.log(month_wo);

    const month_stat = await dbGetStat(cur_date, PERIOD_MONTH); // (cur_date); '2024-07-02'
    if (!month_stat) {
      return next(new HttpError("No Run records found", 404)); // TODO -> insert zero values
    }
    console.log(month_stat);

    let levels = [3200, 1600, 800, 400]; // temporary test data
    // main page 
    res.render('day',{
      month_wo, month_stat, helpers, levels
    });

  } catch (err) {
    next(err);
  }
};


// show weekly statistics page
// week totals + bar diagram
const weeklystat = async (req, res, next) => {
  try {
    // get last run
    const wtotals = await Workout.findAll({
      attributes: [
        [fn('strftime', '%Y%W', col('wdate')), 'wnum'],
        [fn('SUM', col('distance')), 'distTotal'],
        [fn('SUM', col('wtime')), 'timeTotal'],
        [fn('COUNT', '*'), 'runsTotal'],
//        [col('MAX(wdate)'), 'maxwdate']
      ],
      group: ['wnum'], 
      offset: 0,
      limit: 8,
      order: [[sequelize.fn('max', sequelize.col('wdate')), 'DESC'],]
    });
    // console.log(wtotals);

    // prepare labels and milage values for graph
    let labels = new Array();
    let milage = new Array();
    const len = wtotals.length;
    for (let i=0; i < len; ++i) {
      let wlast = helpers.getWeekLastDay(wtotals[i].dataValues.wnum);
      labels[len-i-1] = wlast.substr(0, wlast.length-5);
      milage[len-i-1] = wtotals[i].dataValues.distTotal;
    }
    // console.log("Labels: ", labels);
    // console.log("Milage: ", milage);

    // main page 
    res.render('week',{
      wtotals, helpers, labels, milage
    });

  } catch (err) {
    next(err);
  }
};


// show weekly statistics page
// week totals + bar diagram
const monthlystat = async (req, res, next) => {
  try {
    // get last run
    const mtotals = await Workout.findAll({
    //const wtotals = await Workout.findAndCountAll({
      attributes: [
        [fn('strftime', '%Y%m', col('wdate')), 'mnum'],
        [fn('SUM', col('distance')), 'distTotal'],
        [fn('SUM', col('wtime')), 'timeTotal'],
        [fn('COUNT', '*'), 'runsTotal'],
//        [col('MAX(wdate)'), 'maxwdate']
      ],
      group: ['mnum'], 
      offset: 0,
      limit: 6,
      order: [[sequelize.fn('max', sequelize.col('wdate')), 'DESC'],]
    });
    console.log(mtotals);

    // prepare labels and milage values for chart
    let labels = new Array();
    let milage = new Array();
    const len = mtotals.length;
    for (let i=0; i < len; ++i) {
      labels[len-i-1] = helpers.getMonth(mtotals[i].dataValues.mnum);
      milage[len-i-1] = mtotals[i].dataValues.distTotal;
    }
    //const lbls = JSON.stringify(labels).replaceAll(`\"`, "\'");;
    console.log("Labels: ", labels);
    console.log("Milage: ", milage);
    // main page 
    res.render('month',{
      mtotals, helpers, labels, milage
    });

  } catch (err) {
    next(err);
  }
};


module.exports = {
    homepage,
    dailystat,
    weeklystat,
    monthlystat
};
