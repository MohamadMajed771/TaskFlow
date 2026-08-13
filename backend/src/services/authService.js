const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  findUserByEmail,
  createUser,
} = require("../models/userModel");

const register = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser(
    name,
    email,
    hashedPassword
  );

  return {
    id: userId,
    name,
    email,
  };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = {
  register,
  login,
};