import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useUser } from "../context/UserContext";
import authService from "../services/authService";
import SuccessMessage from "../components/SuccessMessage";
import { AVATARS } from "../utils/avatarUtils";
import "./styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    avatar: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (formData.username.length > 12) {
      newErrors.username = "Username cannot exceed 12 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (activeTab === "signup") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.avatar && activeTab === "signup") {
      newErrors.avatar = "Please select an avatar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let authResponse;
      if (activeTab === "login") {
        authResponse = await authService.login(
          formData.username,
          formData.password,
          formData.rememberMe
        );
      } else {
        authResponse = await authService.signup({
          username: formData.username,
          password: formData.password,
          avatar: formData.avatar,
          rememberMe: formData.rememberMe,
        });
      }

      // Update global user state
      await login(authResponse.user);

      setShowSuccess(true);

      // Navigate to the attempted page or default to /games
      const from = location.state?.from?.pathname || "/games";
      setTimeout(() => navigate(from), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setIsLoading(true);
    try {
      const response = await authService.guestLogin(
        formData.avatar || "cowled"
      );
      await login(response.user);
      setShowSuccess(true);
      setTimeout(() => navigate("/games"), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Mini Game Playground</h1>

        {/* Auth Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="landing-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? "input-error" : ""}`}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username (3-12 characters)"
              maxLength={12}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className={`form-input ${errors.password ? "input-error" : ""}`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {activeTab === "signup" && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`form-input ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Select Avatar:</label>
                <div className="avatar-grid">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      data-type={avatar.type}
                      className={`avatar-button ${
                        formData.avatar === avatar.id ? "selected" : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, avatar: avatar.id })
                      }
                    >
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="avatar-image"
                      />
                    </button>
                  ))}
                </div>
                {errors.avatar && (
                  <span className="error-message">{errors.avatar}</span>
                )}
              </div>
            </>
          )}

          <div className="form-group remember-me">
            <label>
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
              />
              Remember me
            </label>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : activeTab === "login"
              ? "Login"
              : "Sign Up"}
          </button>

          <button
            type="button"
            className="guest-button"
            onClick={handleGuestAccess}
            disabled={isLoading}
          >
            Continue as Guest
          </button>
        </form>
      </div>

      {showSuccess && (
        <SuccessMessage
          message={`Welcome to Mini Game Playground! ${
            activeTab === "login"
              ? "Welcome back!"
              : "Account created successfully!"
          }`}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
