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
    // let week = getFirstLastDayOfWeek(cur_date);
  
    // const last_week_runs = await Workout.findAll( {
    //   where: {
    //     wdate: {
    //       [Op.between]: [week.firstDay, week.lastDay]
    //     }
    //   }
    // });

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
  //    order: [['maxdate', 'ASC']]
    });
    console.log(wtotals);

    let levels = [3200, 1600, 800, 400]; // temporary test data
    // main page 
    res.render('week',{
      wtotals, helpers, levels
    });

  } catch (err) {
    next(err);
  }
};


// TEMP - show test page with differents tests and interface elements
const mainpage = async (req, res, next) => {
  try {
      // get all runs
    //   const runs = await Workout.findAll( {
    //   order: ['id']
    // });
    
    // main page 
    res.render('main');

  } catch (err) {
    next(err);
  }
};

// const getModelsByBrand = async (req, res, next) => {
//   try {
//       // get all Brands
//       const brands = await Brand.findAll( {
//       order: ['id']
//     });
//     if (!brands || brands.length === 0) {
//       return next(new HttpError("No brands found", 404));
//     }

//     // count the nymber of models for each brand
//     let models = await Model.findAll({
//       attributes: [
//         'BrandId',
//         [sequelize.fn('COUNT'), 'numModels']
//       ],
//       group: ['BrandId'],
//       order: ['BrandId']
//     });
    
//     // insert 0 models count for brands without any models in database
//     let j=0;
//     let num_models = [];
//     for (let k=0; k< brands.length; ++k) {
//       if ( j >= models.length || brands[k].id < models[j].BrandId ) {
//         num_models.push(0);
//       }
//       else if ( brands[k].id === models[j].BrandId ) {
//         num_models.push(models[j].dataValues.numModels);
//         ++j;
//       }
//     }

//     // get all models for selected brand
//     models = await Model.findAll({ where: { BrandId: req.params.id } });
//     if (!models || models.length === 0) {
//       return next(new HttpError("No brand models found", 404));
//     }

//     res.render('index',{
//       brands, num_models, models
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// const getModelById = async (req, res, next) => {
//   try {
//     // get model by Id
//     const model_id = req.params.id;
//     const models = await Model.findAll({
//       where: { id: model_id },
//       include: [{
//           model: Brand,
//           attributes: ["name"]
//         },
//       ]
//     });
//     if ( models.length === 0 ) {
//       return next(new HttpError("Couldn't find model", 404));
//     };
//     const model = models[0];

//     // get availables sizes for given Model from Stock
//     const modelSizes = await Stock.findAll({
//       where: { ModelId: model_id },
//       order: ['size']
//     });

//     res.render('model', {
//       model, modelSizes
//     });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = {
    homepage,
    mainpage,
    dailystat,
    weeklystat,
};
