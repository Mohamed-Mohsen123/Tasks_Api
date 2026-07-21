const express = require("express");
const router = express.Router();

const {
  getUsers,
  register,
  signIn,
} = require("../controllers/users.controller");
const {
  validationSchemas,
  handleValidationErrors,
} = require("../middlewares/users.middlewares");
const upload = require("../middlewares/upload.middleware");

router.get("/", getUsers);

router.post(
  "/register",
  upload,
  validationSchemas.register,
  handleValidationErrors,
  register,
);

router.post(
  "/signin",
  validationSchemas.signIn,
  handleValidationErrors,
  signIn,
);

module.exports = router;
