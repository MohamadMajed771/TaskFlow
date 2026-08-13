import { useEffect, useState } from "react";
import api from "../api/axios";

function ProjectNotifications({ projectId }) {
  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await api.get(
          `/notifications/projects/${projectId}/unread-count`
        );

        setUnreadCount(
          response.data.unreadCount
        );
      } catch (error) {
        console.error(
          "Failed to load notification count:",
          error
        );
      }
    };

    loadUnreadCount();
  }, [projectId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/notifications/projects/${projectId}`
      );

      setNotifications(response.data);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async () => {
    const nextState = !showNotifications;

    setShowNotifications(nextState);

    if (nextState) {
      await loadNotifications();
    }
  };

  const markNotificationAsRead = async (
    notification
  ) => {
    if (notification.is_read) {
      return;
    }

    try {
      await api.patch(
        `/notifications/${notification.id}/read`
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: 1,
              }
            : item
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "TaskCompleted":
        return "✅";

      case "TaskOverdue":
        return "⚠️";

      case "TaskCommented":
        return "💬";

      case "TaskAssigned":
        return "👤";

      case "TaskStatusChanged":
        return "🔄";

      case "MemberLeaveRequested":
        return "🚪";

      default:
        return "🔔";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="project-notification-wrapper">
      <button
        className="project-notification-button"
        onClick={toggleNotifications}
      >
        🔔

        {unreadCount > 0 && (
          <span className="project-notification-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="project-notification-panel">
          <div className="project-notification-header">
            <div>
              <h3>Project Activity</h3>

              <p>
                Recent activity in this project
              </p>
            </div>

            <button
              className="notification-close-button"
              onClick={() =>
                setShowNotifications(false)
              }
            >
              ×
            </button>
          </div>

          <div className="project-notification-list">
            {loading ? (
              <div className="notification-empty">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="notification-empty-icon">
                  🔔
                </span>

                <strong>
                  No notifications yet
                </strong>

                <p>
                  Project activity will appear
                  here.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <div
                    key={notification.id}
                    className={`project-notification-item ${
                      !notification.is_read
                        ? "notification-unread"
                        : ""
                    }`}
                    onClick={() =>
                      markNotificationAsRead(
                        notification
                      )
                    }
                  >
                    <div className="notification-type-icon">
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="notification-information">
                      <p>
                        {notification.message}
                      </p>

                      <span>
                        {formatDate(
                          notification.created_at
                        )}
                      </span>
                    </div>

                    {!notification.is_read && (
                      <div className="unread-dot" />
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectNotifications;