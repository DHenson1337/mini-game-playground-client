import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import "./styles/Navbar.css";
import { AVATAR_IMAGES, getAvatarImage } from "../../utils/avatarUtils";
import authService from "../../services/authService";
import SoundControls from "../SoundControls";
import { useSoundSystem } from "../../context/SoundContext";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { playSoundEffect } = useSoundSystem();

  const toggleDropdown = () => {
    playSoundEffect("click");
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      playSoundEffect("click");
      await authService.logout();
      await logout(); // Clear user context
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      playSoundEffect("error");
    }
  };

  const handleNavigation = (path, e) => {
    e.preventDefault();
    playSoundEffect("click");
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

  // NavLink component for consistent styling and behavior
  const NavLink = ({ to, children, className = "" }) => (
    <a
      href="#"
      onClick={(e) => handleNavigation(to, e)}
      className={className}
      onMouseEnter={() => playSoundEffect("hover")}
    >
      {children}
    </a>
  );

  return (
    <nav className="navbar">
      {/* Left side */}
      <div className="nav-left">
        <NavLink to="/games" className="logo">
          <img
            src="/assets/logos/miniGamePlayground.png"
            alt="MiniGame Playground"
            className="logo-image"
          />
        </NavLink>
        <SoundControls />
      </div>

      {/* Center */}
      <div className="nav-center">
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
        <NavLink to="/credits">Credits</NavLink>
        <NavLink to="/suggestions">Suggestions</NavLink>
        <a
          href="https://dhenson1337.github.io/dev-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => playSoundEffect("hover")}
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
              onMouseEnter={() => playSoundEffect("hover")}
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
                <NavLink to="/profile">Account Settings</NavLink>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                  onMouseEnter={() => playSoundEffect("hover")}
                >
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
