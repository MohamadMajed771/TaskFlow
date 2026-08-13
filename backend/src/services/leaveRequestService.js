const leaveRequestModel = require(
  "../models/leaveRequestModel"
);

const projectModel = require(
  "../models/projectModel"
);

const notificationService = require(
  "./notificationService"
);

const {
  findUserById,
} = require("../models/userModel");

const requestLeave = async (
  projectId,
  userId
) => {
  const member =
    await projectModel.getProjectMember(
      projectId,
      userId
    );

  if (!member) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  if (member.role === "Owner") {
    throw new Error(
      "Project owner cannot request to leave"
    );
  }

  const existingRequest =
    await leaveRequestModel
      .findPendingLeaveRequest(
        projectId,
        userId
      );

  if (existingRequest) {
    throw new Error(
      "You already have a pending leave request"
    );
  }

  const requestId =
    await leaveRequestModel.createLeaveRequest(
      projectId,
      userId
    );

  const user =
    await findUserById(userId);

  await notificationService
    .createForProjectOwner(
      projectId,
      null,
      "MemberLeaveRequested",
      `${user.name} requested to leave the project`
    );

  return {
    id: requestId,
    projectId,
    userId,
    status: "Pending",
  };
};

const getProjectLeaveRequests = async (
  projectId,
  ownerUserId
) => {
  const owner =
    await projectModel.getProjectMember(
      projectId,
      ownerUserId
    );

  if (!owner) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  if (owner.role !== "Owner") {
    throw new Error(
      "Only the project owner can view leave requests"
    );
  }

  return await leaveRequestModel
    .getPendingRequestsByProject(
      projectId
    );
};

const acceptLeaveRequest = async (
  requestId,
  ownerUserId
) => {
  const leaveRequest =
    await leaveRequestModel
      .getLeaveRequestById(requestId);

  if (
    !leaveRequest ||
    leaveRequest.status !== "Pending"
  ) {
    throw new Error(
      "Leave request not found or already processed"
    );
  }

  const owner =
    await projectModel.getProjectMember(
      leaveRequest.project_id,
      ownerUserId
    );

  if (!owner || owner.role !== "Owner") {
    throw new Error(
      "Only the project owner can accept leave requests"
    );
  }

  await leaveRequestModel.acceptLeaveRequest(
    requestId,
    leaveRequest.project_id,
    leaveRequest.user_id
  );
};

const declineLeaveRequest = async (
  requestId,
  ownerUserId
) => {
  const leaveRequest =
    await leaveRequestModel
      .getLeaveRequestById(requestId);

  if (
    !leaveRequest ||
    leaveRequest.status !== "Pending"
  ) {
    throw new Error(
      "Leave request not found or already processed"
    );
  }

  const owner =
    await projectModel.getProjectMember(
      leaveRequest.project_id,
      ownerUserId
    );

  if (!owner || owner.role !== "Owner") {
    throw new Error(
      "Only the project owner can decline leave requests"
    );
  }

  await leaveRequestModel
    .declineLeaveRequest(requestId);
};

module.exports = {
  requestLeave,
  getProjectLeaveRequests,
  acceptLeaveRequest,
  declineLeaveRequest,
};