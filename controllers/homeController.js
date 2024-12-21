//************************************
// HTML interface controllers to render pages based on EJS templates
//************************************

const { Op, fn, col } = require('sequelize');
const { Workout, Shoe } = require("../models/index");
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
    // if redirected after creating new Workout - set OK message
    let msg = req.query.msg;
    if ( msg === "OK" ) {
      msg = "New Run/Workout added successfully!";
    }

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
    
    // select shoes for New Workout form
    const shoes = await Shoe.findAll();
    // if no data found (nulls) -> set to zero values
    if (!shoes || shoes.length === 0) {
      shoes[0].id = 0;
      shoes[0].brand = "Unknown";
      shoes[0].model = "";
    }

    // console.log("homepage: ", msg);
    // get wekkly statistics of runs/workouts for last 8 weeks (TEMP)
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
    let len = wtotals.length;
    for (let i=0; i < len; ++i) {
      let wlast = helpers.getWeekLastDay(wtotals[i].dataValues.wnum);
      labels[len-i-1] = wlast.substr(0, wlast.length-5);
      milage[len-i-1] = wtotals[i].dataValues.distTotal;
    }
    // TEMP: add 6 more weeks
    let weekdate = new Date(helpers.getWeekLastDay(wtotals[0].dataValues.wnum));
    let cur_week;
    len = len + 6;
    for (let i=len-6; i < len; ++i) {
      weekdate = new Date(weekdate.getFullYear(), weekdate.getMonth(), weekdate.getDate() + 7);
      cur_week = helpers.formatDate(weekdate);
      labels[i] = cur_week.substr(0, cur_week.length-5);
      milage[i] = 0;
    }
    // console.log("Labels: ", labels);
    // console.log("Milage: ", milage);

    // TODO:
    // calculate average and total disyance and time for the period
    //

    // main page 
    res.render('index',{
      last_run, week_stat, month_stat, helpers, msg, shoes, labels, milage,
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


//************************************
// show shoes info and milage stistics 
//************************************
const shoespage = async (req, res, next) => {
  try {
    // get shoe info and milage statistics
    const shoes = await Shoe.findAll({
      include: [
        {
          model: Workout,
          attributes: [
            [fn('SUM', col('distance')), 'totalDistance']
          ],
        } ],
        group: ['Shoe.id'], 
        // offset: 0,
        // limit: 6,
        // order: [['purchased', 'DESC'],]
    } );

    // ORM retrieves data in confused format -> transform to several simple Arrays
    // prepare labels and milage values for chart drawing
    let labels = new Array();
    let milage = new Array();
    let purchased = new Array();
    let images = new Array();
    const len = shoes.length;
    for (let i=0; i < len; ++i) {
      labels[i] = shoes[i].brand + " " + shoes[i].model;
      milage[i] = shoes[i].Workouts[0].dataValues.totalDistance;
      purchased[i] = shoes[i].purchased;
      images[i] = shoes[i].photo;
    }
    // console.log("Labels: ", labels);
    // console.log("Milage: ", milage);
    // console.log("Purchased: ", purchased);

    // shoes info and stat page 
    res.render('shoes',{
      helpers, labels, milage, purchased, images
    });

  } catch (err) {
    next(err);
  }
};


//************************************
// render homepage
// show last ran info, current week and current month statistics
//************************************
const addNewWorkout = async (req, res, next) => {
  try {

    let { wtime, wdate, distance, description, loadlevel, wotype, shoe, avgpulse } = req.body;

    wdate = new Date(wdate);
    console.log("ADDING NEW WORJOUT...");
    console.log(req.body);
    console.log("wdate = ", wdate);
    console.log("wtime = ", wtime);
    console.log("distance = ", distance);
    console.log("description = ", description);
    console.log("loadlevel = ", loadlevel);
    console.log("wotype = ", wotype);
    console.log("shoe = ", shoe);
    console.log("avgpulse = ", avgpulse);

    // validate data
    let msg = "OK";
    const today = new Date();
    if ( !wdate || wtime <=0 || distance <= 0 || wdate > today ) {
      msg = "Cannot save Run info - please, enter valid data.";
    }
    else {
      // insert new Worjout record
      const wo = await Workout.create({ 
            wdate: wdate,
            distance: distance,
            wtime: wtime,
            description: description,
            height: 0,
            avgpulse: avgpulse,
            maxpulse: null,
            UserId: 1,
            ShoeId: shoe,
            LoadLevelId: loadlevel,
            WorkoutTypeId: wotype,
      });
      if ( !wo ) {
        msg = "Error inserting Workout!";
      };
      // const msg = encodeURIComponent("This is my message to you!");
    }
    // main page 
    res.redirect('/index?msg=' + msg);

  } catch (err) {
    next(err);
  }
};

module.exports = {
    homepage,
    dailystat,
    weeklystat,
    monthlystat,
    shoespage,
    addNewWorkout
};
