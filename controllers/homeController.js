//************************************
// HTML interface controllers to render pages based on EJS templates
//************************************

const { Op, fn, col } = require('sequelize');
const { Workout } = require("../models/index");
const HttpError = require("../services/HttpError");
const { PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, dbGetStat, dbGetWorkouts, dbGetRunLevels } = require("../utils/utils");

const helpers = require('../utils/helpers');

const sequelize = require("../db/database");

//************************************
// render homepage
// show last ran info, current week and current month statistics
//************************************
const homepage = async (req, res, next) => {
  try {
    // get last run/workout info
    const last_run = await Workout.findOne( {
        order: [['wdate', 'DESC']]
    });
    if (!last_run) {
      return next(new HttpError("No Run records found", 404));
    }

    // get last week stats
    let cur_date = new Date();
    const week_stat = await dbGetStat(cur_date, PERIOD_WEEK); 

    // if no data found (nulls) -> set to zero values
    if ( week_stat[0].totalCount === 0 || !week_stat[0].totalDistance) {
      week_stat[0].totalTime = "0:00";
      week_stat[0].totalDistance = 0;
    }
    // console.log(week_stat);

    // get last month stats
    const month_stat = await dbGetStat(cur_date, PERIOD_MONTH); 

    // if no data found (nulls) -> set to zero values
    if ( month_stat[0].totalCount === 0 || !month_stat[0].totalDistance) {
      month_stat[0].totalTime = "0:00";
      month_stat[0].totalDistance = 0;
    }
    // console.log(month_stat);

    // main page 
    res.render('index',{
      last_run, week_stat, month_stat, helpers
    });

  } catch (err) {
    next(err);
  }
};


//************************************
// show daily statistics page
// show all runs made in this month + totals + pie chart of training load
//************************************
const dailystat = async (req, res, next) => {
  try {
    // get all workouts of this month
    let cur_date = new Date();
    
    const month_wo = await dbGetWorkouts(cur_date, PERIOD_MONTH); 
    // if no workouts found - set zero values
    if ( month_wo.length === 0 || !month_wo[0].distance) {
      month_wo[0].wdate = cur_date;
      month_wo[0].wtime = "0:00";
      month_wo[0].distance = 0;
      month_wo[0].avgpulse = 0;
    }
    // console.log(month_wo);

    // get month statistics
    const month_stat = await dbGetStat(cur_date, PERIOD_MONTH); 
    // if no data found (nulls) -> set to zero values
    if ( month_stat[0].totalCount === 0 || !month_stat[0].totalDistance) {
      month_stat[0].totalTime = "0:00";
      month_stat[0].totalDistance = 0;
    }
    // console.log(month_stat);

    // get Load Level totals for diagram - what distance run at which Load Level
    let levelTotals = await dbGetRunLevels(cur_date, PERIOD_MONTH); 
    // console.log("Load Level totals: ", levelTotals);

    // convert Load level stat to flat array for Chart
    let levels = [0, 0, 0, 0];
    for (let i=0; i < levelTotals.length; ++i) {
      if ( levelTotals[i].dataValues.distTotal ) {
        if ( levelTotals[i].dataValues.LoadLevelId === 1) {
          levels[0] += levelTotals[i].dataValues.distTotal;
        }
        else if ( levelTotals[i].dataValues.LoadLevelId === 2) {
          levels[1] += levelTotals[i].dataValues.distTotal;
        }
        else if ( levelTotals[i].dataValues.LoadLevelId === 3) {
          levels[2] += levelTotals[i].dataValues.distTotal;
        }
        else {
          levels[3] += levelTotals[i].dataValues.distTotal;
        }
      }
    }
    // console.log("Load Levels for a Chart: ", levels);

    // daily stat page 
    res.render('day',{
      month_wo, month_stat, helpers, levels
    });

  } catch (err) {
    next(err);
  }
};


//************************************
// show weekly statistics page
// week totals + bar diagram
//************************************
const weeklystat = async (req, res, next) => {
  try {
    // get wekkly statistics of runs/workouts
    // strftime('%Y%W', wdate) - uniquely identifies a week
    const wtotals = await Workout.findAll({
      attributes: [
        [fn('strftime', '%Y%W', col('wdate')), 'wnum'],
        [fn('SUM', col('distance')), 'distTotal'],
        [fn('SUM', col('wtime')), 'timeTotal'],
        [fn('COUNT', '*'), 'runsTotal'],
      ],
      group: ['wnum'], 
      offset: 0,
      limit: 8, // limit results to show to 8 last records
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

    // weekly stat page 
    res.render('week',{
      wtotals, helpers, labels, milage
    });

  } catch (err) {
    next(err);
  }
};


//************************************
// show monthly statistics page
// month totals + line chart data
//************************************
const monthlystat = async (req, res, next) => {
  try {
    // get monthly statistics of runs/workouts
    // strftime('%Y%m', wdate) - uniquely identifies a month
    const mtotals = await Workout.findAll({
      attributes: [
        [fn('strftime', '%Y%m', col('wdate')), 'mnum'],
        [fn('SUM', col('distance')), 'distTotal'],
        [fn('SUM', col('wtime')), 'timeTotal'],
        [fn('COUNT', '*'), 'runsTotal'],
      ],
      group: ['mnum'], 
      offset: 0,
      limit: 6,
      order: [[sequelize.fn('max', sequelize.col('wdate')), 'DESC'],]
    });
    // console.log(mtotals);

    // prepare labels and milage values for chart
    let labels = new Array();
    let milage = new Array();
    const len = mtotals.length;
    for (let i=0; i < len; ++i) {
      labels[len-i-1] = helpers.getMonth(mtotals[i].dataValues.mnum);
      milage[len-i-1] = mtotals[i].dataValues.distTotal;
    }
    // console.log("Labels: ", labels);
    // console.log("Milage: ", milage);

    // monthly stat page 
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
