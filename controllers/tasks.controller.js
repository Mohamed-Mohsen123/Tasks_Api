let { tasks } = require("../data/tasks.js");

// GET all tasks
const getTasks = (req, res) => {
  res.json(tasks);
};

// POST - Create a new task
const createTask = (req, res) => {
  if (tasks.find((task) => task.title === req.body["title"])) {
    return res.status(400).json({
      err: "duplicated title",
    });
  }
  let task = {
    id: Math.max(...tasks.map((t) => t.id), 0) + 1,
    ...req.body,
  };
  tasks.push(task);
  res.status(200).json({
    msg: "task added successfully!",
  });
};

// DELETE - Delete a task by ID
const deleteTask = (req, res) => {
  const taskId = +req.params.task_id;

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
  const taskId = +req.params.task_id;

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
  createTask,
  deleteTask,
  updateTask,
};
