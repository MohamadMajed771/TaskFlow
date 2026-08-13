import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
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
          Organize projects.
          Collaborate better.
          Deliver faster.
        </h1>

        <p>
          Manage your projects, assign tasks,
          communicate with your team and stay
          updated with real-time project activity.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature">
            <div className="auth-feature-icon">
              ✓
            </div>
            Project and task management
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              ✓
            </div>
            Team collaboration and comments
          </div>

          <div className="auth-feature">
            <div className="auth-feature-icon">
              ✓
            </div>
            Smart project notifications
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Welcome back</h2>

          <p className="auth-subtitle">
            Sign in to continue to TaskFlow.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
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
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;