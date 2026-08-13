const taskService = require(
  "../services/taskService"
);

const createTask = async (req, res) => {
  try {
    const task =
      await taskService.createTask(
        req.params.projectId,
        req.user.id,
        req.body
      );

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const tasks =
      await taskService.getProjectTasks(
        req.params.projectId,
        req.user.id
      );

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task =
      await taskService.getTaskById(
        req.params.id,
        req.user.id
      );

    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task =
      await taskService.updateTask(
        req.params.id,
        req.user.id,
        req.body
      );

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateTaskStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const task =
      await taskService.updateTaskStatus(
        req.params.id,
        req.user.id,
        status
      );

    return res.status(200).json({
      message:
        "Task status updated successfully",
      task,
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};