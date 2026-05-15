const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks.controller");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router
  .get("/", getTasks)
  .post(
    "/",
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    handleValidationErrors,
    createTask,
  );

router
  .delete(
    "/:task_id",
    param("task_id")
      .isInt({ min: 1 })
      .withMessage("Task ID must be a positive integer"),
    handleValidationErrors,
    deleteTask,
  )
  .patch(
    "/:task_id",
    param("task_id")
      .isInt({ min: 1 })
      .withMessage("Task ID must be a positive integer"),
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    handleValidationErrors,
    updateTask,
  );

module.exports = router;
