const express = require("express");
const {
    homepage,
    dailystat,
    weeklystat,
    monthlystat,
  } = require("../controllers/homeController")
const router = express.Router();

router.route("/").get(homepage);
router.route("/index").get(homepage);
router.route("/day").get(dailystat);
router.route("/week").get(weeklystat);
router.route("/month").get(monthlystat);

module.exports = router;