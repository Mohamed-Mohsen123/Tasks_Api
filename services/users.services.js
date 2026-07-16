const bcrypt = require("bcryptjs");
const User = require("../models/users.model");
const createToken = require("../utils/token");

const SALT_ROUNDS = 10;

async function getAllUsers() {
  return await User.find().select("-__v -_id -password");
}

async function registerUser(userData) {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return { error: "email already exists" };
  }

  const user = new User({
    ...userData,
    password: await bcrypt.hash(userData.password, SALT_ROUNDS),
  });
  const token = createToken(user);
  await user.save();
  return { success: true, user, token };
}

async function signIn(email, password) {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "invalid email or password" };
  }
  const token = createToken(user);
  return { success: true, user, token };
}

module.exports = {
  getAllUsers,
  registerUser,
  signIn,
};
