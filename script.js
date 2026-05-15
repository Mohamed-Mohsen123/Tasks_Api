const express = require("express");
const tasksRouter = require("./routes/tasks.routes");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/tasksApi", tasksRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
