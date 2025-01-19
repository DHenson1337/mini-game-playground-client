import { Loader } from "lucide-react";
import PropTypes from "prop-types";
import "./styles/Loading.css";

const Loading = ({
  size = "default",
  message = "Loading...",
  fullscreen = false,
  overlay = false,
  className = "",
}) => {
  // Define size classes
  const sizeClasses = {
    small: "loading-small",
    default: "loading-default",
    large: "loading-large",
  };

  // Combine all classes
  const containerClasses = [
    "loading-container",
    sizeClasses[size],
    fullscreen ? "loading-fullscreen" : "",
    overlay ? "loading-overlay" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <div className="loading-content">
        <Loader
          className="loading-spinner"
          size={size === "small" ? 24 : size === "large" ? 48 : 32}
        />
        {message && <p className="loading-text">{message}</p>}
      </div>
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(["small", "default", "large"]),
  message: PropTypes.string,
  fullscreen: PropTypes.bool,
  overlay: PropTypes.bool,
  className: PropTypes.string,
};

export default Loading;
