const express = require("express");
const {
  getting,
  gettingAll,
//  updating, - TODO
  deleting,
//  creating, - TODO
} = require("../controllers/weightsController");

const router = express.Router();

router.route("/").get(gettingAll); //.post(creating);
router.route("/:id").get(getting).delete(deleting); //.put(updating)

module.exports = router;
