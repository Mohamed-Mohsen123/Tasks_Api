const AppError = require("../utils/appError");
const Status = require("../utils/httpStatusText");

function isAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return next(new AppError("admin access required", 403, Status.FAIL));
  }
  next();
}

module.exports = isAdmin;
