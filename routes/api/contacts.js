const express = require("express");
const router = express.Router();
const ctrls = require("../../controllers/controllers");
const { isValidId, tokenAuthMiddleware } = require("../../middlewares");

router.get("/", tokenAuthMiddleware, ctrls.getAllContactsController);

router.get(
  "/:contactId",
  tokenAuthMiddleware,
  isValidId,
  ctrls.getContactController
);

router.post("/", tokenAuthMiddleware, ctrls.createContactController);

router.delete(
  "/:contactId",
  tokenAuthMiddleware,
  isValidId,
  ctrls.deleteContactController
);

router.put(
  "/:contactId",
  tokenAuthMiddleware,
  isValidId,
  ctrls.updateContacController
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  ctrls.updateFavoriteByIdController
);

module.exports = router;
