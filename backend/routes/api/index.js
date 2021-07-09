const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");
const auth = require("./auth");
const user = require("./user");
const restaurants = require("./restaurants");
const review = require("./review");
const reply = require("./reply");

router.use("/auth", auth);

router.use("/user", authMiddleware);
router.use("/user", user);

router.use("/restaurants", authMiddleware);
router.use("/restaurants", restaurants);

router.use("/review", authMiddleware);
router.use("/review", review);

router.use("/reply", authMiddleware);
router.use("/reply", reply);

module.exports = router;
