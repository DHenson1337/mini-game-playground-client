import { useState } from "react";
import { useNavigate } from "react-router";
import "./styles/LandingPage.css";
/* 
Landing Page Component
Handles user registration and avater selection before entering the game platform
*/

function LandingPage() {
  //States for form inputs
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Validates inputs and creates new user
   * @param {Event} e - Form submission event
   */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && selectedAvatar) {
      //Todo add back end API to create user
      navigate("/games"); //Goes to the gamesView section after user is created
    }
  };
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to the Mini Game Playground ^_^</h1>
        <p>Enter a Nickname and select an avatar to begin</p>

        <form onSubmit={handleSubmit} className="landing-form">
          {/* UserName Section */}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              minLength={3}
              maxLength={12}
              required
            />
          </div>
          {/* Avatar Section */}
          <div className="form-group">
            <label>Select Avatar:</label>
            <div className="avatar-grid">
              {/* Todo: Add images for Avatars */}
              {["avatar1", "avatar2", "avatar3"].map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  className={`avatar-button ${
                    selectedAvatar === avatar ? "selected" : ""
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button">
            Start Playing
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
