const crypto = require("crypto");
let { tasks } = require("../data/tasks.js");

function GetAllTasks() {
  return tasks;
}

function getTask(taskId) {
  return tasks.find((task) => task.id === taskId);
}

function GetTaskTitle(taskTitle) {
  return tasks.find((task) => task.title === taskTitle);
}

function createTask(taskData) {
  if (tasks.find((task) => task.title === taskData.title)) {
    return { error: "duplicated title" };
  }

  let task = {
    id: crypto.randomUUID(),
    ...taskData,
  };
  tasks.push(task);
  return { success: true, task };
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return { error: "task not found (wrong id number)" };
  }
  tasks.splice(taskIndex, 1);
  return { success: true };
}

function updateTask(taskId, taskData) {
  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    return { error: "task not found (wrong id number)" };
  }
  task.title = taskData.title;
  return { success: true, task };
}

function putTask(taskId, taskData) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return { error: "task not found (wrong id number)" };
  }
  tasks[taskIndex] = {
    id: taskId,
    ...taskData,
  };
  return { success: true, task: tasks[taskIndex] };
}

module.exports = {
  GetAllTasks,
  getTask,
  GetTaskTitle,
  createTask,
  deleteTask,
  updateTask,
  putTask,
};
