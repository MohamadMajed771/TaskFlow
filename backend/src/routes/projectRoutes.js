const express = require("express");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  removeProjectMember,
} = require("../controllers/projectController");

const router = express.Router();

router.use(authenticateToken);

router.post("/", createProject);
router.get("/", getMyProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/members",getProjectMembers);

router.delete("/:id/members/:userId",removeProjectMember);

module.exports = router;