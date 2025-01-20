import React, { useState } from "react";
import { useSoundSystem } from "../context/SoundContext";
import "./styles/Achievements.css";

const GAME_SECTIONS = {
  TETRIS: "tetris",
  TICTACTOE: "tictactoe",
  SNAKE: "snake",
};

const Achievements = () => {
  const [activeSection, setActiveSection] = useState(GAME_SECTIONS.TETRIS);
  const { playSoundEffect } = useSoundSystem();

  const handleSectionChange = (section) => {
    playSoundEffect("click");
    setActiveSection(section);
  };

  const renderContent = () => {
    return (
      <div className="achievements-content">
        <h2>
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
          Achievements
        </h2>
        <div className="coming-soon-container">
          <h3>Achievement System Coming Soon!</h3>
          <p>Track your progress and earn rewards as you play.</p>
          <div className="features-preview">
            <ul>
              <li>Unlock special achievements</li>
              <li>Track your gaming milestones</li>
              <li>Earn unique rewards</li>
              <li>Compare progress with other players</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="achievements-container">
      <h1 className="achievements-title">Achievements</h1>

      <div className="achievements-navigation">
        <button
          className={`nav-button ${
            activeSection === GAME_SECTIONS.TETRIS ? "active" : ""
          }`}
          onClick={() => handleSectionChange(GAME_SECTIONS.TETRIS)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Tetris
        </button>
        <button
          className={`nav-button ${
            activeSection === GAME_SECTIONS.TICTACTOE ? "active" : ""
          }`}
          onClick={() => handleSectionChange(GAME_SECTIONS.TICTACTOE)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Tic Tac Toe
        </button>
        <button
          className={`nav-button ${
            activeSection === GAME_SECTIONS.SNAKE ? "active" : ""
          }`}
          onClick={() => handleSectionChange(GAME_SECTIONS.SNAKE)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Snake
        </button>
      </div>

      <div className="achievements-display">{renderContent()}</div>
    </div>
  );
};

export default Achievements;
