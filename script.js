const express = require("express");

const app = express();
const port = 3000;
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Clean the house",
  },
  {
    id: 2,
    title: "Call your aunt",
  },
  {
    id: 3,
    title: "make the bed",
  },
];

app.get("/tasksApi/", (req, res) => {
  res.json(tasks);
});

app.post("/tasksApi/", (req, res) => {
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
});

app.delete("/tasksApi/:task_id", (req, res) => {
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
});

app.patch("/tasksApi/:task_id", (req, res) => {
  const taskId = +req.params.task_id;

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(400).json({
      err: "task not found (wrong id number)",
    });
  }
  task.title = req.body["title"];
  res.status(200).json({ msg: "task updated successfully!" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
