import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { AVATARS, getAvatarImage } from "../utils/avatarUtils";
import API_URLS from "../utils/apiUrls";
import "./styles/ProfilePage.css";

const ProfilePage = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    newUsername: "",
    avatar: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        newUsername: user.username,
        avatar: user.avatar,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

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
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Username already")) {
        setError("This username is already taken. Please choose another one.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setError(null);

    if (value.length > 12) {
      setError("Username cannot exceed 12 characters");
      return;
    }

    if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setFormData((prev) => ({ ...prev, newUsername: value }));
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Profile Settings</h1>

        {error && <div className="alert alert-error">{error}</div>}

        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
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

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
