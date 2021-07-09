const router = require("express").Router();
const controller = require("./restaurants.controller");
const { checkRole } = require("./restaurants.controller");
const { validate } = require("express-validation");
const restaurants = require("./restaurants.validation");
const reviewController = require("../review/review.controller");
const review = require("../review/review.validation");
const { ADMIN, OWNER, USER } = require("../../../config");

router.get("/list", controller.list);

router
  .route("/")
  .post(checkRole(OWNER), validate(restaurants.create), controller.create);

router
  .route("/:id")
  .get(controller.get)
  .patch(
    checkRole(ADMIN, OWNER),
    validate(restaurants.update),
    controller.update
  )
  .delete(checkRole(ADMIN, OWNER), controller.delete);

router
  .route("/:id/reviews")
  .get(reviewController.list)
  .post(checkRole(USER), validate(review.create), reviewController.create);

module.exports = router;
