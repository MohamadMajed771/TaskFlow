const db = require("../config/db");

const createTask = async (
  projectId,
  title,
  description,
  priority,
  dueDate,
  assignedUserId,
  createdByUserId
) => {
  const [result] = await db.query(
    `INSERT INTO tasks
     (
       project_id,
       title,
       description,
       priority,
       due_date,
       assigned_user_id,
       created_by_user_id
     )
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      title,
      description,
      priority,
      dueDate,
      assignedUserId,
      createdByUserId,
    ]
  );

  return result.insertId;
};

const getTasksByProjectId = async (projectId) => {
  const [rows] = await db.query(
    `SELECT
        t.id,
        t.project_id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        t.updated_at,

        t.assigned_user_id,
        assigned_user.name AS assigned_user_name,
        assigned_user.email AS assigned_user_email,

        t.created_by_user_id,
        creator.name AS created_by_name

     FROM tasks t

     LEFT JOIN users assigned_user
       ON t.assigned_user_id = assigned_user.id

     INNER JOIN users creator
       ON t.created_by_user_id = creator.id

     WHERE t.project_id = ?

     ORDER BY t.created_at DESC`,
    [projectId]
  );

  return rows;
};

const getTaskById = async (taskId) => {
  const [rows] = await db.query(
    `SELECT
        t.id,
        t.project_id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.assigned_user_id,
        t.created_by_user_id,
        t.created_at,
        t.updated_at,

        assigned_user.name AS assigned_user_name,
        assigned_user.email AS assigned_user_email,

        creator.name AS created_by_name

     FROM tasks t

     LEFT JOIN users assigned_user
       ON t.assigned_user_id = assigned_user.id

     INNER JOIN users creator
       ON t.created_by_user_id = creator.id

     WHERE t.id = ?`,
    [taskId]
  );

  return rows[0];
};

const updateTask = async (
  taskId,
  title,
  description,
  priority,
  dueDate,
  assignedUserId
) => {
  await db.query(
    `UPDATE tasks
     SET title = ?,
         description = ?,
         priority = ?,
         due_date = ?,
         assigned_user_id = ?
     WHERE id = ?`,
    [
      title,
      description,
      priority,
      dueDate,
      assignedUserId,
      taskId,
    ]
  );
};

const updateTaskStatus = async (
  taskId,
  status
) => {
  await db.query(
    `UPDATE tasks
     SET status = ?
     WHERE id = ?`,
    [status, taskId]
  );
};

const deleteTask = async (taskId) => {
  await db.query(
    "DELETE FROM tasks WHERE id = ?",
    [taskId]
  );
};

const getOverdueTasks = async () => {
  const [rows] = await db.query(
    `SELECT
        t.id,
        t.project_id,
        t.title,
        t.status,
        t.due_date,
        t.assigned_user_id,
        u.name AS assigned_user_name
     FROM tasks t
     LEFT JOIN users u
       ON t.assigned_user_id = u.id
     WHERE t.due_date < CURDATE()
       AND t.status != 'Done'`
  );

  return rows;
};

module.exports = {
  createTask,
  getTasksByProjectId,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getOverdueTasks,
};