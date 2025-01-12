import { Link } from "react-router";
import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <div className="logo">
        <Link to="/games">Mini Game Playground</Link>
      </div>
      <div className="nav-links">
        <Link to="/games">Games</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {/* User info will go here */}
      </div>
    </nav>
  );
}

export default Navbar;
