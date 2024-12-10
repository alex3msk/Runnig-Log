// date formatting 
function formatDate(datestr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(datestr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}, ${month} ${year}`;
}

// returns "Mon, Year" string from "YYYYMM" input string
function formatMonthYear(datestr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = parseInt(datestr.substr(0, 4));
    const mon = parseInt(datestr.substr(4, 2));
    if ( !year || !mon || mon > 12 || mon < 1 || year < 2000 ) {
        return datestr; 
    }
    return `${months[mon-1]}, ${year}`;
}

// returns "Mon" string from "YYYYMM" input string
function getMonth(datestr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = parseInt(datestr.substr(4, 2));
    if ( !mon || mon > 12 || mon < 1 ) {
        return datestr; 
    }
    return `${months[mon-1]}`;
}

// calculate pace (time per 1 km) as string m:ss (min:sec) - based on total time and distance 
function getPace(time, dist) {
    const tm_min = Math.floor(time/dist);
    const tm_sec = Math.floor ((time / dist - Math.floor(time/dist)) * 60);
    return `${tm_min}:${tm_sec.toString().padStart(2, '0')}`;
}

// convert time in min -> to string 'h:mm'
function timeStr(time) {
    const tm_h = Math.floor(time/60);
    const tm_min = time % 60;
    return `${tm_h}:${tm_min.toString().padStart(2, '0')}`;
}

// takes string "YYYYWW" - year + week number in the year
// returns week's 1st and last days (dates)
function getWeekDates(input) {
    const year = parseInt(input.substr(0, 4));
    const week = parseInt(input.substr(4, 2));
    // 1st day of the year + offset
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    // get week's Saturday
    const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()));
    // get week's Sunday
    const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    return {
        firstDay: firstDay,
        lastDay: lastDay
    };
}

// takes string "YYYYWW" - year + week number in the year
// returns week's last day as formatted string
function getWeekLastDay(input) {
    const year = parseInt(input.substr(0, 4));
    const week = parseInt(input.substr(4, 2));
    // verify input data
    if ( !year || !week || week > 53 || week < 1 || year < 2000 ) {
        return null;
    }
    // 1st day of the year + offset
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    // get week's Saturday
    const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()));
    return formatDate ( lastDay );
}


module.exports = { formatDate, getPace, timeStr, getWeekDates, getWeekLastDay, formatMonthYear, getMonth }
