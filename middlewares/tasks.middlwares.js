const { body, param } = require("express-validator");
const { validationResult } = require("express-validator");
const status = require("../utils/httpStatusText");
// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: status.FAIL, data: { errors: errors.array() } });
  }
  next();
};

const validationSchemas = {
  createTask: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
  ],
  getTask: [
    param("task_id")
      .trim()
      .notEmpty()
      .withMessage("ID is required")
      .isUUID()
      .withMessage("Invalid UUID"),
  ],
  getTaskTitle: [
    param("task_title").trim().notEmpty().withMessage("title is required"),
  ],
  updateTask: [
    param("task_id")
      .trim()
      .notEmpty()
      .withMessage("ID is required")
      .isUUID()
      .withMessage("Invalid UUID"),
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
  ],

  putTask: [
    param("task_id")
      .trim()
      .notEmpty()
      .withMessage("ID is required")
      .isUUID()
      .withMessage("Invalid UUID"),
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
  ],
  deleteTask: [
    param("task_id")
      .trim()
      .notEmpty()
      .withMessage("ID is required")
      .isUUID()
      .withMessage("Invalid UUID"),
  ],
};

module.exports = {
  validationSchemas,
  handleValidationErrors,
};
