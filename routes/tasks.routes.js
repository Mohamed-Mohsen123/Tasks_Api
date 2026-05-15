const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks.controller");
const {
  validationSchemas,
  handleValidationErrors,
} = require("../middlewares/tasks.middlwares");

router
  .get("/", getTasks)
  .post("/", validationSchemas.createTask, handleValidationErrors, createTask);

router
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
  );

module.exports = router;
