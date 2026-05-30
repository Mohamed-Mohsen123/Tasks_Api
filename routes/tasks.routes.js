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

router
  .get("/", getTasks)
  .post("/", validationSchemas.createTask, handleValidationErrors, createTask);

router
  .get(
    "/title/:task_title",
    validationSchemas.getTaskTitle,
    handleValidationErrors,
    getTaskTitle,
  )
  .get("/:task_id", validationSchemas.getTask, handleValidationErrors, getTask)
  .delete(
    "/:task_id",
    validationSchemas.deleteTask,
    handleValidationErrors,
    deleteTask,
  )
  .patch(
    "/:task_id",
    validationSchemas.updateTask,
    handleValidationErrors,
    updateTask,
  )
  .put("/:task_id", validationSchemas.putTask, handleValidationErrors, putTask);

module.exports = router;
