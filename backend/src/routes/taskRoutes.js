const express = require("express");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(authenticateToken);

router.post(
  "/projects/:projectId",
  createTask
);

router.get(
  "/projects/:projectId",
  getProjectTasks
);

router.get(
  "/:id",
  getTaskById
);

router.put(
  "/:id",
  updateTask
);

router.patch(
  "/:id/status",
  updateTaskStatus
);

router.delete(
  "/:id",
  deleteTask
);

module.exports = router;