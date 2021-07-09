const router = require("express").Router();
const controller = require("./review.controller");
const { checkRole } = require("./review.controller");
const { validate } = require("express-validation");
const review = require("./review.validation");
const { ADMIN, OWNER } = require("../../../config");

router
  .route("/reviewing")
  .get(checkRole(ADMIN, OWNER), controller.reviewingList);

router
  .route("/:id")
  .get(checkRole(ADMIN), controller.get)
  .patch(checkRole(ADMIN), validate(review.update), controller.update)
  .delete(checkRole(ADMIN), controller.delete);

module.exports = router;
