const notificationModel = require(
  "../models/notificationModel"
);

const projectModel = require(
  "../models/projectModel"
);

const taskModel = require(
  "../models/taskModel"
);

const createForProjectMembers = async (
  projectId,
  actorUserId,
  taskId,
  type,
  message
) => {
  const members =
    await projectModel.getProjectMembers(
      projectId
    );

  for (const member of members) {
    if (member.user_id === actorUserId) {
      continue;
    }

    await notificationModel.createNotification(
      projectId,
      member.user_id,
      taskId,
      type,
      message
    );
  }
};

const createForProjectOwner = async (
  projectId,
  taskId,
  type,
  message
) => {
  const owner =
    await projectModel.getProjectOwner(
      projectId
    );

  if (!owner) {
    throw new Error(
      "Project owner not found"
    );
  }

  await notificationModel.createNotification(
    projectId,
    owner.user_id,
    taskId,
    type,
    message
  );
};

const getProjectNotifications = async (
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

  return await notificationModel
    .getProjectNotifications(
      projectId,
      userId
    );
};

const getUnreadCount = async (
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

  return await notificationModel.getUnreadCount(
    projectId,
    userId
  );
};

const markAsRead = async (
  notificationId,
  userId
) => {
  const notification =
    await notificationModel.getNotificationById(
      notificationId,
      userId
    );

  if (!notification) {
    throw new Error(
      "Notification not found"
    );
  }

  await notificationModel.markAsRead(
    notificationId,
    userId
  );
};

const checkOverdueTasks = async () => {
  const overdueTasks =
    await taskModel.getOverdueTasks();

  for (const task of overdueTasks) {
    const members =
      await projectModel.getProjectMembers(
        task.project_id
      );

    let message;

    if (task.assigned_user_name) {
      message =
        `"${task.title}" assigned to ${task.assigned_user_name} is overdue`;
    } else {
      message =
        `"${task.title}" is overdue`;
    }

    for (const member of members) {
      const alreadyExists =
        await notificationModel
          .overdueNotificationExists(
            task.id,
            member.user_id
          );

      if (alreadyExists) {
        continue;
      }

      await notificationModel.createNotification(
        task.project_id,
        member.user_id,
        task.id,
        "TaskOverdue",
        message
      );
    }
  }
};

module.exports = {
  createForProjectMembers,
  createForProjectOwner,
  getProjectNotifications,
  getUnreadCount,
  markAsRead,
  checkOverdueTasks,
};