const invitationService = require(
  "../services/invitationService"
);

const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;

    const invitation =
      await invitationService.inviteUser(
        req.params.projectId,
        req.user.id,
        email
      );

    return res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getMyInvitations = async (req, res) => {
  try {
    const invitations =
      await invitationService.getMyInvitations(
        req.user.id
      );

    return res.status(200).json(invitations);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount =
      await invitationService.getUnreadCount(
        req.user.id
      );

    return res.status(200).json({
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    await invitationService.markAsRead(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Invitation marked as read",
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const result =
      await invitationService.acceptInvitation(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      message: "Invitation accepted",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const declineInvitation = async (req, res) => {
  try {
    await invitationService.declineInvitation(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Invitation declined",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
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