const express = require("express");
const {
    homepage,
    mainpage,
    dailystat,
    weeklystat,
  } = require("../controllers/homeController")
const router = express.Router();

router.route("/").get(homepage);
router.route("/index").get(homepage);
router.route("/main").get(mainpage);
router.route("/day").get(dailystat);
router.route("/week").get(weeklystat);
// router.route("/:id").get(getModelsByBrand);
// router.route("/model/:id").get(getModelById);

module.exports = router;