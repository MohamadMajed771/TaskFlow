const projectModel = require("../models/projectModel");

const createProject = async (
  name,
  description,
  deadline,
  userId
) => {
  if (!name || !deadline) {
    throw new Error(
      "Project name and deadline are required"
    );
  }

  const selectedDate = new Date(deadline);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (
    Number.isNaN(selectedDate.getTime()) ||
    selectedDate <= today
  ) {
    throw new Error(
      "Deadline must be a future date"
    );
  }

  const projectId = await projectModel.createProject(
    name,
    description || null,
    deadline,
    userId
  );

  return {
    id: projectId,
    name,
    description: description || null,
    deadline,
    role: "Owner",
  };
};

const getMyProjects = async (userId) => {
  return await projectModel.getProjectsByUserId(userId);
};

const getProjectById = async (projectId, userId) => {
  const project = await projectModel.getProjectById(
    projectId,
    userId
  );

  if (!project) {
    throw new Error(
      "Project not found or you are not a member"
    );
  }

  return project;
};

const updateProject = async (
  projectId,
  userId,
  name,
  description,
  deadline
) => {
  const project = await projectModel.getProjectById(
    projectId,
    userId
  );

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.role !== "Owner") {
    throw new Error(
      "Only the project owner can update this project"
    );
  }

  if (!name || !deadline) {
    throw new Error(
      "Project name and deadline are required"
    );
  }

  const selectedDate = new Date(deadline);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (
    Number.isNaN(selectedDate.getTime()) ||
    selectedDate <= today
  ) {
    throw new Error(
      "Deadline must be a future date"
    );
  }

  await projectModel.updateProject(
    projectId,
    name,
    description || null,
    deadline
  );

  return await projectModel.getProjectById(
    projectId,
    userId
  );
};

const deleteProject = async (projectId, userId) => {
  const project = await projectModel.getProjectById(
    projectId,
    userId
  );

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.role !== "Owner") {
    throw new Error(
      "Only the project owner can delete this project"
    );
  }

  await projectModel.deleteProject(projectId);
};

const getProjectMembers = async (
  projectId,
  userId
) => {
  const currentMember =
    await projectModel.getProjectMember(
      projectId,
      userId
    );

  if (!currentMember) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  return await projectModel.getProjectMembers(
    projectId
  );
};

const removeProjectMember = async (
  projectId,
  currentUserId,
  memberUserId
) => {
  const currentMember =
    await projectModel.getProjectMember(
      projectId,
      currentUserId
    );

  if (!currentMember) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  if (currentMember.role !== "Owner") {
    throw new Error(
      "Only the project owner can remove members"
    );
  }

  const memberToRemove =
    await projectModel.getProjectMember(
      projectId,
      memberUserId
    );

  if (!memberToRemove) {
    throw new Error(
      "User is not a member of this project"
    );
  }

  if (memberToRemove.role === "Owner") {
    throw new Error(
      "The project owner cannot be removed"
    );
  }

  await projectModel.removeProjectMember(
    projectId,
    memberUserId
  );
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  removeProjectMember,
};