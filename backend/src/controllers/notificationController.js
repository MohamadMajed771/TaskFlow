const notificationService = require(
  "../services/notificationService"
);

const getProjectNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await notificationService
        .getProjectNotifications(
          req.params.projectId,
          req.user.id
        );

    return res.status(200).json(
      notifications
    );
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount =
      await notificationService.getUnreadCount(
        req.params.projectId,
        req.user.id
      );

    return res.status(200).json({
      unreadCount,
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProjectNotifications,
  getUnreadCount,
  markAsRead,
};