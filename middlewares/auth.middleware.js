const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const Status = require("../utils/httpStatusText");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return next(new AppError("no token provided", 401, Status.FAIL));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return next(new AppError("invalid or expired token", 401, Status.FAIL));
  }
}

module.exports = verifyToken;
