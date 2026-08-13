const commentModel = require(
  "../models/commentModel"
);

const taskModel = require(
  "../models/taskModel"
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

const createComment = async (
  taskId,
  userId,
  content
) => {
  if (!content || !content.trim()) {
    throw new Error(
      "Comment content is required"
    );
  }

  const task =
    await taskModel.getTaskById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const member =
    await projectModel.getProjectMember(
      task.project_id,
      userId
    );

  if (!member) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  const commentId =
    await commentModel.createComment(
      taskId,
      userId,
      content.trim()
    );

  const user = await findUserById(userId);

  await notificationService
    .createForProjectMembers(
      task.project_id,
      userId,
      task.id,
      "TaskCommented",
      `${user.name} commented on "${task.title}"`
    );

  const comments =
    await commentModel.getCommentsByTaskId(
      taskId
    );

  return comments.find(
    (comment) => comment.id === commentId
  );
};

const getTaskComments = async (
  taskId,
  userId
) => {
  const task =
    await taskModel.getTaskById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const member =
    await projectModel.getProjectMember(
      task.project_id,
      userId
    );

  if (!member) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  return await commentModel
    .getCommentsByTaskId(taskId);
};

const updateComment = async (
  commentId,
  userId,
  content
) => {
  if (!content || !content.trim()) {
    throw new Error(
      "Comment content is required"
    );
  }

  const comment =
    await commentModel.getCommentById(
      commentId
    );

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user_id !== userId) {
    throw new Error(
      "You can only edit your own comments"
    );
  }

  await commentModel.updateComment(
    commentId,
    content.trim()
  );
};

const deleteComment = async (
  commentId,
  userId
) => {
  const comment =
    await commentModel.getCommentById(
      commentId
    );

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user_id !== userId) {
    throw new Error(
      "You can only delete your own comments"
    );
  }

  await commentModel.deleteComment(
    commentId
  );
};

module.exports = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
};