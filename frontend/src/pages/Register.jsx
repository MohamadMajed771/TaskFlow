import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post(
        "/auth/register",
        formData
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-brand">
          TaskFlow
        </div>

        <h1>
          Build better projects with your team.
        </h1>

        <p>
          Create projects, invite teammates,
          assign work and follow everything
          from one collaborative workspace.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature">
            <div className="auth-feature-icon">
              ✓
            </div>
            Create and organize projects
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              ✓
            </div>
            Invite and manage project members
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              ✓
            </div>
            Track deadlines and progress
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Create account</h2>

          <p className="auth-subtitle">
            Start managing your projects with TaskFlow.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>

              <input
                type="text"
                name="name"
                placeholder="Mohamad Majed"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;