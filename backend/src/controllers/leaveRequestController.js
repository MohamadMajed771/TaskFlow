const leaveRequestService = require(
  "../services/leaveRequestService"
);

const requestLeave = async (req, res) => {
  try {
    const request =
      await leaveRequestService.requestLeave(
        req.params.projectId,
        req.user.id
      );

    return res.status(201).json({
      message:
        "Leave request sent successfully",
      request,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getProjectLeaveRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await leaveRequestService
        .getProjectLeaveRequests(
          req.params.projectId,
          req.user.id
        );

    return res.status(200).json(
      requests
    );
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const acceptLeaveRequest = async (
  req,
  res
) => {
  try {
    await leaveRequestService
      .acceptLeaveRequest(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      message:
        "Leave request accepted successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const declineLeaveRequest = async (
  req,
  res
) => {
  try {
    await leaveRequestService
      .declineLeaveRequest(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      message:
        "Leave request declined successfully",
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

module.exports = {
  requestLeave,
  getProjectLeaveRequests,
  acceptLeaveRequest,
  declineLeaveRequest,
};