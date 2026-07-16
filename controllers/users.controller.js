const usersServices = require("../services/users.services.js");
const Status = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncwrapper.middleware");
const AppError = require("../utils/appError");

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
  const users = await usersServices.getAllUsers();
  res.status(200).json({
    status: Status.SUCCSES,
    data: { users },
  });
});

const register = asyncWrapper(async (req, res, next) => {
  const result = await usersServices.registerUser(req.body);
  if (result.error) {
    return next(new AppError(result.error, 400, Status.FAIL));
  }

  res.status(201).json({
    status: Status.SUCCSES,
    data: { user: formatUser(result.user), token: result.token },
  });
});

const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await usersServices.signIn(email, password);
  if (result.error) {
    return next(new AppError(result.error, 401, Status.FAIL));
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: { user: formatUser(result.user), token: result.token },
  });
});

module.exports = {
  getUsers,
  register,
  signIn,
};
