const express = require("express");
const {
  getting,
  gettingAll,
  updating,
  deleting,
  creating,
} = require("../controllers/workoutsController");

const router = express.Router();

router.route("/").get(gettingAll).post(creating);
router.route("/:id").get(getting).delete(deleting).put(updating);
//router.route("/brand/:id").get(getModelsbyBrandId);
//router.route("/:id").get(getting).put(updating).delete(deleting);

module.exports = router;
