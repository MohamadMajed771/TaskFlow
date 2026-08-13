import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../api/axios";

import ProjectHeader from "../components/ProjectHeader";
import TaskBoard from "../components/TaskBoard";
import MembersPanel from "../components/MembersPanel";
import ProjectNotifications from "../components/ProjectNotifications";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

import "../styles/project.css";

function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(true);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);

        const [
          projectResponse,
          tasksResponse,
          membersResponse,
        ] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks/projects/${id}`),
          api.get(`/projects/${id}/members`),
        ]);

        setProject(projectResponse.data);
        setTasks(tasksResponse.data);
        setMembers(membersResponse.data);
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, navigate]);

  const refreshProject = async () => {
    try {
      const [
        projectResponse,
        tasksResponse,
        membersResponse,
      ] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/projects/${id}`),
        api.get(`/projects/${id}/members`),
      ]);

      setProject(projectResponse.data);
      setTasks(tasksResponse.data);
      setMembers(membersResponse.data);
    } catch (error) {
      console.error(
        "Failed to refresh project:",
        error
      );
    }
  };

  const deleteProject = async () => {
    try {
      await api.delete(
        `/projects/${project.id}`
      );

      setShowDeleteConfirm(false);

      navigate("/dashboard");
    } catch (error) {
      setShowDeleteConfirm(false);

      setToast({
        message:
          error.response?.data?.message ||
          "Failed to delete project",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="project-loading">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="project-page">
      <ProjectHeader
        project={project}
        onBack={() =>
          navigate("/dashboard")
        }
        onDelete={() =>
          setShowDeleteConfirm(true)
        }
      />

      <main className="project-main">
        <div className="project-toolbar">
          <div className="project-tabs">
            <button
              className={
                activeTab === "tasks"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() =>
                setActiveTab("tasks")
              }
            >
              Tasks
            </button>

            <button
              className={
                activeTab === "members"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() =>
                setActiveTab("members")
              }
            >
              Members
            </button>
          </div>

          <div className="project-toolbar-actions">
            {project.role === "Owner" && (
              <button
                className="secondary-button"
                onClick={() =>
                  setActiveTab("members")
                }
              >
                + Add Member
              </button>
            )}

            <ProjectNotifications
              projectId={id}
            />
          </div>
        </div>

        {activeTab === "tasks" && (
          <TaskBoard
            tasks={tasks}
            project={project}
            members={members}
            onRefresh={refreshProject}
          />
        )}

        {activeTab === "members" && (
          <MembersPanel
            members={members}
            project={project}
            projectId={id}
            onRefresh={refreshProject}
          />
        )}
      </main>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Project"
          message={`Are you sure you want to delete "${project.name}"? All tasks, comments, members, invitations and project data will be removed. This action cannot be undone.`}
          confirmText="Delete Project"
          cancelText="Cancel"
          onConfirm={deleteProject}
          onCancel={() =>
            setShowDeleteConfirm(false)
          }
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />
    </div>
  );
}

export default ProjectPage;