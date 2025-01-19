// components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import "./styles/Navbar.css";
import { AVATAR_IMAGES, getAvatarImage } from "../../utils/avatarUtils";
import authService from "../../services/authService";
import SoundControls from "../SoundControls";

const Navbar = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      await logout(); // Clear user context
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <nav className="navbar">
      {/* Left side */}
      <div className="nav-left">
        <a
          href="#"
          onClick={(e) => handleNavigation("/games", e)}
          className="logo"
        >
          <img
            src="/assets/logos/miniGamePlayground.png"
            alt="MiniGame Playground"
            className="logo-image"
          />
        </a>
        <SoundControls />
      </div>

      {/* Center */}
      <div className="nav-center">
        <a href="#" onClick={(e) => handleNavigation("/games", e)}>
          Games
        </a>
        <a href="#" onClick={(e) => handleNavigation("/leaderboard", e)}>
          Leaderboard
        </a>
        <a href="#" onClick={(e) => handleNavigation("/credits", e)}>
          Credits
        </a>
        <a href="#" onClick={(e) => handleNavigation("/suggestions", e)}>
          Suggestions
        </a>
        <a
          href="https://dhenson1337.github.io/dev-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          About Me
        </a>
      </div>

      {/* Right side - User Menu */}
      <div className="nav-right">
        {user && (
          <div className="user-menu">
            <img
              src={getAvatarImage(user.avatar)}
              alt={`${user.username}'s Avatar`}
              className="user-avatar"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <img
                    src={getAvatarImage(user.avatar)}
                    alt={`${user.username}'s Avatar`}
                    className="dropdown-avatar"
                  />
                  <span className="dropdown-username">{user.username}</span>
                </div>
                <a href="#" onClick={(e) => handleNavigation("/profile", e)}>
                  Account Settings
                </a>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
