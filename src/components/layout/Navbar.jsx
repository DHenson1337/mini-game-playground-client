// Navbar.jsx
import { useState } from "react";
import "./styles/Navbar.css";

const Navbar = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Portfolio Link
  const portfolioLink = "https://dhenson1337.github.io/dev-portfolio/";

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="nav-left">
        <a href="/games" className="logo">
          <img
            src="/assets/logos/miniGamePlayground.png"
            alt="MiniGame Playground"
            className="logo-image"
          />
        </a>
        <button
          className={`audio-toggle ${!isAudioEnabled ? "audio-disabled" : ""}`}
          onClick={toggleAudio}
        >
          <img
            src={
              isAudioEnabled
                ? "/assets/icons/audioOn.png"
                : "/assets/icons/audioOff.png"
            }
            alt={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
            className="audio-icon"
          />
        </button>
      </div>

      {/* Center */}
      <div className="nav-center">
        <a href="/games">Games</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/credits">Credits</a>
        <a href="/suggestions">Suggestions</a>
        <a href={portfolioLink}>About Me</a>
      </div>

      {/* Right */}
      <div className="nav-right">
        <div className="user-menu">
          <img
            src={localStorage.getItem("avatar") || "/default-avatar.png"}
            alt="User Avatar"
            className="user-avatar"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="/profile">Profile</a>
              <a href="/settings">Settings</a>
              <a href="/" onClick={() => localStorage.clear()}>
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
