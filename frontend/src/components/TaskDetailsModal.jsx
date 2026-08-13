import { useEffect, useState } from "react";
import api from "../api/axios";

function TaskDetailsModal({
  task,
  project,
  onClose,
  onRefresh,
}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loadingComments, setLoadingComments] =
    useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);

        const response = await api.get(
          `/comments/tasks/${task.id}`
        );

        setComments(response.data);
      } catch (error) {
        console.error(
          "Failed to load comments:",
          error
        );
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [task.id]);

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      setSending(true);

      await api.post(
        `/comments/tasks/${task.id}`,
        {
          content: comment.trim(),
        }
      );

      setComment("");

      const response = await api.get(
        `/comments/tasks/${task.id}`
      );

      setComments(response.data);

      await onRefresh();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="task-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-details-header">
          <div>
            <div className="task-details-badges">
              <span
                className={`priority-badge ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              <span className="task-details-status">
                {task.status === "ToDo"
                  ? "To Do"
                  : task.status === "InProgress"
                    ? "In Progress"
                    : "Done"}
              </span>
            </div>

            <h2>{task.title}</h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="task-details-body">
          <section className="task-information-section">
            <h3>Description</h3>

            <p className="task-full-description">
              {task.description ||
                "No description provided."}
            </p>

            <div className="task-details-grid">
              <div className="task-detail-box">
                <span>Assigned to</span>

                <strong>
                  {task.assigned_user_name ||
                    "Unassigned"}
                </strong>
              </div>

              <div className="task-detail-box">
                <span>Due date</span>

                <strong>
                  {task.due_date
                    ? new Date(
                        task.due_date
                      ).toLocaleDateString()
                    : "No due date"}
                </strong>
              </div>

              <div className="task-detail-box">
                <span>Priority</span>

                <strong>
                  {task.priority}
                </strong>
              </div>

              <div className="task-detail-box">
                <span>Project</span>

                <strong>
                  {project.name}
                </strong>
              </div>
            </div>
          </section>

          <section className="comments-section">
            <div className="comments-title">
              <h3>Comments</h3>

              <span>{comments.length}</span>
            </div>

            <div className="comments-list">
              {loadingComments ? (
                <div className="comments-empty">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="comments-empty">
                  <div>💬</div>

                  <strong>
                    No comments yet
                  </strong>

                  <p>
                    Start the discussion about this
                    task.
                  </p>
                </div>
              ) : (
                comments.map((item) => (
                  <div
                    className="comment-item"
                    key={item.id}
                  >
                    <div className="comment-avatar">
                      {(
                        item.user_name ||
                        item.name ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>
                          {item.user_name ||
                            item.name ||
                            "User"}
                        </strong>

                        <span>
                          {formatDate(
                            item.created_at
                          )}
                        </span>
                      </div>

                      <p>{item.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              className="comment-form"
              onSubmit={addComment}
            >
              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                rows="3"
              />

              <div className="comment-form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    sending || !comment.trim()
                  }
                >
                  {sending
                    ? "Posting..."
                    : "Comment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;