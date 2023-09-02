const express = require("express");
const ctrls = require("../../controllers/auth");
const router = express.Router();
const {
  tokenAuthMiddleware,
  logoutMiddleware,
  upload,
} = require("../../middlewares");

router.post("/register", ctrls.register);

router.post("/login", ctrls.login);

router.post("/logout", tokenAuthMiddleware, ctrls.logoutMiddleware);

router.get("/current", tokenAuthMiddleware, ctrls.getCurrentUser);

router.patch(
  "/avatars",
  tokenAuthMiddleware,
  upload.single("avatar"),
  ctrls.updateAvatarController
);

module.exports = router;
