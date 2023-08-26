const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const contactValidationSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z\s]{3,30}$/)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "ca"] },
    })
    .required(),
  phone: Joi.string()
    .length(10)
    .regex(/^([+])?(\d+)$/)
    .message("Invalid phone number format")
    .required(),
});

const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactDatabaseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

contactDatabaseSchema.post("save", handleMongooseError);

const ContactModel = model("contact", contactDatabaseSchema);

module.exports = {
  contactValidationSchema,
  contactFavoriteSchema,
  ContactModel,
};
