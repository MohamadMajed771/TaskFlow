const db = require("../config/db");

const createInvitation = async (
  projectId,
  invitedUserId,
  invitedByUserId
) => {
  const [result] = await db.query(
    `INSERT INTO project_invitations
     (
       project_id,
       invited_user_id,
       invited_by_user_id
     )
     VALUES (?, ?, ?)`,
    [
      projectId,
      invitedUserId,
      invitedByUserId,
    ]
  );

  return result.insertId;
};

const findPendingInvitation = async (
  projectId,
  invitedUserId
) => {
  const [rows] = await db.query(
    `SELECT *
     FROM project_invitations
     WHERE project_id = ?
       AND invited_user_id = ?
       AND status = 'Pending'`,
    [projectId, invitedUserId]
  );

  return rows[0];
};

const getInvitationsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT
        pi.id,
        pi.project_id,
        pi.status,
        pi.is_read,
        pi.created_at,

        p.name AS project_name,

        u.id AS invited_by_user_id,
        u.name AS invited_by_name,
        u.email AS invited_by_email

     FROM project_invitations pi

     INNER JOIN projects p
       ON pi.project_id = p.id

     INNER JOIN users u
       ON pi.invited_by_user_id = u.id

     WHERE pi.invited_user_id = ?
       AND pi.status = 'Pending'

     ORDER BY pi.created_at DESC`,
    [userId]
  );

  return rows;
};

const getUnreadInvitationCount = async (userId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS unreadCount
     FROM project_invitations
     WHERE invited_user_id = ?
       AND status = 'Pending'
       AND is_read = FALSE`,
    [userId]
  );

  return rows[0].unreadCount;
};

const getInvitationById = async (
  invitationId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT *
     FROM project_invitations
     WHERE id = ?
       AND invited_user_id = ?`,
    [invitationId, userId]
  );

  return rows[0];
};

const markInvitationAsRead = async (
  invitationId,
  userId
) => {
  await db.query(
    `UPDATE project_invitations
     SET is_read = TRUE
     WHERE id = ?
       AND invited_user_id = ?`,
    [invitationId, userId]
  );
};

const acceptInvitation = async (
  invitationId,
  userId
) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT *
       FROM project_invitations
       WHERE id = ?
         AND invited_user_id = ?
         AND status = 'Pending'
       FOR UPDATE`,
      [invitationId, userId]
    );

    const invitation = rows[0];

    if (!invitation) {
      throw new Error(
        "Invitation not found or already processed"
      );
    }

    await connection.query(
      `INSERT INTO project_members
       (project_id, user_id, role)
       VALUES (?, ?, 'Member')`,
      [
        invitation.project_id,
        userId,
      ]
    );

    await connection.query(
      `UPDATE project_invitations
       SET status = 'Accepted',
           is_read = TRUE
       WHERE id = ?`,
      [invitationId]
    );

    await connection.commit();

    return invitation.project_id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const declineInvitation = async (
  invitationId,
  userId
) => {
  const [result] = await db.query(
    `UPDATE project_invitations
     SET status = 'Declined',
         is_read = TRUE
     WHERE id = ?
       AND invited_user_id = ?
       AND status = 'Pending'`,
    [invitationId, userId]
  );

  return result.affectedRows;
};

module.exports = {
  createInvitation,
  findPendingInvitation,
  getInvitationsByUserId,
  getUnreadInvitationCount,
  getInvitationById,
  markInvitationAsRead,
  acceptInvitation,
  declineInvitation,
};