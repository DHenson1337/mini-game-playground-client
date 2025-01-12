import { Link } from "react-router";
import "./styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Looks like the page you're looking for is in another Castle 🏯</p>
      <Link to="/games" className="back-link">
        Return to Games
      </Link>
    </div>
  );
}

export default NotFound;
