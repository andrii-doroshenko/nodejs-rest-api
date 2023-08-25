const jwt = require("jsonwebtoken");
const { UserModel } = require("../schemas/userSchema");
const { HttpError } = require("../helpers/HttpError");

const { PRIVATE_KEY } = process.env;

const tokenAuthMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, PRIVATE_KEY);
    const user = UserModel.findById(id);

    if (!user) {
      next(HttpError(401, "Not authorized"));
    }
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }

  next();
};

module.exports = tokenAuthMiddleware;