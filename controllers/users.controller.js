const bcrypt = require("bcryptjs");
const User = require("../models/users.model");
const Status = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncwrapper.middleware");
const AppError = require("../utils/appError");

const SALT_ROUNDS = 10;

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const getUsers = asyncWrapper(async (req, res) => {
  const users = await User.find().select("-__v -_id -password");
  res.status(200).json({
    status: Status.SUCCSES,
    data: { users },
  });
});

const register = asyncWrapper(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new AppError("email already exists", 400, Status.FAIL));
  }

  const user = new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
  });
  await user.save();

  res.status(201).json({
    status: Status.SUCCSES,
    data: { user: formatUser(user) },
  });
});

const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("invalid email or password", 401, Status.FAIL));
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: { user: formatUser(user) },
  });
});

module.exports = {
  getUsers,
  register,
  signIn,
};
