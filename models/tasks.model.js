const mongoose = require("mongoose");
const crypto = require("crypto");

const tasksSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      primary: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("tasks", tasksSchema, "tasks");
