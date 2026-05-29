const tasksServices = require("../services/tasks.services.js");

// GET all tasks
const getTasks = async (req, res) => {
  const tasks = await tasksServices.GetAllTasks();
  res.status(200).json(tasks);
};

// Get specific task by id
const getTask = async (req, res) => {
  const taskId = req.params.task_id;
  const task = await tasksServices.getTask(taskId);

  if (!task) {
    return res.status(404).json({
      error: "task not found (wrong id number)",
    });
  }
  res.status(200).json(task);
};

// Get specific task by title
const getTaskTitle = async (req, res) => {
  const taskTitle = req.params.task_title;
  const task = await tasksServices.GetTaskTitle(taskTitle);

  if (!task) {
    return res.status(404).json({
      error: "task not found (wrong title)",
    });
  }
  res.status(200).json(task);
};

// POST - Create a new task
const createTask = async (req, res) => {
  const result = await tasksServices.createTask(req.body);
  if (result.error) {
    return res.status(400).json({
      error: result.error,
    });
  }
  res.status(201).json(result.task);
};

// DELETE - Delete a task by ID
const deleteTask = async (req, res) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.deleteTask(taskId);

  if (result.error) {
    return res.status(404).json({
      error: result.error,
    });
  }

  res.status(200).json({
    message: "task deleted successfully!",
  });
};

// PATCH - Update a task by ID
const updateTask = async (req, res) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.updateTask(taskId, req.body);

  if (result.error) {
    return res.status(404).json({
      error: result.error,
    });
  }

  res.status(200).json(result.task);
};

// PUT - Replace a task by ID
const putTask = async (req, res) => {
  const taskId = req.params.task_id;
  const result = await tasksServices.putTask(taskId, req.body);

  if (result.error) {
    return res.status(404).json({
      error: result.error,
    });
  }

  res.status(200).json(result.task);
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
