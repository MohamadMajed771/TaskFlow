const invitationModel = require(
  "../models/invitationModel"
);

const projectModel = require(
  "../models/projectModel"
);

const {
  findUserByEmail,
} = require("../models/userModel");

const inviteUser = async (
  projectId,
  ownerUserId,
  email
) => {
  if (!email) {
    throw new Error("User email is required");
  }

  const project =
    await projectModel.getProjectById(
      projectId,
      ownerUserId
    );

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.role !== "Owner") {
    throw new Error(
      "Only the project owner can invite users"
    );
  }

  const invitedUser =
    await findUserByEmail(email);

  if (!invitedUser) {
    throw new Error(
      "No user found with this email"
    );
  }

  if (invitedUser.id === ownerUserId) {
    throw new Error(
      "You cannot invite yourself"
    );
  }

  const existingMember =
    await projectModel.getProjectMember(
      projectId,
      invitedUser.id
    );

  if (existingMember) {
    throw new Error(
      "This user is already a project member"
    );
  }

  const pendingInvitation =
    await invitationModel.findPendingInvitation(
      projectId,
      invitedUser.id
    );

  if (pendingInvitation) {
    throw new Error(
      "This user already has a pending invitation"
    );
  }

  const invitationId =
    await invitationModel.createInvitation(
      projectId,
      invitedUser.id,
      ownerUserId
    );

  return {
    id: invitationId,
    projectId,
    invitedUser: {
      id: invitedUser.id,
      name: invitedUser.name,
      email: invitedUser.email,
    },
    status: "Pending",
  };
};

const getMyInvitations = async (userId) => {
  return await invitationModel
    .getInvitationsByUserId(userId);
};

const getUnreadCount = async (userId) => {
  return await invitationModel
    .getUnreadInvitationCount(userId);
};

const markAsRead = async (
  invitationId,
  userId
) => {
  const invitation =
    await invitationModel.getInvitationById(
      invitationId,
      userId
    );

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  await invitationModel.markInvitationAsRead(
    invitationId,
    userId
  );
};

const acceptInvitation = async (
  invitationId,
  userId
) => {
  const projectId =
    await invitationModel.acceptInvitation(
      invitationId,
      userId
    );

  return {
    projectId,
  };
};

const declineInvitation = async (
  invitationId,
  userId
) => {
  const affectedRows =
    await invitationModel.declineInvitation(
      invitationId,
      userId
    );

  if (affectedRows === 0) {
    throw new Error(
      "Invitation not found or already processed"
    );
  }
};

module.exports = {
  inviteUser,
  getMyInvitations,
  getUnreadCount,
  markAsRead,
  acceptInvitation,
  declineInvitation,
};