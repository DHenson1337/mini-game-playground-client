import React, { useState } from "react";
import { useSoundSystem } from "../context/SoundContext";
import "./styles/ArcadePlayButton.css";

const ArcadePlayButton = ({ onClick, isDisabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { playSoundEffect } = useSoundSystem();

  const handleMouseDown = () => {
    if (!isDisabled) {
      setIsPressed(true);
      playSoundEffect("click");
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (!isDisabled) {
      playSoundEffect("hover");
    }
  };

  return (
    <button
      className={`arcade-button ${isPressed ? "pressed" : ""} ${
        isDisabled ? "disabled" : ""
      }`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      disabled={isDisabled}
    >
      <span className="button-text">PLAY NOW</span>
      <div className="button-glow"></div>
    </button>
  );
};

export default ArcadePlayButton;
