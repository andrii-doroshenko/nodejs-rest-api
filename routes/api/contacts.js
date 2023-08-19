const express = require("express");
const router = express.Router();
const ctrls = require("../../controllers/controllers");
const { isValidId } = require("../../middlewares");

router.get("/", ctrls.getAllContactsController);

router.get("/:contactId", isValidId, ctrls.getContactController);

router.post("/", ctrls.createContactController);

router.delete("/:contactId", isValidId, ctrls.deleteContactController);

router.put("/:contactId", isValidId, ctrls.updateContacController);

router.patch(
  "/:contactId/favorite",
  isValidId,
  ctrls.updateFavoriteByIdController
);

module.exports = router;
