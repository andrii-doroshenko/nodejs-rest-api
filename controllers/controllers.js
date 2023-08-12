const { HttpError } = require("../helpers");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../models/contacts");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const getAllContactsController = async (req, res, next) => {
  try {
    const contactsList = await listContacts();
    res.json(contactsList);
  } catch (error) {
    next(error);
  }
};

const getContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContactById(contactId);

    if (!contactById) {
      throw HttpError(404, "Contact not found");
    }

    res.json(contactById);
  } catch (error) {
    next(error);
  }
};

const createContactController = async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedId = await removeContact(contactId);

    if (!removedId) {
      throw HttpError(404, "Not found");
    }

    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContacController = async (req, res, next) => {
  try {
    const { error, value } = contactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, `missing fields: ${error.message}`);
    }

    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContactsController,
  getContactController,
  createContactController,
  deleteContactController,
  updateContacController,
};
