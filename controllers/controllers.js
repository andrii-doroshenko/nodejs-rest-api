const { HttpError } = require("../helpers");
const {
  contactFavoriteSchema,
  contactValidationSchema,
  ContactModel,
} = require("../schemas/contactSchema");

const getAllContactsController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const contactsList = await ContactModel.find(
      { owner },
      "-createdAt -updatedAt",
      { skip, limit }
    );

    res.json(contactsList);
  } catch (error) {
    next(error);
  }
};

const getContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await ContactModel.findById(contactId);

    if (!contactById) {
      throw HttpError(404, "Contact not found");
    }

    res.json(contactById);
  } catch (error) {
    next(error);
  }
};

const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedId = await ContactModel.findByIdAndRemove(contactId);

    if (!removedId) {
      throw HttpError(404, "Not found");
    }

    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const createContactController = async (req, res, next) => {
  try {
    const { error, value } = contactValidationSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { _id: owner } = req.user;
    const newContact = await ContactModel.create({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContacController = async (req, res, next) => {
  try {
    const { error, value } = contactValidationSchema.validate(req.body);

    if (error) {
      throw HttpError(400, `missing fields: ${error.message}`);
    }

    const { contactId } = req.params;
    const updatedContact = await ContactModel.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteByIdController = async (req, res, next) => {
  try {
    const { error, value } = contactFavoriteSchema.validate(req.body);

    if (error) {
      throw HttpError(400, `missing fields: ${error.message}`);
    }

    const { contactId } = req.params;
    const updatedContact = await ContactModel.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

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
  updateFavoriteByIdController,
};
