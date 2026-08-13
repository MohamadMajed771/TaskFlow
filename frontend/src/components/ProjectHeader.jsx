function ProjectHeader({
  project,
  onBack,
  onDelete,
}) {
  return (
    <header className="project-header">
      <div className="project-header-left">
        <button
          className="back-button"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <div className="project-header-title-row">
            <h1>{project.name}</h1>

            <span
              className={`role-badge ${
                project.role === "Owner"
                  ? "owner"
                  : "member"
              }`}
            >
              {project.role}
            </span>
          </div>

          <p>
            {project.description ||
              "No project description"}
          </p>
        </div>
      </div>

      <div className="project-header-right">
        <span className="project-deadline-label">
          Deadline
        </span>

        <strong>
          {new Date(
            project.deadline
          ).toLocaleDateString()}
        </strong>

        {project.role === "Owner" && (
          <button
            className="delete-project-button"
            onClick={onDelete}
          >
            Delete Project
          </button>
        )}
      </div>
    </header>
  );
}

export default ProjectHeader;