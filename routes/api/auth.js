const express = require("express");
const ctrls = require("../../controllers/auth");
const router = express.Router();
const { tokenAuthMiddleware } = require("../../middlewares");

router.post("/register", ctrls.register);

router.post("/login", ctrls.login);

router.get("/current", tokenAuthMiddleware, ctrls.getCurrentUser);

module.exports = router;
