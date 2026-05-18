const tasksServices = require("../services/tasks.services.js");

// GET all tasks
const getTasks = (req, res) => {
  const tasks = tasksServices.GetAllTasks();
  res.status(200).json(tasks);
};

// Get specific task by id
const getTask = (req, res) => {
  const taskId = req.params.task_id;
  const task = tasksServices.getTask(taskId);

  if (!task) {
    return res.status(400).json({
      err: "task not found (wrong id number)",
    });
  }
  res.status(200).json(task);
};

// Get specific task by title
const getTaskTitle = (req, res) => {
  const taskTitle = req.params.task_title;
  const task = tasksServices.GetTaskTitle(taskTitle);

  if (!task) {
    return res.status(400).json({
      err: "task not found (wrong title)",
    });
  }
  res.status(200).json(task);
};

// POST - Create a new task
const createTask = (req, res) => {
  const result = tasksServices.createTask(req.body);
  if (result.error) {
    return res.status(400).json({
      err: result.error,
    });
  }
  res.status(200).json({
    msg: "task added successfully!",
  });
};

// DELETE - Delete a task by ID
const deleteTask = (req, res) => {
  const taskId = req.params.task_id;
  const result = tasksServices.deleteTask(taskId);

  if (result.error) {
    return res.status(400).json({
      err: result.error,
    });
  }

  res.status(200).json({
    msg: "task deleted successfully!",
  });
};

// PATCH - Update a task by ID
const updateTask = (req, res) => {
  const taskId = req.params.task_id;
  const result = tasksServices.updateTask(taskId, req.body);

  if (result.error) {
    return res.status(400).json({
      err: result.error,
    });
  }
  
  res.status(200).json({ msg: "task updated successfully!" });
};

// PUT - Replace a task by ID
const putTask = (req, res) => {
  const taskId = req.params.task_id;
  const result = tasksServices.putTask(taskId, req.body);

  if (result.error) {
    return res.status(400).json({
      err: result.error,
    });
  }
  
  res.status(200).json({ msg: "task replaced successfully!" });
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
