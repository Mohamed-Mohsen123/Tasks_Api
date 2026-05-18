const { body, param } = require("express-validator");
const { validationResult } = require("express-validator");
// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
