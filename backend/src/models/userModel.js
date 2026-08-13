const db = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

const createUser = async (name, email, hashedPassword) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password)
     VALUES (?, ?, ?)`,
    [name, email, hashedPassword]
  );

  return result.insertId;
};

const findUserById = async (userId) => {
  const [rows] = await db.query(
    `SELECT id, name, email
     FROM users
     WHERE id = ?`,
    [userId]
  );

  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById
};