const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const tasksRouter = require("./routes/tasks.routes");
const usersRouter = require("./routes/users.routes");
const status = require("./utils/httpStatusText");
const verifyToken = require("./middlewares/auth.middleware");
require("dotenv").config();
const app = express();

const PUBLIC_PATHS = ["/usersApi/register", "/usersApi/signin"];

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

app.use((req, res, next) => {
  if (PUBLIC_PATHS.includes(req.path)) {
    return next();
  }
  return verifyToken(req, res, next);
});

app.use("/tasksApi", tasksRouter);
app.use("/usersApi", usersRouter);

//global middleware for not found routes
app.use((req, res) => {
  res.status(404).json({
    status: status.FAIL,
    data: "Route not found",
  });
});

//global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.status || status.ERROR,
    data: { message: error.message || "internal server error" },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
