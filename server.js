const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const tasksRouter = require("./routes/tasks.routes");
const status = require("./utils/httpStatusText");
require("dotenv").config();
const app = express();

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

app.use(cors());
app.use(express.json());
app.use("/tasksApi", tasksRouter);
app.use((req, res) => {
  res.status(404).json({
    status: status.FAIL,
    data: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
