const express = require("express");
const mongoose = require("mongoose");
const tasksRouter = require("./routes/tasks.routes");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    dbName: "Tasks_DB",
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use(express.json());
app.use("/tasksApi", tasksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
