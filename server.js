const express = require("express");
const tasksRouter = require("./routes/tasks.routes");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/tasksApi", tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
