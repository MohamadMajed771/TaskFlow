const express = require("express");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const {
  requestLeave,
  getProjectLeaveRequests,
  acceptLeaveRequest,
  declineLeaveRequest,
} = require(
  "../controllers/leaveRequestController"
);

const router = express.Router();

router.use(authenticateToken);

router.post(
  "/projects/:projectId",
  requestLeave
);

router.get(
  "/projects/:projectId",
  getProjectLeaveRequests
);

router.patch(
  "/:id/accept",
  acceptLeaveRequest
);

router.patch(
  "/:id/decline",
  declineLeaveRequest
);

module.exports = router;