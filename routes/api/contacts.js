const express = require("express");
const router = express.Router();
const ctrls = require("../../controllers/controllers");

router.get("/", ctrls.getAllContactsController);

router.get("/:contactId", ctrls.getContactController);

router.post("/", ctrls.createContactController);

router.delete("/:contactId", ctrls.deleteContactController);

router.put("/:contactId", ctrls.updateContacController);

module.exports = router;
