const crypto = require("crypto");
const Task = require("../model/tasks.model");

async function GetAllTasks(limit, skip) {
  return await Task.find().select("-__v -_id").limit(limit).skip(skip);
}

async function getTask(taskId) {
  return await Task.findOne({ id: taskId }).select("-__v -_id");
}

async function GetTaskTitle(taskTitle) {
  return await Task.findOne({ title: taskTitle }).select("-__v -_id");
}

async function createTask(taskData) {
  const existingTask = await Task.findOne({ title: taskData.title });
  if (existingTask) {
    return { error: "duplicated title" };
  }

  const task = new Task({
    id: crypto.randomUUID(),
    ...taskData,
  });
  await task.save();
  return { success: true, task };
}

async function deleteTask(taskId) {
  const task = await Task.findOneAndDelete({ id: taskId });
  if (!task) {
    return { error: "task not found (wrong id number)" };
  }
  return { success: true };
}

async function updateTask(taskId, taskData) {
  const task = await Task.findOneAndUpdate({ id: taskId }, taskData, {
    new: true,
  });
  if (!task) {
    return { error: "task not found (wrong id number)" };
  }
  return { success: true, task };
}

async function putTask(taskId, taskData) {
  const task = await Task.findOneAndUpdate(
    { id: taskId },
    { id: crypto.randomUUID(), ...taskData },
    { new: true },
  );
  if (!task) {
    return { error: "task not found (wrong id number)" };
  }
  return { success: true, task };
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
