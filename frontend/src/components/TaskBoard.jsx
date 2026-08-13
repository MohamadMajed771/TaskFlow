import { useState } from "react";
import api from "../api/axios";
import TaskDetailsModal from "./TaskDetailsModal";

function TaskBoard({
  tasks,
  project,
  members,
  onRefresh,
}) {
  const [showCreateTask, setShowCreateTask] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedUserId: "",
  });

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const columns = [
    {
      key: "ToDo",
      title: "To Do",
    },
    {
      key: "InProgress",
      title: "In Progress",
    },
    {
      key: "Done",
      title: "Done",
    },
  ];

  const handleChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        assignedUserId:
          taskForm.assignedUserId
            ? Number(taskForm.assignedUserId)
            : null,
      };

      await api.post(
        `/tasks/projects/${project.id}`,
        payload
      );

      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignedUserId: "",
      });

      setShowCreateTask(false);

      await onRefresh();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (
    taskId,
    status
  ) => {
    try {
      await api.patch(
        `/tasks/${taskId}/status`,
        {
          status,
        }
      );

      await onRefresh();

      if (
        selectedTask &&
        selectedTask.id === taskId
      ) {
        setSelectedTask((current) => ({
          ...current,
          status,
        }));
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update task status"
      );
    }
  };

  const canChangeStatus = (task) => {
    if (project.role === "Owner") {
      return true;
    }

    return (
      Number(task.assigned_user_id) ===
      Number(currentUser?.id)
    );
  };

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const minDate = tomorrow
    .toISOString()
    .split("T")[0];

  const projectDeadline =
    project.deadline
      ? new Date(project.deadline)
          .toISOString()
          .split("T")[0]
      : undefined;

  return (
    <>
      {project.role === "Owner" && (
        <div className="task-board-actions">
          <button
            className="primary-button"
            onClick={() =>
              setShowCreateTask(true)
            }
          >
            + New Task
          </button>
        </div>
      )}

      <div className="task-board">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) =>
              task.status === column.key
          );

          return (
            <div
              className="task-column"
              key={column.key}
            >
              <div className="task-column-header">
                <h2>
                  {column.title}
                </h2>

                <span>
                  {columnTasks.length}
                </span>
              </div>

              <div className="task-column-content">
                {columnTasks.length === 0 ? (
                  <div className="empty-column">
                    No tasks
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      className="task-card"
                      key={task.id}
                      onClick={() =>
                        setSelectedTask(task)
                      }
                    >
                      <div className="task-card-top">
                        <span
                          className={`priority-badge ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h3>
                        {task.title}
                      </h3>

                      <p>
                        {task.description ||
                          "No description"}
                      </p>

                      <div className="task-status-control">
                        <label>
                          Status
                        </label>

                        <select
                          value={task.status}
                          disabled={
                            !canChangeStatus(
                              task
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          onChange={(e) => {
                            e.stopPropagation();

                            updateTaskStatus(
                              task.id,
                              e.target.value
                            );
                          }}
                        >
                          <option value="ToDo">
                            To Do
                          </option>

                          <option value="InProgress">
                            In Progress
                          </option>

                          <option value="Done">
                            Done
                          </option>
                        </select>
                      </div>

                      <div className="task-card-meta">
                        <span>
                          👤{" "}
                          {task.assigned_user_name ||
                            "Unassigned"}
                        </span>

                        <span>
                          📅{" "}
                          {new Date(
                            task.due_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreateTask && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>
                  Create Task
                </h2>

                <p>
                  Create and assign a new task.
                </p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={() =>
                  setShowCreateTask(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={createTask}>
              <div className="form-group">
                <label>
                  Task title
                </label>

                <input
                  type="text"
                  name="title"
                  value={taskForm.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    taskForm.description
                  }
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleChange}
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Assign to
                </label>

                <select
                  name="assignedUserId"
                  value={
                    taskForm.assignedUserId
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Unassigned
                  </option>

                  {members.map(
                    (member) => (
                      <option
                        key={
                          member.user_id
                        }
                        value={
                          member.user_id
                        }
                      >
                        {member.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Due date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={taskForm.dueDate}
                  onChange={handleChange}
                  min={minDate}
                  max={projectDeadline}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowCreateTask(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          project={project}
          onClose={() =>
            setSelectedTask(null)
          }
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default TaskBoard;