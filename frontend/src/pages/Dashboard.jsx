import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showInvitations, setShowInvitations] =
    useState(false);

  const [showCreateProject, setShowCreateProject] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    deadline: "",
  });

  const getProjects = async () => {
    const response = await api.get("/projects");
    setProjects(response.data);
  };

  const getInvitations = async () => {
    const response = await api.get(
      "/invitations"
    );

    setInvitations(response.data);
  };

  const getUnreadCount = async () => {
    const response = await api.get(
      "/invitations/unread-count"
    );

    setUnreadCount(
      response.data.unreadCount
    );
  };

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        projectsResponse,
        invitationsResponse,
        unreadResponse,
      ] = await Promise.all([
        api.get("/projects"),
        api.get("/invitations"),
        api.get("/invitations/unread-count"),
      ]);

      setProjects(projectsResponse.data);
      setInvitations(invitationsResponse.data);
      setUnreadCount(
        unreadResponse.data.unreadCount
      );
    } catch (error) {
      console.error(
        "Dashboard loading failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProjectChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/projects",
        projectForm
      );

      setProjectForm({
        name: "",
        description: "",
        deadline: "",
      });

      setShowCreateProject(false);

      await getProjects();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create project"
      );
    }
  };

  const openInvitation = async (
    invitation
  ) => {
    if (!invitation.is_read) {
      try {
        await api.patch(
          `/invitations/${invitation.id}/read`
        );

        setInvitations((current) =>
          current.map((item) =>
            item.id === invitation.id
              ? {
                  ...item,
                  is_read: 1,
                }
              : item
          )
        );

        setUnreadCount((count) =>
          Math.max(0, count - 1)
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const acceptInvitation = async (
    invitationId
  ) => {
    try {
      await api.patch(
        `/invitations/${invitationId}/accept`
      );

      await Promise.all([
        getProjects(),
        getInvitations(),
        getUnreadCount(),
      ]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Could not accept invitation"
      );
    }
  };

  const declineInvitation = async (
    invitationId
  ) => {
    try {
      await api.patch(
        `/invitations/${invitationId}/decline`
      );

      await Promise.all([
        getInvitations(),
        getUnreadCount(),
      ]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Could not decline invitation"
      );
    }
  };

   const tomorrow = new Date();
    tomorrow.setDate(
    tomorrow.getDate() + 1
    );

const minProjectDate = tomorrow
  .toISOString()
  .split("T")[0];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-mark">
            T
          </div>

          <span>TaskFlow</span>
        </div>

        <div className="dashboard-header-actions">
          <div className="notification-wrapper">
            <button
              className="icon-button"
              onClick={() =>
                setShowInvitations(
                  !showInvitations
                )
              }
            >
              🔔

              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {showInvitations && (
              <div className="invitation-panel">
                <div className="panel-header">
                  <div>
                    <h3>Invitations</h3>
                    <p>
                      Project invitations
                    </p>
                  </div>
                </div>

                <div className="invitation-list">
                  {invitations.length ===
                  0 ? (
                    <div className="empty-small">
                      No pending invitations.
                    </div>
                  ) : (
                    invitations.map(
                      (invitation) => (
                        <div
                          key={
                            invitation.id
                          }
                          className={`invitation-item ${
                            !invitation.is_read
                              ? "unread"
                              : ""
                          }`}
                          onClick={() =>
                            openInvitation(
                              invitation
                            )
                          }
                        >
                          <div className="invitation-avatar">
                            {invitation.invited_by_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="invitation-content">
                            <p>
                              <strong>
                                {
                                  invitation.invited_by_name
                                }
                              </strong>{" "}
                              invited you to{" "}
                              <strong>
                                {
                                  invitation.project_name
                                }
                              </strong>
                            </p>

                            <div className="invitation-actions">
                              <button
                                className="accept-button"
                                onClick={(
                                  e
                                ) => {
                                  e.stopPropagation();
                                  acceptInvitation(
                                    invitation.id
                                  );
                                }}
                              >
                                Accept
                              </button>

                              <button
                                className="decline-button"
                                onClick={(
                                  e
                                ) => {
                                  e.stopPropagation();
                                  declineInvitation(
                                    invitation.id
                                  );
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <div>
            <span className="section-label">
              Workspace
            </span>

            <h1>My Projects</h1>

            <p>
              Manage your projects and
              collaborate with your team.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setShowCreateProject(true)
            }
          >
            + New Project
          </button>
        </section>

        {loading ? (
          <div className="dashboard-loading">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-projects">
            <div className="empty-icon">
              📁
            </div>

            <h2>No projects yet</h2>

            <p>
              Create your first project or
              accept an invitation from a
              teammate.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setShowCreateProject(true)
              }
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() =>
                  navigate(
                    `/projects/${project.id}`
                  )
                }
              >
                <div className="project-card-top">
                  <div className="project-icon">
                    {project.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span
                    className={`role-badge ${
                      project.role ===
                      "Owner"
                        ? "owner"
                        : "member"
                    }`}
                  >
                    {project.role}
                  </span>
                </div>

                <h2>{project.name}</h2>

                <p className="project-description">
                  {project.description ||
                    "No description provided."}
                </p>

                <div className="project-card-footer">
                  <div>
                    <span className="footer-label">
                      Deadline
                    </span>

                    <strong>
                      {new Date(
                        project.deadline
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                  <span className="open-project">
                    Open →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateProject && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Create Project</h2>

                <p>
                  Start a new workspace for
                  your team.
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowCreateProject(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={createProject}
            >
              <div className="form-group">
                <label>
                  Project name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="E-Commerce Platform"
                  value={
                    projectForm.name
                  }
                  onChange={
                    handleProjectChange
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe the project..."
                  value={
                    projectForm.description
                  }
                  onChange={
                    handleProjectChange
                  }
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>
                  Project deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  min={minProjectDate}
                  value={
                    projectForm.deadline
                  }
                  onChange={
                    handleProjectChange
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowCreateProject(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;