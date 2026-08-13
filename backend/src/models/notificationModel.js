const db = require("../config/db");

const createNotification = async (
  projectId,
  userId,
  taskId,
  type,
  message
) => {
  const [result] = await db.query(
    `INSERT INTO project_notifications
     (project_id, user_id, task_id, type, message)
     VALUES (?, ?, ?, ?, ?)`,
    [
      projectId,
      userId,
      taskId,
      type,
      message,
    ]
  );

  return result.insertId;
};

const getProjectNotifications = async (
  projectId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT
        id,
        project_id,
        task_id,
        type,
        message,
        is_read,
        created_at
     FROM project_notifications
     WHERE project_id = ?
       AND user_id = ?
     ORDER BY created_at DESC`,
    [projectId, userId]
  );

  return rows;
};

const getUnreadCount = async (
  projectId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS unreadCount
     FROM project_notifications
     WHERE project_id = ?
       AND user_id = ?
       AND is_read = FALSE`,
    [projectId, userId]
  );

  return rows[0].unreadCount;
};

const getNotificationById = async (
  notificationId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT *
     FROM project_notifications
     WHERE id = ?
       AND user_id = ?`,
    [notificationId, userId]
  );

  return rows[0];
};

const markAsRead = async (
  notificationId,
  userId
) => {
  await db.query(
    `UPDATE project_notifications
     SET is_read = TRUE
     WHERE id = ?
       AND user_id = ?`,
    [notificationId, userId]
  );
};

const overdueNotificationExists = async (
  taskId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT id
     FROM project_notifications
     WHERE task_id = ?
       AND user_id = ?
       AND type = 'TaskOverdue'
     LIMIT 1`,
    [taskId, userId]
  );

  return rows.length > 0;
};

module.exports = {
  createNotification,
  getProjectNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  overdueNotificationExists,
};