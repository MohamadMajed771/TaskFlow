const taskModel = require("../models/taskModel");
const projectModel = require("../models/projectModel");

const notificationService = require(
  "./notificationService"
);

const {
  findUserById,
} = require("../models/userModel");

const validStatuses = [
  "ToDo",
  "InProgress",
  "Done",
];

const validPriorities = [
  "Low",
  "Medium",
  "High",
];

const validateDueDate = (
  dueDate,
  projectDeadline
) => {
  const selectedDate = new Date(dueDate);
  const deadline = new Date(projectDeadline);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid due date");
  }

  if (selectedDate <= today) {
    throw new Error(
      "Task due date must be a future date"
    );
  }

  if (selectedDate > deadline) {
    throw new Error(
      "Task due date cannot be after the project deadline"
    );
  }
};

const createTask = async (
  projectId,
  userId,
  data
) => {
  const project =
    await projectModel.getProjectById(
      projectId,
      userId
    );

  if (!project) {
    throw new Error(
      "Project not found or you are not a member"
    );
  }

  if (project.role !== "Owner") {
    throw new Error(
      "Only the project owner can create tasks"
    );
  }

  const {
    title,
    description,
    priority,
    dueDate,
    assignedUserId,
  } = data;

  if (!title || !dueDate) {
    throw new Error(
      "Task title and due date are required"
    );
  }

  const selectedPriority =
    priority || "Medium";

  if (
    !validPriorities.includes(
      selectedPriority
    )
  ) {
    throw new Error(
      "Invalid task priority"
    );
  }

  validateDueDate(
    dueDate,
    project.deadline
  );

  if (assignedUserId) {
    const member =
      await projectModel.getProjectMember(
        projectId,
        assignedUserId
      );

    if (!member) {
      throw new Error(
        "Assigned user must be a member of this project"
      );
    }
  }

  const taskId =
    await taskModel.createTask(
      projectId,
      title,
      description || null,
      selectedPriority,
      dueDate,
      assignedUserId || null,
      userId
    );

  if (assignedUserId) {
    const assignedUser =
      await findUserById(
        assignedUserId
      );

    await notificationService
      .createForProjectMembers(
        projectId,
        userId,
        taskId,
        "TaskAssigned",
        `${assignedUser.name} was assigned to "${title}"`
      );
  }

  return await taskModel.getTaskById(
    taskId
  );
};

const getProjectTasks = async (
  projectId,
  userId
) => {
  const project =
    await projectModel.getProjectById(
      projectId,
      userId
    );

  if (!project) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  return await taskModel
    .getTasksByProjectId(
      projectId
    );
};

const getTaskById = async (
  taskId,
  userId
) => {
  const task =
    await taskModel.getTaskById(
      taskId
    );

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const project =
    await projectModel.getProjectById(
      task.project_id,
      userId
    );

  if (!project) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  return task;
};

const updateTask = async (
  taskId,
  userId,
  data
) => {
  const task =
    await taskModel.getTaskById(
      taskId
    );

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const project =
    await projectModel.getProjectById(
      task.project_id,
      userId
    );

  if (!project) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  if (project.role !== "Owner") {
    throw new Error(
      "Only the project owner can update tasks"
    );
  }

  const {
    title,
    description,
    priority,
    dueDate,
    assignedUserId,
  } = data;

  if (!title || !dueDate) {
    throw new Error(
      "Task title and due date are required"
    );
  }

  const selectedPriority =
    priority || "Medium";

  if (
    !validPriorities.includes(
      selectedPriority
    )
  ) {
    throw new Error(
      "Invalid task priority"
    );
  }

  validateDueDate(
    dueDate,
    project.deadline
  );

  if (assignedUserId) {
    const member =
      await projectModel.getProjectMember(
        task.project_id,
        assignedUserId
      );

    if (!member) {
      throw new Error(
        "Assigned user must be a project member"
      );
    }
  }

  const previousAssignedUserId =
    task.assigned_user_id;

  await taskModel.updateTask(
    taskId,
    title,
    description || null,
    selectedPriority,
    dueDate,
    assignedUserId || null
  );

  if (
    assignedUserId &&
    assignedUserId !==
      previousAssignedUserId
  ) {
    const assignedUser =
      await findUserById(
        assignedUserId
      );

    await notificationService
      .createForProjectMembers(
        task.project_id,
        userId,
        taskId,
        "TaskAssigned",
        `${assignedUser.name} was assigned to "${title}"`
      );
  }

  return await taskModel.getTaskById(
    taskId
  );
};

const updateTaskStatus = async (
  taskId,
  userId,
  status
) => {
  if (
    !validStatuses.includes(status)
  ) {
    throw new Error(
      "Invalid task status"
    );
  }

  const task =
    await taskModel.getTaskById(
      taskId
    );

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const project =
    await projectModel.getProjectById(
      task.project_id,
      userId
    );

  if (!project) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  const isOwner =
    project.role === "Owner";

  const isAssignedUser =
    task.assigned_user_id === userId;

  if (
    !isOwner &&
    !isAssignedUser
  ) {
    throw new Error(
      "Only the owner or assigned user can change this task status"
    );
  }

  const previousStatus =
    task.status;

  await taskModel.updateTaskStatus(
    taskId,
    status
  );

  const user =
    await findUserById(
      userId
    );

  if (
    previousStatus !== status
  ) {
    await notificationService
      .createForProjectMembers(
        task.project_id,
        userId,
        task.id,
        "TaskStatusChanged",
        `${user.name} changed "${task.title}" from ${previousStatus} to ${status}`
      );
  }

  if (
    status === "Done" &&
    previousStatus !== "Done"
  ) {
    await notificationService
      .createForProjectMembers(
        task.project_id,
        userId,
        task.id,
        "TaskCompleted",
        `${user.name} completed "${task.title}"`
      );
  }

  return await taskModel.getTaskById(
    taskId
  );
};

const deleteTask = async (
  taskId,
  userId
) => {
  const task =
    await taskModel.getTaskById(
      taskId
    );

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const project =
    await projectModel.getProjectById(
      task.project_id,
      userId
    );

  if (!project) {
    throw new Error(
      "You are not a member of this project"
    );
  }

  if (project.role !== "Owner") {
    throw new Error(
      "Only the project owner can delete tasks"
    );
  }

  await taskModel.deleteTask(
    taskId
  );
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};