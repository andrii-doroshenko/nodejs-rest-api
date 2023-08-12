// const { HttpError } = require("../../helpers");
// const express = require("express");
// const Joi = require("joi");
const express = require("express");
const router = express.Router();
const ctrls = require("../../controllers/controllers");
// const {
//   listContacts,
//   getContactById,
//   addContact,
//   updateContact,
//   removeContact,
// } = require("../../models/contacts");

// const contactSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string().required(),
// });

router.get("/", ctrls.getAllContactsController);

router.get("/:contactId", ctrls.getContactController);

router.post("/", ctrls.createContactController);

router.delete("/:contactId", ctrls.deleteContactController);

router.put("/:contactId", ctrls.updateContacController);

module.exports = router;
