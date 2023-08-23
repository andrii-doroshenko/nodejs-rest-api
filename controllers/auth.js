const { schemas, UserModel } = require("../schemas/userSchema");

const { HttpError } = require("../helpers");

const register = async (req, res, next) => {
  try {
    const { error, value } = schemas.registerSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const newUser = await UserModel.create(req.body);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
};
