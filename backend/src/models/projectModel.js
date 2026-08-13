const db = require("../config/db");

const createProject = async (
  name,
  description,
  deadline,
  userId
) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [projectResult] = await connection.query(
      `INSERT INTO projects
       (name, description, deadline, created_by_user_id)
       VALUES (?, ?, ?, ?)`,
      [name, description, deadline, userId]
    );

    const projectId = projectResult.insertId;

    await connection.query(
      `INSERT INTO project_members
       (project_id, user_id, role)
       VALUES (?, ?, ?)`,
      [projectId, userId, "Owner"]
    );

    await connection.commit();

    return projectId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getProjectsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT
        p.id,
        p.name,
        p.description,
        p.deadline,
        p.created_by_user_id,
        p.created_at,
        p.updated_at,
        pm.role
     FROM projects p
     INNER JOIN project_members pm
        ON p.id = pm.project_id
     WHERE pm.user_id = ?
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return rows;
};

const getProjectById = async (projectId, userId) => {
  const [rows] = await db.query(
    `SELECT
        p.id,
        p.name,
        p.description,
        p.deadline,
        p.created_by_user_id,
        p.created_at,
        p.updated_at,
        pm.role
     FROM projects p
     INNER JOIN project_members pm
        ON p.id = pm.project_id
     WHERE p.id = ?
       AND pm.user_id = ?`,
    [projectId, userId]
  );

  return rows[0];
};

const updateProject = async (
  projectId,
  name,
  description,
  deadline
) => {
  await db.query(
    `UPDATE projects
     SET name = ?,
         description = ?,
         deadline = ?
     WHERE id = ?`,
    [name, description, deadline, projectId]
  );
};

const deleteProject = async (projectId) => {
  await db.query(
    "DELETE FROM projects WHERE id = ?",
    [projectId]
  );
};

const getProjectMember = async (
  projectId,
  userId
) => {
  const [rows] = await db.query(
    `SELECT *
     FROM project_members
     WHERE project_id = ?
       AND user_id = ?`,
    [projectId, userId]
  );

  return rows[0];
};

const getProjectMembers = async (projectId) => {
  const [rows] = await db.query(
    `SELECT
        pm.user_id,
        pm.role,
        u.name,
        u.email
     FROM project_members pm
     INNER JOIN users u
       ON pm.user_id = u.id
     WHERE pm.project_id = ?`,
    [projectId]
  );

  return rows;
};

const removeProjectMember = async (
  projectId,
  userId
) => {
  const [result] = await db.query(
    `DELETE FROM project_members
     WHERE project_id = ?
       AND user_id = ?`,
    [projectId, userId]
  );

  return result.affectedRows;
};

const getProjectOwner = async (projectId) => {
  const [rows] = await db.query(
    `SELECT
        pm.user_id,
        u.name,
        u.email
     FROM project_members pm
     INNER JOIN users u
       ON pm.user_id = u.id
     WHERE pm.project_id = ?
       AND pm.role = 'Owner'`,
    [projectId]
  );

  return rows[0];
};

module.exports = {
  createProject,
  getProjectsByUserId,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMember,
  getProjectMembers,
  getProjectOwner,
  removeProjectMember,
};