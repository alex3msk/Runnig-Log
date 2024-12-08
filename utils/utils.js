const { Op, fn, col } = require('sequelize');
const { Workout } = require("../models/index");
// const HttpError = require("../services/HttpError");

const PERIOD_DAY = 1;
const PERIOD_WEEK = 2;
const PERIOD_MONTH = 3;

// Format the date to YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
  

function getFirstLastDayOfWeek(dateString) {
    // Parse the input date string
    const date = new Date(dateString);
    
    // Calculate the first day of the week (Sunday)
    const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    
    // Calculate the 1st day of the next week
    const lastDay = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay)
    };
}
  
function getFirstLastDayOfMonth(dateString) {
    // Parse the input date string
    const date = new Date(dateString);

    // the first day of the month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    // Calculate the 1st day of the next month
    const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 1);

    return {
        firstDay: formatDate(firstDay),
        lastDay: formatDate(lastDay)
    };
}

// get totals for the given period - WEEK or MONTH
const dbGetStat = async (cur_date, period) => {
    let limits;
    switch (period) {
        case PERIOD_WEEK:
            limits = getFirstLastDayOfWeek(cur_date);
            break;
        case PERIOD_MONTH:
            limits = getFirstLastDayOfMonth(cur_date);
            break;
    };

    const stat = await Workout.findAll({
        attributes: [
          [fn('COUNT', '*'), 'totalCount'],
          [fn('SUM', col('wtime')), 'totalTime'],
          [fn('SUM', col('distance')), 'totalDistance']
        ],
  //      group: ['wdate'],
        where: {
          wdate: {
            [Op.between]: [limits.firstDay, limits.lastDay]
          }
        },
        raw: true
    });
    
    return stat;
}


// get all workouts for the given period - WEEK or MONTH
const dbGetWorkouts = async (cur_date, period) => {
    let limits;
    switch (period) {
        case PERIOD_WEEK:
            limits = getFirstLastDayOfWeek(cur_date);
            break;
        case PERIOD_MONTH:
            limits = getFirstLastDayOfMonth(cur_date);
            break;
    };

    const stat = await Workout.findAll({
        order: [['wdate', 'ASC']],
        where: {
          wdate: {
            [Op.between]: [limits.firstDay, limits.lastDay]
          }
        },
        raw: true
    });
    
    return stat;
}


module.exports = {
    PERIOD_DAY, PERIOD_WEEK, PERIOD_MONTH, 
    dbGetStat,
    dbGetWorkouts,
};