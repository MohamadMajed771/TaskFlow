import { useEffect, useState } from "react";
import api from "../api/axios";

function MembersPanel({
  members,
  project,
  projectId,
  onRefresh,
}) {
  const [showInvite, setShowInvite] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [leaveRequests, setLeaveRequests] =
    useState([]);

  const [leaveLoading, setLeaveLoading] =
    useState(false);

  const [leaveRequested, setLeaveRequested] =
    useState(false);

  useEffect(() => {
    const loadLeaveRequests = async () => {
      if (project.role !== "Owner") {
        return;
      }

      try {
        const response = await api.get(
          `/leave-requests/projects/${projectId}`
        );

        setLeaveRequests(response.data);
      } catch (error) {
        console.error(
          "Failed to load leave requests:",
          error
        );
      }
    };

    loadLeaveRequests();
  }, [projectId, project.role]);

  const inviteMember = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        `/invitations/projects/${projectId}`,
        {
          email,
        }
      );

      setEmail("");
      setShowInvite(false);

      alert(
        "Invitation sent successfully"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  const requestLeave = async () => {
    try {
      setLeaveLoading(true);

      await api.post(
        `/leave-requests/projects/${projectId}`
      );

      setLeaveRequested(true);

      alert(
        "Leave request sent successfully"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send leave request"
      );
    } finally {
      setLeaveLoading(false);
    }
  };

  const acceptLeaveRequest = async (
    requestId
  ) => {
    try {
      await api.patch(
        `/leave-requests/${requestId}/accept`
      );

      setLeaveRequests((current) =>
        current.filter(
          (request) =>
            request.id !== requestId
        )
      );

      if (onRefresh) {
        await onRefresh();
      }

      alert(
        "Leave request accepted"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to accept leave request"
      );
    }
  };

  const declineLeaveRequest = async (
    requestId
  ) => {
    try {
      await api.patch(
        `/leave-requests/${requestId}/decline`
      );

      setLeaveRequests((current) =>
        current.filter(
          (request) =>
            request.id !== requestId
        )
      );

      alert(
        "Leave request declined"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to decline leave request"
      );
    }
  };

  return (
    <div className="members-panel">
      <div className="members-header">
        <div>
          <h2>Project Members</h2>

          <p>
            People collaborating on this project.
          </p>
        </div>

        <div className="members-header-actions">
          {project.role === "Owner" && (
            <button
              className="primary-button"
              onClick={() =>
                setShowInvite(true)
              }
            >
              + Add Member
            </button>
          )}

          {project.role === "Member" && (
            <button
              className="leave-project-button"
              onClick={requestLeave}
              disabled={
                leaveLoading ||
                leaveRequested
              }
            >
              {leaveLoading
                ? "Sending..."
                : leaveRequested
                  ? "Request Sent"
                  : "Request to Leave"}
            </button>
          )}
        </div>
      </div>

      <div className="members-list">
        {members.map((member) => (
          <div
            className="member-card"
            key={member.user_id}
          >
            <div className="member-avatar">
              {member.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="member-info">
              <strong>
                {member.name}
              </strong>

              <span>
                {member.email}
              </span>
            </div>

            <span
              className={`role-badge ${
                member.role === "Owner"
                  ? "owner"
                  : "member"
              }`}
            >
              {member.role}
            </span>
          </div>
        ))}
      </div>

      {project.role === "Owner" && (
        <div className="leave-requests-section">
          <div className="leave-requests-header">
            <div>
              <h3>
                Leave Requests
              </h3>

              <p>
                Members waiting for approval
                to leave this project.
              </p>
            </div>

            <span className="leave-request-count">
              {leaveRequests.length}
            </span>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="leave-requests-empty">
              No pending leave requests.
            </div>
          ) : (
            <div className="leave-requests-list">
              {leaveRequests.map(
                (request) => (
                  <div
                    className="leave-request-card"
                    key={request.id}
                  >
                    <div className="member-avatar">
                      {request.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="leave-request-info">
                      <strong>
                        {request.name}
                      </strong>

                      <span>
                        {request.email}
                      </span>

                      <small>
                        Requested to leave
                      </small>
                    </div>

                    <div className="leave-request-actions">
                      <button
                        className="accept-button"
                        onClick={() =>
                          acceptLeaveRequest(
                            request.id
                          )
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="decline-button"
                        onClick={() =>
                          declineLeaveRequest(
                            request.id
                          )
                        }
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {showInvite && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>
                  Invite Member
                </h2>

                <p>
                  Invite a registered TaskFlow
                  user by email.
                </p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={() =>
                  setShowInvite(false)
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={inviteMember}
            >
              <div className="form-group">
                <label>
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="member@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowInvite(false)
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
                    ? "Sending..."
                    : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembersPanel;