const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
  putTask,
  getTaskTitle,
} = require("../controllers/tasks.controller");
const {
  validationSchemas,
  handleValidationErrors,
} = require("../middlewares/tasks.middlwares");
const isAdmin = require("../middlewares/isAdmin");
const verifyToken = require("../middlewares/auth.middleware");

router
  .get("/", verifyToken, getTasks)
  .post(
    "/",
    verifyToken,
    validationSchemas.createTask,
    handleValidationErrors,
    createTask,
  );

router
  .get(
    "/title/:task_title",
    verifyToken,
    validationSchemas.getTaskTitle,
    handleValidationErrors,
    getTaskTitle,
  )
  .get(
    "/:task_id",
    verifyToken,
    validationSchemas.getTask,
    handleValidationErrors,
    getTask,
  )
  .delete(
    "/:task_id",
    verifyToken,
    validationSchemas.deleteTask,
    handleValidationErrors,
    isAdmin,
    deleteTask,
  )
  .patch(
    "/:task_id",
    verifyToken,
    validationSchemas.updateTask,
    handleValidationErrors,
    updateTask,
  )
  .put(
    "/:task_id",
    verifyToken,
    validationSchemas.putTask,
    handleValidationErrors,
    putTask,
  );

module.exports = router;
