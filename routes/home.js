const express = require("express");
const {
    homepage,
    dailystat,
    weeklystat,
    monthlystat,
    shoespage,
    addNewWorkout,
  } = require("../controllers/homeController")
const router = express.Router();

// HTML interface routes
router.route("/").get(homepage); // .post(addNewWorkout);
router.route("/index").get(homepage).post(addNewWorkout);
router.route("/day").get(dailystat);
router.route("/week").get(weeklystat);
router.route("/month").get(monthlystat);
router.route("/shoes").get(shoespage);
router.route("/:msg").get(homepage);

module.exports = router;