let { tasks } = require("../data/tasks.js");

// GET all tasks
const getTasks = (req, res) => {
  res.status(200).json(tasks);
};

// Get Specific task by id
const getTask = (req, res) => {
  const taskId = req.params.task_id;
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(400).json({
      err: "task not found (wrong id number)",
    });
  }
  res.status(200).json(task);
};

// POST - Create a new task
const createTask = (req, res) => {
  if (tasks.find((task) => task.title === req.body["title"])) {
    return res.status(400).json({
      err: "duplicated title",
    });
  }
  let task = {
    id: crypto.randomUUID(),
    ...req.body,
  };
  tasks.push(task);
  res.status(200).json({
    msg: "task added successfully!",
  });
};

// DELETE - Delete a task by ID
const deleteTask = (req, res) => {
  const taskId = req.params.task_id;

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(400).json({
      err: "task not found (wrong id number)",
    });
  }

  tasks = tasks.filter((task) => task.id !== taskId);

  res.status(200).json({
    msg: "task deleted successfully!",
  });
};

// PATCH - Update a task by ID
const updateTask = (req, res) => {
  const taskId = req.params.task_id;

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(400).json({
      err: "task not found (wrong id number)",
    });
  }
  task.title = req.body["title"];
  res.status(200).json({ msg: "task updated successfully!" });
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};
