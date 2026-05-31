const tasksServices = require("../services/tasks.services.js");
const Status = require("../utils/httpStatusText.js");
const asyncWrapper = require("../middlewares/asyncwrapper.middleware.js");
const AppError = require("../utils/appError.js");

// GET all tasks
const getTasks = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 2;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const tasks = await tasksServices.GetAllTasks(limit, skip);
  res.status(200).json({
    status: Status.SUCCSES,
    data: { tasks },
  });
});

// Get specific task by id
const getTask = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.task_id;
  const task = await tasksServices.getTask(taskId);

  if (!task) {
    return next(new AppError("task not found (wrong id number)", 404, Status.FAIL));
  }
  res.status(200).json({
    status: Status.SUCCSES,
    data: { task },
  });
});

// Get specific task by title
const getTaskTitle = asyncWrapper(async (req, res, next) => {
  const taskTitle = req.params.task_title;
  const task = await tasksServices.GetTaskTitle(taskTitle);

  if (!task) {
    return next(new AppError("task not found (wrong title)", 404, Status.FAIL));
  }
  res.status(200).json({
    status: Status.SUCCSES,
    data: { task },
  });
});

// POST - Create a new task
const createTask = asyncWrapper(async (req, res, next) => {
  const result = await tasksServices.createTask(req.body);
  if (result.error) {
    return next(new AppError(result.error, 400, Status.FAIL));
  }
  res.status(201).json({
    status: Status.SUCCSES,
    data: { task: result.task },
  });
});

// DELETE - Delete a task by ID
const deleteTask = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.deleteTask(taskId);

  if (result.error) {
    return next(new AppError(result.error, 404, Status.FAIL));
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: null,
  });
});

// PATCH - Update a task by ID
const updateTask = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.updateTask(taskId, req.body);

  if (result.error) {
    return next(new AppError(result.error, 404, Status.FAIL));
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: { task: result.task },
  });
});

// PUT - Replace a task by ID
const putTask = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.putTask(taskId, req.body);

  if (result.error) {
    return next(new AppError(result.error, 404, Status.FAIL));
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: { task: result.task },
  });
});

module.exports = {
  getTasks,
  getTask,
  getTaskTitle,
  createTask,
  deleteTask,
  updateTask,
  putTask,
};
