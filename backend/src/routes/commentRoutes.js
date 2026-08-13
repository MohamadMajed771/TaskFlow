const express = require("express");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
} = require(
  "../controllers/commentController"
);

const router = express.Router();

router.use(authenticateToken);

router.post(
  "/tasks/:taskId",
  createComment
);

router.get(
  "/tasks/:taskId",
  getTaskComments
);

router.put(
  "/:id",
  updateComment
);

router.delete(
  "/:id",
  deleteComment
);

module.exports = router;