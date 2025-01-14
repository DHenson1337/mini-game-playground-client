import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  getUserFromSession,
  removeUserFromSession,
} from "../../utils/userSession";
import "./styles/Navbar.css";

// Import avatar images
import cowledIcon from "../../assets/avatars/cowled.svg";
import femaleVampireIcon from "../../assets/avatars/femaleVampire.svg";
import hoodIcon from "../../assets/avatars/hood.svg";
import overlordIcon from "../../assets/avatars/overlord.svg";
import quickManIcon from "../../assets/avatars/quickMan.svg";
import visoredHelmIcon from "../../assets/avatars/visoredHelm.svg";
import wizardIcon from "../../assets/avatars/wizard.svg";
import womanElfIcon from "../../assets/avatars/womanElf.svg";
import witchIcon from "../../assets/avatars/witch.svg";

// Avatar mapping object
const AVATAR_IMAGES = {
  cowled: cowledIcon,
  femaleVampire: femaleVampireIcon,
  hood: hoodIcon,
  overlord: overlordIcon,
  quickMan: quickManIcon,
  visoredHelm: visoredHelmIcon,
  wizard: wizardIcon,
  womanElf: womanElfIcon,
  witch: witchIcon,
};

const Navbar = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromSession();
    setUserData(user);
  }, []);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    removeUserFromSession();
    navigate("/");
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
        <button
          className={`audio-toggle ${!isAudioEnabled ? "audio-disabled" : ""}`}
          onClick={toggleAudio}
          aria-label={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
        >
          <img
            src={
              isAudioEnabled
                ? "/assets/icons/audioOn.png"
                : "/assets/icons/audioOff.png"
            }
            alt={isAudioEnabled ? "Audio On" : "Audio Off"}
            className="audio-icon"
          />
        </button>
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
        <div className="user-menu">
          {userData && (
            <>
              <img
                src={AVATAR_IMAGES[userData.avatar]}
                alt={`${userData.username}'s Avatar`}
                className="user-avatar"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <img
                      src={AVATAR_IMAGES[userData.avatar]}
                      alt={`${userData.username}'s Avatar`}
                      className="dropdown-avatar"
                    />
                    <span className="dropdown-username">
                      {userData.username}
                    </span>
                  </div>
                  <a href="#" onClick={(e) => handleNavigation("/profile", e)}>
                    Change Avatar
                  </a>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
