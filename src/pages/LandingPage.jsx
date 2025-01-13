import { useState } from "react";
import { useNavigate } from "react-router";
import "./styles/LandingPage.css";

//Avatar (Profile Pics) Imports
import cowledIcon from "../assets/avatars/cowled.svg";
import femaleVampireIcon from "../assets/avatars/femaleVampire.svg";
import hoodIcon from "../assets/avatars/hood.svg";
import overlordIcon from "../assets/avatars/overlord.svg";
import quickManIcon from "../assets/avatars/quickMan.svg";
import visoredHelmIcon from "../assets/avatars/visoredHelm.svg";
import wizardIcon from "../assets/avatars/wizard.svg";
import womanElfIcon from "../assets/avatars/womanElf.svg";
import witchIcon from "../assets/avatars/witch.svg";

//Avatar section
const AVATARS = [
  {
    id: "cowled",
    name: "Cowled",
    image: cowledIcon,
    // To do figure out why adding a type causes this to hover across the grid
  },

  {
    id: "hood",
    name: "Hood",
    image: hoodIcon,
    type: "stealth",
  },
  {
    id: "wizard",
    name: "Wizard",
    image: wizardIcon,
    type: "magic",
  },

  {
    id: "femaleVampire",
    name: "Female Vampire",
    image: femaleVampireIcon,
    type: "evil",
  },

  {
    id: "femaleElf",
    name: "Female Elf",
    image: womanElfIcon,
    type: "nature",
  },
  {
    id: "witch",
    name: "Witch",
    image: witchIcon,
    type: "magic",
  },
  {
    id: "overlord",
    name: "Overlord",
    image: overlordIcon,
    type: "evil",
  },

  {
    id: "visoredHelm",
    name: "Visored Helm",
    image: visoredHelmIcon,
    type: "warrior",
  },
  {
    id: "quickMan",
    name: "Quick Man",
    image: quickManIcon,
    type: "warrior",
  },
];

/* 
Landing Page Component
Handles user registration and avater selection before entering the game platform
*/

function LandingPage() {
  //States for form inputs
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Validates inputs and creates new user
   * @param {Event} e - Form submission event
   */

  // Avatar (the not so last codebender) selection handler
  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  //Username validation function
  const validateusername = (value) => {
    //Sets user name character limit
    if (value.length < 3) {
      return "NickName must be at least 3 characters";
    }
    if (value.length > 12) {
      return "NickName cannot exceed 12 characters";
    }
    //Character Checker
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "NickName can only contain letters, numbers, and underscores";
    }
    return "";
  };

  //Handle username change with validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateusername(value));
  };

  //Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateusername(username);
    if (error) {
      setUsernameError(error);
      return;
    }
    if (!selectedAvatar) {
      //Todo Avatar validation...(someday)
      return;
    }
    try {
      //Todo: API call to create user
      navigate("/games");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Mini Game Playground</h1>
        <p>Enter a NickName and select an avatar to begin</p>
        {/* User input */}
        <form onSubmit={handleSubmit} className="landing-form">
          <div className="form-group">
            <label htmlFor="username">NickName:</label>
            <input
              type="text"
              id="username"
              className={`form-input ${usernameError ? "input-error" : ""}`}
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter NickName (3-12 characters)"
              maxLength={12}
            />
            {usernameError && (
              <span className="error-message">{usernameError}</span>
            )}
          </div>

          {/* Avatar selection grid */}
          <div className="form-group">
            <label>
              Select Avatar:
              <div className="avatar-grid">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    data-type={avatar.type}
                    className={`avatar-button ${
                      selectedAvatar === avatar.id ? "selected" : ""
                    }`}
                    onClick={() => handleAvatarSelect(avatar.id)}
                  >
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="avatar-image"
                    />
                  </button>
                ))}
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!!usernameError || !username || !selectedAvatar}
          >
            Start Playing
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
