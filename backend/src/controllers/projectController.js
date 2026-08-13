const projectService = require("../services/projectService");

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      deadline,
    } = req.body;

    const project = await projectService.createProject(
      name,
      description,
      deadline,
      req.user.id
    );

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects =
      await projectService.getMyProjects(
        req.user.id
      );

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project =
      await projectService.getProjectById(
        req.params.id,
        req.user.id
      );

    return res.status(200).json(project);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      deadline,
    } = req.body;

    const project =
      await projectService.updateProject(
        req.params.id,
        req.user.id,
        name,
        description,
        deadline
      );

    return res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const members =
      await projectService.getProjectMembers(
        req.params.id,
        req.user.id
      );

    return res.status(200).json(members);
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const removeProjectMember = async (req, res) => {
  try {
    await projectService.removeProjectMember(
      req.params.id,
      req.user.id,
      req.params.userId
    );

    return res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
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