const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { schemas, UserModel } = require("../schemas/userSchema");
const jimp = require("jimp");
const { nanoid } = require("nanoid");

const { HttpError, sendEmail, createEmail } = require("../helpers");

const jwt = require("jsonwebtoken");

const { PRIVATE_KEY } = process.env;

const avatarsFolder = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 8);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

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
      avatarURL,
      verificationToken,
    });

    const recipient = createEmail(email, verificationToken);
    await sendEmail(recipient);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error, value } = schemas.loginSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!existingUser.verify) {
      throw HttpError(401, "Email not verified");
    }

    const passwordCompare = bcrypt.compare(password, existingUser.password);

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: existingUser._id,
    };

    const token = jwt.sign(payload, PRIVATE_KEY, { expiresIn: "23h" });
    await UserModel.findByIdAndUpdate(existingUser._id, { token });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await UserModel.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await UserModel.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { error, value } = schemas.emailSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const recipiaet = createEmail(email, user.verificationToken);
    await sendEmail(recipiaet);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const logoutMiddleware = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await UserModel.findByIdAndUpdate(_id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateAvatarController = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const uploadFolder = path.join(avatarsFolder, filename);

  const image = await jimp.read(tempUpload);
  image.cover(250, 250);
  await image.writeAsync(tempUpload);

  await fs.rename(tempUpload, uploadFolder);

  const avatarURL = path.join("avatars", filename);
  await UserModel.findByIdAndUpdate(_id, { avatarURL });

  res.json(avatarURL);
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logoutMiddleware,
  updateAvatarController,
  verifyEmail,
  resendVerifyEmail,
};
