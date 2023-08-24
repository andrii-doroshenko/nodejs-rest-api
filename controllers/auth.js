var bcrypt = require("bcryptjs");

const { schemas, UserModel } = require("../schemas/userSchema");

const { HttpError } = require("../helpers");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 8);
    const { error, value } = schemas.registerSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const newUser = await UserModel.create({
      ...req.body,
      password: hashPassword,
    });

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
