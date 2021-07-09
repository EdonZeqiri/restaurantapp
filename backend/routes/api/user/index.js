const router = require("express").Router();
const controller = require("./user.controller");

router.route("/list").get(controller.checkRole, controller.list);

router.route("/").post(controller.checkRole, controller.create);

router
  .route("/:id")
  .get(controller.checkRole, controller.get)
  .patch(controller.checkRole, controller.update)
  .delete(controller.delete);

module.exports = router;
