const express = require("express");
const {
  getting,
  gettingAll,
//  updating,
  deleting,
//  creating,
//  allOrdersUser,
} = require("../controllers/startsController");

const router = express.Router();

router.route("/").get(gettingAll); //.post(creating);
router.route("/:id").get(getting).delete(deleting); //.put(updating)

//router.get("/:id/orders", allOrdersUser);
module.exports = router;
