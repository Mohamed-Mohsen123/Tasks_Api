const usersServices = require("../services/users.services.js");
const Status = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncwrapper.middleware");
const AppError = require("../utils/appError");

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const getUsers = asyncWrapper(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const { users, total } = await usersServices.getAllUsers({ limit, skip });
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: Status.SUCCSES,
    pagination: { total, totalPages, currentPage: page, limit },
    data: { users },
  });
});

const register = asyncWrapper(async (req, res, next) => {
  const userData = { ...req.body };
  if (req.file) {
    userData.photo = `uploads/${req.file.filename}`;
  }
  const result = await usersServices.registerUser(userData);
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
