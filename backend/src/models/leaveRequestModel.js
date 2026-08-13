const db = require("../config/db");

const createLeaveRequest = async (
  projectId,
  userId
) => {
  const [result] = await db.query(
    `INSERT INTO project_leave_requests
     (project_id, user_id)
     VALUES (?, ?)`,
    [projectId, userId]
  );

  return result.insertId;
};

const findPendingLeaveRequest = async (
  projectId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT *
     FROM project_leave_requests
     WHERE project_id = ?
       AND user_id = ?
       AND status = 'Pending'`,
    [projectId, userId]
  );

  return rows[0];
};

const getLeaveRequestById = async (
  requestId
) => {
  const [rows] = await db.query(
    `SELECT *
     FROM project_leave_requests
     WHERE id = ?`,
    [requestId]
  );

  return rows[0];
};

const getPendingRequestsByProject = async (
  projectId
) => {
  const [rows] = await db.query(
    `SELECT
        plr.id,
        plr.project_id,
        plr.user_id,
        plr.status,
        plr.created_at,

        u.name,
        u.email

     FROM project_leave_requests plr

     INNER JOIN users u
       ON plr.user_id = u.id

     WHERE plr.project_id = ?
       AND plr.status = 'Pending'

     ORDER BY plr.created_at DESC`,
    [projectId]
  );

  return rows;
};

const acceptLeaveRequest = async (
  requestId,
  projectId,
  userId
) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE tasks
       SET assigned_user_id = NULL
       WHERE project_id = ?
         AND assigned_user_id = ?`,
      [projectId, userId]
    );

    await connection.query(
      `DELETE FROM project_members
       WHERE project_id = ?
         AND user_id = ?`,
      [projectId, userId]
    );

    await connection.query(
      `UPDATE project_leave_requests
       SET status = 'Accepted'
       WHERE id = ?`,
      [requestId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const declineLeaveRequest = async (
  requestId
) => {
  const [result] = await db.query(
    `UPDATE project_leave_requests
     SET status = 'Declined'
     WHERE id = ?
       AND status = 'Pending'`,
    [requestId]
  );

  return result.affectedRows;
};

module.exports = {
  createLeaveRequest,
  findPendingLeaveRequest,
  getLeaveRequestById,
  getPendingRequestsByProject,
  acceptLeaveRequest,
  declineLeaveRequest,
};