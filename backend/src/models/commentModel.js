const db = require("../config/db");

const createComment = async (
  taskId,
  userId,
  content
) => {
  const [result] = await db.query(
    `INSERT INTO comments
     (task_id, user_id, content)
     VALUES (?, ?, ?)`,
    [taskId, userId, content]
  );

  return result.insertId;
};

const getCommentsByTaskId = async (taskId) => {
  const [rows] = await db.query(
    `SELECT
        c.id,
        c.task_id,
        c.content,
        c.created_at,
        c.updated_at,

        c.user_id,
        u.name AS user_name,
        u.email AS user_email

     FROM comments c

     INNER JOIN users u
       ON c.user_id = u.id

     WHERE c.task_id = ?

     ORDER BY c.created_at ASC`,
    [taskId]
  );

  return rows;
};

const getCommentById = async (commentId) => {
  const [rows] = await db.query(
    `SELECT *
     FROM comments
     WHERE id = ?`,
    [commentId]
  );

  return rows[0];
};

const updateComment = async (
  commentId,
  content
) => {
  await db.query(
    `UPDATE comments
     SET content = ?
     WHERE id = ?`,
    [content, commentId]
  );
};

const deleteComment = async (commentId) => {
  await db.query(
    `DELETE FROM comments
     WHERE id = ?`,
    [commentId]
  );
};

module.exports = {
  createComment,
  getCommentsByTaskId,
  getCommentById,
  updateComment,
  deleteComment,
};