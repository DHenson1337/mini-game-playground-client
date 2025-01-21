import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { AVATARS, getAvatarImage } from "../utils/avatarUtils";
import { Eye, EyeOff } from "lucide-react";
import API_URLS from "../utils/apiUrls";
import "./styles/ProfilePage.css";
import { useSoundSystem } from "../context/SoundContext";

const ProfilePage = () => {
  const { user, updateUser, logout } = useUser();
  const navigate = useNavigate();
  const { playSoundEffect } = useSoundSystem();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [formData, setFormData] = useState({
    newUsername: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        newUsername: user.username,
        avatar: user.avatar,
      }));
    }
  }, [user]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Delete handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URLS.USERS}/${user.username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: deletePassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete account");
      }

      playSoundEffect("success");
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
      playSoundEffect("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validate password fields if any are filled
    if (
      formData.newPassword ||
      formData.confirmNewPassword ||
      formData.currentPassword
    ) {
      if (!formData.currentPassword) {
        setError("Current password is required to change password");
        playSoundEffect("error");
        setIsLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("New passwords do not match");
        playSoundEffect("error");
        setIsLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URLS.USERS}/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newUsername: formData.newUsername,
          newAvatar: formData.avatar,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setSuccess("Profile updated successfully!");
      playSoundEffect("success");

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (err) {
      setError(err.message);
      playSoundEffect("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setError(null);

    if (value.length > 12) {
      setError("Username cannot exceed 12 characters");
      playSoundEffect("error");
      return;
    }

    if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
      setError("Username can only contain letters, numbers, and underscores");
      playSoundEffect("error");
      return;
    }

    setFormData((prev) => ({ ...prev, newUsername: value }));
  };

  // Render delete.
  const renderDeleteSection = () => {
    if (user?.isGuest) return null;

    return (
      <div className="form-section delete-section">
        <h2 className="section-title">Delete Account</h2>
        <p className="section-description danger-text">
          Warning: This action cannot be undone. All your data, including scores
          and achievements, will be permanently deleted.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => {
              setShowDeleteConfirm(true);
              playSoundEffect("click");
            }}
            className="delete-button"
            type="button"
          >
            Delete Account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="delete-confirm-form">
            <div className="form-group">
              <label className="form-label">
                Enter your password to confirm
              </label>
              <div className="password-input-container">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter password to confirm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="password-toggle"
                >
                  {showDeletePassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="delete-actions">
              <button
                type="submit"
                className="confirm-delete-button"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                  playSoundEffect("click");
                }}
                className="cancel-delete-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  if (!user) return null;

  if (user.isGuest) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Account Settings</h1>
          <div className="alert alert-error">
            Guest accounts cannot modify their profile. Please sign up for a
            full account to access account settings.
          </div>
          <div className="guest-info">
            <p>Your current guest profile:</p>
            <div className="guest-profile-display">
              <img
                src={getAvatarImage(user.avatar)}
                alt="Guest Avatar"
                className="avatar-image"
              />
              <p className="guest-username">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Account Settings</h1>

        {error && <div className="alert alert-error">{error}</div>}

        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2 className="section-title">Profile Information</h2>

            {/* Username Section */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={formData.newUsername}
                onChange={handleUsernameChange}
                className="form-input"
                placeholder="Enter new username"
                minLength={3}
                maxLength={12}
              />
              <p className="input-hint">
                3-12 characters, letters, numbers, and underscores only
              </p>
            </div>

            {/* Avatar Selection */}
            <div className="form-group">
              <label className="form-label">Avatar</label>
              <div className="avatar-grid">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, avatar: avatar.id }))
                    }
                    className={`avatar-button ${
                      formData.avatar === avatar.id ? "selected" : ""
                    }`}
                  >
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="avatar-image"
                    />
                    <p className="avatar-name">{avatar.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Change Password</h2>
            <p className="section-description">
              Leave password fields empty if you don't want to change your
              password.
            </p>

            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="password-input-container">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="form-input"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="password-toggle"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="password-input-container">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="form-input"
                  placeholder="Enter new password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="password-toggle"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="input-hint">Minimum 6 characters</p>
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-container">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmNewPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmNewPassword: e.target.value,
                    }))
                  }
                  className="form-input"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="password-toggle"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
        {/* Delete Account */}
        {renderDeleteSection()}
      </div>
    </div>
  );
};

export default ProfilePage;
