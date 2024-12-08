const express = require("express");
const {
  getting,
  gettingAll,
  updating,
  deleting,
  creating,
//  allOrdersUser,
} = require("../controllers/usersController");

const router = express.Router();

router.route("/").get(gettingAll).post(creating);
router.route("/:id").get(getting).put(updating).delete(deleting);

//router.get("/:id/orders", allOrdersUser);
module.exports = router;
