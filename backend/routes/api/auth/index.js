const router = require("express").Router();
const controller = require("./auth.controller");
const { validate } = require("express-validation");
const { login, register } = require("./auth.validation");
const authMiddleware = require("../../../middlewares/auth");

router.post("/register", validate(register), controller.register);
router.post("/login", validate(login), controller.login);

router.use("/check", authMiddleware);
router.get("/check", controller.check);

module.exports = router;
