const express = require("express");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const {
  inviteUser,
  getMyInvitations,
  getUnreadCount,
  markAsRead,
  acceptInvitation,
  declineInvitation,
} = require(
  "../controllers/invitationController"
);

const router = express.Router();

router.use(authenticateToken);

router.post(
  "/projects/:projectId",
  inviteUser
);

router.get(
  "/",
  getMyInvitations
);

router.get(
  "/unread-count",
  getUnreadCount
);

router.patch(
  "/:id/read",
  markAsRead
);

router.patch(
  "/:id/accept",
  acceptInvitation
);

router.patch(
  "/:id/decline",
  declineInvitation
);

module.exports = router;