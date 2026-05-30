const tasksServices = require("../services/tasks.services.js");
const Status = require("../utils/httpStatusText.js");

// GET all tasks
const getTasks = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 2;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const tasks = await tasksServices.GetAllTasks(limit, skip);
  res.status(200).json({
    status: Status.SUCCSES,
    data: { tasks },
  });
};

// Get specific task by id
const getTask = async (req, res) => {
  const taskId = req.params.task_id;
  const task = await tasksServices.getTask(taskId);

  if (!task) {
    return res.status(404).json({
      status: Status.FAIL,
      data: { message: "task not found (wrong id number)" },
    });
  }
  res.status(200).json({
    status: Status.SUCCSES,
    data: { task },
  });
};

// Get specific task by title
const getTaskTitle = async (req, res) => {
  const taskTitle = req.params.task_title;
  const task = await tasksServices.GetTaskTitle(taskTitle);

  if (!task) {
    return res.status(404).json({
      status: Status.FAIL,
      data: { message: "task not found (wrong title)" },
    });
  }
  res.status(200).json({
    status: Status.SUCCSES,
    data: { task },
  });
};

// POST - Create a new task
const createTask = async (req, res) => {
  const result = await tasksServices.createTask(req.body);
  if (result.error) {
    return res.status(400).json({
      status: Status.FAIL,
      data: { message: result.error },
    });
  }
  res.status(201).json({
    status: Status.SUCCSES,
    data: { task: result.task },
  });
};

// DELETE - Delete a task by ID
const deleteTask = async (req, res) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.deleteTask(taskId);

  if (result.error) {
    return res.status(404).json({
      status: Status.FAIL,
      data: { message: result.error },
    });
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: null,
  });
};

// PATCH - Update a task by ID
const updateTask = async (req, res) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.updateTask(taskId, req.body);

  if (result.error) {
    return res.status(404).json({
      status: Status.FAIL,
      data: { message: result.error },
    });
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: { task: result.task },
  });
};

// PUT - Replace a task by ID
const putTask = async (req, res) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.putTask(taskId, req.body);

  if (result.error) {
    return res.status(404).json({
      status: Status.FAIL,
      data: { message: result.error },
    });
  }

  res.status(200).json({
    status: Status.SUCCSES,
    data: { task: result.task },
  });
};

module.exports = {
  getTasks,
  getTask,
  getTaskTitle,
  createTask,
  deleteTask,
  updateTask,
  putTask,
};
