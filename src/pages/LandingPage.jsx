import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useUser } from "../context/UserContext";
import authService from "../services/authService";
import SuccessMessage from "../components/SuccessMessage";
import { AVATARS } from "../utils/avatarUtils";
import { Eye, EyeOff } from "lucide-react"; // Icons for password visibility toggle
import { useSoundSystem } from "../context/SoundContext";
import "./styles/LandingPage.css";

const LandingPage = () => {
  const { playSoundEffect } = useSoundSystem();
  const navigate = useNavigate();
  const { login } = useUser();

  // State Management
  const [activeTab, setActiveTab] = useState("login"); // Toggle between login and signup
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

  // Password visibility toggles
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Username validation
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

    // Additional validations for signup
    if (activeTab === "signup") {
      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // Avatar validation
      if (!formData.avatar) {
        newErrors.avatar = "Please select an avatar";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (Login/Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      playSoundEffect("error");
      return;
    }
    setIsLoading(true);
    try {
      let authResponse;

      // Handle login vs signup
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
      playSoundEffect("success");
      setShowSuccess(true);

      // Navigate to the attempted page or default to /games
      const from = location.state?.from?.pathname || "/games";
      setTimeout(() => navigate(from), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
      playSoundEffect("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest access
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
      {/* Game Title/Logo */}
      <div className="landing-title">
        <h1>Mini Game Playground</h1>
      </div>

      <div className="landing-content">
        {/* Auth Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              playSoundEffect("click");
            }}
            onMouseEnter={() => playSoundEffect("hover")}
          >
            Login
          </button>
          <button
            className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              playSoundEffect("click");
            }}
            onMouseEnter={() => playSoundEffect("hover")}
          >
            New Character
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="landing-form">
          {/* Username Field */}
          <div className="form-group">
            <input
              type="text"
              className={`form-input ${errors.username ? "input-error" : ""}`}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPasswords.password ? "text" : "password"}
                className={`form-input ${errors.password ? "input-error" : ""}`}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                className="password-toggle"
                onMouseEnter={() => playSoundEffect("hover")}
              >
                {showPasswords.password ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Signup Fields */}
          {activeTab === "signup" && (
            <>
              {/* Confirm Password */}
              <div className="form-group">
                <div className="password-input-container">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
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
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="password-toggle"
                    onMouseEnter={() => playSoundEffect("hover")}
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Avatar Selection */}
              <div className="form-group">
                <label className="form-label">Select Character</label>
                <div className="avatar-grid">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      className={`avatar-button ${
                        formData.avatar === avatar.id ? "selected" : ""
                      }`}
                      onClick={() => {
                        playSoundEffect("click");
                        setFormData({ ...formData, avatar: avatar.id });
                      }}
                      onMouseEnter={() => playSoundEffect("hover")}
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

          {/* Remember Me */}
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            onMouseEnter={() => playSoundEffect("hover")}
          >
            {isLoading
              ? "Loading..."
              : activeTab === "login"
              ? "Login"
              : "Create Character"}
          </button>

          {/* Guest Button */}
          <button
            type="button"
            className="guest-button"
            onClick={handleGuestAccess}
            onMouseEnter={() => playSoundEffect("hover")}
            disabled={isLoading}
          >
            Quick Play
          </button>

          {/* Error Messages */}
          {errors.submit && (
            <div className="error-popup">
              <span>{errors.submit}</span>
            </div>
          )}
        </form>
      </div>

      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-content">
            <h2>Welcome, Adventurer!</h2>
            <p>
              {activeTab === "login"
                ? "Welcome back to the arcade!"
                : "Your character has been created!"}
            </p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {/* Add particle effects specific to landing page */}
      <div className="login-particles">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="login-particle"
            style={{
              "--delay": `${Math.random() * 5}s`,
              "--position": `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
