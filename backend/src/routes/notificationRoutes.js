const express = require("express");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const {
  getProjectNotifications,
  getUnreadCount,
  markAsRead,
} = require(
  "../controllers/notificationController"
);

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/projects/:projectId",
  getProjectNotifications
);

router.get(
  "/projects/:projectId/unread-count",
  getUnreadCount
);

router.patch(
  "/:id/read",
  markAsRead
);

module.exports = router;